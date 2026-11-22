import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/services", "/pricing", "/work", "/work/emberfall", "/about", "/contact"];

/*
  Regression gate for the accessibility work in #50. It checks the rendered
  export (not the source) on desktop and mobile: axe for WCAG 2.0/2.1/2.2 A+AA,
  one h1 per route, and no sideways scroll at 390px.
*/
for (const route of ROUTES) {
  test(`${route} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      // The WebGL scene is decorative; its canvas has no accessible content.
      .exclude("canvas")
      .analyze();
    const blocking = violations
      .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
      .map((violation) => ({ id: violation.id, help: violation.help, nodes: violation.nodes.length }));
    expect(blocking, `${route}: ${JSON.stringify(blocking)}`).toEqual([]);
  });

  test(`${route} renders exactly one h1`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("no horizontal overflow at 390px on any route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${route} overflows by ${overflow}px`).toBeLessThanOrEqual(1);
  }
});
