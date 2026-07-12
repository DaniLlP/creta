-- =====================================================================
-- Guía Definitiva de Creta — esquema de Supabase para perfiles y reseñas
-- =====================================================================
-- Cómo usarlo:
-- 1. Crea un proyecto en https://supabase.com (gratis)
-- 2. Ve a SQL Editor → New query, pega este archivo entero y ejecútalo (Run)
-- 3. Ve a Authentication → Providers → Email y confirma que "Email OTP /
--    Magic Link" está activado (lo está por defecto)
-- 4. Ve a Authentication → URL Configuration → añade la URL de tu sitio
--    (https://danillp.github.io/creta/) en "Redirect URLs"
-- 5. Copia Project URL y anon/public key desde Settings → API y pégalos
--    en las dos constantes SUPABASE_URL / SUPABASE_ANON_KEY de index.html
-- =====================================================================

-- Necesario para gen_random_uuid() — normalmente ya viene activado en Supabase
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- PERFILES: uno por usuario autenticado, con un nombre de usuario único
-- que sirve para compartir el enlace de tu diario con amigos.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null check (char_length(username) between 3 and 24),
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Los perfiles son visibles para todos"
  on public.profiles for select
  using (true);

create policy "Cada usuario crea su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Cada usuario edita su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------
-- RESEÑAS: platos probados y rincones/lugares visitados, con valoración
-- de 1 a 5 estrellas y un comentario corto opcional.
-- ---------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_id text not null,                                  -- p.ej. 'probado-dakos'
  item_type text not null check (item_type in ('probado','visitado')),
  item_label text not null,                                -- p.ej. 'Dakos'
  rating smallint not null default 0 check (rating between 0 and 5),
  review text,
  updated_at timestamptz default now(),
  unique (user_id, item_id)
);

alter table public.reviews enable row level security;

create policy "Las reseñas son visibles para todos"
  on public.reviews for select
  using (true);

create policy "Cada usuario crea sus propias reseñas"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Cada usuario edita sus propias reseñas"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Cada usuario borra sus propias reseñas"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Índice para que buscar el diario de un amigo por su username sea rápido
create index if not exists reviews_user_id_idx on public.reviews (user_id);
