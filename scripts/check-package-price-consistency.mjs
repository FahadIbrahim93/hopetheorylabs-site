/**
 * Offline package-price consistency check.
 *
 * A website package price must appear in three places at once, all derived
 * from content/en.ts, so a price change cannot silently send a stale quote:
 *   1. content/en.ts — pricing.tiers[].price
 *   2. the tier's prefilled WhatsApp message (decoded from its wa.me link)
 *   3. the assistant's package answer (PACKAGES, used by the price rule)
 *
 * Builds content/en, content/types, lib/whatsapp and lib/assistant/kb to a
 * temp dir with tsc (same approach as check-assistant-kb.mjs) and then
 * requires the compiled modules, so the assertions run against real compiled
 * code rather than grepped text. Fails if any price is missing from its
 * WhatsApp topic or from PACKAGES, or if a package price in en.ts is not in
 * ALLOWED_PRICES. Run as part of `npm test`.
 */
import { createRequire } from "node:module";
import { mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}
function ok(msg) {
  console.log("ok:", msg);
}

// Compile the modules we need (content/en, content/types, lib/whatsapp,
// lib/assistant/kb) so we can require them and exercise the real code.
const dir = mkdtempSync(join(tmpdir(), "htl-price-consist-"));
try {
  const files = [
    "content/en.ts",
    "content/types.ts",
    "lib/whatsapp.ts",
    "lib/assistant/kb.ts",
  ];
  const build = spawnSync(
    "npx",
    [
      "tsc",
      ...files,
      "--outDir",
      dir,
      "--rootDir",
      root,
      "--module",
      "commonjs",
      "--esModuleInterop",
      "--skipLibCheck",
      "--target",
      "ES2020",
      "--moduleResolution",
      "node",
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (build.status !== 0) {
    console.error(build.stdout || "");
    console.error(build.stderr || "");
    fail("could not compile content/en, lib/whatsapp or lib/assistant/kb for " +
         "the package-price consistency checks");
  }

  // Require the compiled kb module (which itself requires content/en and
  // content/types) and the compiled whatsapp module.
  const kb = require(join(dir, "lib/assistant/kb.js"));
  const whatsapp = require(join(dir, "lib/whatsapp.js"));
  const en = require(join(dir, "content/en.js")).default;

  const packageTiers = en.pricing.tiers;
  const packagePrices = packageTiers.map((tier) => ({
    name: tier.name,
    price: tier.price,
    whatsappLink: tier.whatsappLink,
  }));

  const digits = (price) => price.replace(/\D/g, "");

  // --- 1. Every package price is present in its own prefilled WhatsApp message ---
  for (const tier of packagePrices) {
    const decoded = whatsapp.whatsappMessageFrom(tier.whatsappLink);
    if (decoded === null)
      fail(`${tier.name}: wa.me link has no ?text=`);
    if (!decoded.includes(tier.price))
      fail(
        `${tier.name}: price "${tier.price}" is missing from its WhatsApp message ` +
        `(decoded: "${decoded}"). Update the whatsappFor(...) topic string when ` +
        `changing the price, or the visitor sends a stale quote.`,
      );
  }
  ok(
    `${packagePrices.length} package prices all appear in their own WhatsApp messages`,
  );

  // --- 2. Every package price appears in the assistant's package answer (PACKAGES) ---
  for (const tier of packagePrices) {
    if (!kb.PACKAGES.includes(tier.price))
      fail(
        `${tier.name}: price "${tier.price}" is missing from PACKAGES ` +
        `(the assistant's package answer). PACKAGES reads pricing.tiers — if you ` +
        `add or rename a tier, check PACKAGES and the price rule still name it.`,
      );
    if (!kb.PACKAGES.includes(tier.name))
      fail(
        `${tier.name}: tier name missing from PACKAGES. The price rule reply must ` +
        `name every package.`,
      );
  }
  ok(
    `${packagePrices.length} package prices all appear in PACKAGES ` +
    `(assistant package answer)`,
  );

  // --- 3. A real price question routes to "price" and names every package + price ---
  const priceQuestions = [
    "How much for a small business website?",
    "What do you charge for a website?",
    "website package price",
    "ওয়েবসাইট প্যাকেজ দাম কত?",
  ];
  for (const q of priceQuestions) {
    const { id, reply } = kb.matchFaq(q);
    if (id !== "price")
      fail(
        `"${q}" routed to ${id}, expected the price rule to name the packages`,
      );
    for (const tier of packagePrices) {
      if (!reply.includes(tier.price))
        fail(
          `price reply for "${q}" is missing ${tier.name} ${tier.price}. ` +
          `The price rule must always name every package price.`,
        );
      if (!reply.includes(tier.name))
        fail(
          `price reply for "${q}" is missing the ${tier.name} name. ` +
          `The price rule must always name every package.`,
        );
    }
  }
  ok(
    `${priceQuestions.length} price questions (English and Bangla) name every package ` +
    `and every package price`,
  );

  // --- 4. Every package price in en.ts is in ALLOWED_PRICES (no stale figure) ---
  for (const tier of packagePrices) {
    if (!kb.ALLOWED_PRICES.has(digits(tier.price)))
      fail(
        `${tier.name} ${tier.price} is in en.ts but not in ALLOWED_PRICES. ` +
        `Add the figure to the site copy (content/en.ts) rather than to the guard, ` +
        `or the assistant will reject it as an unknown price.`,
      );
  }
  ok(
    `every package price in en.ts is in ALLOWED_PRICES ` +
    `(no stale package figure live only in a WhatsApp link)`,
  );

  // --- 5. No package tier is missing name / price / cta / whatsappLink ---
  for (const tier of packageTiers) {
    if (!tier.whatsappLink)
      fail(
        `${tier.name || "<unnamed tier>"}: missing whatsappLink — a tier without a ` +
        `prefilled link cannot quote its own price on WhatsApp.`,
      );
    if (!tier.price)
      fail(`${tier.name || "<unnamed tier>"}: missing price — every published ` +
           `package must carry a price.`);
    if (!tier.cta)
      fail(`${tier.name || "<unnamed tier>"}: missing cta — every published ` +
           `package must carry a CTA.`);
    if (!tier.name)
      fail(`unnamed tier: every published package must carry a name.`);
  }

  const priceList = packagePrices
    .map((t) => `${t.name} ${t.price}`)
    .join(", ");
  ok(
    `${packagePrices.length} package tiers each have name, price, cta and whatsappLink ` +
    `(${priceList})`,
  );

  console.log(
    "check-package-price-consistency: all passed " +
    `(${priceList})`,
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
