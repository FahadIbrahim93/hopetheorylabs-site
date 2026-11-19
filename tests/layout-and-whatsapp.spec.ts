import { expect, test, type Page } from "@playwright/test";

/*
  Regression gates for the two bugs Fahad reported after the Instrument launch:
  1. The side "Signal" rail collided with the hero's Dhaka label and the HTL / 00n
     serials, and the floating buttons sat on top of decorative labels.
  2. The WhatsApp buttons opened an empty chat instead of one with our message.
  Both run only in the desktop project; they set their own viewports.
*/
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "desktop", "sets its own viewports");
});

const DEFAULT = "Hi Hope Theory Labs, I'd like to discuss a project.";

/* ----------------------------- layout overlap ----------------------------- */

const SIZES: [number, number][] = [
  [390, 844], [768, 1024], [1024, 768], [1024, 700], [1280, 800],
  [1366, 768], [1440, 900], [1600, 800], [1920, 900], [1920, 1080],
];

async function overlaps(page: Page, step: number): Promise<string[]> {
  return page.evaluate(async (stepPx) => {
    const hits = new Set<string>();
    const vh = window.innerHeight;
    const shown = (el: Element) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity) > 0.05 && r.width > 0 && r.height > 0;
    };
    const textRects = (el: Element) => {
      const out: DOMRect[] = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const r of Array.from(range.getClientRects())) if (r.width > 1 && r.height > 1) out.push(r);
      }
      return out;
    };
    const hit = (a: DOMRect, b: DOMRect) => a.left < b.right - 0.5 && a.right > b.left + 0.5 && a.top < b.bottom - 0.5 && a.bottom > b.top + 0.5;
    const label = (el: Element) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 28)} "${(el.textContent ?? "").trim().slice(0, 24)}"`;

    const max = document.documentElement.scrollHeight - vh;
    for (let y = 0; y <= max + stepPx; y += stepPx) {
      window.scrollTo(0, Math.min(y, max));
      await new Promise((r) => setTimeout(r, 50));
      // Fixed chrome: every rail piece + both floating buttons.
      const chrome: { name: string; rect: DOMRect }[] = [];
      for (const rail of Array.from(document.querySelectorAll(".narrative-rail")).filter(shown)) {
        for (const c of Array.from(rail.querySelectorAll(".narrative-rail-label, .narrative-rail-name, .state-hud")).filter(shown)) {
          for (const rect of textRects(c)) chrome.push({ name: `rail ${label(c)}`, rect });
        }
        for (const c of Array.from(rail.querySelectorAll(".narrative-rail-track")).filter(shown)) chrome.push({ name: "rail track", rect: c.getBoundingClientRect() });
      }
      for (const b of Array.from(document.querySelectorAll(".floating-whatsapp, .asst-b")).filter(shown)) chrome.push({ name: `button.${b.className}`, rect: b.getBoundingClientRect() });
      if (!chrome.length) continue;

      const content = Array.from(document.querySelectorAll("main *, footer *, header *")).filter(
        (el) => !el.closest(".narrative-rail, .asst-p, .floating-whatsapp, .asst-b, canvas, .experience-layer, [aria-hidden='true'] svg") && shown(el) && !el.matches(".ticker *, .sr-only"),
      );
      for (const el of content) {
        const interactive = el.matches("input, textarea, select, button, a");
        if (!interactive && el.children.length > 0) continue;
        const rects = interactive ? [el.getBoundingClientRect()] : textRects(el);
        for (const r of rects) {
          if (r.bottom < 0 || r.top > vh) continue;
          for (const c of chrome) if (hit(r, c.rect) && !(c.name === "rail track" && !interactive && el.tagName === "SPAN")) hits.add(`${c.name} over ${label(el)} @y=${y}`);
        }
      }
      for (let i = 0; i < chrome.length; i++) for (let j = i + 1; j < chrome.length; j++) {
        if (chrome[i].name.startsWith("rail") && chrome[j].name.startsWith("rail")) continue;
        if (hit(chrome[i].rect, chrome[j].rect)) hits.add(`${chrome[i].name} over ${chrome[j].name} @y=${y}`);
      }
    }
    return Array.from(hits);
  }, step);
}

for (const [width, height] of SIZES) {
  test(`fixed chrome never overlaps content at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/", { waitUntil: "networkidle" });
    const found = await overlaps(page, 200);
    expect(found, found.slice(0, 8).join("\n")).toEqual([]);
  });
}

test("the side rail only exists where it has room", async ({ page }) => {
  for (const [width, height, visible] of [[1280, 800, false], [1599, 900, false], [1920, 600, false], [1600, 800, true], [1920, 1080, true]] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/", { waitUntil: "networkidle" });
    const shown = await page.locator(".narrative-rail").evaluate((el) => getComputedStyle(el).display !== "none");
    expect(shown, `${width}x${height}`).toBe(visible);
  }
});

test("the rail clears the hero labels and the headline at 1920x1080", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/", { waitUntil: "networkidle" });
  const rail = await page.locator(".narrative-rail").boundingBox();
  const index = await page.locator(".hero-index span").last().boundingBox();
  const h1 = await page.locator("h1").boundingBox();
  expect(rail && index && h1).toBeTruthy();
  expect(index!.x + index!.width, "Dhaka label ends left of the rail").toBeLessThanOrEqual(rail!.x - 8);
  expect(h1!.x + h1!.width, "headline ends left of the rail").toBeLessThanOrEqual(rail!.x - 8);
});

/* -------------------------------- WhatsApp -------------------------------- */

const decode = (href: string) => {
  const url = new URL(href);
  expect(url.origin + url.pathname).toBe("https://wa.me/8801718463471");
  return url.searchParams.get("text");
};

for (const width of [390, 1280]) {
  test.describe(`WhatsApp at ${width}px`, () => {
    test.beforeEach(async ({ page, context }) => {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 800 });
      // Never reach the real WhatsApp: answer the popup locally so its URL is kept.
      await context.route(/wa\.me|whatsapp\.com/, (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>wa</title>" }));
    });

    test("every plain WhatsApp link on every page carries a message", async ({ page }) => {
      let seen = 0;
      for (const route of ["/", "/services", "/pricing", "/about", "/contact", "/nope"]) {
        await page.goto(route, { waitUntil: "networkidle" });
        const hrefs = await page.locator('a[href*="wa.me"]').evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
        for (const href of hrefs) {
          expect(decode(href), `${route}: ${href}`).toMatch(/^Hi Hope Theory Labs/);
          seen++;
        }
      }
      expect(seen).toBeGreaterThan(10);
      await page.goto("/contact", { waitUntil: "networkidle" });
      const plain = page.getByRole("link", { name: "Message us on WhatsApp" });
      expect(decode((await plain.getAttribute("href")) ?? "")).toBe(DEFAULT);
    });

    test("form: required fields block the send and focus the first empty one", async ({ page, context }) => {
      await page.goto("/contact", { waitUntil: "networkidle" });
      let opened = 0;
      context.on("page", () => opened++);
      const send = page.getByRole("button", { name: "Send on WhatsApp" });
      await send.click();
      await expect(page.locator("#contact-name-error")).toBeVisible();
      await expect(page.locator("#contact-objective-error")).toBeVisible();
      await expect(page.locator('input[name="name"]')).toBeFocused();
      await expect(page.locator('input[name="name"]')).toHaveAttribute("aria-invalid", "true");

      await page.locator('input[name="name"]').fill("Rahim");
      await expect(page.locator("#contact-name-error")).toHaveCount(0);
      await send.click();
      await expect(page.locator('textarea[name="objective"]')).toBeFocused();
      await page.waitForTimeout(300);
      expect(opened, "nothing opens while a required field is empty").toBe(0);
    });

    test("form: opens WhatsApp with the visitor's answers, Bangla included", async ({ page, context }) => {
      await page.goto("/contact", { waitUntil: "networkidle" });
      await page.locator('input[name="name"]').fill("রহিম উদ্দিন");
      await page.locator('select[name="workType"]').selectOption({ label: "AI Audit" });
      await page.locator('textarea[name="objective"]').fill("রিপোর্টিং সময় কমাতে চাই & save 10% #1");
      await page.locator('select[name="timeframe"]').selectOption({ label: "In 1–3 months" });
      const [popup] = await Promise.all([
        context.waitForEvent("page"),
        page.getByRole("button", { name: "Send on WhatsApp" }).click(),
      ]);
      const href = popup.url();
      expect(href).toContain("https://wa.me/8801718463471?text=");
      expect(href).not.toMatch(/[^\x21-\x7E]/);
      expect(decode(href)).toBe(
        "Hi Hope Theory Labs, I'm রহিম উদ্দিন. Work: AI Audit. Goal: রিপোর্টিং সময় কমাতে চাই & save 10% #1. Start: In 1–3 months.",
      );
    });

    test("assistant: the handoff link carries a message", async ({ page }) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Open the Hope Theory assistant" }).click();
      const dialog = page.getByRole("dialog");
      // An unknown question gets the handoff reply; its WhatsApp link must carry text.
      await dialog.locator("#asst-input").fill("zzqx wibble flurb");
      await dialog.getByRole("button", { name: "Send", exact: true }).click();
      const handoff = dialog.getByRole("link", { name: "Message us on WhatsApp" });
      await expect(handoff).toBeVisible();
      expect(decode((await handoff.getAttribute("href")) ?? "")).toBe(DEFAULT);
      expect(await handoff.textContent(), "no raw encoded URL is shown").not.toContain("%20");
    });

    test("assistant: enquiry summary opens WhatsApp with the details", async ({ page }) => {
      await page.goto("/", { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Open the Hope Theory assistant" }).click();
      const dialog = page.getByRole("dialog");
      await dialog.getByRole("button", { name: "Start an enquiry" }).click();
      for (const answer of ["Nadia Karim", "nadia@example.com", "Automate our invoice chasing"]) {
        await dialog.locator("#asst-field").fill(answer);
        await dialog.locator("#asst-field").press("Enter");
      }
      const send = dialog.getByRole("link", { name: "Send on WhatsApp" });
      expect(decode((await send.getAttribute("href")) ?? "")).toBe(
        "Hi Hope Theory Labs, I'm Nadia Karim. Automate our invoice chasing Contact: nadia@example.com",
      );
    });
  });
}
