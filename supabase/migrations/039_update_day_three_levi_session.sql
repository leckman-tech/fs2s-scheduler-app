insert into public.speakers (slug, name, organization)
values ('levi-w-eckman', 'Levi W. Eckman, Esq.', 'See Forever Foundation')
on conflict (slug) do update
set
  name = excluded.name,
  organization = excluded.organization;

update public.speakers
set title = 'Convening Director'
where slug = 'levi-w-eckman';

update public.sessions
set
  starts_at = '2026-04-03T10:15:00-04:00',
  ends_at = '2026-04-03T10:25:00-04:00'
where session_code = 'd3s2';

update public.sessions
set
  starts_at = '2026-04-03T10:25:00-04:00',
  ends_at = '2026-04-03T10:55:00-04:00'
where session_code = 'd3s3';

update public.sessions
set
  starts_at = '2026-04-03T11:10:00-04:00',
  ends_at = '2026-04-03T12:05:00-04:00',
  title = '2026 Lobby Day Goals and Agenda Setting with Levi W. Eckman, Esq.',
  slug = '2026-lobby-day-goals-and-agenda-setting-with-levi-w-eckman-esq',
  category = 'closing_session',
  short_description = 'Convening Director Levi W. Eckman, Esq. will lead a prepared session on the 2026 Lobby Day goals and guide agenda setting with the group.',
  description = 'Mr. Levi W. Eckman, Esq., Convening Director, will host a prepared session focused on the goals for the 2026 Lobby Day and guide agenda setting with the group. This session will help attendees align around priorities, advocacy strategy, and shared next steps as the convening moves toward action.'
where session_code = 'd3s5';

delete from public.session_speaker_logistics
where session_id = (
  select id
  from public.sessions
  where session_code = 'd3s5'
  limit 1
);

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
join public.speakers as speakers on speakers.slug = 'levi-w-eckman'
where sessions.session_code = 'd3s5'
on conflict do nothing;
