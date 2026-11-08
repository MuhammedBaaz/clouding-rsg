"""Create (or find) the Claude Managed Agent and its environment for the live concierge.

    python tools/console_setup.py            # reuse an existing agent/environment with these names, or create them
    python tools/console_setup.py --update   # also push the current system prompt + tools to an existing agent

Reads ANTHROPIC_API_KEY (and optionally ANTHROPIC_MODEL, ANTHROPIC_AGENT_ID, ANTHROPIC_ENVIRONMENT_ID) from the
environment or from .env next to server.py. Prints the ids to paste into .env. Never prints the key.

The agent is built from agent/system_prompt.md followed by the approved facts (agent/data.json: BOOKING, RESORTS,
VILLAS, RESORT_COMPARE) and the custom tools in agent/tools.json. The built-in sandbox tools (bash, read, write,
edit, glob, grep, web_fetch, web_search) are disabled: every tool this agent uses runs in server.py.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

AGENT_NAME = "RSG Concierge (Clouding)"
ENV_NAME = "RSG Concierge environment"


def load_env():
    path = os.path.join(ROOT, ".env")
    try:
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k, v = k.strip(), v.strip().strip("\"'")
                if k.startswith("ANTHROPIC_") and k not in os.environ:
                    os.environ[k] = v
    except OSError:
        pass


def build_system():
    with open(os.path.join(ROOT, "agent", "system_prompt.md"), encoding="utf-8") as fh:
        prompt = fh.read().strip()
    from agent import data as D
    facts = {"BOOKING": D.BOOKING, "RESORTS": D.RESORTS, "VILLAS": D.VILLAS, "RESORT_COMPARE": D.RESORT_COMPARE}
    return prompt + "\n\n```json\n" + json.dumps(facts, ensure_ascii=False, sort_keys=True) + "\n```\n"


def build_tools():
    with open(os.path.join(ROOT, "agent", "tools.json"), encoding="utf-8") as fh:
        custom = json.load(fh)
    toolset = {"type": "agent_toolset_20260401", "default_config": {"enabled": False},
               "configs": [{"name": n, "enabled": False} for n in ("bash", "read", "write", "edit", "glob", "grep", "web_fetch", "web_search")]}
    return [toolset] + custom


def main():
    load_env()
    update = "--update" in sys.argv
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key:
        print("ANTHROPIC_API_KEY is not set (environment or .env). Create one at https://platform.claude.com/settings/keys and retry.")
        return 2
    try:
        import anthropic
    except ImportError:
        print("The Anthropic SDK is missing. Run: python -m pip install -r requirements.txt")
        return 2
    model = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5-5").strip()
    client = anthropic.Anthropic(api_key=key)
    system, tools = build_system(), build_tools()

    # ---- agent: reuse by id, then by name, else create
    agent = None
    want = os.environ.get("ANTHROPIC_AGENT_ID", "").strip()
    if want:
        try:
            agent = client.beta.agents.retrieve(want)
            print("Agent %s found by id (%s)." % (agent.id, getattr(agent, "name", "")))
        except anthropic.NotFoundError:
            print("ANTHROPIC_AGENT_ID %s was not found; looking up by name." % want)
    if agent is None:
        for a in client.beta.agents.list():
            if getattr(a, "name", "") == AGENT_NAME:
                agent = a
                print("Agent %s found by name %r." % (a.id, AGENT_NAME))
                break
    if agent is None:
        agent = client.beta.agents.create(name=AGENT_NAME, model=model, system=system, tools=tools,
                                          description="Visit Red Sea concierge demo (Clouding AI). Tools run in the application backend.")
        print("Agent created: %s (model %s, %d custom tools)." % (agent.id, model, len(tools) - 1))
    elif update:
        agent = client.beta.agents.update(agent.id, model=model, system=system, tools=tools)
        print("Agent %s updated with the current system prompt, model %s and tools." % (agent.id, model))
    else:
        print("Agent not modified (pass --update to push the current system prompt and tools).")

    # ---- environment: reuse by id, then by name, else create a cloud environment without extra networking or packages
    env = None
    want = os.environ.get("ANTHROPIC_ENVIRONMENT_ID", "").strip()
    if want:
        try:
            env = client.beta.environments.retrieve(want)
            print("Environment %s found by id." % env.id)
        except anthropic.NotFoundError:
            print("ANTHROPIC_ENVIRONMENT_ID %s was not found; looking up by name." % want)
    if env is None:
        for e in client.beta.environments.list():
            if getattr(e, "name", "") == ENV_NAME:
                env = e
                print("Environment %s found by name %r." % (e.id, ENV_NAME))
                break
    if env is None:
        env = client.beta.environments.create(name=ENV_NAME, config={"type": "cloud"},
                                              description="Minimal cloud environment for the RSG concierge sessions (no sandbox tools are enabled).")
        print("Environment created: %s." % env.id)

    print("\nPaste into .env next to server.py:\n")
    print("ANTHROPIC_AGENT_ID=%s" % agent.id)
    print("ANTHROPIC_ENVIRONMENT_ID=%s" % env.id)
    print("ANTHROPIC_MODEL=%s" % model)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:                                   # the SDK's message, never the key
        print("Console setup failed: %s: %s" % (type(e).__name__, str(e)[:400]))
        sys.exit(1)
