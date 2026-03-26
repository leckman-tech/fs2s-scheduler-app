create table if not exists public.form_submission_guards (
  id uuid primary key default gen_random_uuid(),
  form_key text not null,
  fingerprint text not null,
  email text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists form_submission_guards_form_fingerprint_idx
on public.form_submission_guards (form_key, fingerprint, created_at desc);

create index if not exists form_submission_guards_form_email_idx
on public.form_submission_guards (form_key, lower(email), created_at desc);

alter table public.form_submission_guards enable row level security;

drop policy if exists "Admins can review form submission guards" on public.form_submission_guards;
create policy "Admins can review form submission guards"
on public.form_submission_guards
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Admins manage form submission guards" on public.form_submission_guards;
create policy "Admins manage form submission guards"
on public.form_submission_guards
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create or replace function public.guard_public_form_submission(
  p_form_key text,
  p_fingerprint text,
  p_email text default null,
  p_window_minutes integer default 15,
  p_max_fingerprint_attempts integer default 8,
  p_max_email_attempts integer default 4
)
returns table (allowed boolean, reason text)
language plpgsql
security definer
set search_path = public
as $$
declare
  fingerprint_attempts integer := 0;
  email_attempts integer := 0;
begin
  if p_form_key is null or trim(p_form_key) = '' or p_fingerprint is null or trim(p_fingerprint) = '' then
    return query select false, 'invalid';
    return;
  end if;

  select count(*)
  into fingerprint_attempts
  from public.form_submission_guards
  where form_key = p_form_key
    and fingerprint = p_fingerprint
    and created_at >= timezone('utc', now()) - make_interval(mins => greatest(p_window_minutes, 1));

  if fingerprint_attempts >= greatest(p_max_fingerprint_attempts, 1) then
    insert into public.form_submission_guards (form_key, fingerprint, email)
    values (p_form_key, p_fingerprint, lower(nullif(trim(p_email), '')));

    return query select false, 'Too many attempts from this connection. Please wait a few minutes and try again.';
    return;
  end if;

  if p_email is not null and trim(p_email) <> '' then
    select count(*)
    into email_attempts
    from public.form_submission_guards
    where form_key = p_form_key
      and lower(email) = lower(trim(p_email))
      and created_at >= timezone('utc', now()) - make_interval(mins => greatest(p_window_minutes, 1));

    if email_attempts >= greatest(p_max_email_attempts, 1) then
      insert into public.form_submission_guards (form_key, fingerprint, email)
      values (p_form_key, p_fingerprint, lower(trim(p_email)));

      return query select false, 'That email has reached the temporary submission limit. Please wait a few minutes and try again.';
      return;
    end if;
  end if;

  insert into public.form_submission_guards (form_key, fingerprint, email)
  values (p_form_key, p_fingerprint, lower(nullif(trim(p_email), '')));

  return query select true, null::text;
end;
$$;

grant execute on function public.guard_public_form_submission(text, text, text, integer, integer, integer) to anon, authenticated;
