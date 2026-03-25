create table if not exists public.lobby_day_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  organization text,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists lobby_day_signups_email_idx
on public.lobby_day_signups (lower(email));

create or replace function public.create_lobby_day_signup(
  p_full_name text,
  p_email text,
  p_phone text,
  p_organization text default null
)
returns public.lobby_day_signups
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_signup public.lobby_day_signups%rowtype;
begin
  if exists (
    select 1
    from public.lobby_day_signups
    where lower(email) = lower(trim(p_email))
  ) then
    raise exception 'This email is already signed up for Lobby Day.';
  end if;

  insert into public.lobby_day_signups (
    full_name,
    email,
    phone,
    organization
  ) values (
    trim(p_full_name),
    trim(p_email),
    trim(p_phone),
    nullif(trim(coalesce(p_organization, '')), '')
  )
  returning *
  into inserted_signup;

  return inserted_signup;
end;
$$;

create or replace function public.get_public_lobby_day_signup_summary()
returns table (
  total_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint as total_count
  from public.lobby_day_signups;
$$;

alter table public.lobby_day_signups enable row level security;

drop policy if exists "Anyone can create Lobby Day signups" on public.lobby_day_signups;
create policy "Anyone can create Lobby Day signups"
on public.lobby_day_signups
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can review Lobby Day signups" on public.lobby_day_signups;
create policy "Admins can review Lobby Day signups"
on public.lobby_day_signups
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Admins manage Lobby Day signups" on public.lobby_day_signups;
create policy "Admins manage Lobby Day signups"
on public.lobby_day_signups
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
