-- ════════════════════════════════════════════
-- MamaCare v6 — Supabase SQL Schema
-- Run ONCE in Supabase SQL Editor
-- ════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ── USER PROFILE ──
create table if not exists public.user_profile (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  due_date date,
  lmp_date date,
  pre_weight numeric(5,2),
  language text default 'hinglish',
  emergency_contacts jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── WEIGHT LOGS ──
create table if not exists public.weight_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  weight_kg numeric(5,2) not null,
  week_number int,
  logged_at timestamptz default now()
);

-- ── SLEEP LOGS ──
create table if not exists public.sleep_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  bedtime time not null,
  wake_time time not null,
  duration_hrs numeric(4,2),
  quality int check (quality between 1 and 3),
  issue text,
  sleep_date date default current_date,
  logged_at timestamptz default now()
);

-- ── FOOD LOGS ──
create table if not exists public.food_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  food_name text not null,
  calories int,
  meal_type text,
  food_date date default current_date,
  logged_at timestamptz default now()
);

-- ── WATER LOGS ──
create table if not exists public.water_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  glasses_count int default 0,
  log_date date default current_date,
  unique(user_id, log_date)
);

-- ── MEDICINES ──
create table if not exists public.medicines (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  dose text,
  time_of_day time,
  icon text default '💊',
  notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ── MEDICINE LOGS (daily taken) ──
create table if not exists public.medicine_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  medicine_id uuid references public.medicines on delete cascade not null,
  taken_date date default current_date,
  taken_at timestamptz default now(),
  unique(user_id, medicine_id, taken_date)
);

-- ── JOURNAL ENTRIES ──
create table if not exists public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  week_number int,
  entry_date date default current_date,
  mood text,
  content_text text,
  created_at timestamptz default now()
);

-- ── SAVED BABY NAMES ──
create table if not exists public.saved_names (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  baby_name text not null,
  saved_at timestamptz default now(),
  unique(user_id, baby_name)
);

-- ── HOSPITAL BAG ──
create table if not exists public.hospital_bag (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_name text not null,
  category text,
  is_checked boolean default false,
  is_custom boolean default false,
  created_at timestamptz default now()
);

-- ── BIRTH PLAN ──
create table if not exists public.birth_plan (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_data jsonb default '{}',
  updated_at timestamptz default now(),
  unique(user_id)
);

-- ── APPOINTMENTS ──
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  doctor_name text,
  hospital text,
  appt_date date not null,
  appt_time time,
  notes text,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- ── MOOD LOGS ──
create table if not exists public.mood_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  mood_type text not null,
  logged_at timestamptz default now()
);

-- ════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════
alter table public.user_profile    enable row level security;
alter table public.weight_logs     enable row level security;
alter table public.sleep_logs      enable row level security;
alter table public.food_logs       enable row level security;
alter table public.water_logs      enable row level security;
alter table public.medicines       enable row level security;
alter table public.medicine_logs   enable row level security;
alter table public.journal_entries enable row level security;
alter table public.saved_names     enable row level security;
alter table public.hospital_bag    enable row level security;
alter table public.birth_plan      enable row level security;
alter table public.appointments    enable row level security;
alter table public.mood_logs       enable row level security;

-- RLS Policies — user sees only their own data
create policy "own_profile"    on public.user_profile    for all using (auth.uid()=id)      with check (auth.uid()=id);
create policy "own_weight"     on public.weight_logs     for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_sleep"      on public.sleep_logs      for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_food"       on public.food_logs       for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_water"      on public.water_logs      for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_medicines"  on public.medicines       for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_medlogs"    on public.medicine_logs   for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_journal"    on public.journal_entries for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_names"      on public.saved_names     for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_bag"        on public.hospital_bag    for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_birthplan"  on public.birth_plan      for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_appts"      on public.appointments    for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "own_mood"       on public.mood_logs       for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- ════════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGNUP
-- ════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profile (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ✅ Schema complete! All tables + RLS + auto-profile trigger ready.
