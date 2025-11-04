# 🎓 MoodBoard Workshop Guide

## Workshop Overview

**Duration:** 2 hours  
**Difficulty:** Beginner to Intermediate  
**Prerequisites:** Basic HTML/CSS/JavaScript knowledge

## Workshop Agenda

### 0-10 minutes: Introduction
- Welcome to GDG Campus Chapter
- Overview of cross-cloud innovation
- Demo of final MoodBoard app
- What we'll build today

### 10-25 minutes: Setup
1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Note your project ID

2. **Enable Vision API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Cloud Vision API"
   - Click "Enable"

3. **Get API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key
   - **Important:** Restrict the key to Cloud Vision API only

4. **Project Setup**
   ```bash
   # Clone/download the project
   cd MOODBOARD
   
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Add your API key to .env
   VITE_GOOGLE_CLOUD_VISION_API_KEY=your_api_key_here
   ```

### 25-60 minutes: Development

#### Understanding the Project Structure
```
src/
├── components/
│   ├── Header.jsx          # Navigation bar
│   ├── Hero.jsx            # Landing page with upload area
│   ├── ImageUploader.jsx   # Image upload and preview
│   ├── ResultsDisplay.jsx  # Display detected labels
│   └── Background3D.jsx   # 3D particle background
├── App.jsx                 # Main application logic
└── main.jsx                # Entry point
```

#### Key Concepts to Learn

1. **React Hooks**
   - `useState`: Managing component state
   - `useRef`: Accessing DOM elements
   - `useMemo`: Optimizing performance

2. **Google Cloud Vision API**
   - How to make API calls
   - Processing API responses
   - Handling errors

3. **Modern UI/UX**
   - CSS Grid and Flexbox
   - Animations with Framer Motion
   - Responsive design principles

4. **3D Graphics**
   - Three.js basics
   - React Three Fiber
   - Particle systems

#### Hands-on Tasks

1. **Test the App Locally**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

2. **Upload an Image**
   - Try uploading different types of images
   - Observe the detected labels

3. **Customize Colors** (Optional)
   - Edit `src/index.css`
   - Change CSS variables

4. **Modify Labels Display** (Optional)
   - Edit `src/components/ResultsDisplay.jsx`
   - Change how labels are shown

### 60-90 minutes: Deployment

Choose one deployment method:

#### Option A: AWS S3 (Recommended - Static Hosting)
1. Build: `npm run build`
2. Create S3 bucket (uncheck "Block public access")
3. Enable static website hosting (index: `index.html`, error: `index.html`)
4. Configure bucket policy for public read access
5. Upload all files from `dist/` folder
6. Get your website URL from Properties → Static website hosting
7. Share your URL: `http://your-bucket-name.s3-website-region.amazonaws.com`

📋 **Use the checklist:** See [AWS_S3_DEPLOYMENT_CHECKLIST.md](./AWS_S3_DEPLOYMENT_CHECKLIST.md) for detailed step-by-step instructions.

#### Option B: AWS Amplify (Recommended)
1. Push code to GitHub
2. Connect to AWS Amplify
3. Add environment variables
4. Deploy automatically
5. Share your URL

#### Option C: Vercel/Netlify
1. Push to GitHub
2. Connect repository
3. Add environment variables
4. Deploy
5. Share your URL

**Detailed instructions:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

### 90-120 minutes: Showcase & Wrap-up

1. **Student Showcases** (30 minutes)
   - Students share their deployed apps
   - Discuss challenges and solutions
   - Show creative customizations

2. **Q&A Session** (15 minutes)
   - Technical questions
   - Deployment issues
   - Next steps

3. **Wrap-up** (15 minutes)
   - Key takeaways
   - Resources for further learning
   - Announce next GDG event

## Learning Outcomes

By the end of this workshop, participants will:

✅ Understand how to integrate Google Cloud Vision API  
✅ Know how to build modern React applications  
✅ Learn to deploy static sites on AWS  
✅ Experience working with AI/ML APIs  
✅ Gain hands-on experience with modern web technologies  
✅ Have a portfolio-worthy project to share

## Troubleshooting Common Issues

### API Key Not Working
- **Issue:** "API key not found" error
- **Solution:** Check `.env` file exists and has correct variable name

### Build Errors
- **Issue:** `npm install` fails
- **Solution:** 
  - Check Node.js version (18+)
  - Delete `node_modules` and `package-lock.json`
  - Run `npm install` again

### API Rate Limits
- **Issue:** API requests fail
- **Solution:** 
  - Check Google Cloud billing is enabled
  - Verify API quotas
  - Wait a minute and retry

### Deployment Issues
- **Issue:** App not loading after deployment
- **Solution:** 
  - Check environment variables are set
  - Verify build completed successfully
  - Check browser console for errors

## Extension Ideas

Want to take this further? Try these:

1. **Add Image Filters**
   - Apply CSS filters before analysis
   - Compare filtered vs original

2. **Batch Processing**
   - Upload multiple images
   - Analyze all at once

3. **Save Results**
   - Store results in localStorage
   - Create a gallery of analyzed images

4. **Export Results**
   - Download labels as JSON
   - Generate a report PDF

5. **Advanced AI Features**
   - Sentiment analysis
   - Color palette extraction
   - Similar image search

## Resources

- [React Documentation](https://react.dev/)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [Three.js Documentation](https://threejs.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Vite Documentation](https://vitejs.dev/)

## Support

For workshop-related questions:
- Ask your workshop leader
- Check the [README.md](./README.md)
- Visit GDG Campus Chapter resources

---

**Happy Coding! 🚀**

*Built for GDG Campus Chapter Workshop*

