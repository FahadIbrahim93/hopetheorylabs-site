# Site assistant

A floating assistant on every page. It answers only from the approved site copy,
helps a visitor choose between the website offer and the founding offer, and
captures an enquiry that reaches Fahad on WhatsApp, by email, or in Supabase.

Free tiers only. With no keys configured the assistant still answers, because
the scripted answers ship inside the page.

## Where the code lives

| Path | What it does |
| --- | --- |
| `components/assistant/AssistantLauncher.tsx` | The gold bubble. Tiny; the only part loaded with the page. |
| `components/assistant/AssistantPanel.tsx` | The panel. A separate chunk, fetched on first tap or focus. |
| `lib/assistant/kb.ts` | Knowledge base derived from `content/en.ts`, the system prompt, the scripted FAQ matcher and the price guard. |
| `lib/assistant/server.ts` | Rate limiting, Supabase and Resend over plain `fetch`, PII-free logging. |
| `api/chat.ts` | `POST /api/chat`, provider chain Groq → Gemini → scripted answers. |
| `api/lead.ts` | `POST /api/lead`, saves an enquiry and emails it. |
| `supabase/migrations/20261030_assistant_leads.sql` | `leads` and `rate_limit_hits`, RLS on, service role only. |
| `scripts/check-assistant-kb.mjs` | `npm test`. Fails if the assistant can state a price the site does not. |
| `content/en.ts` → `assistant` | Every visible string in the widget. |

No new runtime dependencies: Groq, Gemini, Supabase and Resend are called with
`fetch`, so the first-load JavaScript is unchanged apart from a ~2 KB launcher.

## Environment variables

All optional, all free tier. Copy `.env.example`, or set them in Vercel →
Project → Settings → Environment Variables with Production **and** Preview
ticked. Never commit real values.

| Variable | Used by | If unset |
| --- | --- | --- |
| `GROQ_API_KEY` | `api/chat.ts` | Falls through to Gemini, then scripted answers. |
| `GEMINI_API_KEY` | `api/chat.ts` | Skipped. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | `api/chat.ts`, `api/lead.ts` | Enquiries are not stored; rate limiting stays per-instance. |
| `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL` | `api/lead.ts` | No email is sent. |
| `NEXT_PUBLIC_CALCOM_URL` | widget | No "Book a call" button. |

Getting the keys: Groq (`console.groq.com` → API Keys), Google AI Studio
(`aistudio.google.com/apikey`), Supabase (project settings → API → `service_role`),
Resend (`resend.com/api-keys`).

**Resend sandbox sender.** The function sends from `onboarding@resend.dev`,
which only delivers to the address the Resend account was created with. Create
the Resend account with `hopetheorybd@gmail.com`, or verify a domain and change
`from` in `api/lead.ts`.

**Service role key.** It bypasses RLS, so it belongs only in the function's
environment. It must never appear in client code or a `NEXT_PUBLIC_` variable.

## Supabase setup

Run `supabase/migrations/20261030_assistant_leads.sql` once in the SQL editor of
the project behind `SUPABASE_URL`. RLS is enabled and there are no policies, so
the anon key can read nothing; the functions use the service role.

## How the assistant behaves

- It answers only from `content/en.ts`. Prices, the founding offer, the free
  concept, the four steps, the contact details — all read from that file at
  request time, so site copy and assistant copy cannot diverge.
- Any ৳ figure the model produces that is not in the site copy is replaced with
  the WhatsApp handoff before the visitor sees it.
- The visitor's language is detected from Bengali script. The model is told to
  answer in Bangla when asked in Bangla. The scripted fallback answers in
  English because Bangla copy is still pending review (see `content/bn.ts`).
- Enquiries: name → contact → need → summary, with "Send on WhatsApp", "Email"
  and "Save my enquiry". The WhatsApp and email routes work with no backend.
- Rate limits: 20 chat messages and 5 enquiries per 10 minutes, per hashed IP,
  with an in-memory bucket plus the Supabase counter so the limit survives
  across serverless instances.
- Logs contain event names, provider status codes and booleans only. No message
  bodies, names, contacts or addresses. The rate-limit key is a salted SHA-256.

## Accessibility and layout

The panel is a dialog with a focus trap, `Esc` to close, a labelled close
button, a polite live region for replies, 44 px targets and 16 px input text
(no iOS zoom). It is a full-height sheet below 640 px and a 380×600 card above
it. The bubble is `56×56` at the same right edge as the WhatsApp control, `12px`
above it, so nothing overlaps and no horizontal scroll is introduced.

## Deployment note — read before merging

The site is a static export (`output: 'export'`), so Next.js route handlers do
not run. The two endpoints are therefore plain Vercel Functions in the root
`api/` directory.

Vercel documents root `api/` functions for projects *without* a framework, and
documents `pages/api` / `app/api` for Next.js projects. Root `api/` files are
scanned for Next.js projects in practice (they are the documented route for
non-Node functions), but with `output: 'export'` this combination is **not**
covered by a Vercel doc. Treat it as the one thing to verify on the preview:

1. Open the preview deployment and call `POST /api/chat` with
   `{"messages":[{"role":"user","content":"price?"}]}`.
2. Expect `200` and a reply. A `404` means the function was not picked up.

If it 404s, the fallback is to keep this repository as the static site and move
`api/` + `lib/assistant/server.ts` into a second Vercel project with the
framework preset "Other", then call it from an absolute URL or a rewrite. That
needs a Vercel settings change, so it is Fahad's call, not an agent's.

Even if the endpoints are unreachable, the widget falls back to the scripted
answers bundled with the page, so the chat never goes dead.

## Checks

```bash
npm run lint && npm run typecheck && npm run build && npm test
```

`npm test` compiles the content files and the knowledge base with the project's
TypeScript, then asserts:

- every ৳ figure the assistant can state exists in `content/en.ts`;
- the WhatsApp number and email come from the site copy;
- the price guard rejects an invented figure and accepts a real one;
- the FAQ matcher answers pricing questions and hands unknown ones to WhatsApp.

Still to run by a human, because this environment has no browser: Playwright
overlap checks at 360, 412, 768, 1280 and 1600 px, the keyboard pass, and
Lighthouse mobile on the preview.

## Deliberate differences from the build brief

| Brief said | Built | Why |
| --- | --- | --- |
| Navy `#0F1B2D` + gold `#B8892F`, no teal | The site's own tokens: `#07090C` ink, `#7FD6C2` teal, `#FFBD61` amber | `docs/SPEC.md` locks the palette and wins over any other design instruction. A navy/gold widget would not match the page. The bubble uses the amber token so it reads differently from the teal WhatsApp control. |
| Starter ৳10,000 / Counter ৳25,000 / Showroom ৳45,000, 50/25/25 split, care plan, domain at cost | Only what `content/en.ts` says: websites from ৳25,000, founding ৳15,000, AI by conversation | Those tiers and terms are nowhere in the repository. Writing them into the assistant would put unapproved prices on a live site. Add them to `content/en.ts` first; the knowledge base picks them up automatically and `npm test` will guard them. |
| "Only Fahad as founder" | The team as the site states it: Fahad Ibrahim and Tamim Abir | `content/en.ts` names both. The prompt forbids titles, credentials and claims, which is enforced. |
| Bubble hides while the WhatsApp button is visible | Bubble sits 12 px above the WhatsApp control, always visible, no overlap | Hiding it would hide the assistant on every section except Contact, which defeats a chat on every page. Flipping back is one CSS rule if the design review prefers the literal brief. |
| Analytics with `@vercel/analytics` | Not added | `docs/SPEC.md`, `docs/DESIGN_RULES.md` and the PR checklist all forbid analytics and tracking. |
