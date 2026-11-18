"""Push ONLY the system prompt and the tool definitions to the existing Managed Agent, then read it back.

    python tools/console_update.py            # show what would change, then update system + tools
    python tools/console_update.py --check    # diff only, no update

Unlike `console_setup.py --update`, this never resends the model (the Console holds a model object with its own
effort setting), the name, the description, MCP servers or skills, and it keeps the Console's own toolset entry
byte for byte. Reads ANTHROPIC_API_KEY and ANTHROPIC_AGENT_ID from the environment or .env; never prints the key.
"""
import io
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "tools"))


def main():
    import console_setup
    console_setup.load_env()
    import anthropic
    c = anthropic.Anthropic()
    aid = os.environ.get("ANTHROPIC_AGENT_ID", "").strip()
    if not aid:
        print("ANTHROPIC_AGENT_ID is not set.")
        return 2
    before = c.beta.agents.retrieve(aid).model_dump()
    toolset = [t for t in before["tools"] if t.get("type") != "custom"]
    with io.open(os.path.join(ROOT, "agent", "tools.json"), encoding="utf-8") as fh:
        local_custom = json.load(fh)
    system = console_setup.build_system()
    console_custom = {t["name"]: t for t in before["tools"] if t.get("type") == "custom"}
    changed = [t["name"] for t in local_custom if t["name"] not in console_custom or console_custom[t["name"]].get("description") != t["description"]
               or {k: v for k, v in (console_custom[t["name"]].get("input_schema") or {}).items() if v is not None} != {k: v for k, v in t["input_schema"].items() if v is not None}]
    removed = sorted(set(console_custom) - {t["name"] for t in local_custom})
    print("Console agent %s version %s, model %s" % (aid, before["version"], before["model"]))
    print("system: %d -> %d chars (%s)" % (len(before["system"]), len(system), "differs" if before["system"] != system else "identical"))
    print("custom tools: %d -> %d; changed or new: %s; removed: %s" % (len(console_custom), len(local_custom), changed or "none", removed or "none"))
    if "--check" in sys.argv:
        return 0
    if before["system"] == system and not changed and not removed:
        print("Nothing to update.")
        return 0
    clean = []
    for t in toolset + local_custom:
        t = {k: v for k, v in t.items() if v is not None}
        if "input_schema" in t:
            t["input_schema"] = {k: v for k, v in t["input_schema"].items() if v is not None}
            if t["input_schema"].get("required") == []:
                t["input_schema"].pop("required")
        clean.append(t)
    after = c.beta.agents.update(aid, system=system, tools=clean).model_dump()
    ok_tools = {t["name"]: t["description"] for t in after["tools"] if t.get("type") == "custom"}
    print("updated: version %s -> %s | system matches: %s | custom tools %d | descriptions match: %s | model unchanged: %s | name/description/mcp/skills unchanged: %s | toolset unchanged: %s"
          % (before["version"], after["version"], after["system"] == system, len(ok_tools), all(ok_tools.get(t["name"]) == t["description"] for t in local_custom),
             after["model"] == before["model"], all(after.get(k) == before.get(k) for k in ("name", "description", "mcp_servers", "skills", "multiagent", "metadata")),
             [t for t in after["tools"] if t.get("type") != "custom"] == toolset))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:                                   # the SDK's message, never the key
        print("Console update failed: %s: %s" % (type(e).__name__, str(e)[:500]))
        sys.exit(1)
