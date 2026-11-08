"""Approved data for the live concierge backend.

agent/data.json is generated from the browser data files by
tools/dump_data.mjs (see that file). It carries the sha256 of each source,
so a change to data/*.js without a regenerated dump is refused at start:
the agent must never answer from facts the page no longer shows.
"""
import hashlib
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DUMP = os.path.join(ROOT, "agent", "data.json")


class DataError(RuntimeError):
    pass


def _sha256(path):
    with open(path, "rb") as fh:
        raw = fh.read()
    if raw.startswith(b"\xef\xbb\xbf"):
        raw = raw[3:]
    return hashlib.sha256(raw).hexdigest()


def load():
    try:
        with open(DUMP, encoding="utf-8") as fh:
            d = json.load(fh)
    except FileNotFoundError:
        raise DataError("agent/data.json is missing. Run: node tools/dump_data.mjs")
    except ValueError as e:
        raise DataError("agent/data.json is not valid JSON (%s). Run: node tools/dump_data.mjs" % e)
    stale = [f for f, h in d.get("sources", {}).items() if _sha256(os.path.join(ROOT, f)) != h]
    if stale:
        raise DataError("agent/data.json is out of date for %s. Run: node tools/dump_data.mjs" % ", ".join(stale))
    for k in ("BOOKING", "RESORTS", "VILLAS", "RESORT_COMPARE", "SCRIPT"):
        if k not in d:
            raise DataError("agent/data.json lacks %s. Run: node tools/dump_data.mjs" % k)
    return d


DATA = load()
BOOKING = DATA["BOOKING"]
RESORTS = DATA["RESORTS"]
VILLAS = DATA["VILLAS"]
RESORT_COMPARE = DATA["RESORT_COMPARE"]
SCRIPT = DATA["SCRIPT"]

ALL_RESORTS = []
for _g in RESORTS:
    for _r in _g["items"]:
        _r = dict(_r)
        _r["group"] = _g["group"]
        ALL_RESORTS.append(_r)


def resort_id(name):
    """Stable id for a resort: lower-case, hyphenated first words (shebara, desert-rock, six-senses-southern-dunes...)."""
    import re
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


RESORT_BY_ID = {resort_id(r["name"]): r for r in ALL_RESORTS}
RESORT_BY_NAME = {r["name"]: r for r in ALL_RESORTS}
SUGGESTED = ["Shebara", "Desert Rock", "Six Senses Southern Dunes, The Red Sea"]
PAGE_RESORTS = [r["name"] for r in RESORTS[0]["items"]]       # the cards on the host page (The Red Sea group)
