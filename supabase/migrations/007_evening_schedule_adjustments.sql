delete from public.sessions
where session_code = 'd3s10';

update public.sessions
set
  title = 'From Silos to Solutions: A Happy Hour',
  slug = 'from-silos-to-solutions-a-happy-hour',
  category = 'reception',
  date = '2026-04-01',
  starts_at = '2026-04-01T17:30:00-04:00',
  ends_at = '2026-04-01T20:00:00-04:00',
  venue = 'National Union Building',
  room = 'National Union Building Speakeasy',
  short_description = 'Light food, drinks, and informal networking for attendees, panelists, presenters, and conference staff.',
  description = 'Light food and drinks will be provided. This reception is open to all attendees, panelists, presenters, and conference staff.',
  featured = true
where session_code = 'd1s13';

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
  'd2s16',
  null,
  null,
  'Evening Activities',
  'evening-activities',
  'evening_event',
  '2026-04-02',
  '2026-04-02T18:00:00-04:00',
  '2026-04-02T20:30:00-04:00',
  'National Union Building, Washington, D.C.',
  'Meet Outside N.U.B.',
  'Evening convening activities for attendees and guests.',
  'Evening convening activities for attendees and guests.',
  null,
  'scheduled',
  true,
  true,
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
