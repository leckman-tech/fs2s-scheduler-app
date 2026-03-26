insert into public.speakers (slug, name, organization)
values
  ('lex-ballard', 'Lex Ballard', 'Horton''s Kids'),
  ('shamette-franklin', 'Ms. Shamette Franklin', null),
  ('rebecca-dreyfus', 'Ms. Rebecca Dreyfus', null),
  ('dr-kamal-wright-cunningham', 'Dr. Kamal Wright-Cunningham', null),
  ('sofia-dean', 'Sofia Dean', 'Free Minds Book Club & Writing Workshop')
on conflict (slug) do update
set
  name = excluded.name,
  organization = coalesce(excluded.organization, public.speakers.organization);

delete from public.session_speaker_logistics
where (session_id, speaker_id) in (
  select sessions.id, speakers.id
  from public.sessions
  join public.speakers on speakers.slug = 'erica-ahdoot'
  where sessions.session_code = 'd1wA'

  union all

  select sessions.id, speakers.id
  from public.sessions
  join public.speakers on speakers.slug = 'julia-mascioli'
  where sessions.session_code = 'd2wE'
);

delete from public.session_speakers
where (session_id, speaker_id) in (
  select sessions.id, speakers.id
  from public.sessions
  join public.speakers on speakers.slug = 'erica-ahdoot'
  where sessions.session_code = 'd1wA'

  union all

  select sessions.id, speakers.id
  from public.sessions
  join public.speakers on speakers.slug = 'julia-mascioli'
  where sessions.session_code = 'd2wE'
);

insert into public.session_speakers (session_id, speaker_id, session_role)
select
  sessions.id,
  speakers.id,
  'workshop_presenter'
from public.sessions
join public.speakers on speakers.slug in (
  'shandell-richards',
  'lex-ballard'
)
where sessions.session_code = 'd1wA'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select
  sessions.id,
  speakers.id,
  'workshop_presenter'
from public.sessions
join public.speakers on speakers.slug in (
  'cyril-pickering',
  'shamette-franklin',
  'rebecca-dreyfus',
  'dr-kamal-wright-cunningham'
)
where sessions.session_code = 'd1wD'
on conflict do nothing;

insert into public.session_speakers (session_id, speaker_id, session_role)
select
  sessions.id,
  speakers.id,
  'workshop_presenter'
from public.sessions
join public.speakers on speakers.slug in (
  'tara-libert',
  'sofia-dean'
)
where sessions.session_code = 'd2wE'
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
join public.speakers on speakers.slug in (
  'shandell-richards',
  'lex-ballard'
)
where sessions.session_code = 'd1wA'
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
join public.speakers on speakers.slug in (
  'cyril-pickering',
  'shamette-franklin',
  'rebecca-dreyfus',
  'dr-kamal-wright-cunningham'
)
where sessions.session_code = 'd1wD'
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
join public.speakers on speakers.slug in (
  'tara-libert',
  'sofia-dean'
)
where sessions.session_code = 'd2wE'
on conflict do nothing;
