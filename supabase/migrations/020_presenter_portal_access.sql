insert into public.profiles (id, role)
select users.id, 'speaker'::public.user_role
from auth.users as users
where lower(users.email) = 'presenter@fs2shub.com'
on conflict (id) do update
set role = 'speaker';
