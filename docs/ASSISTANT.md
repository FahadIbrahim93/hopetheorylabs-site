# Site assistant

Floating assistant on every page. Answers only from approved site copy, explains forward-deployed engineering, custom software, AI integration, enterprise systems, optional AI Audits and published website packages, and captures enquiries to WhatsApp / email / Supabase. It does not disclose founder or team identities.

Free tiers only. With no keys configured the assistant still answers via scripted FAQ shipped in the page.

## Code map

| Path | Role |
| --- | --- |
| `components/assistant/AssistantLauncher.tsx` | Gold bubble; only first-load JS for the feature |
| `components/assistant/AssistantPanel.tsx` | Panel chunk (lazy) |
| `components/assistant/assistant.css` | Bubble + panel styles (site tokens) |
| `lib/assistant/kb.ts` | Facts from `content/en.ts`, FAQ matcher, price guard |
| `lib/assistant/server.ts` | Rate limit, Supabase, Resend via `fetch` |
| `app/api/chat/route.ts` | Bundled Next.js GET health and POST chat; Groq → Gemini → FAQ |
| `app/api/lead/route.ts` | Bundled Next.js GET health and POST lead persistence/email |
| `supabase/migrations/20261030_assistant_leads.sql` | `leads` + `rate_limit_hits` |

## Behaviour

- Prices only from `pricing.tiers` and payment in `content/en.ts`; never invent bespoke fees or require an AI Audit before another service
- Unknown ৳ figures replaced with WhatsApp handoff
- Bangla script → model lang + lead `lang: "bn"`
- Contact step validates email or phone before advancing
- Rate limit: 20 chats / 5 leads per 10 minutes per hashed IP (soft shared counter when Supabase is set)

## Deployment note

Next.js now runs as a hybrid App Router deployment (not `output: "export"`). Static marketing pages are prerendered and `app/api/*/route.ts` handlers run as Vercel Functions with Node.js. This fixes the confirmed legacy root `api/*.ts` ESM-vs-CommonJS runtime error.

Run `npm run build && npm run start -- -p 3100` locally, then GET both `/api/chat` and `/api/lead` to validate their JSON health responses. CI Playwright tests those endpoints without external API keys. Production must still be checked independently after an approved merge.

No secret values belong in this document. Missing storage/email configuration must produce honest failure states and a usable WhatsApp fallback.

## Checks

```bash
npm run lint && npm run typecheck && npm run build && npm test
```

JS first-load: report measured weight honestly (~launcher only until bubble is used). Do not claim under 120 KB if measured higher.
