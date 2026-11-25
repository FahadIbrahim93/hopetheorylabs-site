import { expect, test } from "@playwright/test";
import { en } from "../content/en";

const copy = en.assistant.enquiry;
const outcomes = [
  { name: "storage only", status: 200, saved: true, notified: false, message: copy.saved },
  { name: "both providers", status: 200, saved: true, notified: true, message: copy.saved },
  { name: "email only", status: 200, saved: false, notified: true, message: copy.notified },
  { name: "neither provider", status: 503, saved: false, notified: false, message: copy.saveFailed },
  { name: "unconfirmed success response", status: 200, saved: false, notified: false, message: copy.saveFailed },
];

for (const outcome of outcomes) {
  test('enquiry confirmation — ' + outcome.name, async ({page}) => {
    await page.route("**/api/lead", async route => {
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject({contact:"qa@example.invalid"});
      await route.fulfill({status:outcome.status, json:{
        ok:outcome.saved || outcome.notified, saved:outcome.saved, notified:outcome.notified
      }});
    });
    await page.goto("/contact");
    await page.getByRole("button", {name:en.assistant.open}).click();
    await page.getByRole("button", {name:"Start an enquiry"}).click();
    for (const [label, value] of [[copy.name,"QA"],[copy.contact,"qa@example.invalid"],[copy.need,"Local check"]]) {
      await page.getByLabel(label, {exact:true}).fill(value);
      await page.getByRole("button", {name:en.assistant.send,exact:true}).click();
    }
    await page.getByRole("button", {name:copy.save}).click();
    await expect(page.getByRole("status").filter({hasText:outcome.message})).toBeVisible();
    await expect(page.getByRole("link",{name:copy.sendWhatsApp,exact:true}).filter({visible:true}).last()).toHaveAttribute("href", /wa\.me\/.*Local(%20|\+)check/);
  });
}
