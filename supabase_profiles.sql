-- (Optionnel) Table de profil si tu veux stocker Nom/Contrat/Date/Solde sur Supabase
-- Tu peux la créer dans Supabase > SQL Editor

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  start_balance numeric,
  start_date date,
  contract text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Lectures: chacun ne voit que sa ligne
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = user_id);

-- Insert: chacun ne crée que sa ligne
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = user_id);

-- Update: chacun modifie sa ligne
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
