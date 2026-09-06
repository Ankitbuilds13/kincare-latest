-- ==============================================================================
-- CareBridge: Supabase Auth, Profiles, Account Ownership & RLS Migration
-- Tables: profiles, seniors, family_links, medications, bookings, family_updates
-- ==============================================================================

-- 1. PROFILES TABLE (Associated with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('elder', 'senior_individual', 'family', 'family_caregiver', 'helper', 'helper_proxy', 'healthcare_guardian')),
  email text,
  phone text,
  preferred_city text,
  emergency_contact_name text,
  emergency_contact_phone text,
  address text,
  family_code text,
  elder_code text,
  specialization text,
  badge_number text,
  upi_id text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure columns exist if table was already created
alter table public.profiles add column if not exists role text default 'senior_individual';
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists preferred_city text;
alter table public.profiles add column if not exists family_code text;
alter table public.profiles add column if not exists elder_code text;
alter table public.profiles add column if not exists emergency_contact_name text;
alter table public.profiles add column if not exists emergency_contact_phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists specialization text;
alter table public.profiles add column if not exists badge_number text;
alter table public.profiles add column if not exists upi_id text;
alter table public.profiles add column if not exists avatar_url text;

-- 2. SENIORS TABLE (Owned by authenticated user, associated with family code)
create table if not exists public.seniors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  age integer,
  phone text,
  address text,
  emergency_contact text,
  family_code text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.seniors add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table public.seniors add column if not exists family_code text;
alter table public.seniors add column if not exists emergency_contact text;

-- Create index for fast lookups
create index if not exists idx_seniors_owner on public.seniors(owner_id);
create index if not exists idx_seniors_family_code on public.seniors(family_code);

-- 3. FAMILY LINKS TABLE (Explicit authorization relationship: Family Account -> Senior)
create table if not exists public.family_links (
  id uuid primary key default gen_random_uuid(),
  family_user_id uuid not null references auth.users(id) on delete cascade,
  senior_id uuid not null references public.seniors(id) on delete cascade,
  family_code text not null,
  created_at timestamptz default now(),
  unique(family_user_id, senior_id)
);

create index if not exists idx_family_links_family on public.family_links(family_user_id);
create index if not exists idx_family_links_senior on public.family_links(senior_id);
create index if not exists idx_family_links_code on public.family_links(family_code);

-- 4. MEDICATIONS TABLE (Owned by senior, accessible by owner and linked family)
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  senior_id uuid not null references public.seniors(id) on delete cascade,
  name text not null,
  dosage text not null,
  timing text not null,
  instructions text,
  taken_today boolean default false,
  taken_at text,
  streak_days integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.medications add column if not exists senior_id uuid references public.seniors(id) on delete cascade;
alter table public.medications add column if not exists taken_today boolean default false;
alter table public.medications add column if not exists taken_at text;
alter table public.medications add column if not exists streak_days integer default 0;

create index if not exists idx_medications_senior on public.medications(senior_id);

-- 5. BOOKINGS TABLE (Associated with senior and creating user)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  senior_id uuid references public.seniors(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  service_id text not null,
  service_title text not null,
  patient_name text not null,
  patient_age integer,
  time_slot text not null,
  visit_date text not null,
  address text not null,
  phone text not null,
  notes text,
  status text default 'assigned',
  caregiver_name text,
  caregiver_role text,
  caregiver_phone text,
  caregiver_rating numeric default 4.96,
  amount numeric default 899,
  discount_applied numeric default 100,
  created_at timestamptz default now()
);

alter table public.bookings add column if not exists senior_id uuid references public.seniors(id) on delete cascade;
alter table public.bookings add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists idx_bookings_senior on public.bookings(senior_id);
create index if not exists idx_bookings_user on public.bookings(user_id);

-- 6. FAMILY UPDATES TABLE (Live synchronizations for an authorized senior)
create table if not exists public.family_updates (
  id uuid primary key default gen_random_uuid(),
  senior_id uuid references public.seniors(id) on delete cascade,
  family_code text not null,
  elder_name text,
  elder_phone text,
  elder_address text,
  care_notes text,
  vitals jsonb default '[]'::jsonb,
  chores jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.family_updates add column if not exists senior_id uuid references public.seniors(id) on delete cascade;
alter table public.family_updates add column if not exists family_code text;

create index if not exists idx_family_updates_senior on public.family_updates(senior_id);
create index if not exists idx_family_updates_code on public.family_updates(family_code);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & HELPER FUNCTIONS
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.seniors enable row level security;
alter table public.family_links enable row level security;
alter table public.medications enable row level security;
alter table public.bookings enable row level security;
alter table public.family_updates enable row level security;

-- Helper security definer function: Checks if auth.uid() owns or is linked to senior
create or replace function public.is_authorized_for_senior(target_senior_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.seniors s
    where s.id = target_senior_id
      and (
        s.owner_id = auth.uid()
        or exists (
          select 1 from public.family_links fl
          where fl.senior_id = s.id
            and fl.family_user_id = auth.uid()
        )
      )
  );
$$;

-- RLS POLICIES FOR PROFILES
drop policy if exists "Profiles are viewable by self" on public.profiles;
create policy "Profiles are viewable by self"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "Profiles viewable by linked family" on public.profiles;
create policy "Profiles viewable by linked family"
  on public.profiles for select
  using (
    exists (
      select 1 from public.family_links fl
      join public.seniors s on s.id = fl.senior_id
      where fl.family_user_id = auth.uid()
        and s.owner_id = public.profiles.id
    )
  );

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- RLS POLICIES FOR SENIORS
drop policy if exists "Seniors visible to owner and linked family" on public.seniors;
create policy "Seniors visible to owner and linked family"
  on public.seniors for select
  using (
    owner_id = auth.uid()
    or id in (
      select fl.senior_id from public.family_links fl where fl.family_user_id = auth.uid()
    )
  );

drop policy if exists "Seniors insertable by authenticated owner" on public.seniors;
create policy "Seniors insertable by authenticated owner"
  on public.seniors for insert
  with check (owner_id = auth.uid());

drop policy if exists "Seniors updatable by owner or authorized family" on public.seniors;
create policy "Seniors updatable by owner or authorized family"
  on public.seniors for update
  using (
    owner_id = auth.uid()
    or id in (
      select fl.senior_id from public.family_links fl where fl.family_user_id = auth.uid()
    )
  );

drop policy if exists "Seniors deletable by owner only" on public.seniors;
create policy "Seniors deletable by owner only"
  on public.seniors for delete
  using (owner_id = auth.uid());

-- RLS POLICIES FOR FAMILY LINKS
drop policy if exists "Family links visible to participating family and senior" on public.family_links;
create policy "Family links visible to participating family and senior"
  on public.family_links for select
  using (
    family_user_id = auth.uid()
    or senior_id in (select s.id from public.seniors s where s.owner_id = auth.uid())
  );

drop policy if exists "Family can insert family link for verified senior" on public.family_links;
create policy "Family can insert family link for verified senior"
  on public.family_links for insert
  with check (family_user_id = auth.uid());

drop policy if exists "Family or senior owner can delete link" on public.family_links;
create policy "Family or senior owner can delete link"
  on public.family_links for delete
  using (
    family_user_id = auth.uid()
    or senior_id in (select s.id from public.seniors s where s.owner_id = auth.uid())
  );

-- RLS POLICIES FOR MEDICATIONS
drop policy if exists "Medications viewable by authorized senior or family" on public.medications;
create policy "Medications viewable by authorized senior or family"
  on public.medications for select
  using (public.is_authorized_for_senior(senior_id));

drop policy if exists "Medications insertable by authorized senior or family" on public.medications;
create policy "Medications insertable by authorized senior or family"
  on public.medications for insert
  with check (public.is_authorized_for_senior(senior_id));

drop policy if exists "Medications updatable by authorized senior or family" on public.medications;
create policy "Medications updatable by authorized senior or family"
  on public.medications for update
  using (public.is_authorized_for_senior(senior_id))
  with check (public.is_authorized_for_senior(senior_id));

drop policy if exists "Medications deletable by authorized senior or family" on public.medications;
create policy "Medications deletable by authorized senior or family"
  on public.medications for delete
  using (public.is_authorized_for_senior(senior_id));

-- RLS POLICIES FOR BOOKINGS
drop policy if exists "Bookings viewable by user or senior or caregiver" on public.bookings;
create policy "Bookings viewable by user or senior or caregiver"
  on public.bookings for select
  using (
    user_id = auth.uid()
    or (senior_id is not null and public.is_authorized_for_senior(senior_id))
  );

drop policy if exists "Bookings insertable by authenticated user" on public.bookings;
create policy "Bookings insertable by authenticated user"
  on public.bookings for insert
  with check (
    user_id = auth.uid()
    or (senior_id is not null and public.is_authorized_for_senior(senior_id))
  );

drop policy if exists "Bookings updatable by booker or senior" on public.bookings;
create policy "Bookings updatable by booker or senior"
  on public.bookings for update
  using (
    user_id = auth.uid()
    or (senior_id is not null and public.is_authorized_for_senior(senior_id))
  );

-- RLS POLICIES FOR FAMILY UPDATES
drop policy if exists "Family updates viewable by authorized senior or family" on public.family_updates;
create policy "Family updates viewable by authorized senior or family"
  on public.family_updates for select
  using (
    (senior_id is not null and public.is_authorized_for_senior(senior_id))
    or exists (
      select 1 from public.family_links fl
      where fl.family_code = public.family_updates.family_code
        and fl.family_user_id = auth.uid()
    )
    or exists (
      select 1 from public.seniors s
      where s.family_code = public.family_updates.family_code
        and s.owner_id = auth.uid()
    )
  );

drop policy if exists "Family updates insertable by authorized senior or family" on public.family_updates;
create policy "Family updates insertable by authorized senior or family"
  on public.family_updates for insert
  with check (
    (senior_id is not null and public.is_authorized_for_senior(senior_id))
    or exists (
      select 1 from public.family_links fl
      where fl.family_code = public.family_updates.family_code
        and fl.family_user_id = auth.uid()
    )
    or exists (
      select 1 from public.seniors s
      where s.family_code = public.family_updates.family_code
        and s.owner_id = auth.uid()
    )
  );
