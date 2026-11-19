#!/usr/bin/env node
/* Dumps the approved browser data files (data/booking.js, data/resorts.js,
   data/villas.js, data/script.js) into agent/data.json so server.py can read
   the same facts and wording without a JavaScript runtime at request time.

   The files are evaluated in the order index.html loads them, with a bare
   `window` object, so the IIFEs in data/resorts.js (profiles, URLs) and the
   computed BOOKING.grandTotal come out exactly as the page sees them.
   The sha256 of each source file is recorded; server.py refuses to start
   when a source changed and this dump was not regenerated:

       node tools/dump_data.mjs
*/
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = ["data/booking.js", "data/resorts.js", "data/villas.js", "data/script.js"];
const window = {};
const ctx = vm.createContext({ window });
const sources = {};
for (const f of files) {
  const src = readFileSync(join(root, f), "utf8").replace(/^﻿/, "");
  sources[f] = createHash("sha256").update(src.replace(/\r\n/g, "\n"), "utf8").digest("hex");   // line endings do not count (agent/data.py)
  vm.runInContext(src, ctx, { filename: f });
}
const out = {
  generated: new Date().toISOString(),
  sources,
  BOOKING: window.BOOKING,
  RESORTS: window.RESORTS,
  VILLAS: window.VILLAS,
  RESORT_COMPARE: window.RESORT_COMPARE,
  SCRIPT: window.SCRIPT,
};
for (const k of ["BOOKING", "RESORTS", "VILLAS", "RESORT_COMPARE", "SCRIPT"]) {
  if (!out[k]) { console.error("missing window." + k); process.exit(1); }
}
const target = join(root, "agent", "data.json");
writeFileSync(target, JSON.stringify(out, null, 1) + "\n", "utf8");
console.log("wrote " + target + " (" + Object.keys(sources).length + " sources)");
