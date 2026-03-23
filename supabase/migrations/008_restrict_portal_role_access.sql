update public.profiles
set role = 'panelist'
where id = '7c283bb9-ed24-467f-8eda-18a930619436';

drop policy if exists "Authenticated users can view portal documents" on public.portal_documents;
create policy "Authenticated users can view portal documents"
on public.portal_documents
for select
to authenticated
using (
  public.is_admin(auth.uid())
  or (
    published = true
    and (
      (
        audience = 'attendee'
        and exists (
          select 1
          from public.profiles
          where id = auth.uid()
            and role = 'attendee'
        )
      )
      or (
        audience = 'speaker'
        and exists (
          select 1
          from public.profiles
          where id = auth.uid()
            and role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
        )
      )
      or (
        audience = 'both'
        and exists (
          select 1
          from public.profiles
          where id = auth.uid()
            and role in ('attendee', 'speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
        )
      )
    )
  )
);

drop policy if exists "Authenticated users can view portal document files" on storage.objects;
create policy "Authenticated users can view portal document files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'session-resources'
  and (
    public.is_admin(auth.uid())
    or exists (
      select 1
      from public.portal_documents
      join public.profiles
        on profiles.id = auth.uid()
      where portal_documents.file_path = storage.objects.name
        and portal_documents.published = true
        and (
          (portal_documents.audience = 'attendee' and profiles.role = 'attendee')
          or (
            portal_documents.audience = 'speaker'
            and profiles.role in ('speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
          )
          or (
            portal_documents.audience = 'both'
            and profiles.role in ('attendee', 'speaker', 'panelist', 'workshop_presenter', 'exhibitor', 'admin')
          )
        )
    )
  )
);
