// Independent Chromium inspection of the DEPLOYED site, not the local build.
// Evidence only. Does not edit content or interact with external services.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import path from "node:path";

const BASE = process.env.HTL_QA_URL || "https://hopetheorylabs.vercel.app";
const OUT = path.resolve("artifacts/brand-production-qa");
mkdirSync(OUT, { recursive: true });
const cases = [
  ["mobile-360", 360, 800, true],
  ["mobile-390", 390, 844, true],
  ["tablet-768", 768, 1024, true],
  ["desktop-1440", 1440, 900, false],
  ["desktop-1920", 1920, 1080, false]
];
const results = { base: BASE, checkedAt: new Date().toISOString(), viewports: [], routes: [], fallback: {}, reducedMotion: {}, limitations: [] };
let failures = 0;
const browser = await chromium.launch({ headless: true });
async function inspectSize(label, width, height, mobile) {
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 250)); });
  let data = { label, width, height, errors, passed: false };
  try {
    const response = await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 20000 });
    await page.waitForTimeout(1400);
    data.httpStatus = response?.status() ?? null;
    data.h1 = await page.locator("h1").allTextContents();
    data.title = await page.title();
    data.geometry = await page.evaluate(() => {
      const logo = document.querySelector(".site-wordmark-mark");
      const b = logo?.getBoundingClientRect();
      return {
        viewport: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        overflowX: document.documentElement.scrollWidth > window.innerWidth + 2,
        logoWidth: b ? Math.round(b.width) : 0,
        logoHeight: b ? Math.round(b.height) : 0,
        logoVisible: !!b && b.width >= 24 && b.height >= 24,
        logoLinkName: document.querySelector(".site-wordmark")?.getAttribute("aria-label") || "",
        canvasCount: document.querySelectorAll("canvas").length,
        runningAnimations: document.getAnimations().filter(a => a.playState === "running").length,
        reducedMotionMatched: matchMedia("(prefers-reduced-motion: reduce)").matches,
        skipLink: !!document.querySelector('a[href="#main"]')
      };
    });
    data.mobileMenu = "not applicable";
    if (mobile) {
      const menu = page.locator("details.mobile-menu");
      if (await menu.count()) {
        await menu.locator("summary").click();
        data.mobileMenu = await menu.evaluate(el => el.open);
        await menu.locator("summary").click();
      } else data.mobileMenu = "missing";
    }
    try {
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      data.accessibility = {
        violationCount: axe.violations.length,
        violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.help, nodes: v.nodes.length }))
      };
    } catch (e) { data.accessibility = { error: String(e) }; }
    await page.screenshot({ path: path.join(OUT, label + "-hero.png"), animations: "disabled", timeout: 30000 });
    const services = page.locator("#services");
    if (await services.count()) {
      await services.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(OUT, label + "-services.png"), animations: "disabled", timeout: 30000 });
      data.servicesVisible = await services.isVisible();
    }
    data.passed = (data.httpStatus === 200) &&
      !data.geometry.overflowX &&
      data.geometry.logoVisible &&
      data.h1.length === 1 &&
      !!data.geometry.skipLink &&
      data.accessibility?.violationCount === 0 &&
      !errors.some(e => e.startsWith("pageerror")) &&
      (!mobile || data.mobileMenu === true);
    if (!data.passed) failures++;
  } catch (e) {
    data.error = String(e);
    failures++;
  } finally {
    results.viewports.push(data);
    await context.close();
  }
}
for (const row of cases) await inspectSize(...row);
const routeContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const routePage = await routeContext.newPage();
for (const pathname of ["/about", "/services", "/pricing", "/contact"]) {
  try {
    const response = await routePage.goto(BASE + pathname, { waitUntil: "domcontentloaded", timeout: 40000 });
    const heading = await routePage.locator("h1").allTextContents();
    const route = { pathname, status: response?.status(), h1: heading };
    results.routes.push(route);
    if (route.status !== 200 || heading.length !== 1) failures++;
  } catch (e) { results.routes.push({ pathname, error: String(e) }); failures++; }
}
try {
  await routePage.goto(BASE + "/?experience=fallback", { waitUntil: "domcontentloaded", timeout: 40000 });
  await routePage.waitForTimeout(1200);
  results.fallback = await routePage.evaluate(() => ({
    h1: document.querySelector("h1")?.innerText || "",
    svgCount: document.querySelectorAll("svg").length,
    canvasCount: document.querySelectorAll("canvas").length,
    forced: location.search.includes("experience=fallback")
  }));
  await routePage.screenshot({ path: path.join(OUT, "desktop-forced-fallback.png"), animations: "disabled" });
} catch (e) { results.fallback = { error: String(e) }; failures++; }
await routeContext.close();
const reduceContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const reducePage = await reduceContext.newPage();
try {
  await reducePage.goto(BASE, { waitUntil: "domcontentloaded", timeout: 40000 });
  await reducePage.waitForTimeout(1000);
  results.reducedMotion = await reducePage.evaluate(() => ({
    mediaMatches: matchMedia("(prefers-reduced-motion: reduce)").matches,
    animatedElements: document.getAnimations().filter(a => a.playState === "running").length
  }));
  await reducePage.screenshot({ path: path.join(OUT, "desktop-reduced-motion.png"), animations: "disabled" });
} catch (e) { results.reducedMotion = { error: String(e) }; failures++; }
await reduceContext.close();
await browser.close();
results.limitations.push("Automated screenshots must be reviewed by a human for aesthetic quality, cropping, alignment, and actual logo recognizability; bounding-box tests cannot prove visual legibility.");
results.limitations.push("A headless CI environment may use the SVG/fallback experience rather than GPU WebGL. Canvas presence does not prove animation smoothness or FPS on real devices.");
writeFileSync(path.join(OUT, "qa-results.json"), JSON.stringify(results, null, 2));
let summary = "# HTL live visual and accessibility QA\n\n";
summary += "Production: " + BASE + "\n\n";
summary += "| Viewport | HTTP | Overflow | Logo px | WCAG violations | JS errors | Result |\n|---|---:|---|---:|---:|---:|---|\n";
for (const r of results.viewports) summary += "| " + r.label + " | " + (r.httpStatus ?? "-") + " | " + (r.geometry?.overflowX ?? "-") + " | " + (r.geometry?.logoWidth ?? "-") + " | " + (r.accessibility?.violationCount ?? "-") + " | " + r.errors.length + " | " + (r.passed ? "PASS" : "REVIEW") + " |\n";
summary += "\nSubpages: " + results.routes.map(x => x.pathname + "=" + (x.status || "ERROR")).join(", ") + "\n";
summary += "\nFallback: " + JSON.stringify(results.fallback) + "\n";
summary += "\nReduced-motion: " + JSON.stringify(results.reducedMotion) + "\n";
summary += "\nFailures requiring inspection: " + failures + "\n\nEvidence screenshots and full axe findings are in the downloadable artifact.\n";
writeFileSync(path.join(OUT, "QA-SUMMARY.md"), summary);
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
if (failures) process.exitCode = 1;
