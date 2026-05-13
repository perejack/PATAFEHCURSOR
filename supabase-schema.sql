create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.investments (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  amount numeric(12,2) not null check (amount > 0),
  payment_method text not null default 'mpesa',
  status text not null default 'active',
  invested_at timestamptz not null default now()
);

create table if not exists public.payment_transactions (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('deposit','withdrawal')),
  method text not null,
  status text not null default 'pending',
  reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  amount numeric(12,2) not null check (amount > 0),
  payment_method text not null default 'mpesa',
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  available_at timestamptz not null
);

alter table public.profiles enable row level security;
alter table public.investments enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.withdrawals enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "investments_own_all" on public.investments;
create policy "investments_own_all" on public.investments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "transactions_own_all" on public.payment_transactions;
create policy "transactions_own_all" on public.payment_transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "withdrawals_own_all" on public.withdrawals;
create policy "withdrawals_own_all" on public.withdrawals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
