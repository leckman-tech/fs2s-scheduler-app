create type public.portal_audience as enum ('attendee', 'speaker', 'both');

insert into storage.buckets (id, name, public)
values ('session-resources', 'session-resources', false)
on conflict (id) do nothing;

create table if not exists public.portal_documents (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions (id) on delete set null,
  audience public.portal_audience not null default 'attendee',
  title text not null,
  description text,
  file_name text not null,
  file_path text not null unique,
  mime_type text,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.portal_messages (
  id uuid primary key default gen_random_uuid(),
  audience public.portal_audience not null default 'speaker',
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists portal_documents_session_idx
on public.portal_documents (session_id, created_at desc);

create index if not exists portal_documents_published_idx
on public.portal_documents (published, audience, created_at desc);

create index if not exists portal_messages_published_idx
on public.portal_messages (published, audience, created_at desc);

alter table public.portal_documents enable row level security;
alter table public.portal_messages enable row level security;

drop policy if exists "Authenticated users can view portal documents" on public.portal_documents;
create policy "Authenticated users can view portal documents"
on public.portal_documents
for select
to authenticated
using (
  (
    published = true
    and (
      audience in ('attendee', 'both')
      or (
        audience = 'speaker'
        and exists (
          select 1
          from public.profiles
          where id = auth.uid()
            and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
        )
      )
    )
  )
  or public.is_admin(auth.uid())
);

drop policy if exists "Admins manage portal documents" on public.portal_documents;
create policy "Admins manage portal documents"
on public.portal_documents
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Speaker-access users can view portal messages" on public.portal_messages;
create policy "Speaker-access users can view portal messages"
on public.portal_messages
for select
to authenticated
using (
  (
    published = true
    and audience = 'speaker'
    and exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
    )
  )
  or public.is_admin(auth.uid())
);

drop policy if exists "Speaker-access users can create portal messages" on public.portal_messages;
create policy "Speaker-access users can create portal messages"
on public.portal_messages
for insert
to authenticated
with check (
  audience = 'speaker'
  and author_id = auth.uid()
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
);

drop policy if exists "Admins manage portal messages" on public.portal_messages;
create policy "Admins manage portal messages"
on public.portal_messages
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Authenticated users can view portal document files" on storage.objects;
create policy "Authenticated users can view portal document files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'session-resources'
);

drop policy if exists "Admins can upload portal document files" on storage.objects;
create policy "Admins can upload portal document files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'session-resources'
  and public.is_admin(auth.uid())
);

drop policy if exists "Admins can update portal document files" on storage.objects;
create policy "Admins can update portal document files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'session-resources'
  and public.is_admin(auth.uid())
)
with check (
  bucket_id = 'session-resources'
  and public.is_admin(auth.uid())
);

drop policy if exists "Admins can delete portal document files" on storage.objects;
create policy "Admins can delete portal document files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'session-resources'
  and public.is_admin(auth.uid())
);

update public.announcements
set body = 'Welcome to From Silos to Solutions 2026. Explore the schedule and save sessions to your agenda.'
where title = 'Welcome to FS2S 2026';
