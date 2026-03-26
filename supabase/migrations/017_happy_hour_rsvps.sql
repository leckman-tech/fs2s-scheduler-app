do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'happy_hour_rsvp_group'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.happy_hour_rsvp_group as enum ('conference_attendee', 'staff');
  end if;
end $$;

create table if not exists public.happy_hour_rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  organization text,
  rsvp_group public.happy_hour_rsvp_group not null,
  status public.session_signup_status not null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists happy_hour_rsvps_email_idx
on public.happy_hour_rsvps (lower(email));

create index if not exists happy_hour_rsvps_group_status_idx
on public.happy_hour_rsvps (rsvp_group, status, created_at);

create or replace function public.create_happy_hour_rsvp(
  p_full_name text,
  p_email text,
  p_phone text,
  p_organization text default null,
  p_rsvp_group public.happy_hour_rsvp_group default 'conference_attendee'
)
returns public.happy_hour_rsvps
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_signup public.happy_hour_rsvps%rowtype;
  confirmed_total integer;
  confirmed_staff integer;
  next_status public.session_signup_status;
begin
  perform pg_advisory_xact_lock(hashtext('happy_hour_rsvps'));

  if exists (
    select 1
    from public.happy_hour_rsvps
    where lower(email) = lower(trim(p_email))
  ) then
    raise exception 'This email is already on the Happy Hour list.';
  end if;

  select count(*)
  into confirmed_total
  from public.happy_hour_rsvps
  where status = 'confirmed';

  select count(*)
  into confirmed_staff
  from public.happy_hour_rsvps
  where status = 'confirmed'
    and rsvp_group = 'staff';

  if confirmed_total >= 150 then
    next_status := 'waitlist';
  elsif p_rsvp_group = 'staff' and confirmed_staff >= 35 then
    next_status := 'waitlist';
  else
    next_status := 'confirmed';
  end if;

  insert into public.happy_hour_rsvps (
    full_name,
    email,
    phone,
    organization,
    rsvp_group,
    status
  ) values (
    trim(p_full_name),
    lower(trim(p_email)),
    trim(p_phone),
    nullif(trim(coalesce(p_organization, '')), ''),
    p_rsvp_group,
    next_status
  )
  returning *
  into inserted_signup;

  return inserted_signup;
end;
$$;

create or replace function public.get_public_happy_hour_rsvp_summary()
returns table (
  confirmed_count bigint,
  waitlist_count bigint,
  confirmed_attendee_count bigint,
  waitlist_attendee_count bigint,
  confirmed_staff_count bigint,
  waitlist_staff_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*) filter (where status = 'confirmed')::bigint as confirmed_count,
    count(*) filter (where status = 'waitlist')::bigint as waitlist_count,
    count(*) filter (where status = 'confirmed' and rsvp_group = 'conference_attendee')::bigint as confirmed_attendee_count,
    count(*) filter (where status = 'waitlist' and rsvp_group = 'conference_attendee')::bigint as waitlist_attendee_count,
    count(*) filter (where status = 'confirmed' and rsvp_group = 'staff')::bigint as confirmed_staff_count,
    count(*) filter (where status = 'waitlist' and rsvp_group = 'staff')::bigint as waitlist_staff_count
  from public.happy_hour_rsvps;
$$;

alter table public.happy_hour_rsvps enable row level security;

drop policy if exists "Anyone can create Happy Hour RSVPs" on public.happy_hour_rsvps;
create policy "Anyone can create Happy Hour RSVPs"
on public.happy_hour_rsvps
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can review Happy Hour RSVPs" on public.happy_hour_rsvps;
create policy "Admins can review Happy Hour RSVPs"
on public.happy_hour_rsvps
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Admins manage Happy Hour RSVPs" on public.happy_hour_rsvps;
create policy "Admins manage Happy Hour RSVPs"
on public.happy_hour_rsvps
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

update public.sessions
set
  short_description = 'Open bar, light food, and informal networking at the National Union Building Speakeasy. Separate RSVP options are available for conference attendees and invited MAS/SFF staff.',
  description = 'Join the From Silos to Solutions Happy Hour at the National Union Building Speakeasy. Light food and an open bar will be provided. Conference attendees and invited MAS/SFF staff should RSVP in advance through the Happy Hour RSVP page. Planning is centered on 125 guests, with room to stretch to 150 total attendees and up to 35 MAS/SFF staff RSVPs.',
  live_updates = 'Use the Happy Hour RSVP page to reserve your place or join the waitlist.'
where session_code = 'd1s13';
