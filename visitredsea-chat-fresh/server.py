"""Static server for the fresh RSG site with the Empathy Studio web widget.

    python server.py            # http://127.0.0.1:8100/  (refuses to start when the port is busy)
    python server.py 8130       # another port, only useful if Studio allows that origin

Serves this folder (dot-files, private paths and .py files are refused) and one generated script:

    GET /studio-widget.js       the Empathy Studio embed snippet, exactly as supplied, with the channel's browser
                                key read from .env (STUDIO_CHANNEL_KEY). Empty when the key is not set.

The key is the channel's browser key (acp_...), meant to be sent from the page; it is kept in .env so it is not
committed. No server credential is used by this site.
"""
import json
import os
import re
import socket
import sys
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.abspath(__file__))


def load_dotenv(path):
    try:
        with open(path, encoding="utf-8-sig") as fh:          # tolerates the BOM PowerShell adds
            for line in fh:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k, v = k.strip(), v.strip()
                if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
                    v = v[1:-1]
                if (k.startswith("STUDIO_") or k.startswith("RSG_")) and k not in os.environ:
                    os.environ[k] = v
    except OSError:
        pass


load_dotenv(os.path.join(ROOT, ".env"))
# The live backend (visitredsea-chat-live/server.py) that holds the completed bookings; trip.html fetches a booking
# record through this server so the browser talks to one origin only. Server-to-server, so a local address is fine.
BACKEND_URL = os.environ.get("RSG_BACKEND_URL", "http://127.0.0.1:8110").strip().rstrip("/")

STUDIO = {
    "key": os.environ.get("STUDIO_CHANNEL_KEY", "").strip(),
    "sdk": os.environ.get("STUDIO_SDK_URL", "https://cdn.clouding.ai/sdk/web/next/core.min.js").strip(),
    "sse": os.environ.get("STUDIO_SSE_ENDPOINT", "https://acp-test.clouding.ai/api/v1/chat").strip(),
    "avatar": os.environ.get("STUDIO_AVATAR_URL", "https://i.postimg.cc/TYg4S1HH/image-1794154482438.png").strip(),
}


# Appearance. The Web SDK reads its look (colours, agent name, welcome card, introduction, input copy, typing texts,
# position, dimensions) only from the ChatWidget.init({...}) config; it fetches nothing at runtime (core.min.js 1.14.0:
# the only request is the chat endpoint, whose "ack" carries ids). Studio's customizer therefore hands the whole
# configuration over as the "Copy snippet" output. Paste that snippet, unchanged, into one of these files (private/ is
# never served and is gitignored) and the server uses its config object verbatim; without a file the minimal config
# below applies and the widget shows the SDK defaults.
SNIPPET_FILES = [os.path.join(ROOT, "private", "studio-widget.snippet.html"), os.path.join(ROOT, "private", "studio-widget.snippet.js"),
                 os.path.join(ROOT, "private", "studio-widget.snippet.txt")]


def studio_snippet():
    """(config_literal, sdk_src) from the pasted Copy-snippet output, or (None, None)."""
    for path in SNIPPET_FILES:
        try:
            with open(path, encoding="utf-8-sig") as fh:
                text = fh.read()
        except OSError:
            continue
        i = text.find("ChatWidget.init(")
        if i < 0:
            continue
        j = i + len("ChatWidget.init(")
        depth, k, in_str, esc = 0, j, None, False
        while k < len(text):                                   # the balanced object literal after init(
            ch = text[k]
            if in_str:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == in_str:
                    in_str = None
            elif ch in "\"'`":
                in_str = ch
            elif ch in "([{":
                depth += 1
            elif ch in ")]}":
                if depth == 0:
                    break
                depth -= 1
            k += 1
        literal = text[j:k].strip()
        if not literal.startswith("{"):
            continue
        m = re.search(r"<script[^>]*src=[\"']([^\"']+core\.min\.js)[\"']", text)
        return literal, (m.group(1) if m else None)
    return None, None


def widget_js():
    """Load the SDK, then ChatWidget.init once: with the config object from Studio's Copy-snippet output when a snippet
    file exists (appearance included), else the minimal transport + avatar config."""
    if not STUDIO["key"]:
        return "/* Empathy Studio widget not configured: set STUDIO_CHANNEL_KEY in .env (see .env.example) */\n"
    literal, sdk_src = studio_snippet()
    if literal:
        cfg_js, sdk = literal, sdk_src or STUDIO["sdk"]
        source = "Studio Copy-snippet config (private/studio-widget.snippet.*)"
    else:
        cfg_js = json.dumps({"transport": {"sseEndpoint": STUDIO["sse"], "apiKey": STUDIO["key"]}, "agent": {"avatarUrl": STUDIO["avatar"]}}, ensure_ascii=False)
        sdk = STUDIO["sdk"]
        source = "minimal config (no snippet file: SDK default appearance)"
    return (
        "/* appearance source: " + source + " */\n"
        "(function () {\n"
        "  if (window.__rsgStudioWidget) return;                 /* one widget, one initialisation */\n"
        "  window.__rsgStudioWidget = true;\n"
        "  var cfg = " + cfg_js + ";\n"
        "  var s = document.createElement('script'); s.src = " + json.dumps(sdk) + ";\n"
        "  s.onload = function () {\n"
        "    if (!(window.ChatWidget && ChatWidget.init)) { console.error('Empathy Studio SDK loaded without ChatWidget.init'); return; }\n"
        "    window.__rsgStudioInstance = ChatWidget.init(cfg);\n"
        "    document.dispatchEvent(new CustomEvent('rsg:widget-ready'));\n"
        "  };\n"
        "  s.onerror = function () { console.error('Empathy Studio SDK could not be loaded from ' + s.src); };\n"
        "  document.head.appendChild(s);\n"
        "})();\n")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        if self.path.startswith("/studio-widget.js"):
            sys.stderr.write("%s %s\n" % (self.command, self.path))

    def _private(self):
        segs = [p for p in unquote(self.path.split("?")[0].split("#")[0]).replace("\\", "/").split("/") if p]
        return any(p.startswith(".") for p in segs) or (segs and segs[0].lower() == "private") or (segs and segs[-1].lower().endswith(".py"))

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_HEAD(self):
        if self._private():
            return self.send_error(HTTPStatus.NOT_FOUND)
        return super().do_HEAD()

    def trip_record(self):
        """GET /api/trip?b=<booking id>&t=<token>: proxied to the live backend's signed booking-record endpoint."""
        from urllib.parse import parse_qs, urlparse, quote
        import urllib.request
        q = parse_qs(urlparse(self.path).query)
        b, t = (q.get("b") or [""])[0][:40], (q.get("t") or [""])[0][:64]
        if not b or not t:
            return self._json(400, {"error": "bad_request"})
        try:
            with urllib.request.urlopen(BACKEND_URL + "/api/booking/" + quote(b) + "?t=" + quote(t), timeout=15) as r:
                body = r.read()
                return self._raw(200, body)
        except urllib.error.HTTPError as e:
            return self._json(e.code if e.code in (400, 404) else 502, {"error": "not_found" if e.code == 404 else "backend_error"})
        except Exception:
            return self._json(502, {"error": "backend_unreachable"})

    def _json(self, status, payload):
        self._raw(status, json.dumps(payload, ensure_ascii=False).encode("utf-8"))

    def _raw(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/api/trip":
            return self.trip_record()
        if path == "/studio-widget.js":
            body = widget_js().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if self._private():
            return self.send_error(HTTPStatus.NOT_FOUND)
        return super().do_GET()


def port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("127.0.0.1", port)) == 0


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8100
    if port_in_use(port):
        print("Cannot start: something already listens on 127.0.0.1:%d. Find it with:  netstat -ano | findstr :%d" % (port, port))
        print("The Studio web channel allows exact origins only, so this server does not move to another port.")
        return 1
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("Fresh RSG site: http://127.0.0.1:%d/" % port)
    print("Empathy Studio widget: %s" % ("configured (channel key from .env, endpoint %s)" % STUDIO["sse"] if STUDIO["key"] else "NOT configured: set STUDIO_CHANNEL_KEY in .env"))
    _lit, _src = studio_snippet()
    print("Widget appearance: " + ("from Studio's Copy-snippet file (private/studio-widget.snippet.*)" if _lit else "SDK defaults (no private/studio-widget.snippet.* file; paste Studio's Copy snippet there)"))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
