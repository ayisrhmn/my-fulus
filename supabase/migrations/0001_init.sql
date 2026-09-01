-- MyFulus initial schema: categories + transactions, with RLS.
-- Run manually in the Supabase SQL editor.

create type transaction_type as enum ('income', 'expense');

create table categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete cascade,  -- null = global default
  name       text not null,
  type       transaction_type not null,
  icon       text,
  color      text,
  created_at timestamptz not null default now()
);

create table transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  amount      numeric(14, 2) not null check (amount > 0),
  type        transaction_type not null,
  category_id uuid references categories (id) on delete set null,
  description text,
  date        date not null,
  created_at  timestamptz not null default now()
);

create index transactions_user_date_idx on transactions (user_id, date desc);
create index categories_user_idx on categories (user_id);

-- Row Level Security ---------------------------------------------------------

alter table categories   enable row level security;
alter table transactions enable row level security;

-- categories: read own + global defaults; write own only.
create policy "categories_select" on categories
  for select using (user_id = auth.uid() or user_id is null);

create policy "categories_insert" on categories
  for insert with check (user_id = auth.uid());

create policy "categories_update" on categories
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "categories_delete" on categories
  for delete using (user_id = auth.uid());

-- transactions: full access to own rows only.
create policy "transactions_all" on transactions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Default global categories -------------------------------------------------

insert into categories (user_id, name, type, icon) values
  (null, 'Salary',        'income',  '💰'),
  (null, 'Bonus',         'income',  '🎁'),
  (null, 'Other Income',  'income',  '➕'),
  (null, 'Food',          'expense', '🍽️'),
  (null, 'Transport',     'expense', '🚗'),
  (null, 'Shopping',      'expense', '🛍️'),
  (null, 'Bills',         'expense', '🧾'),
  (null, 'Health',        'expense', '💊'),
  (null, 'Entertainment', 'expense', '🎬'),
  (null, 'Other Expense', 'expense', '➖');
