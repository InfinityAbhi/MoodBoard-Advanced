# 🎨 MoodBoard - AI-Powered Image Analysis

A stunning, modern web application that uses Google Cloud Vision API to analyze images and detect emotions, objects, and themes. Built with React, Three.js, and Framer Motion for a world-class 3D UI/UX experience.

![MoodBoard](https://img.shields.io/badge/MoodBoard-AI%20Powered-purple) ![React](https://img.shields.io/badge/React-18.2-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.158-black)

## ✨ Features

- 🎯 **AI-Powered Analysis** - Uses Google Cloud Vision API to detect labels, objects, and emotions
- 🎨 **Stunning 3D UI** - Beautiful 3D particle background with smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🚀 **Instant Deployment** - Ready to deploy on AWS S3 or AWS Amplify
- 💫 **Modern UX** - Smooth animations and transitions with Framer Motion
- 🎭 **Emotion Detection** - Detects joy, sorrow, anger, and surprise in faces
- 🏷️ **Smart Labeling** - Automatically tags images with relevant labels
- 🎯 **Object Detection** - Identifies objects within images

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Cloud account with Vision API enabled
- Google Cloud Vision API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MOODBOARD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your Google Cloud Vision API key:
   ```
   VITE_GOOGLE_CLOUD_VISION_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder, ready for deployment.

## 🚀 Deployment

### Option 1: AWS S3 (Recommended for Workshop)

> **Quick Start:** See [AWS_S3_DEPLOYMENT_CHECKLIST.md](./AWS_S3_DEPLOYMENT_CHECKLIST.md) for a step-by-step checklist.

1. **Build the project**
   ```bash
   # Make sure .env has your Google Cloud Vision API key
   npm run build
   ```

2. **Create an S3 bucket**
   - Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
   - Create a new bucket with public read access
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html`

3. **Upload files**
   - Upload all files from `dist/` folder to your S3 bucket
   - Or use AWS CLI: `aws s3 sync dist/ s3://your-bucket-name --delete`

4. **Get your website URL**
   - Check bucket Properties → Static website hosting
   - Your site will be at: `http://your-bucket-name.s3-website-region.amazonaws.com`

5. **Add CloudFront for HTTPS (Optional)**
   - Create CloudFront distribution pointing to your S3 bucket
   - Get HTTPS URL: `https://[id].cloudfront.net`

📖 **Detailed instructions:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Option 2: AWS Amplify

1. **Connect your repository**
   - Go to AWS Amplify Console
   - Connect your Git repository

2. **Configure build settings**
   ```
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Add environment variables**
   - In Amplify Console, go to Environment variables
   - Add `VITE_GOOGLE_CLOUD_VISION_API_KEY` with your API key

4. **Deploy**
   - Save and deploy

### Option 3: Vercel/Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Connect your repository to Vercel/Netlify
   - Add environment variable: `VITE_GOOGLE_CLOUD_VISION_API_KEY`
   - Deploy!

## 🔑 Getting Google Cloud Vision API Key

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)

2. **Create a new project** (or select existing)

3. **Enable Vision API**
   - Go to APIs & Services > Library
   - Search for "Cloud Vision API"
   - Click Enable

4. **Create credentials**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "API Key"
   - Copy your API key

5. **Restrict API Key (Recommended)**
   - Click on your API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Cloud Vision API"
   - Save

6. **Add to your project**
   - Add the key to your `.env` file

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library
- **Google Cloud Vision API** - AI image analysis

## 📁 Project Structure

```
MOODBOARD/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation
│   │   ├── Hero.jsx            # Landing page
│   │   ├── ImageUploader.jsx   # Image upload component
│   │   ├── ResultsDisplay.jsx  # Results display
│   │   └── Background3D.jsx    # 3D particle background
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── dist/                       # Production build
├── .env.example                # Environment variables template
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🎨 Customization

### Changing Colors

Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  /* ... */
}
```

### Adjusting 3D Particles

Edit `src/components/Background3D.jsx`:
```jsx
<FloatingParticles count={1000} /> // Change count
```

## 🐛 Troubleshooting

### API Key Issues
- Make sure your API key is correctly set in `.env`
- Ensure the Vision API is enabled in Google Cloud Console
- Check API key restrictions

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Deployment Issues
- Ensure environment variables are set in your hosting platform
- Check build output directory is correct
- Verify API key is accessible from deployed URL

## 📝 License

This project is created for the Google Developer Group (Campus Chapter) workshop.

## 🤝 Contributing

This is a workshop project. Feel free to fork and customize for your needs!

## 📧 Support

For workshop-related questions, contact your GDG Campus Chapter organizers.

---

**Built with ❤️ for GDG Campus Chapter Workshop**

