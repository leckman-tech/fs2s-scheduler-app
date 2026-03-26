alter table public.attendee_directory_entries
add column if not exists account_id uuid unique references public.profiles (id) on delete set null;

create index if not exists attendee_directory_entries_account_idx
on public.attendee_directory_entries (account_id);

create or replace function public.ensure_attendee_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  attendee_email text;
  attendee_name text;
  saved_profile public.profiles%rowtype;
begin
  if current_user_id is null then
    raise exception 'You must be signed in first.';
  end if;

  select lower(email), coalesce(nullif(trim(coalesce(raw_user_meta_data ->> 'full_name', '')), ''), split_part(lower(email), '@', 1))
  into attendee_email, attendee_name
  from auth.users
  where id = current_user_id;

  insert into public.profiles (id, full_name, role)
  values (current_user_id, attendee_name, 'attendee')
  on conflict (id) do update
    set full_name = coalesce(nullif(trim(public.profiles.full_name), ''), excluded.full_name)
  returning *
  into saved_profile;

  insert into public.attendee_directory_entries (
    account_id,
    full_name,
    email,
    share_with_attendees,
    share_with_planners,
    updated_at
  )
  values (
    current_user_id,
    coalesce(nullif(trim(saved_profile.full_name), ''), attendee_name),
    attendee_email,
    false,
    true,
    timezone('utc', now())
  )
  on conflict (email) do update
    set
      account_id = excluded.account_id,
      full_name = excluded.full_name,
      share_with_planners = true,
      updated_at = timezone('utc', now());

  return saved_profile;
end;
$$;

grant execute on function public.ensure_attendee_profile() to authenticated;

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
    account_id,
    full_name,
    email,
    share_with_attendees,
    share_with_planners,
    updated_at
  )
  values (
    new.id,
    attendee_name,
    attendee_email,
    false,
    true,
    timezone('utc', now())
  )
  on conflict (email) do update
    set
      account_id = excluded.account_id,
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

update public.attendee_directory_entries d
set account_id = p.id
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'attendee'
  and lower(u.email) = lower(d.email)
  and d.account_id is null;
