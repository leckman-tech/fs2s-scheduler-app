create or replace function public.sync_attendee_directory_from_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  attendee_email text;
  attendee_name text;
begin
  if new.role <> 'attendee' then
    return new;
  end if;

  select lower(email)
  into attendee_email
  from auth.users
  where id = new.id;

  if attendee_email is null then
    return new;
  end if;

  attendee_name := coalesce(nullif(trim(coalesce(new.full_name, '')), ''), split_part(attendee_email, '@', 1));

  insert into public.attendee_directory_entries (
    full_name,
    email,
    share_with_attendees,
    share_with_planners,
    updated_at
  )
  values (
    attendee_name,
    attendee_email,
    false,
    true,
    timezone('utc', now())
  )
  on conflict (email) do update
    set
      full_name = excluded.full_name,
      share_with_planners = true,
      updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists sync_attendee_directory_from_profile_trigger on public.profiles;
create trigger sync_attendee_directory_from_profile_trigger
after insert or update of full_name, role
on public.profiles
for each row
execute procedure public.sync_attendee_directory_from_profile();

insert into public.attendee_directory_entries (
  full_name,
  email,
  share_with_attendees,
  share_with_planners,
  updated_at
)
select
  coalesce(nullif(trim(coalesce(p.full_name, '')), ''), split_part(lower(u.email), '@', 1)),
  lower(u.email),
  false,
  true,
  timezone('utc', now())
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'attendee'
on conflict (email) do update
  set
    full_name = excluded.full_name,
    share_with_planners = true,
    updated_at = timezone('utc', now());
