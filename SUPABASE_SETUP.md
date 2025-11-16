# 🗄️ Supabase Setup Guide

This project expects a Supabase backend to verify attendees and store feedback. Use the steps below to configure your project.

## 1. Environment Variables

Add these to your `.env` file (see `SETUP.md` for full instructions):

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ACTIVE_EVENT_ID=uuid-of-active-event
VITE_SUPABASE_STORAGE_BUCKET=feedback-photos
```

## 2. Database Schema

Run the SQL below in Supabase (SQL Editor) to create the necessary tables.

```sql
-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- Event attendees (roster uploaded manually)
create table if not exists public.event_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  email text not null,
  name text,
  has_participated boolean default false,
  last_feedback_at timestamptz,
  created_at timestamptz default now(),
  unique (event_id, email)
);

-- Feedback captured via the app
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  attendee_id uuid references public.event_attendees(id) on delete set null,
  email text not null,
  score integer check (score between 1 and 10),
  satisfaction_label text,
  sentiment_context text,
  photo_path text,
  photo_url text,
  submitted_at timestamptz default now()
);
```

### Optional indexes for faster lookups

```sql
create index if not exists idx_event_attendees_event_email
  on public.event_attendees (event_id, email);

create index if not exists idx_feedback_event_email
  on public.feedback (event_id, email);
```

## 3. Storage Bucket

Create a public storage bucket to keep captured photos:

1. Navigate to **Storage** → **Buckets** → **New bucket**
2. Bucket name: `feedback-photos` (or match `VITE_SUPABASE_STORAGE_BUCKET`)
3. Enable "Public bucket" (needed to display confirmation image)
4. Optionally, add a folder per event for organisation

> **Security Tip:** If you prefer private storage, remove public access and generate signed URLs instead. You’ll need to adjust the code to request signed URLs via Supabase Edge Functions or service role keys.

## 4. Seed Attendees

You can bulk insert via CSV or SQL. Example CSV headers:

```
email,name,event_id
alice@example.com,Alice Johnson,6d9a0f34-e75b-44aa-a0d7-b2c61a7d6df7
bob@example.com,Bob Smith,6d9a0f34-e75b-44aa-a0d7-b2c61a7d6df7
```

Upload through **Table Editor** → `event_attendees` → **Import data**.

## 5. Event Configuration

- Create an event row and note the `id` (UUID). Paste this into `.env` as `VITE_ACTIVE_EVENT_ID`.
- Update the roster before each event, setting `has_participated` back to `false` if you need to reuse the list.

## 6. RLS Policies (Recommended)

If Row Level Security is enabled (default in Supabase), add policies to allow the anon key to read the relevant data and insert feedback. Example policies:

```sql
-- Allow read access to attendees list for the active event
alter table public.event_attendees enable row level security;

create policy "allow roster read"
  on public.event_attendees
  for select
  using (true);

-- Allow inserting feedback
alter table public.feedback enable row level security;

create policy "allow feedback insert"
  on public.feedback
  for insert
  with check (true);

-- Allow updating attendee participation flag
create policy "allow attendee update"
  on public.event_attendees
  for update
  using (true)
  with check (true);
```

Tailor these policies to your security model (e.g., restrict by event or by API key role).

## 7. Testing the Flow

1. Set `VITE_ACTIVE_EVENT_ID` to your event UUID
2. Add an attendee with `has_participated = false`
3. Run the app, enter the email, capture feedback
4. Verify the feedback row + stored image appear in Supabase

---

Your Supabase backend is now ready to power the instant feedback workflow. 🎉



