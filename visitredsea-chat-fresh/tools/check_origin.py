"""Does the Studio channel accept a browser origin? Sends the channel's own request shape with the key from .env.

    python tools/check_origin.py                       # checks http://127.0.0.1:8100
    python tools/check_origin.py http://localhost:8100 https://demo.example

400 "Failed to parse request body" = the origin is allowed (the request got past the origin check and was parsed).
403 with an empty body = the origin is NOT on the channel's Allowed domains. The key is never printed.
"""
import json
import os
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env = {}
try:
    with open(os.path.join(ROOT, ".env"), encoding="utf-8-sig") as fh:
        for line in fh:
            if "=" in line and not line.strip().startswith("#"):
                k, v = line.strip().split("=", 1)
                env[k.strip()] = v.strip().strip("\"'")
except OSError:
    pass
key = env.get("STUDIO_CHANNEL_KEY", "")
endpoint = env.get("STUDIO_SSE_ENDPOINT", "https://acp-test.clouding.ai/api/v1/chat")
if not key:
    print("STUDIO_CHANNEL_KEY is not set in .env"); sys.exit(2)
origins = sys.argv[1:] or ["http://127.0.0.1:8100"]
for origin in origins + [None]:
    headers = {"X-API-Key": key, "Content-Type": "application/json"}
    if origin:
        headers["Origin"] = origin
    req = urllib.request.Request(endpoint, data=b"{}", headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            code, body = r.status, r.read(200)
    except urllib.error.HTTPError as e:
        code, body = e.code, e.read(200)
    except Exception as e:
        print("%-32s network error: %s" % (origin or "(no Origin header)", type(e).__name__)); continue
    verdict = "ALLOWED (request parsed)" if code == 400 else "REJECTED by the origin check" if code == 403 else "status %d" % code
    print("%-32s %d  %s" % (origin or "(no Origin header)", code, verdict))
