-- Keramiikkapäiväkirja schema (v3) — piece/vaihe-malli + kirjautuminen.
--
-- Jos ajoit aiemman version (pieces/steps ilman owner_id, tai
-- sessions/session_photos), pudota vanhat taulut ensin:
--
--   drop table if exists session_photos;
--   drop table if exists sessions;
--   drop table if exists step_photos;
--   drop table if exists steps;
--   drop table if exists pieces;
--   drop table if exists ideas;
--
-- Aja tämän jälkeen kaikki alla oleva Supabasen SQL-editorissa.

create extension if not exists "uuid-ossp";

create table if not exists pieces (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'luonnos' check (
    status in ('luonnos', 'aktiivinen', 'valmis')
  ),
  clay_type text,
  start_weight_g numeric,
  cover_photo_path text,
  created_at timestamptz not null default now()
);

create table if not exists steps (
  id uuid primary key default uuid_generate_v4(),
  piece_id uuid not null references pieces(id) on delete cascade,
  step_type text not null check (
    step_type in (
      'muotoilu', 'kuivatus', 'raakapoltto',
      'enkoopointi', 'lasitus', 'lasipoltto', 'muu'
    )
  ),
  note text,
  weight_g numeric,
  kiln_temp_c numeric,
  firing_program text,
  glaze_name text,
  glaze_application_method text,
  created_at timestamptz not null default now()
);

create table if not exists step_photos (
  id uuid primary key default uuid_generate_v4(),
  step_id uuid not null references steps(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists ideas (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  note text,
  link text,
  storage_path text,
  created_at timestamptz not null default now()
);

create index if not exists pieces_owner_id_idx on pieces(owner_id);
create index if not exists steps_piece_id_idx on steps(piece_id);
create index if not exists step_photos_step_id_idx on step_photos(step_id);
create index if not exists ideas_owner_id_idx on ideas(owner_id);

-- Storage bucket for piece/step and idea photos.
insert into storage.buckets (id, name, public)
values ('ceramics-diary', 'ceramics-diary', true)
on conflict (id) do nothing;

-- RLS: each user only sees and edits their own data.
alter table pieces enable row level security;
alter table steps enable row level security;
alter table step_photos enable row level security;
alter table ideas enable row level security;

create policy "own pieces select" on pieces for select using (auth.uid() = owner_id);
create policy "own pieces insert" on pieces for insert with check (auth.uid() = owner_id);
create policy "own pieces update" on pieces for update using (auth.uid() = owner_id);
create policy "own pieces delete" on pieces for delete using (auth.uid() = owner_id);

create policy "own steps select" on steps for select using (
  exists (select 1 from pieces where pieces.id = steps.piece_id and pieces.owner_id = auth.uid())
);
create policy "own steps insert" on steps for insert with check (
  exists (select 1 from pieces where pieces.id = steps.piece_id and pieces.owner_id = auth.uid())
);
create policy "own steps update" on steps for update using (
  exists (select 1 from pieces where pieces.id = steps.piece_id and pieces.owner_id = auth.uid())
);
create policy "own steps delete" on steps for delete using (
  exists (select 1 from pieces where pieces.id = steps.piece_id and pieces.owner_id = auth.uid())
);

create policy "own step_photos select" on step_photos for select using (
  exists (
    select 1 from steps
    join pieces on pieces.id = steps.piece_id
    where steps.id = step_photos.step_id and pieces.owner_id = auth.uid()
  )
);
create policy "own step_photos insert" on step_photos for insert with check (
  exists (
    select 1 from steps
    join pieces on pieces.id = steps.piece_id
    where steps.id = step_photos.step_id and pieces.owner_id = auth.uid()
  )
);

create policy "own ideas select" on ideas for select using (auth.uid() = owner_id);
create policy "own ideas insert" on ideas for insert with check (auth.uid() = owner_id);
create policy "own ideas update" on ideas for update using (auth.uid() = owner_id);
create policy "own ideas delete" on ideas for delete using (auth.uid() = owner_id);

-- Storage policies: users can only read/write files under a path
-- that starts with their own user id.
create policy "own storage select" on storage.objects for select using (
  bucket_id = 'ceramics-diary' and (storage.foldername(name))[1] = auth.uid()::text
);
create policy "own storage insert" on storage.objects for insert with check (
  bucket_id = 'ceramics-diary' and (storage.foldername(name))[1] = auth.uid()::text
);
