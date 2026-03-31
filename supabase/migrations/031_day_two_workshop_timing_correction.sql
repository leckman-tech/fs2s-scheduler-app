update public.sessions
set
  starts_at = '2026-04-02T13:00:00-04:00',
  ends_at = '2026-04-02T14:15:00-04:00'
where session_code in ('d2wE', 'd2wF', 'd2wG');

update public.sessions
set
  starts_at = '2026-04-02T14:15:00-04:00',
  ends_at = '2026-04-02T14:20:00-04:00',
  title = 'Coffee Break',
  short_description = 'Short break between programming blocks.',
  description = 'Short break between programming blocks.'
where session_code = 'd2s10';

update public.sessions
set
  starts_at = '2026-04-02T14:20:00-04:00',
  ends_at = '2026-04-02T15:35:00-04:00'
where session_code in ('d2wJ', 'd2wK', 'd2wL');

update public.sessions
set
  starts_at = '2026-04-02T15:35:00-04:00',
  ends_at = '2026-04-02T15:55:00-04:00',
  title = 'Closing Announcements & Friday Preview',
  slug = 'closing-announcements-friday-preview',
  short_description = 'Brief closing announcements and Friday logistics before the dinner break.',
  description = 'Attendees will reconvene briefly for closing announcements and Friday logistics before the dinner break begins at 3:55 PM ahead of the evening bus tour.'
where session_code = 'd2s15';

update public.sessions
set
  starts_at = '2026-04-02T15:55:00-04:00',
  ends_at = '2026-04-02T18:00:00-04:00',
  title = 'Dinner Break',
  short_description = 'Dinner break before the evening Big Bus tour.',
  description = 'Attendees will have time for dinner before the evening Big Bus tour begins at 6:00 PM.'
where session_code = 'd2s15b';
