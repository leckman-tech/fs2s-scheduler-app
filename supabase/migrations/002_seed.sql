insert into public.speakers (slug, name, title, organization)
values
  ('nate-balis-juvenile-justice-strategy-group', 'Nate Balis', 'Director', 'Juvenile Justice Strategy Group'),
  ('philip-copeland-dme', 'Philip Copeland', 'Director of Strategic Initiatives', 'DME'),
  ('liz-ryan-office-of-juvenile-justice-and-delinquency-prevention', 'Liz Ryan', 'Former Administrator', 'Office of Juvenile Justice and Delinquency Prevention'),
  ('michael-umpierre-georgetown-university', 'Michael Umpierre', 'Director, Center for Youth Justice at Georgetown University', 'Georgetown University'),
  ('valerie-slater-rise-for-youth', 'Valerie Slater', 'Executive Director', 'RISE for Youth'),
  ('youth-representative-maya-schools-secure', 'Youth Representative', 'Youth Representative', 'Maya Schools Secure'),
  ('youth-representative-rise-for-youth', 'Youth Representative', 'Youth Representative', 'RISE for Youth')
on conflict (slug) do update
set
  name = excluded.name,
  title = excluded.title,
  organization = excluded.organization;

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
)
values
  ('D1-01', null, null, 'Registration & Continental Breakfast', 'registration-continental-breakfast', 'breakfast', '2026-04-01', '2026-04-01T08:30:00-04:00', '2026-04-01T09:15:00-04:00', 'National Union Building', 'Lobby & Main Floor', 'Conference check in, breakfast, and informal arrival period for attendees.', 'Conference check in, breakfast, and informal arrival period for attendees.', null, 'scheduled', true, false, false),
  ('D1-02', null, null, 'Welcome Remarks & Land Acknowledgment', 'welcome-remarks-land-acknowledgment', 'opening_session', '2026-04-01', '2026-04-01T09:15:00-04:00', '2026-04-01T09:30:00-04:00', 'National Union Building', 'Sixth Floor North and South', 'Opening welcome, grounding remarks, and acknowledgment to begin the convening.', 'Opening welcome, grounding remarks, and acknowledgment to begin the convening.', null, 'scheduled', true, true, false),
  ('D1-03', null, null, 'Opening Keynote', 'opening-keynote', 'keynote', '2026-04-01', '2026-04-01T09:30:00-04:00', '2026-04-01T10:30:00-04:00', 'National Union Building', 'Sixth Floor North and South', 'Opening keynote for the convening focused on the conference theme and the urgency of partnership based action.', 'Opening keynote for the convening focused on the conference theme and the urgency of partnership based action.', null, 'scheduled', true, true, false),
  ('D1-04', null, null, 'Morning Break', 'morning-break-day-one', 'break', '2026-04-01', '2026-04-01T10:30:00-04:00', '2026-04-01T10:45:00-04:00', 'National Union Building', 'National Union Building', 'Morning transition break.', 'Morning transition break.', null, 'scheduled', true, false, false),
  ('D1-WS-A', 'A', null, 'Workshop A', 'workshop-a', 'workshop', '2026-04-01', '2026-04-01T10:45:00-04:00', '2026-04-01T12:00:00-04:00', 'National Union Building', 'Third Floor North', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D1-WS-B', 'B', null, 'Workshop B', 'workshop-b', 'workshop', '2026-04-01', '2026-04-01T10:45:00-04:00', '2026-04-01T12:00:00-04:00', 'National Union Building', 'Third Floor South', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D1-WS-C', 'C', null, 'Workshop C', 'workshop-c', 'workshop', '2026-04-01', '2026-04-01T10:45:00-04:00', '2026-04-01T12:00:00-04:00', 'National Union Building', 'Second Floor North', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D1-WS-D', 'D', null, 'Workshop D', 'workshop-d', 'workshop', '2026-04-01', '2026-04-01T10:45:00-04:00', '2026-04-01T12:00:00-04:00', 'National Union Building', 'Second Floor South', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D1-05', null, null, 'Networking Lunch with School Staff & Community Leaders', 'networking-lunch-school-staff-community-leaders', 'lunch', '2026-04-01', '2026-04-01T12:00:00-04:00', '2026-04-01T13:00:00-04:00', 'National Union Building', 'Main Floor & Lobby, and Second Floor North', 'Lunch and networking for school staff, community leaders, and convening participants.', 'Lunch and networking for school staff, community leaders, and convening participants.', null, 'scheduled', true, true, false),
  ('D1-06', null, null, 'Optional Community Leader Roundtable + Dessert', 'optional-community-leader-roundtable-dessert', 'special_event', '2026-04-01', '2026-04-01T13:00:00-04:00', '2026-04-01T13:50:00-04:00', 'National Union Building', 'Main Floor & Lobby, and Second Floor North', 'Optional roundtable conversation for community leaders with dessert.', 'Optional roundtable conversation for community leaders with dessert.', null, 'scheduled', true, false, false),
  ('D1-07', null, null, 'Conference Staff/Volunteers Special Surprise', 'conference-staff-volunteers-special-surprise', 'staff_event', '2026-04-01', '2026-04-01T14:00:00-04:00', null, 'National Union Building', 'Staff Room', 'Internal appreciation moment for conference staff and volunteers.', 'Internal appreciation moment for conference staff and volunteers.', null, 'scheduled', true, false, false),
  ('D1-08', null, null, 'Interactive Scholar Sessions with MAPCS Students', 'interactive-scholar-sessions-mapcs-students', 'scholar_session', '2026-04-01', '2026-04-01T14:00:00-04:00', '2026-04-01T15:15:00-04:00', 'National Union Building', 'Second Floor North & South', 'Interactive sessions featuring Maya Angelou Public Charter School students.', 'Interactive sessions featuring Maya Angelou Public Charter School students.', null, 'scheduled', true, true, false),
  ('D1-09', null, null, 'Light Wrap-Up / Transition to Evening', 'light-wrap-up-transition-to-evening', 'transition', '2026-04-01', '2026-04-01T15:15:00-04:00', '2026-04-01T16:00:00-04:00', 'National Union Building', 'National Union Building', 'End of day transition period. No building access after wrap up.', 'End of day transition period. No building access after wrap up.', null, 'scheduled', true, false, false),
  ('D1-10', null, null, 'Evening Activities', 'evening-activities', 'evening_event', '2026-04-01', '2026-04-01T17:30:00-04:00', '2026-04-01T20:00:00-04:00', 'National Union Building', 'Meet Outside N.U.B.', 'Evening convening activities held off site or beginning outside the National Union Building.', 'Evening convening activities held off site or beginning outside the National Union Building.', null, 'scheduled', true, true, false),

  ('D2-01', null, null, 'Arrival & Continental Breakfast', 'arrival-continental-breakfast-day-two', 'breakfast', '2026-04-02', '2026-04-02T08:30:00-04:00', '2026-04-02T09:15:00-04:00', 'National Union Building, Washington, DC', 'Lobby & Main Floor', 'Arrival period with breakfast and informal networking.', 'Arrival period with breakfast and informal networking.', null, 'scheduled', true, false, false),
  ('D2-02', null, null, 'Welcome & Day Two Overview', 'welcome-day-two-overview', 'opening_session', '2026-04-02', '2026-04-02T09:15:00-04:00', '2026-04-02T09:30:00-04:00', 'National Union Building, Washington, DC', 'Sixth Floor North and South', 'Welcome back and overview of day two.', 'Welcome back and overview of day two.', null, 'scheduled', true, false, false),
  ('D2-03', null, null, 'Morning Keynote', 'morning-keynote', 'keynote', '2026-04-02', '2026-04-02T09:30:00-04:00', '2026-04-02T10:30:00-04:00', 'National Union Building, Washington, DC', 'Sixth Floor North and South', 'Day two keynote session.', 'Day two keynote session.', null, 'scheduled', true, true, false),
  ('D2-04', null, null, 'Coffee Break', 'coffee-break-day-two', 'break', '2026-04-02', '2026-04-02T10:30:00-04:00', '2026-04-02T10:45:00-04:00', 'National Union Building, Washington, DC', 'National Union Building', 'Coffee and transition break.', 'Coffee and transition break.', null, 'scheduled', true, false, false),
  ('D2-05', null, null, 'Panel #1: Building Power Across Systems', 'panel-1-building-power-across-systems', 'panel', '2026-04-02', '2026-04-02T10:45:00-04:00', '2026-04-02T12:00:00-04:00', 'National Union Building, Washington, DC', 'Sixth Floor North and South', 'Panel conversation on building power across youth serving systems.', 'Panel conversation on building power across youth serving systems.', null, 'scheduled', true, true, false),
  ('D2-06', null, null, 'Lunch (Provided) & Networking', 'lunch-provided-networking', 'lunch', '2026-04-02', '2026-04-02T12:00:00-04:00', '2026-04-02T13:15:00-04:00', 'National Union Building, Washington, DC', 'Lobby & Main Floor', 'Lunch and informal networking.', 'Lunch and informal networking.', null, 'scheduled', true, false, false),
  ('D2-WS-E', 'E', null, 'Workshop E', 'workshop-e', 'workshop', '2026-04-02', '2026-04-02T13:15:00-04:00', '2026-04-02T14:30:00-04:00', 'National Union Building, Washington, DC', 'Third Floor North', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D2-WS-F', 'F', null, 'Workshop F', 'workshop-f', 'workshop', '2026-04-02', '2026-04-02T13:15:00-04:00', '2026-04-02T14:30:00-04:00', 'National Union Building, Washington, DC', 'Third Floor South', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D2-WS-G', 'G', null, 'Workshop G', 'workshop-g', 'workshop', '2026-04-02', '2026-04-02T13:15:00-04:00', '2026-04-02T14:30:00-04:00', 'National Union Building, Washington, DC', 'Second Floor North', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D2-WS-H', 'H', null, 'Workshop H', 'workshop-h', 'workshop', '2026-04-02', '2026-04-02T13:15:00-04:00', '2026-04-02T14:30:00-04:00', 'National Union Building, Washington, DC', 'Second Floor South', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D2-07', null, null, 'Coffee Break & Transition', 'coffee-break-transition', 'break', '2026-04-02', '2026-04-02T14:30:00-04:00', '2026-04-02T14:45:00-04:00', 'National Union Building, Washington, DC', 'National Union Building', 'Mid afternoon transition break.', 'Mid afternoon transition break.', null, 'scheduled', true, false, false),
  ('D2-WS-I', 'I', null, 'Workshop I', 'workshop-i', 'workshop', '2026-04-02', '2026-04-02T14:45:00-04:00', '2026-04-02T16:00:00-04:00', 'National Union Building, Washington, DC', 'Third Floor North', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D2-WS-J', 'J', null, 'Workshop J', 'workshop-j', 'workshop', '2026-04-02', '2026-04-02T14:45:00-04:00', '2026-04-02T16:00:00-04:00', 'National Union Building, Washington, DC', 'Third Floor South', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D2-WS-K', 'K', null, 'Workshop K', 'workshop-k', 'workshop', '2026-04-02', '2026-04-02T14:45:00-04:00', '2026-04-02T16:00:00-04:00', 'National Union Building, Washington, DC', 'Second Floor North', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D2-WS-L', 'L', null, 'Workshop L', 'workshop-l', 'workshop', '2026-04-02', '2026-04-02T14:45:00-04:00', '2026-04-02T16:00:00-04:00', 'National Union Building, Washington, DC', 'Second Floor South', 'Workshop title and presenter to be announced.', 'Workshop title and presenter to be announced.', null, 'scheduled', true, false, true),
  ('D2-08', null, null, 'Closing Reflections & Preview of Friday', 'closing-reflections-preview-of-friday', 'closing_session', '2026-04-02', '2026-04-02T16:00:00-04:00', '2026-04-02T16:30:00-04:00', 'National Union Building, Washington, DC', 'Sixth Floor North and South', 'Day two closing reflections and preview of the final day.', 'Day two closing reflections and preview of the final day.', null, 'scheduled', true, false, false),

  ('D3-01', null, null, 'Arrival & Continental Breakfast', 'arrival-continental-breakfast-day-three', 'breakfast', '2026-04-03', '2026-04-03T08:30:00-04:00', '2026-04-03T09:15:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Performing Arts Center', 'Arrival period with breakfast at the Maya Angelou Learning Campus.', 'Arrival period with breakfast at the Maya Angelou Learning Campus.', null, 'scheduled', true, false, false),
  ('D3-02', null, null, 'Welcome & Day Three Kick-Off', 'welcome-day-three-kickoff', 'opening_session', '2026-04-03', '2026-04-03T09:15:00-04:00', '2026-04-03T09:30:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Performing Arts Center', 'Welcome and opening remarks for the final day.', 'Welcome and opening remarks for the final day.', null, 'scheduled', true, false, false),
  ('D3-03', null, null, 'Fireside Chat', 'fireside-chat', 'fireside_chat', '2026-04-03', '2026-04-03T09:30:00-04:00', '2026-04-03T10:30:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Performing Arts Center', 'Featured fireside chat. Speaker to be determined.', 'Featured fireside chat. Speaker to be determined.', null, 'scheduled', true, true, false),
  ('D3-04', null, null, 'Coffee Break', 'coffee-break-day-three', 'break', '2026-04-03', '2026-04-03T10:30:00-04:00', '2026-04-03T10:45:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Lobby of Performing Arts Center', 'Morning break.', 'Morning break.', null, 'scheduled', true, false, false),
  ('D3-05', null, null, 'Panel #2: Voices of Experience: Breaking Silos for Youth Justice', 'panel-2-voices-of-experience-breaking-silos-for-youth-justice', 'panel', '2026-04-03', '2026-04-03T10:45:00-04:00', '2026-04-03T12:00:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Performing Arts Center', 'Panel focused on lived experience, youth justice, and breaking institutional silos.', 'Panel focused on lived experience, youth justice, and breaking institutional silos.', null, 'scheduled', true, true, false),
  ('D3-06', null, null, 'Lunch (Provided)', 'lunch-provided', 'lunch', '2026-04-03', '2026-04-03T12:00:00-04:00', '2026-04-03T13:30:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Lobby of the Performing Arts Center', 'Lunch for attendees and guests.', 'Lunch for attendees and guests.', null, 'scheduled', true, false, false),
  ('D3-07', null, null, 'Meet The Board', 'meet-the-board', 'special_event', '2026-04-03', '2026-04-03T13:30:00-04:00', '2026-04-03T14:00:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Performing Arts Center', 'Conversation with Maya board members.', 'Conversation with Maya board members.', null, 'scheduled', true, false, false),
  ('D3-08', null, null, 'Final Convening Session: Meeting Scholars from Maya Angelou Public Charter School', 'final-convening-session-meeting-scholars', 'scholar_session', '2026-04-03', '2026-04-03T14:00:00-04:00', '2026-04-03T15:30:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Third & Fourth Floors and Performing Arts Center', 'Final convening session centered on meeting scholars from Maya Angelou Public Charter School.', 'Final convening session centered on meeting scholars from Maya Angelou Public Charter School.', null, 'scheduled', true, true, false),
  ('D3-09', null, null, 'From Silos to Solutions: A Happy Hour', 'from-silos-to-solutions-happy-hour', 'reception', '2026-04-03', '2026-04-03T16:30:00-04:00', '2026-04-03T19:30:00-04:00', 'Maya Angelou Learning Campus, Performing Arts Center', 'Performing Arts Center', 'Closing happy hour event for attendees, partners, and guests.', 'Closing happy hour event for attendees, partners, and guests.', null, 'scheduled', true, true, false)
on conflict (slug) do update
set
  session_code = excluded.session_code,
  placeholder_code = excluded.placeholder_code,
  final_title = excluded.final_title,
  title = excluded.title,
  category = excluded.category,
  date = excluded.date,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  venue = excluded.venue,
  room = excluded.room,
  short_description = excluded.short_description,
  description = excluded.description,
  live_updates = excluded.live_updates,
  status = excluded.status,
  published = excluded.published,
  featured = excluded.featured,
  is_placeholder = excluded.is_placeholder;

insert into public.session_speakers (session_id, speaker_id, session_role)
select s.id, p.id, 'panelist'
from public.sessions s
join public.speakers p on p.slug = 'nate-balis-juvenile-justice-strategy-group'
where s.slug = 'panel-1-building-power-across-systems'
on conflict do nothing;

insert into public.session_speaker_logistics (session_id, speaker_id, confirmation_status, arrival_time, av_needs, staff_contact, private_logistics_note)
select s.id, p.id, 'confirmed', '2026-04-02T10:10:00-04:00', 'Handheld microphone', 'Jordan Reed - jordan@fs2s.org', 'Arrive at the sixth floor green room 35 minutes before panel start.'
from public.sessions s
join public.speakers p on p.slug = 'nate-balis-juvenile-justice-strategy-group'
where s.slug = 'panel-1-building-power-across-systems'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select s.id, p.id, 'panelist'
from public.sessions s
join public.speakers p on p.slug = 'philip-copeland-dme'
where s.slug = 'panel-1-building-power-across-systems'
on conflict do nothing;

insert into public.session_speaker_logistics (session_id, speaker_id, confirmation_status, arrival_time, av_needs, staff_contact, private_logistics_note)
select s.id, p.id, 'unconfirmed', '2026-04-02T10:10:00-04:00', 'Lapel microphone', 'Jordan Reed - jordan@fs2s.org', 'Awaiting final reply. Hold reserved seat on stage.'
from public.sessions s
join public.speakers p on p.slug = 'philip-copeland-dme'
where s.slug = 'panel-1-building-power-across-systems'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select s.id, p.id, 'panelist'
from public.sessions s
join public.speakers p on p.slug = 'liz-ryan-office-of-juvenile-justice-and-delinquency-prevention'
where s.slug = 'panel-1-building-power-across-systems'
on conflict do nothing;

insert into public.session_speaker_logistics (session_id, speaker_id, confirmation_status, arrival_time, av_needs, staff_contact, private_logistics_note)
select s.id, p.id, 'pending', '2026-04-02T10:10:00-04:00', 'Handheld microphone', 'Jordan Reed - jordan@fs2s.org', 'Pending confirmation. Keep talking points packet ready.'
from public.sessions s
join public.speakers p on p.slug = 'liz-ryan-office-of-juvenile-justice-and-delinquency-prevention'
where s.slug = 'panel-1-building-power-across-systems'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select s.id, p.id, 'panelist'
from public.sessions s
join public.speakers p on p.slug = 'michael-umpierre-georgetown-university'
where s.slug = 'panel-1-building-power-across-systems'
on conflict do nothing;

insert into public.session_speaker_logistics (session_id, speaker_id, confirmation_status, arrival_time, av_needs, staff_contact, private_logistics_note)
select s.id, p.id, 'confirmed', '2026-04-02T10:10:00-04:00', 'Confidence monitor and handheld microphone', 'Jordan Reed - jordan@fs2s.org', 'Confirmed for panel and available for quick backstage briefing.'
from public.sessions s
join public.speakers p on p.slug = 'michael-umpierre-georgetown-university'
where s.slug = 'panel-1-building-power-across-systems'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select s.id, p.id, 'panelist'
from public.sessions s
join public.speakers p on p.slug = 'valerie-slater-rise-for-youth'
where s.slug = 'panel-2-voices-of-experience-breaking-silos-for-youth-justice'
on conflict do nothing;

insert into public.session_speaker_logistics (session_id, speaker_id, confirmation_status, arrival_time, av_needs, staff_contact, private_logistics_note)
select s.id, p.id, 'confirmed', '2026-04-03T10:10:00-04:00', 'Handheld microphone', 'Maya Events Desk - events@mayaschools.org', 'Meet at PAC backstage entrance before the morning break ends.'
from public.sessions s
join public.speakers p on p.slug = 'valerie-slater-rise-for-youth'
where s.slug = 'panel-2-voices-of-experience-breaking-silos-for-youth-justice'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select s.id, p.id, 'panelist'
from public.sessions s
join public.speakers p on p.slug = 'youth-representative-maya-schools-secure'
where s.slug = 'panel-2-voices-of-experience-breaking-silos-for-youth-justice'
on conflict do nothing;

insert into public.session_speaker_logistics (session_id, speaker_id, confirmation_status, arrival_time, av_needs, staff_contact, private_logistics_note)
select s.id, p.id, 'awaiting_invitation', '2026-04-03T10:10:00-04:00', 'Chair microphone', 'Maya Events Desk - events@mayaschools.org', 'Placeholder youth seat. Outreach still in progress.'
from public.sessions s
join public.speakers p on p.slug = 'youth-representative-maya-schools-secure'
where s.slug = 'panel-2-voices-of-experience-breaking-silos-for-youth-justice'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select s.id, p.id, 'panelist'
from public.sessions s
join public.speakers p on p.slug = 'youth-representative-rise-for-youth'
where s.slug = 'panel-2-voices-of-experience-breaking-silos-for-youth-justice'
on conflict do nothing;

insert into public.session_speaker_logistics (session_id, speaker_id, confirmation_status, arrival_time, av_needs, staff_contact, private_logistics_note)
select s.id, p.id, 'confirmed', '2026-04-03T10:10:00-04:00', 'Chair microphone', 'Maya Events Desk - events@mayaschools.org', 'Confirmed youth representative from RISE for Youth.'
from public.sessions s
join public.speakers p on p.slug = 'youth-representative-rise-for-youth'
where s.slug = 'panel-2-voices-of-experience-breaking-silos-for-youth-justice'
on conflict do nothing;

insert into public.announcements (title, body, priority, published)
values
  ('Welcome to FS2S 2026', 'Welcome to From Silos to Solutions 2026. Explore the schedule, review the latest updates, and use the portal for shared conference documents.', 'normal', true),
  ('Check the app for live room updates', 'Any room changes, speaker updates, or day-of logistics will appear here first.', 'urgent', true),
  ('Please complete session feedback before leaving each session', 'Your feedback helps the convening team improve each experience in real time.', 'normal', true);
