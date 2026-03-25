update public.sessions
set
  title = 'Networking Lunch (Provided)',
  slug = 'networking-lunch-provided',
  category = 'lunch',
  starts_at = '2026-04-01T12:00:00-04:00',
  ends_at = '2026-04-01T13:30:00-04:00',
  venue = 'National Union Building',
  room = 'Main Floor, Lobby, & Second Floor North',
  short_description = 'Lunch by Spilled Milk Catering with vegetarian and non-vegetarian options, plus time to connect across the convening.',
  description = 'Lunch will be provided by Spilled Milk Catering and will include both vegetarian and non-vegetarian options. This block is designed for networking, conversation, and connection across the convening.',
  featured = false
where session_code = 'd1s9';

update public.sessions
set
  title = 'Optional Dessert Roundtable with Maya and See Forever Leadership',
  slug = 'optional-dessert-roundtable-with-maya-and-see-forever-leadership',
  category = 'special_event',
  starts_at = '2026-04-01T13:30:00-04:00',
  ends_at = '2026-04-01T14:00:00-04:00',
  venue = 'National Union Building',
  room = 'Main Floor, Lobby, & Second Floor North',
  short_description = 'Optional dessert conversation with Maya and See Forever staff, board members, and leadership.',
  description = 'An informal dessert conversation with Maya and See Forever staff, board members, and leadership for attendees who would like a smaller-group exchange after lunch.',
  featured = false
where session_code = 'd1s10';

update public.sessions
set
  title = 'Interactive Scholar Sessions with MAPCS Scholars',
  slug = 'interactive-scholar-sessions-with-mapcs-scholars',
  category = 'scholar_session',
  starts_at = '2026-04-01T14:00:00-04:00',
  ends_at = '2026-04-01T15:00:00-04:00',
  venue = 'National Union Building',
  room = 'Second Floor North & South',
  short_description = 'Interactive session featuring MAPCS scholars and conversation across the convening.',
  description = 'An interactive session featuring MAPCS scholars and creating space for conversation, reflection, and connection across the convening.',
  featured = true
where session_code = 'd1s11';

update public.sessions
set
  title = 'Day One Wrap-Up',
  slug = 'day-one-wrap-up',
  category = 'closing_session',
  starts_at = '2026-04-01T15:00:00-04:00',
  ends_at = '2026-04-01T15:30:00-04:00',
  venue = 'National Union Building',
  room = 'National Union Building',
  short_description = 'Short closing and transition before the evening reception.',
  description = 'A short closing and transition to the evening, with time for attendees to pause, reconnect, and prepare for the reception.',
  featured = false
where session_code = 'd1s12';

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
  'd1s12b',
  null,
  null,
  'Open Hour in Downtown D.C.',
  'open-hour-in-downtown-dc',
  'transition',
  '2026-04-01',
  '2026-04-01T15:30:00-04:00',
  '2026-04-01T16:30:00-04:00',
  'Downtown Washington, D.C.',
  'Downtown Washington, D.C.',
  'An open hour before the reception for attendees to recharge or explore nearby.',
  'Attendees have an hour before the evening reception. Nearby options include the National Portrait Gallery and other downtown destinations within walking distance.',
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
  title = 'From Silos to Solutions: A Happy Hour',
  slug = 'from-silos-to-solutions-a-happy-hour',
  category = 'reception',
  starts_at = '2026-04-01T16:30:00-04:00',
  ends_at = '2026-04-01T20:00:00-04:00',
  venue = 'National Union Building',
  room = 'National Union Building Speakeasy',
  short_description = 'Light food, drinks, and informal networking for attendees, panelists, presenters, and conference staff.',
  description = 'Light food and drinks will be provided. This reception is open to all attendees, panelists, presenters, and conference staff.',
  featured = true
where session_code = 'd1s13';
