"""Shared spend cap for the RSG Managed Agent (all sessions this backend opens, plus what the platform reports for the agent).

The platform prices every session at public list rates and reports it as `usage.list_cost` (integer cents). Its own
`budget` is per session only, so this module keeps the cross-session total:

  * a ledger (private/agent_spend.json) of the cumulative list cost of every remote session this backend opened,
    refreshed from `sessions.retrieve` after each agent run;
  * a periodic refresh from `sessions.list` for every session of the agent created or updated after the budget start,
    which also picks up sessions opened elsewhere (Console tests, a direct Studio binding) as far as the list API shows them.

Before every agent run `check()` raises ProviderError("budget") once the larger of the two totals reaches the cap, and
every new session is created with a platform budget equal to the remaining amount, so a single session can never
spend past the shared cap even if the ledger lags by one request.

Settings: AGENT_BUDGET_USD (default 2.00), AGENT_BUDGET_START (ISO-8601 UTC; default below, the owner's instruction).
"""
import datetime
import json
import os
import threading
import time
from decimal import Decimal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEDGER = os.environ.get("AGENT_SPEND_LEDGER", "").strip() or os.path.join(ROOT, "private", "agent_spend.json")
CAP_CENTS = int((Decimal(os.environ.get("AGENT_BUDGET_USD", "2.00").strip() or "2.00") * 100).to_integral_value())
START = os.environ.get("AGENT_BUDGET_START", "2026-11-10T13:31:15Z").strip()
REFRESH_SECONDS = 20
_lock = threading.Lock()
_last_refresh = 0.0
_api_total = 0            # cents, from sessions.list (sessions created/updated after START)
_api_error = None


def start_dt():
    return datetime.datetime.fromisoformat(START.replace("Z", "+00:00"))


def _load():
    try:
        with open(LEDGER, encoding="utf-8") as fh:
            d = json.load(fh)
    except (OSError, ValueError):
        d = {}
    d.setdefault("start", START)
    d.setdefault("cap_cents", CAP_CENTS)
    d.setdefault("sessions", {})
    return d


def _save(d):
    os.makedirs(os.path.dirname(LEDGER), exist_ok=True)
    tmp = LEDGER + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(d, fh, indent=1)
    os.replace(tmp, LEDGER)


def ledger_total():
    with _lock:
        return sum(int(v.get("list_cost_cents", 0)) for v in _load()["sessions"].values())


def record(remote_id, usage, title=""):
    """Store the cumulative list cost the platform reports for one session (replaces, never adds)."""
    cents = _cents(usage)
    if cents is None:
        return
    with _lock:
        d = _load()
        row = d["sessions"].setdefault(remote_id, {"title": title, "first_seen": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
        row["list_cost_cents"] = max(int(row.get("list_cost_cents", 0)), cents)
        row["updated"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        _save(d)


def _cents(usage):
    try:
        u = usage if isinstance(usage, dict) else usage.model_dump()
        return int((u.get("list_cost") or {}).get("amount"))
    except (AttributeError, TypeError, ValueError):
        return None


_refreshing = False


def refresh_from_api(client, agent_id, force=False):
    """Sum the platform's list cost for every session of the agent created or updated after START.

    Without force this never blocks a guest turn: when the cached figure is older than REFRESH_SECONDS a background
    thread fetches the new one (about a second against the API) and the cached figure is returned meanwhile. The
    ledger, updated after every run, still counts this backend's own spend without any delay."""
    global _last_refresh, _refreshing
    if force:
        return _refresh_now(client, agent_id)
    if time.time() - _last_refresh >= REFRESH_SECONDS and not _refreshing:
        _refreshing = True
        threading.Thread(target=_refresh_now, args=(client, agent_id), daemon=True).start()
    return _api_total


def _refresh_now(client, agent_id):
    global _last_refresh, _api_total, _api_error, _refreshing
    total, start = 0, start_dt()
    try:
        page = client.beta.sessions.list(limit=100)         # newest first: stop at the first page that predates the budget start
        rows = []
        while True:
            rows.extend(page.data)
            if not page.data or min((x.created_at for x in page.data if x.created_at), default=start) < start or not page.has_next_page():
                break
            page = page.get_next_page()
        for s in rows:
            d = s.model_dump()
            if (d.get("agent") or {}).get("id") != agent_id:
                continue
            upd = d.get("updated_at") or d.get("created_at")
            if not upd or upd < start:
                continue
            c = _cents(d.get("usage") or {})
            if c:
                total += c
                with _lock:
                    led = _load()
                    row = led["sessions"].setdefault(s.id, {"title": d.get("title") or "(outside this backend)", "first_seen": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
                    row["list_cost_cents"] = max(int(row.get("list_cost_cents", 0)), c)
                    _save(led)
        _api_error = None
    except Exception as e:                                   # the list may lag or fail: the ledger still counts
        _api_error = "%s: %s" % (type(e).__name__, str(e)[:120])
    _last_refresh = time.time()
    _api_total = total
    _refreshing = False
    return total


def spent_cents(client=None, agent_id=None):
    api = refresh_from_api(client, agent_id) if client is not None and agent_id else _api_total
    return max(ledger_total(), api)


def remaining_cents(client=None, agent_id=None):
    return max(0, CAP_CENTS - spent_cents(client, agent_id))


def status(client=None, agent_id=None):
    spent = spent_cents(client, agent_id)
    return {"capUsd": "%.2f" % (CAP_CENTS / 100), "spentUsd": "%.2f" % (spent / 100), "remainingUsd": "%.2f" % (max(0, CAP_CENTS - spent) / 100),
            "start": START, "ledger": LEDGER, "listApiError": _api_error}


def session_budget(client=None, agent_id=None):
    """The platform-enforced per-session cap: whatever is left of the shared budget (at least one cent, else no session)."""
    rem = remaining_cents(client, agent_id)
    if rem <= 0:
        return None
    return {"type": "limit", "max_list_cost": {"amount": str(rem), "currency": "USD"}}
