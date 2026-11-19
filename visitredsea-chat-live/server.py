"""
Local server for the concierge page: static files plus the e-mail
verification (OTP) API used by the Verify card.

    python server.py                 # http://127.0.0.1:8080/
    python server.py 8767            # another port

The code is generated here, kept here (hashed) and checked here. It is
never returned to the browser, never written to a log and never printed.

E-mail delivery needs an authorised SMTP account, supplied only through
environment variables (never in the page, never in this file):

    OTP_SMTP_HOST        e.g. smtp.example.com
    OTP_SMTP_PORT        587 (STARTTLS, default), 465 (SSL) or 25
    OTP_SMTP_USER        login name
    OTP_SMTP_PASSWORD    login password or app password
    OTP_SMTP_FROM        approved sender, e.g. "Concierge <name@domain>"
                         (defaults to OTP_SMTP_USER)
    OTP_SMTP_SECURITY    starttls (default) | ssl | none
    OTP_ALLOWED_RECIPIENTS  comma-separated list; default muhammed.baz@clouding.ai

Saved guest profiles (returning customers) are read only after a code was
verified: /api/otp/verify returns a short-lived session bound to that
e-mail, and /api/profile answers only for a valid session. Profiles live in
the application's own JSON store, which is never served to the browser.
This is an application-stored profile, not an integration with an RSG
customer database.

    PROFILE_STORE        path to the store (default: private/profiles.json)
                         {"profiles": {"name@domain": {"title": "...", "firstName": "...",
                          "familyName": "...", "mobileCode": "+966", "mobile": "...",
                          "guest2First": "...", "guest2Family": "..."}}}

At start the server inserts the prepared accounts listed in
private/profiles.seed.json (the approved demo account) once: an address
already in the store, or seeded before, is never overwritten or re-added.
Special requests are not part of a saved profile: a "requests" value in an
older record is ignored and never returned.

Until OTP_SMTP_HOST, OTP_SMTP_USER and OTP_SMTP_PASSWORD are set the API
answers 503 "email_not_configured" and the page says so. There is no
console fallback.
"""
import hashlib
import hmac
import json
import re
import os
import secrets
import smtplib
import socket
import ssl
import sys
import threading
import time
from email.message import EmailMessage
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.abspath(__file__))


def load_dotenv(path):
    """Read KEY=VALUE lines from .env into the environment (existing values win)."""
    try:
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip(); v = v.strip()
                if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                    v = v[1:-1]
                if (k.startswith(("OTP_", "ANTHROPIC_", "LIVE_AGENT_", "STUDIO_")) or k == "PROFILE_STORE") and k not in os.environ:
                    os.environ[k] = v
    except OSError:
        pass


load_dotenv(os.path.join(ROOT, ".env"))
sys.path.insert(0, ROOT)
try:
    from agent import chat as CHAT                     # live concierge: approved data, state, tools, agent provider
    from agent.provider import make_provider
    from agent import studio_bridge as BRIDGE        # Empathy Studio "Custom Agent" contract (POST /studio/sessions...)
except Exception as _e:                                # a stale data dump or a missing dependency: say so and stop
    sys.stderr.write("live agent backend unavailable: %s\n" % _e)
    raise SystemExit(1)
CODE_TTL = 300          # seconds a code stays valid
MAX_ATTEMPTS = 5        # wrong entries before the challenge is locked
RESEND_COOLDOWN = 30    # seconds between two requests for the same address
MAX_BODY = 4096
CHAT_MAX_BODY = 32768   # a chat turn carries the typed message or a guest form

# Empathy Studio web widget. When STUDIO_CHANNEL_KEY is set, GET /studio-widget.js returns the widget snippet with the
# channel's browser key (kept in .env, never in the repository); the page then shows Studio's widget instead of the
# RSG launcher (add ?chat=rsg to the URL to get the RSG chat back). Without the key the script is empty.
STUDIO = {
    "key": os.environ.get("STUDIO_CHANNEL_KEY", "").strip(),
    "sdk": os.environ.get("STUDIO_SDK_URL", "https://cdn.clouding.ai/sdk/web/next/core.min.js").strip(),
    "sse": os.environ.get("STUDIO_SSE_ENDPOINT", "https://acp-test.clouding.ai/api/v1/chat").strip(),
    "avatar": os.environ.get("STUDIO_AVATAR_URL", "").strip(),        # default: this origin's VRS mark
    # Custom Agent bridge: optional shared secret Studio sends as the header X-Bridge-Key (set the same pair in Studio's
    # "Secret Headers"), and the public origin the card images are served from (default: the request's Host).
    "bridge_secret": os.environ.get("STUDIO_BRIDGE_SECRET", "").strip(),
    "page_origin": os.environ.get("STUDIO_PAGE_ORIGIN", "http://127.0.0.1:8100").strip(),   # the site that serves trip.html
    "asset_origin": os.environ.get("STUDIO_ASSET_ORIGIN", "").strip(),
}


def studio_widget_js():
    if not STUDIO["key"]:
        return "/* Empathy Studio widget not configured: set STUDIO_CHANNEL_KEY in .env */\n"
    cfg = {"transport": {"sseEndpoint": STUDIO["sse"], "apiKey": STUDIO["key"]}, "agent": {"avatarUrl": STUDIO["avatar"]}}
    return (
        "(function(){\n"
        "  var qs = new URLSearchParams(location.search);\n"
        "  if (qs.get('chat') === 'rsg') return;                      /* keep the RSG chat for this page view */\n"
        "  document.documentElement.classList.add('studio-widget');\n"
        "  var cfg = " + json.dumps(cfg, ensure_ascii=False) + ";\n"
        "  if (!cfg.agent.avatarUrl) cfg.agent.avatarUrl = location.origin + '/assets/logos/vrs-turtle-mark.svg';\n"
        "  var s = document.createElement('script'); s.src = " + json.dumps(STUDIO["sdk"]) + ";\n"
        "  s.onload = function () { if (window.ChatWidget && ChatWidget.init) ChatWidget.init(cfg); else console.warn('Empathy Studio SDK loaded without ChatWidget.init'); };\n"
        "  s.onerror = function () { console.warn('Empathy Studio SDK could not be loaded'); document.documentElement.classList.remove('studio-widget'); };\n"
        "  document.head.appendChild(s);\n"
        "})();\n")
SESSION_TTL = 1800      # seconds a verified session can read its saved profile
PROFILE_FIELDS = ("title", "firstName", "familyName", "mobileCode", "mobile", "guest2First", "guest2Family")   # never "requests"
SEED_FILE = os.path.join(ROOT, "private", "profiles.seed.json")
PROFILE_STORE = os.environ.get("PROFILE_STORE", "").strip() or os.path.join(ROOT, "private", "profiles.json")
if not os.path.isabs(PROFILE_STORE):
    PROFILE_STORE = os.path.join(ROOT, PROFILE_STORE)

CONFIG = {
    "host": os.environ.get("OTP_SMTP_HOST", "").strip(),
    "port": int(os.environ.get("OTP_SMTP_PORT", "587") or 587),
    "user": os.environ.get("OTP_SMTP_USER", "").strip(),
    "password": os.environ.get("OTP_SMTP_PASSWORD", ""),
    "sender": (os.environ.get("OTP_SMTP_FROM", "") or os.environ.get("OTP_SMTP_USER", "")).strip(),
    "security": (os.environ.get("OTP_SMTP_SECURITY", "starttls") or "starttls").strip().lower(),
    "allowed": [a.strip().lower() for a in os.environ.get("OTP_ALLOWED_RECIPIENTS", "muhammed.baz@clouding.ai").split(",") if a.strip()],
}


def configured():
    return bool(CONFIG["host"] and CONFIG["user"] and CONFIG["password"] and CONFIG["sender"])


# ---------------------------------------------------------------- challenges
_lock = threading.Lock()
_challenges = {}      # id -> dict(email, salt, digest, expires, attempts, consumed, created)
_latest = {}          # email -> challenge id (a new request invalidates the previous one)
_last_sent = {}       # email -> time of the last accepted send


def _digest(salt, code):
    return hashlib.sha256((salt + ":" + code).encode("utf-8")).hexdigest()


def _purge(now):
    for cid in [c for c, ch in _challenges.items() if ch["expires"] + 600 < now]:
        _challenges.pop(cid, None)


def create_challenge(email):
    now = time.time()
    with _lock:
        _purge(now)
        last = _last_sent.get(email, 0)
        if now - last < RESEND_COOLDOWN:
            return None, int(RESEND_COOLDOWN - (now - last)) + 1
        code = "%06d" % secrets.randbelow(1000000)
        cid = secrets.token_urlsafe(18)
        salt = secrets.token_hex(8)
        old = _latest.get(email)
        if old and old in _challenges:
            _challenges[old]["consumed"] = True      # earlier code can no longer be used
        _challenges[cid] = {"email": email, "salt": salt, "digest": _digest(salt, code), "expires": now + CODE_TTL,
                            "attempts": 0, "consumed": False, "created": now}
        _latest[email] = cid
    return (cid, code), 0


def commit_send(email):
    with _lock:
        _last_sent[email] = time.time()


def discard(cid):
    with _lock:
        _challenges.pop(cid, None)


def verify_challenge(cid, email, code):
    now = time.time()
    with _lock:
        ch = _challenges.get(cid)
        if not ch or ch["email"] != email or _latest.get(email) != cid:
            return "invalid_challenge", 0
        if ch["consumed"]:
            return "consumed", 0
        if ch["expires"] < now:
            return "expired", 0
        if ch["attempts"] >= MAX_ATTEMPTS:
            return "locked", 0
        ch["attempts"] += 1
        if hmac.compare_digest(ch["digest"], _digest(ch["salt"], code)):
            ch["consumed"] = True
            return "ok", 0
        left = MAX_ATTEMPTS - ch["attempts"]
        return ("locked" if left <= 0 else "wrong"), left


# ---------------------------------------------------------------- verified sessions and saved profiles
_sessions = {}        # token -> dict(email, expires)


def open_session(email):
    now = time.time()
    token = secrets.token_urlsafe(24)
    with _lock:
        for t in [t for t, v in _sessions.items() if v["expires"] < now]:
            _sessions.pop(t, None)
        _sessions[token] = {"email": email, "expires": now + SESSION_TTL}
    return token


def session_email(token):
    with _lock:
        v = _sessions.get(token or "")
        if not v or v["expires"] < time.time():
            return None
        return v["email"]


def _email_key(k):
    return str(k).strip().lower()


def seed_profiles():
    """One-time, insert-only seed of the prepared accounts into the store. Returns the addresses added."""
    try:
        with open(SEED_FILE, encoding="utf-8-sig") as fh:
            seed = json.load(fh).get("profiles", {})
    except FileNotFoundError:
        return []
    except (OSError, ValueError, AttributeError) as e:
        sys.stderr.write("profile seed unreadable: %s\n" % type(e).__name__)
        return []
    try:
        with open(PROFILE_STORE, encoding="utf-8-sig") as fh:
            data = json.load(fh)
    except FileNotFoundError:
        data = {}
    except (OSError, ValueError) as e:
        sys.stderr.write("profile store unreadable, not seeded: %s\n" % type(e).__name__)
        return []
    if not isinstance(data, dict):
        return []
    profiles = data.setdefault("profiles", {})
    seeded = data.setdefault("_seeded", [])
    present = {_email_key(k) for k in profiles} | {_email_key(k) for k in seeded}
    added = []
    for k, rec in (seed.items() if isinstance(seed, dict) else []):
        key = _email_key(k)
        if not key or key in present or not isinstance(rec, dict):
            continue
        profiles[key] = {f: str(rec[f]).strip() for f in PROFILE_FIELDS if isinstance(rec.get(f), (str, int)) and str(rec[f]).strip()}
        seeded.append(key); added.append(key)
    if added:
        os.makedirs(os.path.dirname(PROFILE_STORE), exist_ok=True)
        tmp = PROFILE_STORE + ".tmp"
        with open(tmp, "w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, indent=1)
        os.replace(tmp, PROFILE_STORE)
    return added


def load_profile(email):
    """(store_available, profile_or_None). Only whitelisted, non-empty text fields leave the server."""
    try:
        with open(PROFILE_STORE, encoding="utf-8-sig") as fh:          # tolerates a BOM (Notepad)
            data = json.load(fh)
    except FileNotFoundError:
        return False, None
    except (OSError, ValueError) as e:
        sys.stderr.write("profile store unreadable: %s\n" % type(e).__name__)
        return False, None
    profiles = data.get("profiles", {}) if isinstance(data, dict) else {}
    raw = {_email_key(k): v for k, v in profiles.items()}.get(_email_key(email)) if isinstance(profiles, dict) else None
    if not isinstance(raw, dict):
        return True, None
    clean = {k: str(raw[k]).strip() for k in PROFILE_FIELDS if isinstance(raw.get(k), (str, int)) and str(raw[k]).strip()}
    return True, (clean or None)


# ---------------------------------------------------------------- e-mail
def send_code(email, code):
    msg = EmailMessage()
    msg["Subject"] = "Your verification code"
    msg["From"] = CONFIG["sender"]
    msg["To"] = email
    msg.set_content(
        "Your verification code for the Red Sea concierge booking conversation:\n\n"
        "    %s\n\n"
        "It expires in %d minutes.\nIf you did not request it, you can ignore this message.\n" % (code, CODE_TTL // 60)
    )
    ctx = ssl.create_default_context()
    if CONFIG["security"] == "ssl":
        with smtplib.SMTP_SSL(CONFIG["host"], CONFIG["port"], timeout=20, context=ctx) as s:
            s.login(CONFIG["user"], CONFIG["password"])
            s.send_message(msg)
    else:
        with smtplib.SMTP(CONFIG["host"], CONFIG["port"], timeout=20) as s:
            s.ehlo()
            if CONFIG["security"] == "starttls":
                s.starttls(context=ctx)
                s.ehlo()
            if CONFIG["user"]:
                s.login(CONFIG["user"], CONFIG["password"])
            s.send_message(msg)


def classify_send_error(e):
    """Sanitised failure class for the page; no addresses, codes or secrets."""
    if isinstance(e, smtplib.SMTPAuthenticationError):
        return "auth"
    if isinstance(e, smtplib.SMTPRecipientsRefused):
        return "recipient_refused"
    if isinstance(e, smtplib.SMTPSenderRefused):
        return "sender_refused"
    if isinstance(e, (socket.gaierror, ConnectionRefusedError, TimeoutError, socket.timeout, smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected)):
        return "connect"
    if isinstance(e, ssl.SSLError):
        return "tls"
    if isinstance(e, smtplib.SMTPException):
        return "smtp"
    if isinstance(e, OSError):
        return "connect"
    return "other"


# ---------------------------------------------------------------- HTTP
def normalise_digits(s):
    out = []
    for ch in s:
        o = ord(ch)
        if 0x0660 <= o <= 0x0669:
            out.append(chr(o - 0x0660 + 48))        # Arabic-Indic digits
        elif 0x06F0 <= o <= 0x06F9:
            out.append(chr(o - 0x06F0 + 48))        # Eastern Arabic-Indic digits
        elif ch.isdigit():
            out.append(ch)
    return "".join(out)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):            # quiet static log; API events are logged explicitly
        if self.path.startswith("/api/"):
            sys.stderr.write("%s %s %s\n" % (time.strftime("%H:%M:%S"), self.command, self.path))

    def _json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self, limit=MAX_BODY):
        n = int(self.headers.get("Content-Length") or 0)
        if n <= 0 or n > limit:
            return None
        try:
            return json.loads(self.rfile.read(n).decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            return None

    def end_headers(self):
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def _private(self):
        """Never serve secrets or server-side data: dot-files (.env), private/ (profile store), server code."""
        segs = [p for p in unquote(self.path.split("?")[0].split("#")[0]).replace("\\", "/").split("/") if p]
        return any(p.startswith(".") for p in segs) or (segs and segs[0].lower() == "private") or (segs and segs[-1].lower().endswith(".py"))

    def do_HEAD(self):
        if self._private():
            return self.send_error(404)
        return super().do_HEAD()

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/api/otp/status":
            return self._json(200, {"service": "otp", "configured": configured(), "ttlSec": CODE_TTL, "resendAfterSec": RESEND_COOLDOWN,
                                    "smtpHost": bool(CONFIG["host"]), "smtpUser": bool(CONFIG["user"]), "smtpPassword": bool(CONFIG["password"]), "sender": bool(CONFIG["sender"]),
                                    "profileStore": os.path.isfile(PROFILE_STORE)})
        if path == "/api/chat/status":
            return self._json(200, CHAT.status())
        if path.startswith("/api/booking/"):
            return self.booking_record(path)
        if path == "/api/studio/state":
            return self.studio_page_state()
        if path == "/studio-widget.js":
            body = studio_widget_js().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path.startswith("/api/"):
            return self._json(404, {"error": "not_found"})
        if self._private():
            return self.send_error(404)
        return super().do_GET()

    def do_POST(self):
        path = self.path.split("?")[0]
        if path == "/api/otp/request":
            return self.otp_request()
        if path == "/api/otp/verify":
            return self.otp_verify()
        if path == "/api/profile":
            return self.profile()
        if path == "/api/chat/session":
            return self.chat_session()
        if path == "/api/chat/turn":
            return self.chat_turn()
        if path == "/api/chat/action-result":
            return self.chat_action_result()
        if path == "/studio/sessions" or re.match(r"^/studio/sessions/[^/]+/messages$", path):
            return self.studio_bridge(path)
        if path == "/api/studio/draft":
            return self.studio_page_draft()
        self._json(404, {"error": "not_found"})

    # ---- website views (visitredsea-chat-fresh/js/booking-views.js through that site's /api/booking/* proxy), 18 Nov 2026.
    # Local only: the website's server calls these on 127.0.0.1. A request that came through the tunnel carries Cloudflare's
    # headers and is refused, so the public bridge address never exposes a booking by visitor id.
    def _local_only(self):
        if self.client_address[0] not in ("127.0.0.1", "::1"):
            return False
        return not any(self.headers.get(h) for h in ("Cf-Connecting-Ip", "Cf-Ray", "X-Forwarded-For", "X-Forwarded-Proto"))

    def studio_page_state(self):
        from urllib.parse import parse_qs, urlparse
        if not self._local_only():
            return self._json(403, {"error": "local_only"})
        vid = (parse_qs(urlparse(self.path).query).get("v") or [""])[0][:120]
        state = BRIDGE.page_state(vid) if vid else None
        return self._json(200, state) if state else self._json(404, {"error": "no_conversation"})

    def studio_page_draft(self):
        if not self._local_only():
            return self._json(403, {"error": "local_only"})
        data = self._read_json(CHAT_MAX_BODY)
        if not isinstance(data, dict):
            return self._json(400, {"error": "bad_request"})
        status = BRIDGE.save_draft(str(data.get("v") or "")[:120], data.get("fields"))
        return self._json(status, {"ok": status == 200})

    def booking_record(self, path):
        """GET /api/booking/<id>?t=<token>: the saved completed booking for the trip PDF. Read-only: downloading again
        changes nothing and credits nothing. The token is derived from the booking id and the server secret."""
        from urllib.parse import parse_qs, urlparse
        bid = path.split("/")[3][:40]
        token = (parse_qs(urlparse(self.path).query).get("t") or [""])[0]
        if not bid or not hmac.compare_digest(token, BRIDGE.pdf_token(bid)):
            return self._json(404, {"error": "not_found"})
        rec = BRIDGE.L.completion(bid)
        if not rec:
            return self._json(404, {"error": "not_found"})
        return self._json(200, {"booking": rec})

    # ---- Empathy Studio "Custom Agent" contract (agent/studio_bridge.py). Base URL in Studio = https://<host>/studio
    def studio_bridge(self, path):
        secret = STUDIO.get("bridge_secret", "")
        if secret and self.headers.get("X-Bridge-Key", "") != secret:
            return self._json(401, {"error": "unauthorized"})
        data = self._read_json(CHAT_MAX_BODY)
        if not isinstance(data, dict):
            return self._json(400, {"error": "bad_request"})
        scheme = self.headers.get("X-Forwarded-Proto", "http").split(",")[0].strip() or "http"      # a tunnel/proxy terminates TLS
        origin = STUDIO.get("asset_origin") or ("%s://%s" % (scheme, self.headers.get("Host", "127.0.0.1:8100")))
        if os.environ.get("STUDIO_DEBUG_FIELDS", "").strip() == "1":
            # Phase 0 diagnostic (off by default): which fields Studio sends, values only as short hashes, channel key never
            def _h(v):
                return hashlib.sha256(json.dumps(v, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()[:12]
            shown = {k: ("<present>" if "key" in k.lower() else _h(v)) for k, v in data.items() if k not in ("variables", "message")}
            var_list = data.get("variables") if isinstance(data.get("variables"), list) else []
            vars_ = {str(x.get("name")): ("<present>" if "key" in str(x.get("name")).lower() else _h(x.get("value")))
                     for x in var_list if isinstance(x, dict)}
            sys.stderr.write("%s studio fields %s top=%s variables=%s\n" % (time.strftime("%H:%M:%S"), path, json.dumps(shown), json.dumps(vars_)))
        if path == "/studio/sessions":
            sid = BRIDGE.start_session(data.get("variables"))
            sys.stderr.write("%s studio session %s\n" % (time.strftime("%H:%M:%S"), sid[:8]))
            return self._json(200, {"session_id": sid})
        sid = path.split("/")[3]
        status, payload = BRIDGE.handle_message(sid, data.get("message"), sys.modules[__name__], origin)
        return self._json(status, payload)

    # ---- live concierge (agent/chat.py). The handler only parses and routes; state and rules live there.
    def chat_session(self):
        self._read_json()
        s = CHAT.new_session()
        return self._json(200, {"sid": s.sid, "state": CHAT.T.snapshot(s.state), "ttlSec": CHAT.SESSION_TTL, "provider": CHAT.status()})

    def _chat_body(self):
        data = self._read_json(CHAT_MAX_BODY)
        if not isinstance(data, dict):
            self._json(400, {"error": "bad_request"})
            return None, None
        sess = CHAT.get_session(str(data.get("sid", ""))[:64])
        if not sess:
            self._json(404, {"error": "session_expired"})
            return None, None
        return data, sess

    def chat_turn(self):
        data, sess = self._chat_body()
        if not sess:
            return
        turn_id = str(data.get("turnId", ""))[:64]
        if not turn_id:
            return self._json(400, {"error": "bad_request"})
        client = data.get("client") if isinstance(data.get("client"), dict) else {}
        try:
            if data.get("kind") == "event":
                resp = CHAT.event_turn(sess, turn_id, data.get("event"), client, sys.modules[__name__])
            else:
                resp = CHAT.text_turn(sess, turn_id, str(data.get("text", ""))[:2000], client)
        except CHAT.ChatError as e:
            return self._json(e.status, dict({"error": e.error}, **e.extra))
        return self._json(200, resp)

    def chat_action_result(self):
        data, sess = self._chat_body()
        if not sess:
            return
        action_id = str(data.get("actionId", ""))[:64]
        if not action_id:
            return self._json(400, {"error": "bad_request"})
        try:
            resp = CHAT.action_result(sess, action_id, bool(data.get("ok")), data)
        except CHAT.ChatError as e:
            return self._json(e.status, dict({"error": e.error}, **e.extra))
        return self._json(200, resp)

    def profile(self):
        """Saved details for the e-mail of a verified session only; an e-mail address alone is never enough."""
        data = self._read_json()
        email = session_email(str((data or {}).get("session", ""))[:64]) if isinstance(data, dict) else None
        if not email:
            return self._json(401, {"error": "not_authenticated"})
        store, prof = load_profile(email)
        return self._json(200, {"found": bool(prof), "profile": prof, "store": store})

    def otp_request(self):
        data = self._read_json()
        email = (data or {}).get("email", "") if isinstance(data, dict) else ""
        email = str(email).strip().lower()
        if "@" not in email or " " in email:
            return self._json(400, {"error": "invalid_email"})
        if email not in CONFIG["allowed"]:
            return self._json(403, {"error": "recipient_not_allowed"})
        if not configured():
            return self._json(503, {"error": "email_not_configured"})
        made, wait = create_challenge(email)
        if not made:
            return self._json(429, {"error": "cooldown", "retryAfterSec": wait})
        cid, code = made
        try:
            send_code(email, code)
        except Exception as e:                      # provider refused or unreachable: the challenge is dropped
            discard(cid)
            reason = classify_send_error(e)
            sys.stderr.write("otp send failed (%s): %s\n" % (reason, type(e).__name__))
            return self._json(502, {"error": "send_failed", "reason": reason})
        commit_send(email)
        return self._json(200, {"challengeId": cid, "expiresInSec": CODE_TTL, "resendAfterSec": RESEND_COOLDOWN})

    def otp_verify(self):
        data = self._read_json()
        if not isinstance(data, dict):
            return self._json(400, {"error": "bad_request"})
        cid = str(data.get("challengeId", ""))[:64]
        email = str(data.get("email", "")).strip().lower()
        code = normalise_digits(str(data.get("code", "")))[:6]
        if len(code) != 6:
            return self._json(400, {"error": "invalid_code_format"})
        result, left = verify_challenge(cid, email, code)
        if result == "ok":
            return self._json(200, {"verified": True, "session": open_session(email)})
        status = {"wrong": 400, "expired": 410, "locked": 423, "consumed": 410, "invalid_challenge": 404}[result]
        return self._json(status, {"error": result, "attemptsLeft": left})


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8100
    CHAT.PROVIDER = make_provider()
    BRIDGE.PAGE_ORIGIN = STUDIO["page_origin"]
    BRIDGE.TOKEN_SECRET = (STUDIO["bridge_secret"] or secrets.token_hex(16)).encode("utf-8")
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("Concierge page, live agent and verification API: http://127.0.0.1:%d/" % port)
    ps = CHAT.PROVIDER.status()
    print("Live agent: %s" % ("%s, model %s, connected through a Claude Managed Agent" % (ps["provider"], ps["model"]) if ps["configured"] and not ps.get("testDouble")
                              else "TEST DOUBLE (no Claude)" if ps.get("testDouble")
                              else "NOT configured (missing %s). The chat will say so. See .env.example and docs/CONSOLE_SETUP.md." % ", ".join(k for k in ("apiKey", "agentId", "environmentId") if not ps.get(k))))
    print("E-mail sending: %s" % ("configured (%s via %s)" % (CONFIG["sender"], CONFIG["host"]) if configured() else "NOT configured. Set OTP_SMTP_* in the environment or in .env (see .env.example)."))
    print("Allowed recipients: %s" % ", ".join(CONFIG["allowed"]))
    added = seed_profiles()
    if added:
        print("Saved profiles: prepared account(s) added to the store: %s" % ", ".join(added))
    print("Saved profiles: %s" % ("store %s" % PROFILE_STORE if os.path.isfile(PROFILE_STORE) else "no store (returning customers get 'no saved profile')"))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
