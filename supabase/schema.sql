-- GearEx initial Supabase migration.
-- Run in the Supabase project SQL Editor before enabling browser-side credentials.
-- All user content is private to its owner through Row Level Security.

create table if not exists public.gearex_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint gearex_progress_payload_limit check (octet_length(payload::text) <= 524288)
);

create table if not exists public.gearex_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_path text,
  updated_at timestamptz not null default now(),
  constraint gearex_display_name_length check (char_length(display_name) <= 60),
  constraint gearex_avatar_owner check (
    avatar_path is null or avatar_path = user_id::text || '/avatar.webp'
  )
);

alter table public.gearex_progress enable row level security;
alter table public.gearex_profiles enable row level security;

revoke all on public.gearex_progress from anon;
revoke all on public.gearex_profiles from anon;
grant select,insert,update,delete on public.gearex_progress to authenticated;
grant select,insert,update,delete on public.gearex_profiles to authenticated;

create policy "gearex_progress_select_own" on public.gearex_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "gearex_progress_insert_own" on public.gearex_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "gearex_progress_update_own" on public.gearex_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "gearex_progress_delete_own" on public.gearex_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "gearex_profiles_select_own" on public.gearex_profiles
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "gearex_profiles_insert_own" on public.gearex_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "gearex_profiles_update_own" on public.gearex_profiles
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "gearex_profiles_delete_own" on public.gearex_profiles
  for delete to authenticated using ((select auth.uid()) = user_id);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
  values('gearex-avatars','gearex-avatars',false,2097152,array['image/webp'])
  on conflict (id) do update set
    public=false,file_size_limit=excluded.file_size_limit,
    allowed_mime_types=excluded.allowed_mime_types;

create policy "gearex_avatar_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'gearex-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "gearex_avatar_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gearex-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and storage.filename(name) = 'avatar.webp');

create policy "gearex_avatar_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'gearex-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'gearex-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and storage.filename(name) = 'avatar.webp');

create policy "gearex_avatar_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gearex-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
