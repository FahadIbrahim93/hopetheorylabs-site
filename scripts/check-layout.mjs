/*
 * Layout check for the assistant widget: the five widths the brief names.
 *
 *   npm run check:layout                       # against a running dev server
 *   QA_URL=http://localhost:4000 npm run check:layout
 *
 * Playwright is not a dependency: CI does not need a browser, so the check
 * stays opt-in. Install it once with
 *   npm i -D playwright && npx playwright install chromium
 * and point QA_CHROME at another Chromium if you prefer.
 *
 * Screenshots land in artifacts/assistant-qa/ (git-ignored) for the PR.
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error(
    "This check needs Playwright:\n  npm i -D playwright && npx playwright install chromium",
  );
  process.exit(2);
}

const BASE = process.env.QA_URL ?? "http://localhost:3000";
const HOST = process.env.QA_HOST;
const SHOTS = process.env.QA_SHOTS ?? "artifacts/assistant-qa";
const WIDTHS = [360, 412, 768, 1280, 1600];
mkdirSync(SHOTS, { recursive: true });

const args = ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"];
if (HOST) args.push(`--host-resolver-rules=MAP ${HOST} 127.0.0.1`);

const browser = await chromium.launch({ executablePath: process.env.QA_CHROME, args });

let pass = 0;
const failures = [];
const ok = (label, condition, detail = "") => {
  if (condition) {
    pass++;
    console.log(`  ok   ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL ${label}${detail ? " · " + detail : ""}`);
  }
};

const overlap = (a, b) => {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return w > 0.5 && h > 0.5 ? Math.round(w * h) : 0;
};

/* React hydrates lazily, so wait for it instead of sleeping a fixed time. */
const hydrated = (page) =>
  page.waitForFunction(
    () => {
      const el = document.querySelector(".asst-b");
      return Boolean(el) && Object.keys(el).some((key) => key.startsWith("__react"));
    },
    null,
    { timeout: 60000 },
  );

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    // Without a serverless runtime the chat and lead endpoints 404; that is
    // expected here and is exactly the fallback path the widget must survive.
    const text = message.text();
    if (message.type() !== "error") return;
    if (text.includes("404") || text.includes("501") || text.includes("Failed to load resource")) return;
    errors.push(text);
  });

  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.locator(".asst-b").waitFor({ state: "visible" });
  await hydrated(page);
  await page.waitForTimeout(300);

  const closed = await page.evaluate((widths) => {
    const box = (el) => {
      const b = el.getBoundingClientRect();
      return { left: b.left, top: b.top, right: b.right, bottom: b.bottom, width: b.width, height: b.height };
    };
    const shown = (el) => {
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) return false;
      if (el.closest("[aria-hidden='true']")) return false;
      const b = el.getBoundingClientRect();
      return b.width > 1 && b.height > 1;
    };
    const text = [];
    document.querySelectorAll("body *").forEach((el) => {
      if (el.closest(".asst-b, .asst-p")) return;
      if (el.closest("svg")) return;
      if (!shown(el)) return;
      if ([...el.children].some((child) => child.textContent.trim())) return;
      if (!el.textContent.trim() && !["INPUT", "TEXTAREA"].includes(el.tagName)) return;
      const b = el.getBoundingClientRect();
      if (b.bottom < 0 || b.top > innerHeight || b.right < 0 || b.left > widths) return;
      text.push({ tag: el.tagName, cls: String(el.className).slice(0, 30), rect: box(el) });
    });
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      bubble: box(document.querySelector(".asst-b")),
      whatsapp: document.querySelector("#wa") ? box(document.querySelector("#wa")) : null,
      text,
    };
  }, width);

  ok(`${width}px: no horizontal scroll`, closed.scrollWidth <= closed.innerWidth + 1, `${closed.scrollWidth} > ${closed.innerWidth}`);
  ok(
    `${width}px: bubble inside the viewport`,
    closed.bubble.left >= 0 && closed.bubble.right <= width + 0.5 && closed.bubble.top >= 0 && closed.bubble.bottom <= 800,
  );
  ok(`${width}px: bubble is at least 44px`, closed.bubble.width >= 44 && closed.bubble.height >= 44);
  const covered = closed.text.filter((node) => overlap(closed.bubble, node.rect)).map((node) => `${node.tag}.${node.cls}`);
  ok(`${width}px: bubble covers no text`, covered.length === 0, covered.slice(0, 4).join(", "));
  if (closed.whatsapp) {
    const gap = closed.whatsapp.top - closed.bubble.bottom;
    ok(`${width}px: bubble clears the WhatsApp control`, overlap(closed.bubble, closed.whatsapp) === 0 && gap >= 4, `gap ${Math.round(gap)}px`);
  }

  await page.screenshot({ path: `${SHOTS}/${width}-closed.png` });

  await page.locator(".asst-b").click();
  await page.locator(".asst-p").waitFor({ state: "visible" });
  await page.waitForTimeout(350);

  const open = await page.evaluate(() => {
    const box = (el) => {
      const b = el.getBoundingClientRect();
      return { left: b.left, top: b.top, right: b.right, bottom: b.bottom, width: b.width, height: b.height };
    };
    const panel = document.querySelector(".asst-p");
    const parts = {};
    for (const selector of [".asst-h", ".asst-log", ".asst-chips", ".asst-compose", ".asst-note"]) {
      const el = document.querySelector(selector);
      if (el) parts[selector] = box(el);
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      viewportHeight: innerHeight,
      panel: box(panel),
      parts,
    };
  });

  ok(`${width}px: open panel causes no horizontal scroll`, open.scrollWidth <= open.innerWidth + 1, `${open.scrollWidth} > ${open.innerWidth}`);
  ok(
    `${width}px: open panel stays inside the viewport`,
    open.panel.left >= -0.5 && open.panel.right <= width + 0.5 && open.panel.top >= -0.5 && open.panel.bottom <= open.viewportHeight + 0.5,
  );
  if (width < 640) {
    ok(`${width}px: phone sheet is full width`, Math.abs(open.panel.width - width) <= 1, `${open.panel.width} vs ${width}`);
  } else {
    ok(
      `${width}px: desktop card is 380x600`,
      Math.abs(open.panel.width - 380) <= 1 && Math.abs(open.panel.height - 600) <= 1,
      `${open.panel.width}x${open.panel.height}`,
    );
  }

  const entries = Object.entries(open.parts);
  const clashes = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      if (overlap(entries[i][1], entries[j][1])) clashes.push(`${entries[i][0]}×${entries[j][0]}`);
    }
  }
  ok(`${width}px: panel sections do not overlap`, clashes.length === 0, clashes.join(", "));
  const spilled = entries.filter(([, box]) => box.top < open.panel.top - 0.5 || box.bottom > open.panel.bottom + 0.5);
  ok(`${width}px: panel sections stay inside the card`, spilled.length === 0, spilled.map(([selector]) => selector).join(", "));

  await page.screenshot({ path: `${SHOTS}/${width}-open.png` });

  await page.fill("#asst-input", "how much does a website cost?");
  await page.keyboard.press("Enter");
  await page.waitForFunction(
    () => document.querySelectorAll(".asst-m:not(.asst-typing)").length >= 3,
    null,
    { timeout: 15000 },
  );
  const reply = await page.locator(".asst-m:not(.asst-typing)").last().textContent();
  ok(`${width}px: an answer arrives`, reply.includes("৳25,000"), reply.slice(0, 60));

  let trapped = true;
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => Boolean(document.activeElement?.closest(".asst-p")));
    if (!inside) {
      trapped = false;
      break;
    }
  }
  ok(`${width}px: Tab stays inside the dialog`, trapped);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  const closedAgain = await page.evaluate(
    () => document.querySelector(".asst-p") === null && document.activeElement?.classList.contains("asst-b"),
  );
  ok(`${width}px: Escape closes and returns focus`, closedAgain);
  ok(`${width}px: no console or page errors`, errors.length === 0, errors.slice(0, 2).join(" | "));

  await page.close();
}

/*
 * The packages block in Services: the price ladder, and the two fixed overlays
 * (header scrim, hero source labels) that used to sit on top of later sections.
 */
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.locator("#pricing").waitFor({ state: "visible" });
  await hydrated(page);

  await page.evaluate(() => {
    const el = document.querySelector("#pricing");
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 110, behavior: "instant" });
  });
  /* The section reveal fades its children in with a stagger; measure settled. */
  await page.waitForTimeout(1100);

  const pk = await page.evaluate(() => {
    const box = (el) => {
      const b = el.getBoundingClientRect();
      return { left: b.left, top: b.top, right: b.right, bottom: b.bottom, width: b.width, height: b.height };
    };
    const block = document.querySelector("#pricing");
    const rows = [...block.querySelectorAll(".pk-l li")];
    const header = document.querySelector("header");
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      block: box(block),
      section: box(document.querySelector("#services")),
      heading: block.querySelector("h3")?.textContent.trim() ?? "",
      eyebrow: block.querySelector(".eyebrow")?.textContent.trim() ?? "",
      base: block.querySelector(".pk-b")?.textContent.trim() ?? "",
      rows: rows.map((row) => ({
        name: row.querySelector(".pk-n")?.textContent.trim() ?? "",
        price: row.querySelector(".pk-p")?.textContent.trim() ?? "",
        rect: box(row),
        priceRect: box(row.querySelector(".pk-p")),
      })),
      terms: box(block.querySelector(".pk-t")),
      founding: box(block.nextElementSibling),
      cta: (() => {
        const a = block.parentElement.querySelector(".ct a");
        return { text: a.textContent.trim(), href: a.getAttribute("href"), rect: box(a) };
      })(),
      labels: [...document.querySelectorAll("#nds .nd")].map((n) => Number(getComputedStyle(n).opacity)),
      scrim: header ? getComputedStyle(header, "::after").backgroundImage : "none",
    };
  });

  ok(`${width}px: packages block causes no horizontal scroll`, pk.scrollWidth <= pk.innerWidth + 1, `${pk.scrollWidth} > ${pk.innerWidth}`);
  ok(
    `${width}px: packages block sits inside Services`,
    pk.block.left >= pk.section.left - 0.5 && pk.block.right <= pk.section.right + 0.5 && pk.block.top >= pk.section.top && pk.block.bottom <= pk.section.bottom,
  );
  ok(
    `${width}px: packages heading is the third level`,
    pk.eyebrow.toLowerCase() === "packages" && pk.heading.length > 0,
    `${pk.eyebrow} / ${pk.heading}`,
  );
  ok(`${width}px: price ladder lists three named tiers`, pk.rows.length === 3 && pk.rows.every((row) => row.name), pk.rows.map((row) => row.name).join(", "));
  ok(
    `${width}px: every tier carries a taka price`,
    pk.rows.every((row) => row.price.startsWith("৳") && /[0-9]/.test(row.price)),
    pk.rows.map((row) => row.price).join(", "),
  );
  const rowClashes = [];
  for (let i = 0; i < pk.rows.length; i++) {
    for (let j = i + 1; j < pk.rows.length; j++) {
      if (overlap(pk.rows[i].rect, pk.rows[j].rect)) rowClashes.push(`${i + 1}×${j + 1}`);
    }
  }
  ok(`${width}px: price rows do not overlap`, rowClashes.length === 0, rowClashes.join(", "));
  ok(
    `${width}px: prices sit inside the block`,
    pk.rows.every((row) => row.priceRect.right <= pk.block.right + 0.5 && row.priceRect.left >= pk.block.left - 0.5),
  );
  const priceEdges = pk.rows.map((row) => row.priceRect.right);
  ok(`${width}px: prices share one right edge`, Math.max(...priceEdges) - Math.min(...priceEdges) <= 1);
  ok(`${width}px: terms do not overlap the ladder`, overlap(pk.terms, pk.rows[pk.rows.length - 1].rect) === 0);
  ok(`${width}px: founding offer clears the terms`, overlap(pk.founding, pk.terms) === 0);
  ok(`${width}px: packages call to action clears the offer`, overlap(pk.cta.rect, pk.founding) === 0);
  ok(`${width}px: call to action opens WhatsApp`, String(pk.cta.href).startsWith("https://wa.me/8801718463471"), String(pk.cta.href));
  ok(`${width}px: call to action is a reachable target`, pk.cta.rect.height >= 32 && pk.cta.rect.width >= 44, `${Math.round(pk.cta.rect.width)}x${Math.round(pk.cta.rect.height)}`);
  ok(`${width}px: hero labels have cleared the section`, pk.labels.every((opacity) => opacity <= 0.05), pk.labels.join(", "));
  ok(`${width}px: header carries a scrim`, pk.scrim.includes("gradient"), pk.scrim.slice(0, 60));

  await page.screenshot({ path: `${SHOTS}/${width}-pricing.png` });
  await page.close();
}

/* The enquiry flow the brief describes, start to finish, on a phone. */
{
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.locator(".asst-b").waitFor({ state: "visible" });
  await hydrated(page);
  await page.locator(".asst-b").click();
  await page.locator(".asst-chips button", { hasText: "Prepare an enquiry" }).click();
  for (const answer of ["Rahim", "01612345678", "A shop site with cash on delivery"]) {
    await page.fill("#asst-field", answer);
    await page.locator('.asst-fstep button[type="submit"]').click();
  }
  await page.waitForTimeout(300);

  const summary = await page.evaluate(() => {
    const panel = document.querySelector(".asst-p");
    return {
      text: panel.textContent,
      links: [...panel.querySelectorAll("a")].map((a) => a.getAttribute("href")),
      focused: document.activeElement?.getAttribute("href") ?? document.activeElement?.tagName,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
    };
  });

  ok("enquiry: summary shows all three answers", ["Rahim", "01612345678", "cash on delivery"].every((v) => summary.text.includes(v)));
  ok(
    "enquiry: WhatsApp and email handoffs present",
    summary.links.some((href) => href?.startsWith("https://wa.me/8801718463471")) && summary.links.some((href) => href?.startsWith("mailto:")),
  );
  ok("enquiry: focus lands on the primary action", String(summary.focused).startsWith("https://wa.me"), String(summary.focused));
  ok("enquiry: no horizontal scroll on the summary", summary.scrollWidth <= summary.innerWidth + 1);
  await page.screenshot({ path: `${SHOTS}/360-enquiry-summary.png` });
  await page.close();
}

await browser.close();
console.log(`\n${pass} passed, ${failures.length} failed`);
if (failures.length) {
  console.log("Failed:\n" + failures.map((name) => " - " + name).join("\n"));
  process.exit(1);
}
