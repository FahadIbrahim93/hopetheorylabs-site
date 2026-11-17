/*
  Capture the before/after evidence frames without committing them.

  Usage:
    npm run build
    node scripts/serve-out.mjs 3100 &
    node scripts/capture-evidence.mjs --base http://127.0.0.1:3100

  Frames land in docs/screenshots/local/<width>/<route>.jpg (git-ignored) and
  are meant to live in the PR description or an issue, not in the repository
  (the previously committed frames under docs/screenshots/issue-50 have been
  removed; this script replaces them).
*/
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/services", name: "services" },
  { path: "/pricing", name: "pricing" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
];
const WIDTHS = [390, 768, 1440];

function readFlag(flag, fallback) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
}

const base = readFlag("--base", "http://127.0.0.1:3100");
const label = readFlag("--label", "local");

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
  const dir = join("docs", "screenshots", label, String(width));
  await mkdir(dir, { recursive: true });
  for (const route of ROUTES) {
    await page.goto(`${base}${route.path}`, { waitUntil: "networkidle" });
    // Let the reveal transforms settle and any WebGL scene paint its first frame.
    await page.waitForTimeout(700);
    const file = join(dir, `${route.name}.jpg`);
    await page.screenshot({ path: file, fullPage: true, type: "jpeg", quality: 82 });
    console.log(`captured ${file}`);
  }
  await page.close();
}

await browser.close();
