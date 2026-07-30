-- Ceramics diary schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "uuid-ossp";

-- One row per piece of work (e.g. one mug, one bowl, one experiment)
create table if not exists pieces (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  clay_type text,
  start_weight_g numeric,
  cover_photo_path text,
  created_at timestamptz not null default now()
);

-- A step in a piece's process. step_type drives which optional
-- fields are relevant in the UI (kiln temp only for firing, glaze
-- name only for glazing, etc.) but all columns are nullable so any
-- combination can be recorded.
create table if not exists steps (
  id uuid primary key default uuid_generate_v4(),
  piece_id uuid not null references pieces(id) on delete cascade,
  step_type text not null check (
    step_type in (
      'muotoilu',      -- forming
      'kuivatus',      -- drying
      'raakapoltto',   -- bisque firing
      'enkoopointi',   -- engobe application
      'lasitus',       -- glazing
      'lasipoltto',    -- glaze firing
      'muu'            -- other
    )
  ),
  note text,
  weight_g numeric,
  kiln_temp_c numeric,
  firing_program text,
  glaze_name text,
  glaze_application_method text, -- e.g. dipping, spraying, brushing
  created_at timestamptz not null default now()
);

-- One or more photos per step, stored in Supabase Storage.
-- storage_path is the path inside the "ceramics-diary" bucket.
create table if not exists step_photos (
  id uuid primary key default uuid_generate_v4(),
  step_id uuid not null references steps(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists steps_piece_id_idx on steps(piece_id);
create index if not exists step_photos_step_id_idx on step_photos(step_id);

-- Storage bucket for photos. Create it once, then the policies below
-- allow anyone with the anon key to read/write — tighten this once
-- you add authentication.
insert into storage.buckets (id, name, public)
values ('ceramics-diary', 'ceramics-diary', true)
on conflict (id) do nothing;

-- Basic open policies for a single-user portfolio project.
-- Revisit before shipping to multiple real users.
alter table pieces enable row level security;
alter table steps enable row level security;
alter table step_photos enable row level security;

create policy "public read pieces" on pieces for select using (true);
create policy "public write pieces" on pieces for insert with check (true);
create policy "public update pieces" on pieces for update using (true);

create policy "public read steps" on steps for select using (true);
create policy "public write steps" on steps for insert with check (true);
create policy "public update steps" on steps for update using (true);

create policy "public read step_photos" on step_photos for select using (true);
create policy "public write step_photos" on step_photos for insert with check (true);
