insert into public.speakers (slug, name, organization)
values ('naike-savain', 'Naïké Savain', 'Washington, D.C.-based advocate')
on conflict (slug) do update
set
  name = excluded.name,
  organization = excluded.organization;

update public.speakers
set title = 'Movement builder and advocate'
where slug = 'naike-savain';

update public.sessions
set
  starts_at = '2026-04-02T10:30:00-04:00',
  ends_at = '2026-04-02T10:35:00-04:00',
  title = 'Coffee Break',
  short_description = 'Short break between programming blocks.',
  description = 'Short break between programming blocks.'
where session_code = 'd2s4';

update public.sessions
set
  starts_at = '2026-04-02T10:35:00-04:00',
  ends_at = '2026-04-02T12:00:00-04:00'
where session_code = 'd2s5';

update public.sessions
set
  starts_at = '2026-04-02T12:00:00-04:00',
  ends_at = '2026-04-02T13:00:00-04:00'
where session_code = 'd2s6';

update public.sessions
set
  starts_at = '2026-04-02T13:00:00-04:00',
  ends_at = '2026-04-02T14:30:00-04:00'
where session_code in ('d2wE', 'd2wF', 'd2wG');

update public.sessions
set
  starts_at = '2026-04-02T14:30:00-04:00',
  ends_at = '2026-04-02T14:35:00-04:00',
  title = 'Coffee Break',
  short_description = 'Short break between programming blocks.',
  description = 'Short break between programming blocks.'
where session_code = 'd2s10';

update public.sessions
set
  starts_at = '2026-04-02T14:35:00-04:00',
  ends_at = '2026-04-02T15:50:00-04:00'
where session_code in ('d2wJ', 'd2wK', 'd2wL');

update public.sessions
set
  starts_at = '2026-04-02T15:50:00-04:00',
  ends_at = '2026-04-02T16:00:00-04:00',
  venue = 'National Union Building, Washington, D.C.',
  room = 'Sixth Floor North and South',
  title = 'Closing Announcements & Friday Preview',
  slug = 'closing-announcements-friday-preview',
  short_description = 'Brief closing announcements and Friday logistics before the dinner break.',
  description = 'Attendees will reconvene briefly for closing announcements and Friday logistics before ending promptly at 4:00 PM for the dinner break ahead of the evening bus tour.'
where session_code = 'd2s15';

update public.sessions
set
  starts_at = '2026-04-02T16:00:00-04:00',
  ends_at = '2026-04-02T18:00:00-04:00'
where session_code = 'd2s15b';

update public.sessions
set
  starts_at = '2026-04-03T09:30:00-04:00',
  ends_at = '2026-04-03T12:15:00-04:00',
  short_description = 'Optional private tour of one of our secure sites in Washington, D.C., with departure beginning at 9:30 AM.',
  description = 'An optional limited excursion offering a private tour of one of our secure sites in Washington, D.C. Confirmed participants should arrive by 9:30 AM for departure to the sites and will return in time for lunch. This experience reflects our work as the exclusive provider for incarcerated education in the city. Space is limited to the first 10 attendees who sign up, and confirmed participants will receive follow-up logistics directly.'
where session_code = 'd3s2b';

update public.sessions
set
  starts_at = '2026-04-03T11:10:00-04:00',
  ends_at = '2026-04-03T12:15:00-04:00',
  title = 'Fireside Chat and Guided Reflection with CEO Dr. Clarisse Mendoza-Davis',
  slug = 'fireside-chat-guided-reflection-dr-clarisse-mendoza-davis',
  short_description = 'A combined fireside chat and guided reflection led by CEO Dr. Clarisse Mendoza-Davis to formally close the convening.',
  description = 'CEO Dr. Clarisse Mendoza-Davis will lead a combined fireside chat and guided reflection to formally close the convening, bringing the conversation back to the partnership, leadership, and accountability themes that shaped the week.'
where session_code = 'd3s5';

update public.sessions
set
  starts_at = '2026-04-03T12:15:00-04:00',
  ends_at = '2026-04-03T13:15:00-04:00',
  title = 'Community Lunch',
  slug = 'community-lunch',
  category = 'lunch',
  room = 'Cafeteria',
  short_description = 'Shared lunch for attendees following the convening close.',
  description = 'Lunch will be served following the closing fireside chat and guided reflection.'
where session_code = 'd3s6';

update public.sessions
set
  starts_at = '2026-04-03T13:15:00-04:00',
  ends_at = '2026-04-03T13:45:00-04:00',
  title = 'Small Group Tours of the High School Campus',
  slug = 'small-group-tours-of-the-high-school-campus',
  category = 'special_event',
  room = 'High School Campus',
  short_description = 'Small group tours of the high school campus.',
  description = 'Attendees will have an opportunity to join small group tours of the high school campus before reconvening in the PAC.'
where session_code = 'd3s7';

update public.sessions
set
  starts_at = '2026-04-03T13:45:00-04:00',
  ends_at = '2026-04-03T14:00:00-04:00',
  title = 'Transition Back to the Performing Arts Center (PAC)',
  slug = 'transition-back-to-the-performing-arts-center-pac',
  room = 'Campus Transition to PAC',
  short_description = 'Transition back to the PAC for the closing celebration.',
  description = 'Attendees will transition back to the Performing Arts Center before the Dr. Maya Angelou celebration begins at 2:00 PM.'
where session_code = 'd3s8';

update public.portal_documents
set session_id = null
where session_id = (
  select id
  from public.sessions
  where session_code = 'd2wI'
  limit 1
);

delete from public.sessions
where session_code = 'd2wI';

delete from public.session_speakers
where session_id = (
  select id
  from public.sessions
  where session_code = 'd1wB'
  limit 1
)
and speaker_id = (
  select id
  from public.speakers
  where slug = 'naike-savain'
  limit 1
);

insert into public.session_speakers (session_id, speaker_id, session_role)
select sessions.id, speakers.id, 'workshop_presenter'
from public.sessions as sessions
join public.speakers as speakers on speakers.slug = 'naike-savain'
where sessions.session_code = 'd1wB';

delete from public.session_speakers
where session_id = (
  select id
  from public.sessions
  where session_code = 'd3s5'
  limit 1
);

insert into public.session_speakers (session_id, speaker_id, session_role)
select sessions.id, speakers.id, 'speaker'
from public.sessions as sessions
join public.speakers as speakers on speakers.slug = 'dr-clarisse-mendoza-davis'
where sessions.session_code = 'd3s5';
