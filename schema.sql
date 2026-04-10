-- ═══════════════════════════════════════════
-- MamaCare v6 — Supabase SQL Schema
-- Run this in Supabase SQL Editor (one shot)
-- ═══════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── USER PROFILE ──────────────────────────
create table if not exists public.user_profile (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  due_date date,
  lmp_date date,
  pre_weight numeric(5,2),
  language text default 'hinglish',
  partner_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── WEIGHT LOGS ───────────────────────────
create table if not exists public.weight_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  weight_kg numeric(5,2) not null,
  week_number int,
  logged_at timestamptz default now()
);

-- ── SLEEP LOGS ────────────────────────────
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

-- ── FOOD LOGS ─────────────────────────────
create table if not exists public.food_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  food_name text not null,
  calories int,
  meal_type text,
  food_date date default current_date,
  logged_at timestamptz default now()
);

-- ── WATER LOGS ────────────────────────────
create table if not exists public.water_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  glasses_count int default 0,
  log_date date default current_date,
  unique(user_id, log_date)
);

-- ── MEDICINES ─────────────────────────────
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

-- ── MEDICINE LOGS (daily taken tracking) ──
create table if not exists public.medicine_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  medicine_id uuid references public.medicines on delete cascade not null,
  taken_date date default current_date,
  taken_at timestamptz default now(),
  unique(user_id, medicine_id, taken_date)
);

-- ── JOURNAL ENTRIES ───────────────────────
create table if not exists public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  week_number int,
  entry_date date default current_date,
  mood text,
  content_text text,
  -- Photos stored as base64 locally / downloaded to gallery
  -- No cloud photo storage to save bandwidth
  created_at timestamptz default now()
);

-- ── SAVED BABY NAMES ──────────────────────
create table if not exists public.saved_names (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  baby_name text not null,
  notes text,
  saved_at timestamptz default now(),
  unique(user_id, baby_name)
);

-- ── HOSPITAL BAG ──────────────────────────
create table if not exists public.hospital_bag (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_name text not null,
  category text,
  is_checked boolean default false,
  is_custom boolean default false,
  created_at timestamptz default now()
);

-- ── BIRTH PLAN ────────────────────────────
create table if not exists public.birth_plan (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_data jsonb default '{}',
  updated_at timestamptz default now(),
  unique(user_id)
);

-- ── APPOINTMENTS ──────────────────────────
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

-- ── MOOD LOGS ─────────────────────────────
create table if not exists public.mood_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  mood_type text not null,
  notes text,
  logged_at timestamptz default now()
);

-- ── KICK LOGS ─────────────────────────────
create table if not exists public.kick_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_date date default current_date,
  kick_count int default 0,
  session_start timestamptz,
  session_end timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, session_date)
);

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY — Users see only their data
-- ═══════════════════════════════════════════
alter table public.user_profile enable row level security;
alter table public.weight_logs enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.food_logs enable row level security;
alter table public.water_logs enable row level security;
alter table public.medicines enable row level security;
alter table public.medicine_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.saved_names enable row level security;
alter table public.hospital_bag enable row level security;
alter table public.birth_plan enable row level security;
alter table public.appointments enable row level security;
alter table public.mood_logs enable row level security;
alter table public.kick_logs enable row level security;

-- RLS Policies (select, insert, update, delete)
do $$
declare
  t text;
  tables text[] := array[
    'weight_logs','sleep_logs','food_logs','water_logs',
    'medicines','medicine_logs','journal_entries','saved_names',
    'hospital_bag','birth_plan','appointments','mood_logs','kick_logs'
  ];
begin
  foreach t in array tables loop
    execute format('create policy "%s_own" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t, t);
  end loop;
end $$;

create policy "profile_own" on public.user_profile
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- ═══════════════════════════════════════════
-- AUTO-CREATE PROFILE ON SIGNUP
-- ═══════════════════════════════════════════
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

-- Done! All tables created with RLS. ✓

-- Add emergency_contacts to user_profile (run this separately if table already exists)
ALTER TABLE public.user_profile ADD COLUMN IF NOT EXISTS emergency_contacts jsonb default '[]';

-- ════════════════════════════════════════════
-- ADD PARTNER ACCESS COLUMNS (run if upgrading)
-- ════════════════════════════════════════════
alter table public.user_profile
  add column if not exists partner_email text,
  add column if not exists partner_token text,
  add column if not exists partner_perms text;
