create table if not exists public.attendee_board_posts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  organization text,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  author_token text
);

alter table public.attendee_board_posts
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table public.attendee_board_posts
  add column if not exists author_token text;

update public.attendee_board_posts
set updated_at = coalesce(updated_at, created_at, timezone('utc', now()))
where updated_at is null;

create table if not exists public.attendee_directory_entries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  title text,
  organization text,
  share_with_attendees boolean not null default false,
  share_with_planners boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.attendee_board_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.attendee_board_posts (id) on delete cascade,
  full_name text not null,
  email text not null,
  organization text,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  author_token text
);

create table if not exists public.attendee_board_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.attendee_board_posts (id) on delete cascade,
  viewer_token text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (post_id, viewer_token)
);

create index if not exists attendee_board_posts_published_idx
on public.attendee_board_posts (published, created_at desc);

create index if not exists attendee_board_posts_author_token_idx
on public.attendee_board_posts (author_token);

create index if not exists attendee_directory_entries_visibility_idx
on public.attendee_directory_entries (share_with_attendees, share_with_planners, full_name);

create index if not exists attendee_board_replies_post_idx
on public.attendee_board_replies (post_id, created_at asc);

create index if not exists attendee_board_replies_author_token_idx
on public.attendee_board_replies (author_token);

create index if not exists attendee_board_likes_post_idx
on public.attendee_board_likes (post_id, created_at desc);

create or replace function public.create_attendee_board_post(
  p_full_name text,
  p_email text,
  p_organization text default null,
  p_body text default null
)
returns public.attendee_board_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_post public.attendee_board_posts%rowtype;
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
    raise exception 'Message cannot be empty.';
  end if;

  insert into public.attendee_board_posts (
    full_name,
    email,
    organization,
    body,
    updated_at
  ) values (
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_organization, '')), ''),
    trim(coalesce(p_body, '')),
    timezone('utc', now())
  )
  returning *
  into inserted_post;

  return inserted_post;
end;
$$;

create or replace function public.create_attendee_board_post_with_token(
  p_full_name text,
  p_email text,
  p_organization text default null,
  p_body text default null,
  p_author_token text default null
)
returns public.attendee_board_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_post public.attendee_board_posts%rowtype;
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
    raise exception 'Message cannot be empty.';
  end if;

  insert into public.attendee_board_posts (
    full_name,
    email,
    organization,
    body,
    updated_at,
    author_token
  ) values (
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_organization, '')), ''),
    trim(coalesce(p_body, '')),
    timezone('utc', now()),
    nullif(trim(coalesce(p_author_token, '')), '')
  )
  returning *
  into inserted_post;

  return inserted_post;
end;
$$;

create or replace function public.update_attendee_board_post(
  p_post_id uuid,
  p_body text,
  p_author_token text
)
returns public.attendee_board_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_post public.attendee_board_posts%rowtype;
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
    raise exception 'Message cannot be empty.';
  end if;

  update public.attendee_board_posts
  set
    body = trim(p_body),
    updated_at = timezone('utc', now())
  where id = p_post_id
    and author_token = nullif(trim(coalesce(p_author_token, '')), '')
  returning *
  into updated_post;

  if updated_post.id is null then
    raise exception 'You can only edit posts from the same browser used to publish them.';
  end if;

  return updated_post;
end;
$$;

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
    post_id,
    full_name,
    email,
    organization,
    body,
    updated_at,
    author_token
  ) values (
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
    and author_token = nullif(trim(coalesce(p_author_token, '')), '')
  returning *
  into updated_reply;

  if updated_reply.id is null then
    raise exception 'You can only edit replies from the same browser used to publish them.';
  end if;

  return updated_reply;
end;
$$;

create or replace function public.toggle_attendee_board_like(
  p_post_id uuid,
  p_viewer_token text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_token text;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  normalized_token := nullif(trim(coalesce(p_viewer_token, '')), '');

  if normalized_token is null then
    raise exception 'A browser token is required to like posts.';
  end if;

  if exists (
    select 1
    from public.attendee_board_likes
    where post_id = p_post_id
      and viewer_token = normalized_token
  ) then
    delete from public.attendee_board_likes
    where post_id = p_post_id
      and viewer_token = normalized_token;

    return false;
  end if;

  insert into public.attendee_board_likes (post_id, viewer_token)
  values (p_post_id, normalized_token)
  on conflict (post_id, viewer_token) do nothing;

  return true;
end;
$$;

create or replace function public.upsert_attendee_directory_entry(
  p_full_name text,
  p_email text,
  p_phone text default null,
  p_title text default null,
  p_organization text default null,
  p_share_with_attendees boolean default false,
  p_share_with_planners boolean default true
)
returns public.attendee_directory_entries
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_entry public.attendee_directory_entries%rowtype;
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  ) then
    raise exception 'This login does not include attendee portal access.';
  end if;

  if not p_share_with_attendees and not p_share_with_planners then
    raise exception 'Choose at least one sharing option.';
  end if;

  insert into public.attendee_directory_entries (
    full_name,
    email,
    phone,
    title,
    organization,
    share_with_attendees,
    share_with_planners,
    updated_at
  ) values (
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_title, '')), ''),
    nullif(trim(coalesce(p_organization, '')), ''),
    p_share_with_attendees,
    p_share_with_planners,
    timezone('utc', now())
  )
  on conflict (email) do update
    set
      full_name = excluded.full_name,
      phone = excluded.phone,
      title = excluded.title,
      organization = excluded.organization,
      share_with_attendees = excluded.share_with_attendees,
      share_with_planners = excluded.share_with_planners,
      updated_at = timezone('utc', now())
  returning *
  into saved_entry;

  return saved_entry;
end;
$$;

alter table public.attendee_board_posts enable row level security;
alter table public.attendee_directory_entries enable row level security;
alter table public.attendee_board_replies enable row level security;
alter table public.attendee_board_likes enable row level security;

drop policy if exists "Attendees can view attendee board posts" on public.attendee_board_posts;
create policy "Attendees can view attendee board posts"
on public.attendee_board_posts
for select
to authenticated
using (
  (
    published = true
    and exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('attendee', 'admin')
    )
  )
  or public.is_admin(auth.uid())
);

drop policy if exists "Admins manage attendee board posts" on public.attendee_board_posts;
create policy "Admins manage attendee board posts"
on public.attendee_board_posts
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Attendees can view attendee board replies" on public.attendee_board_replies;
create policy "Attendees can view attendee board replies"
on public.attendee_board_replies
for select
to authenticated
using (
  (
    published = true
    and exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('attendee', 'admin')
    )
  )
  or public.is_admin(auth.uid())
);

drop policy if exists "Admins manage attendee board replies" on public.attendee_board_replies;
create policy "Admins manage attendee board replies"
on public.attendee_board_replies
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Attendees can view attendee board likes" on public.attendee_board_likes;
create policy "Attendees can view attendee board likes"
on public.attendee_board_likes
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('attendee', 'admin')
  )
  or public.is_admin(auth.uid())
);

drop policy if exists "Admins manage attendee board likes" on public.attendee_board_likes;
create policy "Admins manage attendee board likes"
on public.attendee_board_likes
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Attendees can view attendee directory entries" on public.attendee_directory_entries;
create policy "Attendees can view attendee directory entries"
on public.attendee_directory_entries
for select
to authenticated
using (
  (
    share_with_attendees = true
    and exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('attendee', 'admin')
    )
  )
  or public.is_admin(auth.uid())
);

drop policy if exists "Admins manage attendee directory entries" on public.attendee_directory_entries;
create policy "Admins manage attendee directory entries"
on public.attendee_directory_entries
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
