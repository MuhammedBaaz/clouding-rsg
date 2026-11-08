# Connecting the live concierge to Claude (Managed Agents)

The live build talks to a **Claude Managed Agent** (Anthropic's hosted agent runtime, beta as of 8 Nov 2026, beta header `managed-agents-2026-04-01`, set automatically by the SDK). Agents and environments are created through the API, the SDK or the `ant` CLI; the Console has no screen for them. The script `tools/console_setup.py` does that step for you and prints the ids. The only thing you create in the Console by hand is the API key.

What this build does and does not do:

- The agent runs the conversation (understands the guest, calls one of 18 application tools per message). Every tool runs in `server.py`; the agent's built-in sandbox tools (bash, read, write, edit, glob, grep, web_fetch, web_search) are disabled on the agent.
- The agent never receives OTP codes, verification session tokens, e-mail addresses, phone numbers or the saved profile. It sees first names, the stage and the booking selections.
- Managed Agents sessions persist on Anthropic's side until deleted (they are not eligible for Zero Data Retention). One remote session is created per chat conversation; `server.py` keeps only its id.
- Pricing: token rates of the chosen model (`claude-sonnet-5-5` by default). The docs read on 8 Nov 2026 list no separate Managed Agents session fee; check your Console billing after the first live runs.

## 0. Current state (8 November 2026)

Steps 1 to 6 below are done on the owner's machine: the agent **RSG Concierge (Clouding)** is `agent_01D3yFvZ2ZTDBwxa8i5g8YN3`, the environment is `env_014yGcQKoVVA6nP1zVTQz5yN`, both on `claude-sonnet-5-5`, and `.env` in this folder holds the key and the ids. `python tools/console_setup.py` finds them again by id or name and will not create duplicates; `--update` pushes prompt/tool changes. To demo: `start.cmd` → http://127.0.0.1:8100/.

## 1. Steps

| Step | Console screen and button | Exact field label | Exact value to enter or where to get it | Expected result |
|---|---|---|---|---|
| 1 | https://platform.claude.com/settings/keys → **Create Key** | Key name | `rsg-concierge-live` (any name) | A key starting with `sk-ant-…` shown once. **You paste it** into `.env` as `ANTHROPIC_API_KEY`. Never commit it. |
| 2 | (local) `D:\Clouding\RSG\visitredsea-chat-live\.env` | `ANTHROPIC_API_KEY=` | the key from step 1 | The file also holds the SMTP values copied from V2. |
| 3 | (local, Windows terminal in the live folder) | — | `python -m pip install -r requirements.txt` | `anthropic` 2.x installed (3.11 Store Python: `--user` is added automatically). |
| 4 | (local) | — | `python tools/console_setup.py` | Prints `Agent created: agent_…` (or "found by name"), `Environment created: env_…`, then three lines to paste. **Console generates** these ids. |
| 5 | (local) `.env` | `ANTHROPIC_AGENT_ID=`, `ANTHROPIC_ENVIRONMENT_ID=`, `ANTHROPIC_MODEL=` | the three lines printed in step 4 | — |
| 6 | (local) | — | `start.cmd` (or `python server.py 8100`) | Console prints `Live agent: managed_agents, model claude-sonnet-5-5, connected through a Claude Managed Agent`. Browser opens http://127.0.0.1:8100/ |
| 7 | Browser, http://127.0.0.1:8100/?open=1 | — | type `أنا محمد`, then `أبي أتصفح المنتجعات على الصفحة` | The concierge answers by name; the second message minimises the chat, scrolls to the resort cards and runs the spotlight. |
| 8 | (optional, after changing `agent/system_prompt.md`, `agent/tools.json` or `data/*.js`) | — | `node tools/dump_data.mjs` then `python tools/console_setup.py --update` | The agent on Anthropic's side gets the new prompt, facts and tools. `server.py` refuses to start when `agent/data.json` is older than the data files. |

If you prefer the `ant` CLI or raw API calls: the agent definition is the object the script builds — `name` `RSG Concierge (Clouding)`, `model` from `ANTHROPIC_MODEL`, `system` = `agent/system_prompt.md` + a fenced JSON block of `BOOKING`, `RESORTS`, `VILLAS`, `RESORT_COMPARE` from `agent/data.json`, `tools` = `[{"type":"agent_toolset_20260401","default_config":{"enabled":false},"configs":[…all eight disabled…]}]` followed by the 18 custom tools of `agent/tools.json`. The environment is `{"name":"RSG Concierge environment","config":{"type":"cloud"}}`. Endpoints (beta header required): `POST /v1/agents`, `POST /v1/environments`, `POST /v1/sessions`, `POST /v1/sessions/{id}/events`, `GET /v1/sessions/{id}/events/stream`.

## 2. Environment variables (`.env` next to `server.py`, or the process environment, which wins)

| Variable | Who sets it | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | you (secret) | Console API key |
| `ANTHROPIC_AGENT_ID` | printed by `console_setup.py` | the Managed Agent |
| `ANTHROPIC_ENVIRONMENT_ID` | printed by `console_setup.py` | the cloud environment sessions run in |
| `ANTHROPIC_MODEL` | you, default `claude-sonnet-5-5` | model used when creating/updating the agent |
| `ANTHROPIC_STREAM_TIMEOUT` | optional, default 120 | seconds to wait for one agent run |
| `OTP_SMTP_*`, `OTP_ALLOWED_RECIPIENTS`, `PROFILE_STORE` | as in V2 | e-mail verification and saved profiles (unchanged) |
| `LIVE_AGENT_TEST_DOUBLE` | tests only | `1` replaces Claude with a local keyword stand-in (loud banner). Never set it for a demo. |

`.env.example` lists them with comments.

## 3. Smoke test

```bat
cd /d D:\Clouding\RSG\visitredsea-chat-live
python -m pip install -r requirements.txt
python tools/console_setup.py
start.cmd
```

Then in the browser (http://127.0.0.1:8100/?open=1):

1. `أنا محمد` → «حياك الله يا محمد…».
2. `أبي أتصفح المنتجعات على الصفحة` → chat minimises to the bar, page scrolls to the cards, spotlight walks over them, اختر buttons appear. Press **اختر** on Shebara → chat comes back with the Shebara card and the villas.
3. Ask a side question (`كم فيلا في شباره؟`) → an answer from the approved facts, no step change.
4. Continue with the cards as in V2. A returning guest (`لدي حساب سابق`) gets a real code by e-mail; a new guest gets no code.
5. **المتابعة للدفع** opens the official checkout; when you come back, the concierge says this demo receives no payment result and shows the trip summary with **تحميل PDF**.

Protocol regression (against a test instance, never the demo port): `set LIVE_AGENT_TEST_DOUBLE=1`, `python server.py 8101`, `node tools/drive_live.mjs http://127.0.0.1:8101`; with the real agent, `node tools/drive_live.mjs http://127.0.0.1:8101 --live`.

## 4. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Chat says «اتصال المساعد غير مهيّأ…» | key, agent id or environment id missing | fill `.env`, restart |
| Chat says «تعذر الاتصال بالمساعد الآن…» and the server log shows `auth` | wrong or revoked key | new key in the Console |
| … log shows `not_found` | agent or environment id wrong | rerun `console_setup.py` |
| … log shows `rate_limit` / `provider` / `timeout` | Anthropic side | retry; the guest keeps their place |
| `live agent backend unavailable: agent/data.json is out of date` | a `data/*.js` file changed | `node tools/dump_data.mjs`, then `console_setup.py --update` |
| `No module named anthropic` | SDK not installed for this Python | `python -m pip install -r requirements.txt` |
