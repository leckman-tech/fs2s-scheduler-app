create extension if not exists pgcrypto;

create type public.user_role as enum (
  'attendee',
  'speaker',
  'panelist',
  'workshop_presenter',
  'exhibitor',
  'admin'
);

create type public.session_category as enum (
  'breakfast',
  'opening_session',
  'keynote',
  'break',
  'workshop',
  'lunch',
  'special_event',
  'staff_event',
  'scholar_session',
  'transition',
  'evening_event',
  'panel',
  'closing_session',
  'fireside_chat',
  'reception'
);

create type public.session_status as enum (
  'scheduled',
  'moved',
  'delayed',
  'full',
  'cancelled',
  'completed'
);

create type public.announcement_priority as enum ('normal', 'urgent');
create type public.participant_role as enum ('speaker', 'panelist', 'workshop_presenter', 'exhibitor');
create type public.confirmation_status as enum (
  'confirmed',
  'pending',
  'unconfirmed',
  'awaiting_invitation',
  'to_be_announced'
);

create table if not exists public.speakers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  title text,
  organization text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'attendee',
  full_name text,
  speaker_id uuid references public.speakers (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  session_code text,
  placeholder_code text,
  final_title text,
  title text not null,
  slug text not null unique,
  category public.session_category not null,
  date date not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text not null,
  room text not null,
  short_description text not null,
  description text not null,
  live_updates text,
  status public.session_status not null default 'scheduled',
  published boolean not null default true,
  featured boolean not null default false,
  is_placeholder boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists sessions_session_code_idx
on public.sessions (session_code)
where session_code is not null;

create table if not exists public.session_speakers (
  session_id uuid not null references public.sessions (id) on delete cascade,
  speaker_id uuid not null references public.speakers (id) on delete cascade,
  session_role public.participant_role not null default 'speaker',
  primary key (session_id, speaker_id)
);

create table if not exists public.session_speaker_logistics (
  session_id uuid not null,
  speaker_id uuid not null,
  confirmation_status public.confirmation_status not null default 'confirmed',
  arrival_time timestamptz,
  av_needs text,
  staff_contact text,
  private_logistics_note text,
  primary key (session_id, speaker_id),
  foreign key (session_id, speaker_id)
    references public.session_speakers (session_id, speaker_id)
    on delete cascade
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  priority public.announcement_priority not null default 'normal',
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  most_useful text not null,
  improvements text not null,
  attend_future boolean not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists sessions_date_idx on public.sessions (date, starts_at);
create index if not exists sessions_published_idx on public.sessions (published, starts_at);
create index if not exists speakers_slug_idx on public.speakers (slug);
create index if not exists announcements_published_idx on public.announcements (published, created_at desc);
create index if not exists feedback_session_idx on public.feedback (session_id, created_at desc);
create index if not exists session_speakers_speaker_idx on public.session_speakers (speaker_id, session_id);
create index if not exists session_speaker_logistics_speaker_idx on public.session_speaker_logistics (speaker_id, session_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists sessions_set_updated_at on public.sessions;
create trigger sessions_set_updated_at
before update on public.sessions
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create or replace function public.is_admin(check_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user
      and role = 'admin'
  );
$$;

create or replace function public.is_linked_speaker(check_user uuid, check_speaker uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user
      and speaker_id = check_speaker
  );
$$;

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.speakers enable row level security;
alter table public.session_speakers enable row level security;
alter table public.session_speaker_logistics enable row level security;
alter table public.announcements enable row level security;
alter table public.feedback enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Public can view published sessions" on public.sessions;
create policy "Public can view published sessions"
on public.sessions
for select
using (published = true or public.is_admin(auth.uid()));

drop policy if exists "Admins manage sessions" on public.sessions;
create policy "Admins manage sessions"
on public.sessions
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Public can view speakers" on public.speakers;
create policy "Public can view speakers"
on public.speakers
for select
using (true);

drop policy if exists "Admins manage speakers" on public.speakers;
create policy "Admins manage speakers"
on public.speakers
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Public can view session speaker links" on public.session_speakers;
create policy "Public can view session speaker links"
on public.session_speakers
for select
using (true);

drop policy if exists "Admins manage session speaker links" on public.session_speakers;
create policy "Admins manage session speaker links"
on public.session_speakers
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins and assigned speakers can view logistics" on public.session_speaker_logistics;
create policy "Admins and assigned speakers can view logistics"
on public.session_speaker_logistics
for select
using (public.is_admin(auth.uid()) or public.is_linked_speaker(auth.uid(), speaker_id));

drop policy if exists "Admins manage logistics" on public.session_speaker_logistics;
create policy "Admins manage logistics"
on public.session_speaker_logistics
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Public can view published announcements" on public.announcements;
create policy "Public can view published announcements"
on public.announcements
for select
using (published = true or public.is_admin(auth.uid()));

drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Admins manage announcements"
on public.announcements
for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
on public.feedback
for insert
with check (true);

drop policy if exists "Admins can review feedback" on public.feedback;
create policy "Admins can review feedback"
on public.feedback
for select
using (public.is_admin(auth.uid()));
