insert into public.profiles (id, role)
select users.id, 'panelist'::public.user_role
from auth.users as users
where lower(users.email) = 'panelist@fs2shub.com'
on conflict (id) do update
set role = 'panelist';
