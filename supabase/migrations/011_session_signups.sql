create type public.session_signup_status as enum ('confirmed', 'waitlist');

alter type public.session_signup_status owner to postgres;

alter table public.sessions
  add column if not exists signup_enabled boolean not null default false,
  add column if not exists signup_capacity integer,
  add column if not exists signup_instructions text;

alter table public.sessions
  drop constraint if exists sessions_signup_capacity_check;

alter table public.sessions
  add constraint sessions_signup_capacity_check
  check (signup_capacity is null or signup_capacity > 0);

create table if not exists public.session_signups (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  organization text,
  status public.session_signup_status not null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists session_signups_session_email_idx
on public.session_signups (session_id, lower(email));

create index if not exists session_signups_session_status_idx
on public.session_signups (session_id, status, created_at);

create or replace function public.create_session_signup(
  p_session_id uuid,
  p_full_name text,
  p_email text,
  p_phone text default null,
  p_organization text default null
)
returns public.session_signups
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_session public.sessions%rowtype;
  confirmed_count integer;
  next_status public.session_signup_status;
  inserted_signup public.session_signups%rowtype;
begin
  select *
  into selected_session
  from public.sessions
  where id = p_session_id
    and published = true
  for update;

  if not found then
    raise exception 'This event could not be found.';
  end if;

  if not selected_session.signup_enabled then
    raise exception 'Sign-ups are not enabled for this event.';
  end if;

  if exists (
    select 1
    from public.session_signups
    where session_id = p_session_id
      and lower(email) = lower(trim(p_email))
  ) then
    raise exception 'This email is already signed up for this event.';
  end if;

  select count(*)
  into confirmed_count
  from public.session_signups
  where session_id = p_session_id
    and status = 'confirmed';

  if selected_session.signup_capacity is not null
    and confirmed_count >= selected_session.signup_capacity then
    next_status := 'waitlist';
  else
    next_status := 'confirmed';
  end if;

  insert into public.session_signups (
    session_id,
    full_name,
    email,
    phone,
    organization,
    status
  ) values (
    p_session_id,
    trim(p_full_name),
    trim(p_email),
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_organization, '')), ''),
    next_status
  )
  returning *
  into inserted_signup;

  return inserted_signup;
end;
$$;

create or replace function public.get_public_session_signup_summary(check_session uuid)
returns table (
  signup_enabled boolean,
  signup_capacity integer,
  signup_instructions text,
  confirmed_count bigint,
  waitlist_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.signup_enabled,
    s.signup_capacity,
    s.signup_instructions,
    count(ss.id) filter (where ss.status = 'confirmed') as confirmed_count,
    count(ss.id) filter (where ss.status = 'waitlist') as waitlist_count
  from public.sessions s
  left join public.session_signups ss
    on ss.session_id = s.id
  where s.id = check_session
    and s.published = true
  group by s.signup_enabled, s.signup_capacity, s.signup_instructions;
$$;

alter table public.session_signups enable row level security;

drop policy if exists "Anyone can sign up for enabled sessions" on public.session_signups;
create policy "Anyone can sign up for enabled sessions"
on public.session_signups
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.sessions
    where id = session_id
      and published = true
      and signup_enabled = true
  )
);

drop policy if exists "Admins can review session signups" on public.session_signups;
create policy "Admins can review session signups"
on public.session_signups
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Admins manage session signups" on public.session_signups;
create policy "Admins manage session signups"
on public.session_signups
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

update public.sessions
set
  signup_enabled = true,
  signup_capacity = 50,
  signup_instructions = 'Save your spot for the Big Bus sunset tour here. Phone number is optional, but helpful if the conference team needs to send a text update. The first 50 sign-ups will be confirmed and any additional sign-ups will be placed on the waitlist.'
where session_code = 'd2s16';
