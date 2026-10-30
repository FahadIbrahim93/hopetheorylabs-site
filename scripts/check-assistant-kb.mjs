#!/usr/bin/env node
/*
 * Knowledge-base guard for the site assistant.
 *
 * The assistant may only state facts that live in `content/en.ts`. This test
 * compiles the content files and the knowledge base with the project's own
 * TypeScript, loads them, and fails if the KB exposes a ৳ figure that the site
 * copy does not contain, or if the contact details drift apart.
 *
 * Run with `npm test`.
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = mkdtempSync(join(tmpdir(), "htl-kb-"));

const failures = [];
function check(label, condition, detail) {
  if (condition) {
    console.log(`  ok  ${label}`);
  } else {
    failures.push(detail ? `${label} — ${detail}` : label);
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function pricesIn(text) {
  // Must end on a digit, so a comma used as punctuation ("৳10,000, ৳25,000")
  // is not read as part of the figure.
  return (text.match(/৳\s?[\d,]*\d/g) ?? []).map((price) => price.replace(/\s/g, ""));
}

try {
  execFileSync(
    process.execPath,
    [
      join(root, "node_modules", "typescript", "bin", "tsc"),
      "lib/assistant/kb.ts",
      "--outDir",
      out,
      "--module",
      "commonjs",
      "--target",
      "es2022",
      "--moduleResolution",
      "node",
      "--esModuleInterop",
      "--skipLibCheck",
    ],
    { cwd: root, stdio: "pipe" },
  );

  const require = createRequire(import.meta.url);
  const kb = require(join(out, "lib", "assistant", "kb.js"));
  const { en } = require(join(out, "content", "en.js"));

  const kbText = kb.FACTS_LINES.join("\n");
  const enText = JSON.stringify(en);
  const kbPrices = pricesIn(kbText);
  const enPrices = new Set(pricesIn(enText));

  check("KB exposes at least one price", kbPrices.length > 0);
  check(
    "every KB price appears in content/en.ts",
    kbPrices.every((price) => enPrices.has(price)),
    kbPrices.filter((price) => !enPrices.has(price)).join(", "),
  );
  check("site copy still carries the website price", enPricingContains(en, "৳25,000"));
  check("site copy still carries the founding price", enPricingContains(en, "৳15,000"));
  check(
    "site copy carries every approved package",
    ["৳10,000", "৳25,000", "৳45,000"].every((price) => enPricingContains(en, price)),
    "one of Starter/Counter/Showroom is missing",
  );
  check(
    "KB states every package",
    ["Starter", "Counter", "Showroom"].every((name) => kbText.includes(name)),
  );
  check(
    "KB states the payment split and terms",
    /quarter midway/.test(kbText) && /at cost/.test(kbText) && /care plan/.test(kbText),
  );

  check("WhatsApp number comes from the site copy", en.contact.phone.includes(kb.WHATSAPP_DISPLAY));
  check("email comes from the site copy", kb.EMAIL === en.contact.email);

  check(
    "price guard rejects an invented figure",
    kb.unknownPrice("A website is ৳99,999") === "৳99,999",
  );
  check(
    "price guard catches a price written without the taka sign",
    kb.unknownPrice("We charge 40,000 taka") === "40,000 taka",
  );
  check("price guard accepts a real figure", kb.unknownPrice("Websites from ৳25,000") === null);
  check("price guard accepts the cheapest package", kb.unknownPrice("Starter is ৳10,000") === null);
  check("price guard accepts the largest package", kb.unknownPrice("Showroom costs 45,000 taka") === null);
  check("price guard rejects a discount we do not offer", kb.unknownPrice("Showroom is ৳35,000") === "৳35,000");
  check("price guard accepts the founding price in words", kb.unknownPrice("Founding clients pay BDT 15000") === null);
  check("FAQ matcher answers pricing questions", /25,000/.test(kb.matchFaq("how much does a website cost").reply));
  check(
    "FAQ matcher answers the compare-packages chip with the ladder",
    /Starter/.test(kb.matchFaq("Compare website packages").reply) &&
      /45,000/.test(kb.matchFaq("Compare website packages").reply),
  );
  check(
    "every chip the widget sends is answered, not handed off",
    en.assistant.chips
      .slice(0, 3)
      .every((chip) => kb.matchFaq(chip).id !== "handoff"),
    en.assistant.chips.slice(0, 3).filter((chip) => kb.matchFaq(chip).id === "handoff").join(", "),
  );
  check("FAQ matcher answers the care plan question", kb.matchFaq("is there a care plan?").id === "price");
  check("FAQ matcher hands unknown questions to WhatsApp", /wa\.me/.test(kb.matchFaq("do you offer SEO in Sylhet?").reply));
  check("Bangla detection", kb.hasBangla("ওয়েবসাইটের দাম কত?") && !kb.hasBangla("what is the price"));
  check("system prompt lists the facts", kb.buildSystemPrompt().includes("৳25,000"));
  check("system prompt lists the packages", kb.buildSystemPrompt().includes("Showroom ৳45,000"));
} finally {
  rmSync(out, { recursive: true, force: true });
}

function enPricingContains(content, price) {
  return JSON.stringify(content).includes(price);
}

if (failures.length) {
  console.error(`\n${failures.length} knowledge-base check(s) failed:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nAssistant knowledge base matches the site copy.");
