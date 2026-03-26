insert into public.speakers (slug, name, organization)
values ('lisa-leonard', 'Lisa Leonard', null)
on conflict (slug) do update
set name = excluded.name;

update public.sessions
set
  title = 'Workshop I',
  final_title = 'Parenting through an EQ Lens: Empowering Practitioners to Foster Reflective, Emotionally Intelligent Student Support Systems',
  slug = 'parenting-through-an-eq-lens-i',
  short_description = 'A workshop on reflective parenting, emotional intelligence, and stronger school-home support systems for students.',
  description = 'This workshop explores how reflective parenting and emotional intelligence can strengthen student support systems and improve school-home partnership. Lisa Leonard examines how traditional parent engagement has too often become transactional rather than transformational, especially in a post-pandemic moment shaped by stress and educational trauma. The session is organized around five EQ-based lenses for practitioners: understanding the emotional lens families bring into school spaces, shifting from reactive discipline to reflective responses, addressing adults’ own relationships with education, applying practical EQ tools in meetings and school systems, and creating welcoming pathways for families who have been historically marginalized or disengaged. Participants will leave with strategies to foster more reflective, emotionally intelligent support for students and their families.',
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
