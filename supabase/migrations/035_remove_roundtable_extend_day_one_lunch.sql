update public.sessions
set
  starts_at = '2026-04-01T12:30:00-04:00',
  ends_at = '2026-04-01T14:00:00-04:00'
where session_code = 'd1s9';

update public.portal_documents
set session_id = null
where session_id = (
  select id
  from public.sessions
  where session_code = 'd1s10'
  limit 1
);

delete from public.session_speakers
where session_id = (
  select id
  from public.sessions
  where session_code = 'd1s10'
  limit 1
);

delete from public.sessions
where session_code = 'd1s10';
