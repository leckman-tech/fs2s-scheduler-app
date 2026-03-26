alter table public.attendee_board_posts
add column if not exists account_id uuid references public.profiles (id) on delete set null,
add column if not exists room text not null default 'Community Lounge';

alter table public.attendee_board_replies
add column if not exists account_id uuid references public.profiles (id) on delete set null;

create index if not exists attendee_board_posts_room_idx
on public.attendee_board_posts (room, published, created_at desc);

create index if not exists attendee_board_posts_account_idx
on public.attendee_board_posts (account_id);

create index if not exists attendee_board_replies_account_idx
on public.attendee_board_replies (account_id);

update public.attendee_board_posts p
set account_id = profile_match.id
from (
  select p2.id as post_id, p3.id
  from public.attendee_board_posts p2
  join auth.users u on lower(u.email) = lower(p2.email)
  join public.profiles p3 on p3.id = u.id
) as profile_match
where p.id = profile_match.post_id
  and p.account_id is null;

update public.attendee_board_replies r
set account_id = profile_match.id
from (
  select r2.id as reply_id, p3.id
  from public.attendee_board_replies r2
  join auth.users u on lower(u.email) = lower(r2.email)
  join public.profiles p3 on p3.id = u.id
) as profile_match
where r.id = profile_match.reply_id
  and r.account_id is null;

drop function if exists public.create_attendee_board_post(text, text, text, text);
create or replace function public.create_attendee_board_post(
  p_full_name text,
  p_email text,
  p_organization text default null,
  p_body text default null,
  p_room text default 'Community Lounge'
)
returns public.attendee_board_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_post public.attendee_board_posts%rowtype;
  normalized_room text;
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

  insert into public.attendee_board_posts (
    account_id,
    room,
    full_name,
    email,
    organization,
    body
  ) values (
    auth.uid(),
    normalized_room,
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_organization, '')), ''),
    trim(coalesce(p_body, ''))
  )
  returning *
  into inserted_post;

  return inserted_post;
end;
$$;

drop function if exists public.create_attendee_board_post_with_token(text, text, text, text, text);
create or replace function public.create_attendee_board_post_with_token(
  p_full_name text,
  p_email text,
  p_organization text default null,
  p_body text default null,
  p_author_token text default null,
  p_room text default 'Community Lounge'
)
returns public.attendee_board_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_post public.attendee_board_posts%rowtype;
  normalized_room text;
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

  insert into public.attendee_board_posts (
    account_id,
    room,
    full_name,
    email,
    organization,
    body,
    author_token
  ) values (
    auth.uid(),
    normalized_room,
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_organization, '')), ''),
    trim(coalesce(p_body, '')),
    nullif(trim(coalesce(p_author_token, '')), '')
  )
  returning *
  into inserted_post;

  return inserted_post;
end;
$$;

drop function if exists public.update_attendee_board_post(uuid, text, text);
create or replace function public.update_attendee_board_post(
  p_post_id uuid,
  p_body text,
  p_author_token text,
  p_room text default null
)
returns public.attendee_board_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_post public.attendee_board_posts%rowtype;
  normalized_room text;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  if trim(coalesce(p_body, '')) = '' then
    raise exception 'Post cannot be empty.';
  end if;

  normalized_room := nullif(trim(regexp_replace(coalesce(p_room, ''), '\s+', ' ', 'g')), '');

  update public.attendee_board_posts
  set
    room = coalesce(normalized_room, room),
    body = trim(p_body),
    updated_at = timezone('utc', now())
  where id = p_post_id
    and (
      account_id = auth.uid()
      or author_token = nullif(trim(coalesce(p_author_token, '')), '')
    )
  returning *
  into updated_post;

  if updated_post.id is null then
    raise exception 'You can only edit posts from your own attendee account or original browser.';
  end if;

  return updated_post;
end;
$$;

drop function if exists public.create_attendee_board_reply(uuid, text, text, text, text, text);
create or replace function public.create_attendee_board_reply(
  p_post_id uuid,
  p_full_name text,
  p_email text,
  p_organization text default null,
  p_body text default null,
  p_author_token text default null
)
returns public.attendee_board_replies
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_reply public.attendee_board_replies%rowtype;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  if not exists (
    select 1
    from public.attendee_board_posts
    where id = p_post_id
      and published = true
  ) then
    raise exception 'This post could not be found.';
  end if;

  if trim(coalesce(p_body, '')) = '' then
    raise exception 'Reply cannot be empty.';
  end if;

  insert into public.attendee_board_replies (
    account_id,
    post_id,
    full_name,
    email,
    organization,
    body,
    updated_at,
    author_token
  ) values (
    auth.uid(),
    p_post_id,
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_organization, '')), ''),
    trim(coalesce(p_body, '')),
    timezone('utc', now()),
    nullif(trim(coalesce(p_author_token, '')), '')
  )
  returning *
  into inserted_reply;

  return inserted_reply;
end;
$$;

drop function if exists public.update_attendee_board_reply(uuid, text, text);
create or replace function public.update_attendee_board_reply(
  p_reply_id uuid,
  p_body text,
  p_author_token text
)
returns public.attendee_board_replies
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_reply public.attendee_board_replies%rowtype;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  if trim(coalesce(p_body, '')) = '' then
    raise exception 'Reply cannot be empty.';
  end if;

  update public.attendee_board_replies
  set
    body = trim(p_body),
    updated_at = timezone('utc', now())
  where id = p_reply_id
    and (
      account_id = auth.uid()
      or author_token = nullif(trim(coalesce(p_author_token, '')), '')
    )
  returning *
  into updated_reply;

  if updated_reply.id is null then
    raise exception 'You can only edit replies from your own attendee account or original browser.';
  end if;

  return updated_reply;
end;
$$;

create or replace function public.delete_attendee_board_post(
  p_post_id uuid,
  p_author_token text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_id uuid;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  delete from public.attendee_board_posts
  where id = p_post_id
    and (
      account_id = auth.uid()
      or author_token = nullif(trim(coalesce(p_author_token, '')), '')
    )
  returning id into deleted_id;

  if deleted_id is null then
    raise exception 'You can only delete posts from your own attendee account or original browser.';
  end if;

  return true;
end;
$$;

create or replace function public.delete_attendee_board_reply(
  p_reply_id uuid,
  p_author_token text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_id uuid;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  delete from public.attendee_board_replies
  where id = p_reply_id
    and (
      account_id = auth.uid()
      or author_token = nullif(trim(coalesce(p_author_token, '')), '')
    )
  returning id into deleted_id;

  if deleted_id is null then
    raise exception 'You can only delete replies from your own attendee account or original browser.';
  end if;

  return true;
end;
$$;

grant execute on function public.create_attendee_board_post(text, text, text, text, text) to authenticated;
grant execute on function public.create_attendee_board_post_with_token(text, text, text, text, text, text) to authenticated;
grant execute on function public.update_attendee_board_post(uuid, text, text, text) to authenticated;
grant execute on function public.create_attendee_board_reply(uuid, text, text, text, text, text) to authenticated;
grant execute on function public.update_attendee_board_reply(uuid, text, text) to authenticated;
grant execute on function public.delete_attendee_board_post(uuid, text) to authenticated;
grant execute on function public.delete_attendee_board_reply(uuid, text) to authenticated;
