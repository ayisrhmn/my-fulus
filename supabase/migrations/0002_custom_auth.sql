-- MyFulus: replace Supabase Auth with a custom email-code login.
-- Run manually in the Supabase SQL editor.
--
-- Non-destructive: only creates new tables and copies user rows. It does NOT
-- touch `transactions` / `categories` data, and it leaves `auth.users` and the
-- existing RLS policies in place as a rollback safety net. The app now talks to
-- Postgres with the service-role key, which bypasses RLS, so scoping is done in
-- application code (`.eq('user_id', ...)` on every query).

-- 1. App-owned users table. IDs are copied verbatim from auth.users so every
--    existing transactions.user_id / categories.user_id keeps resolving.
create table if not exists public.users (
  id         uuid primary key,
  email      text unique not null,
  created_at timestamptz not null default now()
);

insert into public.users (id, email, created_at)
select id, email, created_at
from auth.users
on conflict (id) do nothing;

-- 2. One-time login codes (HMAC-hashed, short TTL, attempt-limited in code).
create table if not exists public.login_codes (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  code_hash  text not null,
  expires_at timestamptz not null,
  attempts   int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists login_codes_email_idx on public.login_codes (email);

-- 3. Lock both tables down. Only the service-role key (which bypasses RLS)
--    should ever read them.
alter table public.users       enable row level security;
alter table public.login_codes enable row level security;

-- Verification (expect auth_users = app_users, and the second query = 0 rows):
--   select (select count(*) from auth.users)   as auth_users,
--          (select count(*) from public.users) as app_users;
--   select user_id from public.transactions
--   except
--   select id from public.users;
