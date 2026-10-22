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

Until OTP_SMTP_HOST, OTP_SMTP_USER and OTP_SMTP_PASSWORD are set the API
answers 503 "email_not_configured" and the page says so. There is no
console fallback.
"""
import hashlib
import hmac
import json
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
                if k.startswith("OTP_") and k not in os.environ:
                    os.environ[k] = v
    except OSError:
        pass


load_dotenv(os.path.join(ROOT, ".env"))
CODE_TTL = 300          # seconds a code stays valid
MAX_ATTEMPTS = 5        # wrong entries before the challenge is locked
RESEND_COOLDOWN = 30    # seconds between two requests for the same address
MAX_BODY = 4096

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
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n <= 0 or n > MAX_BODY:
            return None
        try:
            return json.loads(self.rfile.read(n).decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            return None

    def end_headers(self):
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/api/otp/status":
            return self._json(200, {"service": "otp", "configured": configured(), "ttlSec": CODE_TTL, "resendAfterSec": RESEND_COOLDOWN,
                                    "smtpHost": bool(CONFIG["host"]), "smtpUser": bool(CONFIG["user"]), "smtpPassword": bool(CONFIG["password"]), "sender": bool(CONFIG["sender"])})
        if path.startswith("/api/"):
            return self._json(404, {"error": "not_found"})
        return super().do_GET()

    def do_POST(self):
        path = self.path.split("?")[0]
        if path == "/api/otp/request":
            return self.otp_request()
        if path == "/api/otp/verify":
            return self.otp_verify()
        self._json(404, {"error": "not_found"})

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
            return self._json(200, {"verified": True})
        status = {"wrong": 400, "expired": 410, "locked": 423, "consumed": 410, "invalid_challenge": 404}[result]
        return self._json(status, {"error": result, "attemptsLeft": left})


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("Concierge page and verification API: http://127.0.0.1:%d/" % port)
    print("E-mail sending: %s" % ("configured (%s via %s)" % (CONFIG["sender"], CONFIG["host"]) if configured() else "NOT configured. Set OTP_SMTP_* in the environment or in .env (see .env.example)."))
    print("Allowed recipients: %s" % ", ".join(CONFIG["allowed"]))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
