-- MyFulus: full migration off Supabase Auth to a custom email-code login.
-- Run manually in the Supabase SQL editor.
--
-- Data is preserved: transactions / categories rows are never deleted. Their
-- user_id values are kept as-is and re-pointed from auth.users to public.users
-- (same UUIDs, copied below). After this the app talks to Postgres only with
-- the service-role key; RLS policies that relied on auth.uid() are removed.

begin;

-- 1. App-owned users table. IDs are copied verbatim from auth.users so every
--    existing transactions.user_id / categories.user_id keeps resolving.
--    New users are created by the app with a generated UUID.
create table if not exists public.users (
  id         uuid primary key default gen_random_uuid(),
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

-- 3. Re-point the user_id foreign keys from auth.users to public.users.
do $$
declare
  fk record;
begin
  for fk in
    select con.conname, rel.relname as table_name
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where con.contype = 'f'
      and nsp.nspname = 'public'
      and rel.relname in ('transactions', 'categories')
      and con.confrelid = 'auth.users'::regclass
  loop
    execute format('alter table public.%I drop constraint %I', fk.table_name, fk.conname);
  end loop;
end $$;

alter table public.transactions
  add constraint transactions_user_id_fkey
  foreign key (user_id) references public.users (id) on delete cascade;

alter table public.categories
  add constraint categories_user_id_fkey
  foreign key (user_id) references public.users (id) on delete cascade;

-- 4. Drop the RLS policies that referenced auth.uid(). RLS stays ENABLED with no
--    policies, so the anon / authenticated roles can read nothing; the app's
--    service-role key bypasses RLS entirely.
drop policy if exists "categories_select" on public.categories;
drop policy if exists "categories_insert" on public.categories;
drop policy if exists "categories_update" on public.categories;
drop policy if exists "categories_delete" on public.categories;
drop policy if exists "transactions_all" on public.transactions;

alter table public.users       enable row level security;
alter table public.login_codes enable row level security;

commit;

-- Verification (expect auth_users = app_users, and the second query = 0 rows):
--   select (select count(*) from auth.users)   as auth_users,
--          (select count(*) from public.users) as app_users;
--   select user_id from public.transactions
--   except
--   select id from public.users;
