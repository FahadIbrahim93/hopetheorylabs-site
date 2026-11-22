import { expect, test } from "@playwright/test";

// Runs against the actual production Next server started by Playwright.
// All POSTs here are local/CI only: no real lead, database, email or remote API.
test("GET API health endpoints return JSON, not HTML/500", async ({ request }) => {
  for (const service of ["chat", "lead"]) {
    const response = await request.get(`/api/${service}`);
    expect(response.status(), `GET /api/${service}`).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(await response.json()).toMatchObject({ ok: true, service });
  }
});

test("chat rejects malformed conversation", async ({ request }) => {
  const response = await request.post("/api/chat", { data: { messages: [] } });
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ error: "bad_request" });
});

test("chat responds with FAQ or model response to an ordinary question", async ({ request }) => {
  const response = await request.post("/api/chat", { data: { messages: [{ role: "user", content: "What is an AI Audit?" }] } });
  expect(response.status()).toBe(200);
  const reply = await response.json();
  expect(typeof reply.reply).toBe("string");
  expect(reply.reply.length).toBeGreaterThan(12);
});

test("chat does not disclose unpublished founder identities", async ({ request }) => {
  for (const question of ["Who founded Hope Theory Labs?", "Who is behind this company?"]) {
    const response = await request.post("/api/chat", {
      data: { messages: [{ role: "user", content: question }] },
    });
    expect(response.status()).toBe(200);
    const answer = await response.json();
    expect(answer.source).toBe("policy:identity");
    expect(answer.reply).toContain("does not publish");
  }
});

test("lead rejects missing fields and invalid contact", async ({ request }) => {
  const empty = await request.post("/api/lead", { data: {} });
  expect(empty.status()).toBe(400);
  expect(await empty.json()).toMatchObject({ error: "missing_fields" });
  const invalid = await request.post("/api/lead", { data: { name: "Synthetic", contact: "invalid", need: "test" } });
  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toMatchObject({ error: "bad_contact" });
});

test("honeypot never creates a lead", async ({ request }) => {
  const response = await request.post("/api/lead", {
    data: { name: "Synthetic", contact: "example@example.invalid", need: "test", website: "bot" },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ saved: false, notified: false });
});

test("an unconfigured backend cannot claim that a lead was saved or notified", async ({ request }) => {
  // Local CI deliberately has no Supabase or Resend credentials.
  // Do not run this test against production; that requires a separate approved synthetic test.
  const response = await request.post("/api/lead", {
    data: {
      name: "Synthetic Test",
      contact: "synthetic@example.invalid",
      need: "Check no silent lead loss when storage and email are unconfigured",
    },
  });
  expect([200, 503]).toContain(response.status());
  const result = await response.json();
  expect(typeof result.saved).toBe("boolean");
  expect(typeof result.notified).toBe("boolean");
  expect(result.ok).toBe(result.saved || result.notified);
  expect(result.whatsapp).toContain("wa.me/");
  if (!result.saved && !result.notified) expect(response.status()).toBe(503);
});
