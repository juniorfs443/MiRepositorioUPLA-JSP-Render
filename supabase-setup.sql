-- Ejecuta este script en Supabase > SQL Editor.
-- Luego crea tu usuario en Authentication > Users o usando Sign up si lo agregas después.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  career text,
  bio text,
  avatar_url text,
  updated_at timestamptz default now()
);

create table if not exists public.repository_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week int not null check (week between 1 and 16),
  file_name text not null,
  description text,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.repository_files enable row level security;

drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read"
on public.profiles for select
using (true);

drop policy if exists "profiles owner write" on public.profiles;
create policy "profiles owner write"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "files public read" on public.repository_files;
create policy "files public read"
on public.repository_files for select
using (true);

drop policy if exists "files owner insert" on public.repository_files;
create policy "files owner insert"
on public.repository_files for insert
with check (auth.uid() = user_id);

drop policy if exists "files owner update" on public.repository_files;
create policy "files owner update"
on public.repository_files for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "files owner delete" on public.repository_files;
create policy "files owner delete"
on public.repository_files for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('repository-files', 'repository-files', true)
on conflict (id) do update set public = true;

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
on storage.objects for select
using (bucket_id = 'avatars');

drop policy if exists "avatar owner upload" on storage.objects;
create policy "avatar owner upload"
on storage.objects for insert
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "avatar owner update" on storage.objects;
create policy "avatar owner update"
on storage.objects for update
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "repo public read" on storage.objects;
create policy "repo public read"
on storage.objects for select
using (bucket_id = 'repository-files');

drop policy if exists "repo owner upload" on storage.objects;
create policy "repo owner upload"
on storage.objects for insert
with check (bucket_id = 'repository-files' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "repo owner delete" on storage.objects;
create policy "repo owner delete"
on storage.objects for delete
using (bucket_id = 'repository-files' and auth.uid()::text = (storage.foldername(name))[1]);
