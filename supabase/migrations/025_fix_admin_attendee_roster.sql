create or replace function public.get_admin_attendee_account_roster()
returns table (
  id uuid,
  full_name text,
  email text,
  phone text,
  title text,
  organization text,
  share_with_attendees boolean,
  share_with_planners boolean,
  created_at timestamptz,
  updated_at timestamptz,
  role text,
  sync_status text
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Admin access required.';
  end if;

  return query
  select
    u.id,
    coalesce(
      nullif(trim(d.full_name), ''),
      nullif(trim(p.full_name), ''),
      nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), ''),
      split_part(lower(u.email), '@', 1),
      'Attendee'
    ) as full_name,
    lower(u.email) as email,
    d.phone,
    d.title,
    d.organization,
    coalesce(d.share_with_attendees, false) as share_with_attendees,
    coalesce(d.share_with_planners, true) as share_with_planners,
    coalesce(p.created_at, u.created_at) as created_at,
    coalesce(d.updated_at, u.updated_at, p.created_at, u.created_at) as updated_at,
    p.role,
    case
      when p.role = 'attendee' and d.account_id = u.id then 'synced'
      when p.role = 'attendee' then 'profile only'
      when d.account_id = u.id then 'directory only'
      when coalesce(u.raw_user_meta_data ->> 'portal_type', '') = 'attendee' then 'auth only'
      else 'unclassified'
    end as sync_status
  from auth.users u
  left join public.profiles p on p.id = u.id
  left join public.attendee_directory_entries d
    on d.account_id = u.id
    or lower(d.email) = lower(u.email)
  where
    p.role = 'attendee'
    or coalesce(u.raw_user_meta_data ->> 'portal_type', '') = 'attendee'
    or d.id is not null
  order by coalesce(p.created_at, u.created_at) desc;
end;
$$;

grant execute on function public.get_admin_attendee_account_roster() to authenticated;
