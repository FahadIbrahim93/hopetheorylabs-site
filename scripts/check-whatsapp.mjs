/**
 * Offline checks for every WhatsApp link the site can produce.
 * - The generated hrefs decode to the exact messages we intend (incl. Bangla).
 * - No source file builds a bare wa.me link that would open an empty chat.
 */
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const fail = (msg) => { console.error("FAIL:", msg); process.exit(1); };
const ok = (msg) => console.log("ok:", msg);
const eq = (actual, expected, label) => {
  if (actual !== expected) fail(`${label}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
  ok(label);
};

const dir = mkdtempSync(join(tmpdir(), "htl-wa-"));
try {
  const build = spawnSync(
    "npx",
    ["tsc", "lib/whatsapp.ts", "content/en.ts", "content/types.ts", "--outDir", dir, "--rootDir", root, "--module", "commonjs", "--esModuleInterop", "--skipLibCheck", "--target", "ES2020", "--moduleResolution", "node"],
    { cwd: root, encoding: "utf8" },
  );
  if (build.status !== 0) { console.error(build.stdout, build.stderr); fail("could not compile lib/whatsapp.ts"); }
  const wa = require(join(dir, "lib/whatsapp.js"));
  const { en } = require(join(dir, "content/en.js"));

  const DEFAULT = "Hi Hope Theory Labs, I'd like to discuss a project.";
  const decode = (href) => {
    const url = new URL(href);
    if (url.origin + url.pathname !== "https://wa.me/8801718463471") fail(`unexpected target ${href}`);
    return url.searchParams.get("text");
  };

  // Default message, and exact encoding.
  eq(decode(wa.whatsappDefaultUrl), DEFAULT, "default link decodes to the default message");
  eq(
    wa.whatsappDefaultUrl,
    "https://wa.me/8801718463471?text=Hi%20Hope%20Theory%20Labs%2C%20I%27d%20like%20to%20discuss%20a%20project%2E",
    "default link href is fully percent-encoded (no trailing '.' or raw apostrophe)",
  );
  eq(decode(wa.whatsappUrl("")), DEFAULT, "empty message falls back to the default");

  // Contact form message.
  eq(
    wa.buildContactMessage({ name: "Rahim Uddin", kind: "AI Audit", goal: "Cut our weekly reporting time", timing: "In 1–3 months" }),
    "Hi Hope Theory Labs, I'm Rahim Uddin. Work: AI Audit. Goal: Cut our weekly reporting time. Start: In 1–3 months.",
    "form message with every answer",
  );
  eq(
    wa.buildContactMessage({ name: "A", kind: "", goal: "Ship it.", timing: "" }),
    "Hi Hope Theory Labs, I'm A. Goal: Ship it.",
    "empty optional parts are left out, no doubled full stop",
  );
  eq(
    wa.buildContactMessage({ name: "", kind: "Not sure yet", goal: "", timing: "Still exploring" }),
    "Hi Hope Theory Labs. Work: Not sure yet. Start: Still exploring.",
    "no name: greeting stays clean",
  );
  eq(
    wa.buildContactMessage({ name: "  Nadia ", kind: "AI Audit", goal: "line one\n\n  line   two", timing: "As soon as possible" }),
    "Hi Hope Theory Labs, I'm Nadia. Work: AI Audit. Goal: line one line two. Start: As soon as possible.",
    "whitespace and newlines are collapsed",
  );

  // Bangla, emoji, and URL-significant characters round-trip.
  for (const goal of ["আমাদের অ্যাপ দরকার & দ্রুত? 100% ✓", "Need A&B=C #1 + more/less?"]) {
    const href = wa.whatsappUrl(wa.buildContactMessage({ name: "রহিম", kind: "AI Audit", goal, timing: "As soon as possible" }));
    eq(
      decode(href),
      `Hi Hope Theory Labs, I'm রহিম. Work: AI Audit. Goal: ${goal}. Start: As soon as possible.`.replace("?.", "?").replace("✓.", "✓."),
      `round-trips: ${goal}`,
    );
    if (!/^[\x21-\x7E]+$/.test(href)) fail("href contains non-ASCII characters");
    if (/[#]/.test(href.split("?text=")[1])) fail("raw # in query would truncate the message");
  }
  ok("hrefs are pure ASCII and contain no raw #/&");

  // Very long goal is capped.
  const long = wa.buildContactMessage({ name: "A", kind: "AI Audit", goal: "x".repeat(5000), timing: "Still exploring" });
  if (long.length > 1200) fail("long goal is not capped");
  ok("long goal is capped");

  // Every link in the site copy carries text.
  const hrefs = [];
  const walk = (value) => {
    if (typeof value === "string") { if (value.includes("wa.me/")) hrefs.push(value); }
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  walk(en);
  if (hrefs.length < 8) fail(`expected the content to hold many WhatsApp links, found ${hrefs.length}`);
  for (const href of hrefs) {
    const text = decode(href);
    if (!text || !text.startsWith("Hi Hope Theory Labs")) fail(`link without a proper prefilled message: ${href}`);
  }
  ok(`all ${hrefs.length} WhatsApp links in the site copy carry a prefilled message`);
  eq(decode(en.contact.phoneHref), DEFAULT, "contact page plain WhatsApp link uses the default message");
  eq(decode(en.hero.whatsappLink), "Hi Hope Theory Labs, I'm interested in software or AI engineering.", "hero link names the approved engineering scope");

  // No source file may hard-code a bare wa.me link.
  const bare = [];
  const scan = (path) => {
    for (const name of readdirSync(path)) {
      if (["node_modules", ".next", "out", ".git", "docs", "tests", "public"].includes(name)) continue;
      const full = join(path, name);
      if (statSync(full).isDirectory()) { scan(full); continue; }
      if (!/\.(tsx?|mjs|html|txt)$/.test(name)) continue;
      if (relative(root, full) === "lib/whatsapp.ts" || relative(root, full).startsWith("scripts/check-")) continue;
      const src = readFileSync(full, "utf8");
      for (const m of src.matchAll(/wa\.me\/\d+(?!\d|\?text=)/g)) bare.push(`${relative(root, full)}: ${m[0]}`);
    }
  };
  scan(root);
  if (bare.length) fail(`bare wa.me links (open an empty chat):\n  ${bare.join("\n  ")}`);
  ok("no bare wa.me links in source");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log("check-whatsapp: all passed");
