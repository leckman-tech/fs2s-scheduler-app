insert into public.profiles (id, full_name, role)
select
  u.id,
  coalesce(
    nullif(trim(coalesce(p.full_name, u.raw_user_meta_data ->> 'full_name', '')), ''),
    'Levi W. Eckman'
  ),
  'admin'
from auth.users u
left join public.profiles p on p.id = u.id
where lower(u.email) = lower('Leckman@SeeForever.org')
on conflict (id) do update
set
  role = 'admin',
  full_name = coalesce(nullif(trim(public.profiles.full_name), ''), excluded.full_name);
