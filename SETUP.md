# ⚡ Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Environment File

```bash
# Create .env file (if it does not exist)
touch .env
```

Add the following variables (values go after the `=` sign):

```
# Google Cloud Vision API
VITE_GOOGLE_CLOUD_VISION_API_KEY=your_google_cloud_api_key

# Supabase project
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Event configuration
VITE_ACTIVE_EVENT_ID=uuid-of-the-event-you-are-running
VITE_SUPABASE_STORAGE_BUCKET=feedback-photos   # optional, defaults to feedback-photos
```

**Notes:**
- Ask your Supabase admin for the URL, anon key, and event ID if you don’t have them.
- The Supabase storage bucket (`feedback-photos`) must exist before running the app.
- Never commit `.env` or share these keys publicly.

## Step 3: Configure Google Cloud Vision API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable "Cloud Vision API" from APIs & Services > Library
4. Go to APIs & Services > Credentials
5. Click "Create Credentials" > "API Key"
6. Copy the key and paste it in your `.env` file
7. Restrict the key to Cloud Vision API + your production domain(s)

## Step 4: Prepare Supabase

1. Create (or use an existing) Supabase project
2. Ensure the following tables and storage bucket exist (see `SUPABASE_SETUP.md`):
   - `events`
   - `event_attendees`
   - `feedback`
   - Storage bucket: `feedback-photos`
3. Insert your attendee list into `event_attendees` with `event_id` + `email`

## Step 5: Run the App

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 6: Build for Production

```bash
npm run build
```

The optimised build outputs to the `dist` directory, ready for deployment.

---

**Troubleshooting:**

- "API key not found" → Check `.env` file, variable spelling, restart dev server.
- "Supabase client not initialised" → Ensure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.
- "No face detected" → Ask the participant to step closer, ensure good lighting, and retake.
- Install issues → Verify Node.js 18+, delete `node_modules` + `package-lock.json`, reinstall.

