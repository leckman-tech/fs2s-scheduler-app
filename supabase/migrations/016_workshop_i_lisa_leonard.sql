insert into public.speakers (slug, name, organization)
values ('lisa-leonard', 'Lisa Leonard', null)
on conflict (slug) do update
set name = excluded.name;

update public.sessions
set
  title = 'Workshop I',
  final_title = 'Parenting through an EQ Lens',
  slug = 'parenting-through-an-eq-lens-i',
  short_description = 'Workshop presented by Lisa Leonard.',
  description = 'Parenting through an EQ Lens is presented by Lisa Leonard during the 2:45 PM workshop block. Additional workshop details can be shared in the admin dashboard as needed.',
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
