update public.sessions
set
  title = 'Closing Reflection & Friday Preview (via Zoom)',
  slug = 'closing-reflection-friday-preview-via-zoom',
  category = 'closing_session',
  starts_at = '2026-04-02T16:00:00-04:00',
  ends_at = '2026-04-02T16:15:00-04:00',
  venue = 'Via Zoom',
  room = 'Zoom Breakout Rooms',
  short_description = 'Short closing reflection and Friday logistics update delivered via Zoom from breakout rooms.',
  description = 'Attendees will close Day Two and receive Friday logistics updates via Zoom from their breakout rooms so everyone can transition off the fifth and sixth floors by 4:00 PM.',
  featured = false
where session_code = 'd2s15';

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
  'd2s15b',
  null,
  null,
  'Dinner Break',
  'dinner-break',
  'break',
  '2026-04-02',
  '2026-04-02T16:15:00-04:00',
  '2026-04-02T18:00:00-04:00',
  'Downtown Washington, D.C.',
  'On Your Own',
  'Dinner break before the evening Big Bus tour.',
  'Attendees will have time for dinner before the evening Big Bus tour begins.',
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

update public.sessions
set
  title = 'Big Bus Sunset Tour of Washington',
  slug = 'big-bus-sunset-tour-of-washington',
  category = 'evening_event',
  starts_at = '2026-04-02T18:00:00-04:00',
  ends_at = '2026-04-02T20:30:00-04:00',
  venue = 'Washington, D.C.',
  room = 'Meet Outside N.U.B.',
  short_description = 'Big Bus tour featuring cherry blossoms and Washington monuments at sunset.',
  description = 'This evening Big Bus tour will feature the cherry blossoms and Washington monuments at sunset. It is open to all conference attendees, staff, and volunteers, with space reserved for the first 50 people who sign up at registration on Wednesday morning or on Thursday if spots remain.',
  featured = true
where session_code = 'd2s16';

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
      signup_capacity = 50,
      signup_instructions = 'Save your spot for the Big Bus sunset tour here. Phone number is optional, but helpful if the conference team needs to send a text update. The first 50 sign-ups will be confirmed and any additional sign-ups will be placed on the waitlist.'
    where session_code = 'd2s16';
  end if;
end $$;
