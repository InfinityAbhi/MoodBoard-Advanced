# 🎓 MoodBoard Workshop Guide

## Workshop Overview

**Duration:** 2 hours  
**Difficulty:** Beginner to Intermediate  
**Prerequisites:** Basic HTML/CSS/JavaScript, Google Cloud, and Supabase familiarity

## Workshop Agenda

### 0–10 minutes · Introduction
- Welcome to GDG Campus Chapter
- Why instant event feedback matters
- Live demo of the MoodBoard Feedback Station
- Overview of tools: Google Vision, Supabase, AWS S3

### 10–30 minutes · Platform Setup
1. **Google Cloud Vision**
   - Create/select a project
   - Enable Cloud Vision API
   - Create an API key + restrict to Vision API
2. **Supabase**
   - Create/select a Supabase project
   - Review `SUPABASE_SETUP.md` for SQL schema
   - Create `feedback-photos` storage bucket (public)
3. **Local Environment**
   ```bash
   git clone <repo>
   cd MOODBOARD
   npm install
   cp env.example .env  # or create .env and copy variables from SETUP.md
   ```
   Populate `.env` with:
   ```
   VITE_GOOGLE_CLOUD_VISION_API_KEY=...
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_ACTIVE_EVENT_ID=...
   VITE_SUPABASE_STORAGE_BUCKET=feedback-photos
   ```

### 30–55 minutes · Data Prep
- Create an `events` row and note the UUID (active event)
- Import attendee emails into `event_attendees` (`event_id`, `email`, `name`, `has_participated=false`)
- Walkthrough of Supabase Table Editor & CSV import

### 55–95 minutes · Code Deep Dive
- **Architecture walkthrough**
  - `App.jsx` step controller (email → camera → summary)
  - Supabase client + helper utilities
  - Satisfaction mapping logic in `utils/satisfaction.js`
- **UI Components**
  - `EmailStep` – form validation, error states
  - `CameraCapture` – `getUserMedia`, canvas capture, UX best practices
  - `FeedbackSummary` – confirmation / ready for next attendee
- **Integrations**
  - Vision API request payload + response parsing
  - Supabase storage upload + public URL
  - Enforcing one feedback per attendee (update `has_participated`)
- Hands-on: run `npm run dev`, verify email, capture a test shot

### 95–115 minutes · Deployment
Pick a path (demo all if time allows):
- **AWS S3 Static Hosting** (recommended) – follow `AWS_S3_DEPLOYMENT_CHECKLIST.md`
- **AWS Amplify** – connect repo, add env vars, automatic builds
- **Vercel / Netlify** – quick deploy with environment variables

### 115–120 minutes · Wrap-Up
- Showcase: attendees share live links and Supabase dashboards
- Q&A: troubleshooting, best practices, extensions
- Next steps + upcoming GDG events

## Learning Outcomes

Participants will:

✅ Configure Google Vision + Supabase for real-time feedback  
✅ Build a React workflow that talks to third-party APIs securely  
✅ Capture camera input and process it in-browser  
✅ Persist data + media using Supabase tables and storage  
✅ Deploy a production-ready static web app (S3 / Amplify / Vercel)  
✅ Leave with a polished, creative project for their portfolio

## Troubleshooting Highlights

- **Camera blocked:** ensure HTTPS + granted permissions; refresh page.
- **Email rejected:** confirm attendee exists for `VITE_ACTIVE_EVENT_ID` and `has_participated` is `false`.
- **Supabase 401:** invalid URL/anon key or missing RLS policy. Re-check `.env` and policies in `SUPABASE_SETUP.md`.
- **Vision API errors:** verify API key, billing, and face presence in frame.
- **Build issues:** Node 18+, clear `node_modules`, reinstall.

## Extension Ideas

1. **Multiple Events UI** – allow organisers to pick active event from dropdown
2. **Signed Storage URLs** – keep images private but accessible via time-limited links
3. **Edge Functions** – move scoring logic to Supabase backend for auditing
4. **Analytics Dashboard** – chart satisfaction over time per event
5. **Multi-Face Handling** – capture group sentiments, aggregate scores

## Resources

- [SETUP.md](./SETUP.md) – environment configuration
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) – schema + policies
- [DEPLOYMENT.md](./DEPLOYMENT.md) – hosting guides
- [Google Cloud Vision Docs](https://cloud.google.com/vision/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

---

**Happy Coding! 🚀**

*Built for GDG Campus Chapter Workshop*

