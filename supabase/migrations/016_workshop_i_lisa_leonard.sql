insert into public.speakers (slug, name, organization)
values ('lisa-leonard', 'Lisa Leonard', null)
on conflict (slug) do update
set name = excluded.name;

update public.sessions
set
  title = 'Workshop I',
  final_title = null,
  slug = 'workshop-i-lisa-leonard',
  short_description = 'Workshop session presented by Lisa Leonard.',
  description = 'Workshop details forthcoming. This 2:45 PM session will be presented by Lisa Leonard.',
  featured = false
where session_code = 'd2wI';

delete from public.session_speaker_logistics
where session_id in (
  select id
  from public.sessions
  where session_code = 'd2wI'
);

delete from public.session_speakers
where session_id in (
  select id
  from public.sessions
  where session_code = 'd2wI'
);

insert into public.session_speakers (session_id, speaker_id, session_role)
select
  sessions.id,
  speakers.id,
  'workshop_presenter'
from public.sessions
join public.speakers on speakers.slug = 'lisa-leonard'
where sessions.session_code = 'd2wI'
on conflict do nothing;

insert into public.session_speaker_logistics (
  session_id,
  speaker_id,
  confirmation_status
)
select
  sessions.id,
  speakers.id,
  'confirmed'
from public.sessions
join public.speakers on speakers.slug = 'lisa-leonard'
where sessions.session_code = 'd2wI'
on conflict do nothing;
