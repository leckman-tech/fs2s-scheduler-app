create table if not exists public.attendee_board_posts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  organization text,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

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

create index if not exists attendee_board_posts_published_idx
on public.attendee_board_posts (published, created_at desc);

create index if not exists attendee_directory_entries_visibility_idx
on public.attendee_directory_entries (share_with_attendees, share_with_planners, full_name);

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

  insert into public.attendee_board_posts (
    full_name,
    email,
    organization,
    body
  ) values (
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
