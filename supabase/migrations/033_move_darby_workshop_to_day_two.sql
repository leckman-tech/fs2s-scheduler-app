update public.portal_documents
set session_id = null
where session_id = (
  select id
  from public.sessions
  where session_code = 'd2wI'
  limit 1
);

delete from public.session_speakers
where session_id = (
  select id
  from public.sessions
  where session_code = 'd2wI'
  limit 1
);

delete from public.sessions
where session_code = 'd2wI';

update public.sessions
set
  session_code = 'd2wI',
  placeholder_code = 'I',
  title = 'Workshop I',
  slug = 'building-youth-power-in-local-policymaking-i',
  date = '2026-04-02',
  starts_at = '2026-04-02T14:20:00-04:00',
  ends_at = '2026-04-02T15:35:00-04:00',
  venue = 'National Union Building, Washington, D.C.',
  room = 'Third Floor North'
where session_code = 'd1wB';

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
select
  'd2wI',
  'I',
  'Building Youth Power in Local Policymaking',
  'Workshop I',
  'building-youth-power-in-local-policymaking-i',
  'workshop',
  '2026-04-02',
  '2026-04-02T14:20:00-04:00',
  '2026-04-02T15:35:00-04:00',
  'National Union Building, Washington, D.C.',
  'Third Floor North',
  'In this interactive workshop, participants will engage in activities to strengthen young people’s understanding of laws and policies and how to influence them. Using discussion, role play, and participatory techniques, the session explores how local policymaking happens, how to identify policymakers, how to craft a policy ask, and how to support young people in communicating with elected officials and other decision makers.',
  'In this interactive workshop, participants will engage in activities to strengthen young people’s understanding of laws and policies and how to influence them. Using discussion, role play, and participatory techniques, the session explores how local policymaking happens, how to identify policymakers, how to craft a policy ask, and how to support young people in communicating with elected officials and other decision makers. Learning objectives: Understand how local policymaking works; Help young people identify policymakers and policy asks; Build youth advocacy and civic engagement skills.',
  null,
  'scheduled',
  true,
  false,
  false
where not exists (
  select 1
  from public.sessions
  where session_code = 'd2wI'
);

delete from public.session_speakers
where session_id = (
  select id
  from public.sessions
  where session_code = 'd1wB'
  limit 1
);

insert into public.session_speakers (session_id, speaker_id, session_role)
select sessions.id, speakers.id, 'workshop_presenter'
from public.sessions as sessions
join public.speakers as speakers on speakers.slug = 'darby-hickey'
where sessions.session_code = 'd2wI'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select sessions.id, speakers.id, 'workshop_presenter'
from public.sessions as sessions
join public.speakers as speakers on speakers.slug = 'naike-savain'
where sessions.session_code = 'd2wI'
on conflict do nothing;
