/**
 * No-cookie, read-only production reachability smoke test.
 * CI runs on an unrelated GitHub Actions runner; no auth or test leads.
 */
import { appendFileSync } from "node:fs";

const origin = "https://hopetheorylabs.vercel.app";
const entries = [
  { path: "/", expect: "html" },
  { path: "/about", expect: "html" },
  { path: "/services", expect: "html" },
  { path: "/pricing", expect: "html" },
  { path: "/contact", expect: "html" },
  { path: "/api/chat", expect: "chat" },
  { path: "/api/lead", expect: "lead" },
];
const result = [];
for (const { path, expect } of entries) {
  try {
    const resp = await fetch(origin + path, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "HopeTheoryLabs-readonly-CI-preflight/1.0", accept: expect === "html" ? "text/html" : "application/json" },
      signal: AbortSignal.timeout(18000),
    });
    const contentType = resp.headers.get("content-type") || "";
    const payload = await resp.text();
    const isHtml = /text\/html/i.test(contentType) && /<!doctype html|<html/i.test(payload.slice(0, 800));
    const isAuth = /vercel authentication|login to vercel|deployment protection|authenticate to continue/i.test(payload.slice(0, 3000));
    let pass = resp.status === 200 && !isAuth;
    let responseType = "unknown";
    if (expect === "html") {
      pass = pass && isHtml && /Hope Theory Labs/i.test(payload);
      responseType = isHtml ? "site HTML" : "not HTML";
    } else {
      let data = null;
      try { data = JSON.parse(payload); } catch {}
      responseType = data && typeof data === "object" ? "JSON" : "not JSON";
      pass = pass && /application\/json/i.test(contentType) && data?.ok === true && data?.service === expect;
    }
    result.push({ path, status: resp.status, type: responseType, authWall: isAuth, pass });
  } catch (err) {
    result.push({ path, status: "ERR", type: err?.name || "unknown", authWall: false, pass: false });
  }
}
const table = [
  "### Public production preflight — unsigned, read-only",
  "",
  "| Path | HTTP | Response | Auth wall | Result |",
  "| --- | --- | --- | --- | --- |",
  ...result.map(v => `| ${v.path} | ${v.status} | ${v.type} | ${v.authWall ? "Yes" : "No"} | ${v.pass ? "PASS" : "FAIL"} |`),
  "",
  "All GETs from the external GitHub Actions runner with no session. No credentials or user data were sent.",
  "",
];
const summary = table.join("\n");
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
if (result.some(x => !x.pass)) process.exitCode = 1;
