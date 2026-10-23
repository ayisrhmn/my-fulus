-- MyFulus schema for a plain Postgres database (13+).
--
-- Tables are created unqualified, in the first schema on the search_path.
-- On the shared DB, run it inside the app's schema (the DB_SCHEMA value):
--
--   psql "$DATABASE_URL" -v schema=myfulus -f db/schema.sql
--
-- No RLS: access control lives in the server code (every query filters by
-- user_id) and in the grants of the app's database role.

\if :{?schema}
  create schema if not exists :"schema";
  set search_path to :"schema";
\endif

begin;

create type transaction_type as enum ('income', 'expense');

create table users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

-- One-time login codes (HMAC-hashed, short TTL, attempt-limited in code).
create table login_codes (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  code_hash  text not null,
  expires_at timestamptz not null,
  attempts   int not null default 0,
  created_at timestamptz not null default now()
);

create table categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users (id) on delete cascade,  -- null = global default
  name       text not null,
  type       transaction_type not null,
  icon       text,  -- lucide-react icon name, e.g. 'wallet'
  color      text,
  created_at timestamptz not null default now()
);

create table transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users (id) on delete cascade,
  amount      numeric(14, 2) not null check (amount > 0),
  type        transaction_type not null,
  category_id uuid references categories (id) on delete set null,
  description text,
  date        date not null,
  created_at  timestamptz not null default now()
);

create index login_codes_email_idx on login_codes (email);
create index categories_user_idx on categories (user_id);
create index transactions_user_date_idx on transactions (user_id, date desc);

-- Default global categories. Skip this block when restoring data from a dump,
-- which already contains them.
insert into categories (user_id, name, type, icon) values
  (null, 'Gaji',             'income',  'wallet'),
  (null, 'Bonus',            'income',  'gift'),
  (null, 'Pemasukan Lain',   'income',  'plus'),
  (null, 'Makan',            'expense', 'utensils-crossed'),
  (null, 'Transportasi',     'expense', 'car'),
  (null, 'Belanja',          'expense', 'shopping-bag'),
  (null, 'Tagihan',          'expense', 'receipt'),
  (null, 'Kesehatan',        'expense', 'pill'),
  (null, 'Hiburan',          'expense', 'clapperboard'),
  (null, 'Pengeluaran Lain', 'expense', 'minus');

commit;
