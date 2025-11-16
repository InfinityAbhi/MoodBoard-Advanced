# 🎥 MoodBoard Feedback Station

A production-ready event feedback kiosk that verifies attendees by email, captures their expression via webcam, scores satisfaction on a 1–10 scale, and stores everything in Supabase—powered by Google Cloud Vision API.

![MoodBoard](https://img.shields.io/badge/MoodBoard-Feedback%20AI-purple) ![React](https://img.shields.io/badge/React-18.2-blue) ![Three.js](https://img.shields.io/badge/Three.js-background-black)

## ✨ What it does

- ✅ **Attendee Verification** – check emails against the Supabase roster for the active event
- 🎥 **Instant Camera Capture** – open the webcam, guide the participant, and snap a frame
- 😀 **AI Satisfaction Scoring** – use Google Vision face analysis to produce a 1–10 score and one of five labels (Frustrated → Delighted)
- ☁️ **Supabase Persistence** – store the photo, score, label, and context with the attendee record
- 🔒 **One Shot Rule** – each attendee can submit feedback only once per event
- 🌀 **Immersive UI** – 3D ambient background, smooth Framer Motion transitions, responsive design

## 🧭 Workflow at the booth

1. Staff loads the attendee list into Supabase (`event_attendees` table)
2. Participant types their email → app verifies they belong to the active event
3. Camera fires up → participant smiles (or not!) → capture
4. Vision API scores the expression, maps it to one of five satisfaction labels
5. Result + image stored in Supabase (`feedback` table + `feedback-photos` bucket)
6. Summary screen confirms success → ready for the next attendee

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Google Cloud project with Vision API enabled
- Supabase project (URL + anon key + tables from `SUPABASE_SETUP.md`)

### Setup

```bash
git clone <repository-url>
cd MOODBOARD
npm install
```

Create `.env` (see `env.example` or `SETUP.md` for details) and add:

```
VITE_GOOGLE_CLOUD_VISION_API_KEY=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ACTIVE_EVENT_ID=...
VITE_SUPABASE_STORAGE_BUCKET=feedback-photos   # optional override
```

Then run the dev server:

```bash
npm run dev
```

Open http://localhost:5173.

Need Supabase tables, storage bucket, or policies? Follow `SUPABASE_SETUP.md`.

### Build for production

```bash
npm run build
```

The optimised bundle lives in `dist/` and can be deployed to AWS S3, Amplify, Vercel, Netlify, etc. (See `DEPLOYMENT.md` + `AWS_S3_DEPLOYMENT_CHECKLIST.md`.)

## 🧱 Project Structure

```
src/
├── App.jsx                 # Step controller + Supabase integration
├── App.css                 # Layout styles
├── components/
│   ├── Background3D.jsx    # Three.js particle background
│   ├── CameraCapture.jsx   # Webcam capture + UI
│   ├── CameraCapture.css
│   ├── EmailStep.jsx       # Email verification screen
│   ├── EmailStep.css
│   ├── FeedbackSummary.jsx # Confirmation screen
│   ├── FeedbackSummary.css
│   └── Header.{jsx,css}    # Top navigation and branding
├── lib/
│   └── supabaseClient.js   # Supabase client factory
├── utils/
│   └── satisfaction.js     # Vision analysis → score/label helper
├── index.css               # Global theme tokens
└── main.jsx                # Entry point
```

Additional docs:
- `SETUP.md` – environment & configuration steps
- `SUPABASE_SETUP.md` – database schema + storage instructions
- `DEPLOYMENT.md`, `AWS_S3_DEPLOYMENT_CHECKLIST.md` – hosting guides

## 🧠 Satisfaction Mapping

Scores are derived from Google Vision face likelihoods:

| Score | Label         | Meaning                          |
|-------|---------------|----------------------------------|
| 1–2   | Frustrated    | Strong negative signals          |
| 3–4   | Disappointed  | Mild negative expression         |
| 5–6   | Neutral       | No dominant emotion detected     |
| 7–8   | Satisfied     | Positive cues present            |
| 9–10  | Delighted     | Clear joy / delighted expression |

Context text is stored alongside the score to help organisers interpret results.

## 🧰 Tech Stack

- **React 18 + Vite** – modern web app foundation
- **Framer Motion** – buttery smooth UI transitions
- **Three.js + React Three Fiber** – reactive 3D particle background
- **Supabase JS** – attendee lookup, feedback storage, file uploads
- **Google Cloud Vision API** – face analysis + emotion scoring
- **Lucide Icons** – crisp, lightweight iconography

## 📚 Workshop Flow Support

See `WORKSHOP_GUIDE.md` for a full 2-hour workshop plan covering:
- Creating events & attendee lists
- Connecting Supabase + environment keys
- Running the kiosk in practice
- Deploying to AWS S3 / Amplify for live demos

## 🐛 Troubleshooting

- **Camera blocked** → Grant browser camera permissions, refresh, check HTTPS.
- **Email rejected** → Ensure the attendee email exists in `event_attendees` for the active event and `has_participated` is false.
- **Supabase errors** → Verify env vars, storage bucket, and RLS policies.
- **Vision API errors** → Confirm API key, billing status, and that faces are in frame.

## 📄 License

Created for the Google Developer Group (Campus Chapter) workshop. Fork, adapt, and make it yours.

---

**Built with ❤️ for lightning-fast event feedback.**

