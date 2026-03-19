# From Silos to Solutions 2026 Convening App

A mobile-first conference schedule web app built with Next.js, TypeScript, and Supabase for the From Silos to Solutions 2026 Convening.

## What is included

- Attendee schedule homepage grouped by day
- Category filters across the convening schedule, including keynote, panel, workshop, scholar session, reception, meals, and more
- Session detail pages with room, speakers, descriptions, and live updates
- Personal agenda favorites stored in browser local storage
- Session feedback form with rating, useful takeaways, improvement notes, and future-interest question
- Prominent announcements panel for urgent notices and room changes
- Public speaker directory page
- Private speaker and panelist portal with assigned sessions and logistics
- Secure admin sign-in using Supabase Auth
- Admin dashboard to create, edit, publish, unpublish, and delete sessions
- Dedicated workshop planner for placeholder slots A-L
- Admin announcements manager with immediate attendee-side publishing
- Admin feedback reporting page plus CSV export endpoint
- Supabase schema and seed data for the April 1-3, 2026 draft schedule

## Tech stack

- Next.js App Router
- TypeScript
- Supabase Auth + Postgres
- Responsive custom CSS with a mobile-first layout

## Project structure

- `app/(attendee)` attendee-facing schedule and session pages
- `app/admin` admin login and dashboard routes
- `app/portal` private speaker and panelist portal routes
- `app/speakers` public speaker directory route
- `app/api/feedback` attendee feedback submission endpoint
- `components` shared UI and admin form components
- `lib` Supabase clients, queries, utilities, and admin actions
- `supabase/migrations` SQL schema and seed data

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and add your Supabase values:

```bash
cp .env.example .env.local
```

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Create a Supabase project, then run the SQL files in order:

- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_seed.sql`

You can run them in the Supabase SQL editor or through the Supabase CLI if you already use it locally.

4. Create an admin account in Supabase Auth:

- Create a user with email/password in the Supabase dashboard
- The signup trigger will automatically create a row in `public.profiles`
- Promote that user to admin with:

```sql
update public.profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_ID';
```

5. Start the app:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To enable the private speaker or panelist portal for a user, set both the role and the linked speaker record on that user profile:

```sql
update public.profiles
set
  role = 'panelist',
  speaker_id = 'SPEAKER_RECORD_ID'
where id = 'YOUR_AUTH_USER_ID';
```

## Database model

Main tables:

- `profiles`: user role metadata for admin access
- `sessions`: conference schedule records with workshop placeholder support, featured flags, and live updates
- `speakers`: reusable speaker and panelist records
- `session_speakers`: public session-to-speaker links and session roles
- `session_speaker_logistics`: private confirmation and logistics data for assigned speakers and panelists
- `announcements`: attendee-facing notices
- `feedback`: attendee responses by session

RLS policies included in the schema:

- Public read access only for published sessions and announcements
- Public insert access for session feedback
- Private speaker logistics access only for admins and the assigned speaker or panelist
- Admin-only create, update, delete access for schedule and announcements
- Admin-only feedback review access

## Admin workflow

- Visit `/admin/login`
- Sign in with your Supabase admin user
- Use `/admin/dashboard` to manage sessions
- Use `/admin/dashboard/workshops` to update all workshop placeholders in one place
- Use `/admin/dashboard/announcements` for live notices
- Use `/admin/dashboard/feedback` to review responses and export CSV

## Notes

- Favorites are intentionally stored in browser local storage for now, so they are device-specific.
- Session forms accept one participant per line in this format:

```text
Name | Title | Organization | Role | Confirmation | Arrival YYYY-MM-DDTHH:MM | AV Needs | Staff Contact | Private Logistics Note
```

- Workshop slots are seeded with `placeholder_code` values `A` through `L` and blank `final_title` values so they can be updated later without changing the slot structure.
- The seed uses April 1-3, 2026 and stores times in Eastern Time offsets.

## Fastest workshop workflow

1. Open `/admin/dashboard/workshops`.
2. For each slot, add the `final_title` once it is approved.
3. Paste the presenter line into the workshop card.
4. Save each workshop slot.
5. Use the full edit link only if you need to change broader session details beyond title, room, venue, or presenters.

## Where to edit things later

- Sessions, room names, status, featured flags, and venue details: `/admin/dashboard` then open a session edit page
- Workshop placeholders, final titles, and workshop presenters: `/admin/dashboard/workshops`
- Speakers and panelists for a specific session: the session edit form or workshop planner presenter field
- Announcements: `/admin/dashboard/announcements`
- Speaker logistics fields like arrival time, AV needs, staff contact, and private logistics notes: the speaker lines inside the session edit form or workshop planner

## Suggested next steps

1. Add attendee accounts if you want cloud-synced personal agendas across devices.
2. Move feedback submission behind authenticated attendees if you need attribution or spam control.
3. Add richer admin analytics such as attendance tracking, session capacity, and announcement scheduling.
4. Connect file or image uploads for speaker headshots and sponsor assets.
