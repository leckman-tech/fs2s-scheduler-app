create or replace function public.delete_attendee_account(p_account_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  account_email text;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Admin access required.';
  end if;

  select lower(email)
  into account_email
  from auth.users
  where id = p_account_id;

  if account_email is null then
    raise exception 'Attendee account not found.';
  end if;

  delete from public.attendee_board_replies
  where account_id = p_account_id
     or lower(email) = account_email;

  delete from public.attendee_board_posts
  where account_id = p_account_id
     or lower(email) = account_email;

  delete from public.attendee_directory_entries
  where account_id = p_account_id
     or lower(email) = account_email;

  delete from auth.users
  where id = p_account_id;
end;
$$;

grant execute on function public.delete_attendee_account(uuid) to authenticated;
