alter table public.attendee_board_posts
  add column if not exists image_path text;

insert into storage.buckets (id, name, public)
values ('attendee-board-media', 'attendee-board-media', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Attendees can view attendee board media" on storage.objects;
create policy "Attendees can view attendee board media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'attendee-board-media'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  )
);

drop policy if exists "Attendees can upload attendee board media" on storage.objects;
create policy "Attendees can upload attendee board media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'attendee-board-media'
  and split_part(name, '/', 1) = auth.uid()::text
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  )
);

drop policy if exists "Attendees can update attendee board media" on storage.objects;
create policy "Attendees can update attendee board media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'attendee-board-media'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin(auth.uid())
  )
)
with check (
  bucket_id = 'attendee-board-media'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin(auth.uid())
  )
);

drop policy if exists "Attendees can delete attendee board media" on storage.objects;
create policy "Attendees can delete attendee board media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'attendee-board-media'
  and (
    split_part(name, '/', 1) = auth.uid()::text
    or public.is_admin(auth.uid())
  )
);

drop function if exists public.create_attendee_board_post(text, text, text, text, text);
create or replace function public.create_attendee_board_post(
  p_full_name text,
  p_email text,
  p_organization text default null,
  p_body text default null,
  p_room text default 'Community Lounge',
  p_image_path text default null
)
returns public.attendee_board_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_post public.attendee_board_posts%rowtype;
  normalized_room text;
  normalized_image_path text;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  if trim(coalesce(p_full_name, '')) = '' then
    raise exception 'Full name is required.';
  end if;

  if trim(coalesce(p_email, '')) = '' then
    raise exception 'Email is required.';
  end if;

  if trim(coalesce(p_body, '')) = '' then
    raise exception 'Post cannot be empty.';
  end if;

  normalized_room := nullif(trim(regexp_replace(coalesce(p_room, ''), '\s+', ' ', 'g')), '');
  if normalized_room is null then
    normalized_room := 'Community Lounge';
  end if;

  normalized_image_path := nullif(trim(coalesce(p_image_path, '')), '');

  insert into public.attendee_board_posts (
    account_id,
    room,
    full_name,
    email,
    organization,
    body,
    image_path
  ) values (
    auth.uid(),
    normalized_room,
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_organization, '')), ''),
    trim(coalesce(p_body, '')),
    normalized_image_path
  )
  returning *
  into inserted_post;

  return inserted_post;
end;
$$;

drop function if exists public.create_attendee_board_post_with_token(text, text, text, text, text, text);
create or replace function public.create_attendee_board_post_with_token(
  p_full_name text,
  p_email text,
  p_organization text default null,
  p_body text default null,
  p_author_token text default null,
  p_room text default 'Community Lounge',
  p_image_path text default null
)
returns public.attendee_board_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_post public.attendee_board_posts%rowtype;
  normalized_room text;
  normalized_image_path text;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  if trim(coalesce(p_full_name, '')) = '' then
    raise exception 'Full name is required.';
  end if;

  if trim(coalesce(p_email, '')) = '' then
    raise exception 'Email is required.';
  end if;

  if trim(coalesce(p_body, '')) = '' then
    raise exception 'Post cannot be empty.';
  end if;

  normalized_room := nullif(trim(regexp_replace(coalesce(p_room, ''), '\s+', ' ', 'g')), '');
  if normalized_room is null then
    normalized_room := 'Community Lounge';
  end if;

  normalized_image_path := nullif(trim(coalesce(p_image_path, '')), '');

  insert into public.attendee_board_posts (
    account_id,
    room,
    full_name,
    email,
    organization,
    body,
    author_token,
    image_path
  ) values (
    auth.uid(),
    normalized_room,
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_organization, '')), ''),
    trim(coalesce(p_body, '')),
    nullif(trim(coalesce(p_author_token, '')), ''),
    normalized_image_path
  )
  returning *
  into inserted_post;

  return inserted_post;
end;
$$;

grant execute on function public.create_attendee_board_post(text, text, text, text, text, text) to authenticated;
grant execute on function public.create_attendee_board_post_with_token(text, text, text, text, text, text, text) to authenticated;
