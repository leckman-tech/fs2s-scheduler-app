delete from public.session_speaker_logistics
where speaker_id in (
  select id
  from public.speakers
  where slug in ('senator-van-hollen-us-senate', 'rep-jayapal-us-house-of-representatives')
);

delete from public.session_speakers
where speaker_id in (
  select id
  from public.speakers
  where slug in ('senator-van-hollen-us-senate', 'rep-jayapal-us-house-of-representatives')
);

delete from public.speakers
where slug in ('senator-van-hollen-us-senate', 'rep-jayapal-us-house-of-representatives');
