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

-- ════════════════════════════════════════════
-- AI COACH — Add column (run if upgrading)
-- ════════════════════════════════════════════
alter table public.user_profile
  add column if not exists latest_coach_report jsonb;

-- ════════════════════════════════════════════
-- v6.1 ADDITIONS — Run if upgrading from v6
-- ════════════════════════════════════════════

-- Blood Pressure Logs
create table if not exists public.bp_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  systolic int not null,
  diastolic int not null,
  pulse int,
  bp_date date default current_date,
  notes text,
  logged_at timestamptz default now()
);
alter table public.bp_logs enable row level security;
create policy "bp_logs_own" on public.bp_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Blood Sugar Logs
create table if not exists public.sugar_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  reading numeric(5,2) not null,
  reading_type text default 'random', -- fasting, post_meal, random
  sugar_date date default current_date,
  notes text,
  logged_at timestamptz default now()
);
alter table public.sugar_logs enable row level security;
create policy "sugar_logs_own" on public.sugar_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Contraction Sessions
create table if not exists public.contraction_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  contractions jsonb default '[]',
  session_date date default current_date,
  created_at timestamptz default now()
);
alter table public.contraction_sessions enable row level security;
create policy "contraction_sessions_own" on public.contraction_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Subscriptions (Premium)
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  plan text default 'free',
  razorpay_subscription_id text,
  razorpay_payment_id text,
  status text default 'active',
  started_at timestamptz default now(),
  expires_at timestamptz
);
alter table public.subscriptions enable row level security;
create policy "subscriptions_own" on public.subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Add blood_group to user_profile
alter table public.user_profile add column if not exists blood_group text;
alter table public.user_profile add column if not exists name text;

-- ════════════════════════════════════════════
-- v6.2 ADDITIONS
-- ════════════════════════════════════════════

-- Baby Feeds
create table if not exists public.baby_feeds (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  feed_type text not null, -- breast, bottle_breast, formula, solid
  side text,               -- left, right, both
  duration_min int,
  amount_ml numeric(6,2),
  fed_at timestamptz default now()
);
alter table public.baby_feeds enable row level security;
create policy "baby_feeds_own" on public.baby_feeds for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Baby Diapers
create table if not exists public.baby_diapers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  diaper_type text not null, -- wet, dirty, mixed
  changed_at timestamptz default now()
);
alter table public.baby_diapers enable row level security;
create policy "baby_diapers_own" on public.baby_diapers for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Baby Sleeps
create table if not exists public.baby_sleeps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  sleep_start timestamptz not null,
  sleep_end timestamptz,
  duration_min int,
  sleep_type text default 'nap', -- nap, night
  sleep_date date default current_date
);
alter table public.baby_sleeps enable row level security;
create policy "baby_sleeps_own" on public.baby_sleeps for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Baby Weights
create table if not exists public.baby_weights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  weight_kg numeric(5,3) not null,
  height_cm numeric(5,2),
  age_days int,
  logged_at timestamptz default now()
);
alter table public.baby_weights enable row level security;
create policy "baby_weights_own" on public.baby_weights for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Baby Vaccinations
create table if not exists public.baby_vaccinations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  vaccine_id text not null,
  given_date date not null,
  hospital text,
  batch_number text,
  unique(user_id, vaccine_id)
);
alter table public.baby_vaccinations enable row level security;
create policy "baby_vaccinations_own" on public.baby_vaccinations for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Baby Milestones
create table if not exists public.baby_milestones (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  milestone_id text not null,
  milestone_date date not null,
  note text,
  photo_url text,
  unique(user_id, milestone_id)
);
alter table public.baby_milestones enable row level security;
create policy "baby_milestones_own" on public.baby_milestones for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Daily Symptom Diary
create table if not exists public.symptom_diary (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  diary_date date not null default current_date,
  swelling int default 0 check (swelling between 0 and 5),
  heartburn int default 0 check (heartburn between 0 and 5),
  fatigue int default 0 check (fatigue between 0 and 5),
  nausea int default 0 check (nausea between 0 and 5),
  back_pain int default 0 check (back_pain between 0 and 5),
  headache int default 0 check (headache between 0 and 5),
  note text,
  unique(user_id, diary_date)
);
alter table public.symptom_diary enable row level security;
create policy "symptom_diary_own" on public.symptom_diary for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- Add baby fields to user_profile
alter table public.user_profile add column if not exists baby_dob date;
alter table public.user_profile add column if not exists baby_name text;
alter table public.user_profile add column if not exists baby_gender text;
alter table public.user_profile add column if not exists doctor_email text;
alter table public.user_profile add column if not exists doctor_name text;
alter table public.user_profile add column if not exists doctor_token text;
alter table public.user_profile add column if not exists allergies text;
alter table public.user_profile add column if not exists medical_notes text;
