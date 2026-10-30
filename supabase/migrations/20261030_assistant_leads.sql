-- Website assistant: enquiry storage and a shared rate-limit counter.
-- Run this once in the Supabase SQL editor for the project that owns
-- SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (or `supabase db push`).
--
-- RLS is on with no policies: only the service role used by `api/lead.ts` and
-- `api/chat.ts` can read or write these tables. The anon key has no access.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  need text not null,
  package text,
  lang text not null default 'en'
);

alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;

comment on table public.leads is
  'Enquiries sent from the website assistant. Written only by api/lead.ts with the service role key.';

create table if not exists public.rate_limit_hits (
  id bigserial primary key,
  key text not null,
  created_at timestamptz not null default now()
);

alter table public.rate_limit_hits enable row level security;
revoke all on table public.rate_limit_hits from anon, authenticated;

create index if not exists rate_limit_hits_key_created_idx
  on public.rate_limit_hits (key, created_at desc);

comment on table public.rate_limit_hits is
  'Rate-limit counters. `key` is a salted SHA-256 of the visitor IP, never the address itself.';

create or replace function public.prune_rate_limit_hits()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.rate_limit_hits
  where created_at < now() - interval '1 day';
$$;
