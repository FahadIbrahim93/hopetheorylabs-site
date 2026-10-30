# Site assistant

Floating assistant on every page. Answers only from approved site copy, helps choose website vs founding offer, captures enquiries to WhatsApp / email / Supabase.

Free tiers only. With no keys configured the assistant still answers via scripted FAQ shipped in the page.

## Code map

| Path | Role |
| --- | --- |
| `components/assistant/AssistantLauncher.tsx` | Gold bubble; only first-load JS for the feature |
| `components/assistant/AssistantPanel.tsx` | Panel chunk (lazy) |
| `components/assistant/assistant.css` | Bubble + panel styles (site tokens) |
| `lib/assistant/kb.ts` | Facts from `content/en.ts`, FAQ matcher, price guard |
| `lib/assistant/server.ts` | Rate limit, Supabase, Resend via `fetch` |
| `api/chat.ts` | Groq → Gemini → FAQ |
| `api/lead.ts` | Save enquiry + email |
| `supabase/migrations/20261030_assistant_leads.sql` | `leads` + `rate_limit_hits` |

## Behaviour

- Prices only from `pricing.tiers` / founding / payment in `content/en.ts`
- Unknown ৳ figures replaced with WhatsApp handoff
- Bangla script → model lang + lead `lang: "bn"`
- Contact step validates email or phone before advancing
- Rate limit: 20 chats / 5 leads per 10 minutes per hashed IP (soft shared counter when Supabase is set)

## Deployment note

Site uses `output: "export"`. Handlers live in root `api/`. Verify on preview:

```bash
curl -sS -X POST https://<preview>/api/chat \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"how much is a website?"}]}'
```

404 → functions not picked up; widget still falls back to FAQ. Product fix is drop export and use `app/api/*/route.ts` (Fahad decision).

## Checks

```bash
npm run lint && npm run typecheck && npm run build && npm test
```

JS first-load: report measured weight honestly (~launcher only until bubble is used). Do not claim under 120 KB if measured higher.
