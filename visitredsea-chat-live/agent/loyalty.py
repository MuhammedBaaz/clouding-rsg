"""Demo loyalty points for the RSG concierge. NOT Red Sea Global's loyalty programme: the rules below are demo
defaults, configurable through the environment, and every guest-facing sentence that quotes them says so.

Earning   : LOYALTY_EARN_SAR_PER_POINT   (default 10)   -> 1 point per SAR 10 of the amount payable at checkout, rounded down.
Redemption: LOYALTY_REDEEM_SAR_PER_POINT (default 0.10) -> 1 point is worth SAR 0.10 off the next demo booking.
Store     : LOYALTY_STORE (default private/loyalty.json, never served by server.py, gitignored directory).

Arithmetic is exact (decimal), never done by the language model. A completion is recorded once per booking id: the
completion, the deduction of redeemed points and the award are written together in one atomic file replace, and a
repeated completion for the same booking id returns the stored record without crediting again.
"""
import json
import os
import threading
import time
from decimal import Decimal, ROUND_DOWN

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORE = os.environ.get("LOYALTY_STORE", "").strip() or os.path.join(ROOT, "private", "loyalty.json")
EARN_SAR_PER_POINT = Decimal(os.environ.get("LOYALTY_EARN_SAR_PER_POINT", "10").strip() or "10")
REDEEM_SAR_PER_POINT = Decimal(os.environ.get("LOYALTY_REDEEM_SAR_PER_POINT", "0.10").strip() or "0.10")
CENT = Decimal("0.01")
_lock = threading.Lock()


def identity(email):
    """The stable demo guest identity: the e-mail the guest gave, lower-cased."""
    return str(email or "").strip().lower()


def sar(x):
    return Decimal(str(x)).quantize(CENT, rounding=ROUND_DOWN)


def points_for(amount_sar):
    """Points earned on an amount: floor(amount / EARN_SAR_PER_POINT). SAR 1,250.50 -> 125 with the default rule."""
    amount = sar(amount_sar)
    if amount <= 0:
        return 0
    return int((amount / EARN_SAR_PER_POINT).to_integral_value(rounding=ROUND_DOWN))


def redeem_value(points):
    return sar(Decimal(int(points)) * REDEEM_SAR_PER_POINT)


def max_redeemable(balance, total_sar):
    """Never more points than the guest has, never more value than the booking total."""
    by_total = int((sar(total_sar) / REDEEM_SAR_PER_POINT).to_integral_value(rounding=ROUND_DOWN))
    return max(0, min(int(balance), by_total))


def _load():
    try:
        with open(STORE, encoding="utf-8") as fh:
            data = json.load(fh)
    except (OSError, ValueError):
        data = {}
    data.setdefault("guests", {})
    data.setdefault("completions", {})
    return data


def _save(data):
    os.makedirs(os.path.dirname(STORE), exist_ok=True)
    tmp = STORE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=1)
    os.replace(tmp, STORE)                                   # one atomic write: completion + deduction + award together


def balance(ident):
    if not ident:
        return 0
    with _lock:
        return int(_load()["guests"].get(ident, {}).get("balance", 0))


def completion(booking_id):
    with _lock:
        return _load()["completions"].get(booking_id)


def complete(booking_id, ident, payable_total, redeemed_points, details):
    """Record the demo completion once. Returns the record (repeated=True when it already existed)."""
    with _lock:
        data = _load()
        if booking_id in data["completions"]:
            return dict(data["completions"][booking_id], repeated=True)
        guest = data["guests"].setdefault(ident, {"balance": 0, "awards": {}})
        redeemed = min(int(redeemed_points or 0), int(guest["balance"]))
        payable = sar(payable_total)
        earned = points_for(payable)
        guest["balance"] = int(guest["balance"]) - redeemed + earned
        rec = {"booking_id": booking_id, "identity": ident, "completed_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
               "payable_total_sar": str(payable), "redeemed_points": redeemed, "redeem_value_sar": str(redeem_value(redeemed)),
               "earned_points": earned, "balance_after": guest["balance"], "earn_rule": "1 point per SAR %s, rounded down" % EARN_SAR_PER_POINT,
               "demo": True, "payment_verified": False}
        rec.update({k: v for k, v in (details or {}).items() if k not in rec})
        guest["awards"][booking_id] = {"earned_points": earned, "redeemed_points": redeemed, "completed_at": rec["completed_at"]}
        data["completions"][booking_id] = rec
        _save(data)
        return dict(rec, repeated=False)
