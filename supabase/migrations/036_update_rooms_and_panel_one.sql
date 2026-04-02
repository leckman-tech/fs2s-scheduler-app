insert into public.speakers (slug, name, organization)
values ('david-domenici', 'David Domenici', 'See Forever Foundation')
on conflict (slug) do update
set
  name = excluded.name,
  organization = excluded.organization;

update public.speakers
set title = 'Moderator, Co-Founder'
where slug = 'david-domenici';

update public.sessions
set room = 'Sixth North'
where session_code in ('d1s1', 'd1s9', 'd2s1', 'd2s6');

update public.sessions
set room = '2 North'
where session_code in ('d2wE', 'd2wL');

update public.sessions
set room = '4 South'
where session_code in ('d2wF', 'd2wJ');

update public.sessions
set room = '6 South'
where session_code in ('d2wG', 'd2wI');

update public.sessions
set room = '3 North'
where session_code = 'd2wK';

delete from public.session_speaker_logistics
where (session_id, speaker_id) in (
  select sessions.id, speakers.id
  from public.sessions
  join public.speakers on speakers.slug = 'senator-van-hollen'
  where sessions.session_code = 'd2s5'
);

delete from public.session_speakers
where (session_id, speaker_id) in (
  select sessions.id, speakers.id
  from public.sessions
  join public.speakers on speakers.slug = 'senator-van-hollen'
  where sessions.session_code = 'd2s5'
);

insert into public.session_speakers (session_id, speaker_id, session_role)
select
  sessions.id,
  speakers.id,
  'panelist'
from public.sessions
join public.speakers on speakers.slug = 'david-domenici'
where sessions.session_code = 'd2s5'
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
join public.speakers on speakers.slug = 'david-domenici'
where sessions.session_code = 'd2s5'
on conflict do nothing;

delete from public.speakers
where slug = 'senator-van-hollen'
  and not exists (
    select 1
    from public.session_speakers
    where speaker_id = public.speakers.id
  );
