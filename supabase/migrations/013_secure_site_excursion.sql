alter table public.sessions
  add column if not exists signup_deadline timestamptz;

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

  if selected_session.signup_deadline is not null
    and now() >= selected_session.signup_deadline then
    raise exception 'Sign-ups for this event are now closed.';
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

insert into public.sessions (
  session_code,
  placeholder_code,
  final_title,
  title,
  slug,
  category,
  date,
  starts_at,
  ends_at,
  venue,
  room,
  short_description,
  description,
  live_updates,
  status,
  published,
  featured,
  is_placeholder
) values (
  'd3s2b',
  null,
  null,
  'Limited Excursion: Private Tour of a Secure Site',
  'limited-excursion-private-tour-of-a-secure-site',
  'special_event',
  '2026-04-03',
  '2026-04-03T10:00:00-04:00',
  '2026-04-03T12:30:00-04:00',
  'Washington, D.C.',
  'Details shared with confirmed participants',
  'Optional private tour of one of our secure sites in Washington, D.C., available to the first 10 attendees who sign up.',
  'An optional limited excursion offering a private tour of one of our secure sites in Washington, D.C. This experience reflects our work as the exclusive provider for incarcerated education in the city. Space is limited to the first 10 attendees who sign up, and confirmed participants will receive follow-up logistics directly.',
  null,
  'scheduled',
  true,
  false,
  false
)
on conflict (slug) do update set
  session_code = excluded.session_code,
  title = excluded.title,
  category = excluded.category,
  date = excluded.date,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  venue = excluded.venue,
  room = excluded.room,
  short_description = excluded.short_description,
  description = excluded.description,
  status = excluded.status,
  published = excluded.published,
  featured = excluded.featured,
  is_placeholder = excluded.is_placeholder;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'sessions'
      and column_name = 'signup_enabled'
  ) then
    update public.sessions
    set
      signup_enabled = true,
      signup_capacity = 10,
      signup_instructions = 'Use this form to request a spot on the limited Friday excursion. Space is available to the first 10 attendees, and sign-ups close on Wednesday, April 1. Confirmed participants will receive private location details directly.',
      signup_deadline = '2026-04-01T23:59:00-04:00'
    where session_code = 'd3s2b';
  end if;
end $$;
