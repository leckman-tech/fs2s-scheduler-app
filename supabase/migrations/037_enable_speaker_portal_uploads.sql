alter table public.portal_documents
add column if not exists uploaded_by uuid references public.profiles (id) on delete set null;

create index if not exists portal_documents_uploaded_by_idx
on public.portal_documents (uploaded_by, created_at desc);

drop policy if exists "Speaker-access users can upload own portal documents" on public.portal_documents;
create policy "Speaker-access users can upload own portal documents"
on public.portal_documents
for insert
to authenticated
with check (
  audience = 'speaker'
  and uploaded_by = auth.uid()
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
);

drop policy if exists "Speaker-access users can update own portal documents" on public.portal_documents;
create policy "Speaker-access users can update own portal documents"
on public.portal_documents
for update
to authenticated
using (
  uploaded_by = auth.uid()
  and audience = 'speaker'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
)
with check (
  uploaded_by = auth.uid()
  and audience = 'speaker'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
);

drop policy if exists "Speaker-access users can delete own portal documents" on public.portal_documents;
create policy "Speaker-access users can delete own portal documents"
on public.portal_documents
for delete
to authenticated
using (
  uploaded_by = auth.uid()
  and audience = 'speaker'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
);

drop policy if exists "Speaker-access users can upload speaker portal files" on storage.objects;
create policy "Speaker-access users can upload speaker portal files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'session-resources'
  and name like 'speaker-submissions/%'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
);

drop policy if exists "Speaker-access users can update speaker portal files" on storage.objects;
create policy "Speaker-access users can update speaker portal files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'session-resources'
  and name like 'speaker-submissions/%'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
)
with check (
  bucket_id = 'session-resources'
  and name like 'speaker-submissions/%'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
);

drop policy if exists "Speaker-access users can delete speaker portal files" on storage.objects;
create policy "Speaker-access users can delete speaker portal files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'session-resources'
  and name like 'speaker-submissions/%'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
  )
);
