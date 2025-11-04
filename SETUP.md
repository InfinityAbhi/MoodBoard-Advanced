# ⚡ Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add your Google Cloud Vision API key:

```
VITE_GOOGLE_CLOUD_VISION_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your actual API key from Google Cloud Console.

## Step 3: Get Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable "Cloud Vision API" from APIs & Services > Library
4. Go to APIs & Services > Credentials
5. Click "Create Credentials" > "API Key"
6. Copy the key and paste it in your `.env` file

## Step 4: Run the App

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Step 5: Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

---

**Troubleshooting:**

- If you get "API key not found" error, make sure:
  - The `.env` file exists in the root directory
  - The variable name is exactly `VITE_GOOGLE_CLOUD_VISION_API_KEY`
  - You've restarted the dev server after creating/editing `.env`

- If dependencies fail to install:
  - Make sure you have Node.js 18+ installed
  - Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

