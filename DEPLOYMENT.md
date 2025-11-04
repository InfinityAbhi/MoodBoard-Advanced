# 🚀 Deployment Guide for MoodBoard

This guide covers multiple deployment options for the MoodBoard application.

## 📋 Pre-Deployment Checklist

1. ✅ Build the project successfully: `npm run build`
2. ✅ Test locally with `npm run preview`
3. ✅ Set up Google Cloud Vision API key
4. ✅ Ensure all environment variables are configured

## Option 1: AWS S3 + CloudFront (Recommended for Production)

> **Workshop Note:** This is the recommended deployment method for the workshop. AWS S3 provides simple, cost-effective static website hosting.

### Step 1: Build the Application with Environment Variable
```bash
# Make sure your .env file has your API key
# VITE_GOOGLE_CLOUD_VISION_API_KEY=your_api_key_here

# Build the application (the API key will be embedded in the build)
npm run build
```

> **Important:** Since S3 is static hosting, the API key from your `.env` file will be embedded in the JavaScript bundle during build. This is normal for client-side apps, but make sure to restrict your Google Cloud API key to only your domain.

### Step 2: Create S3 Bucket
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Bucket name: `moodboard-app` (or your preferred name - must be globally unique)
4. Region: Choose closest to your users (e.g., `us-east-1`)
5. **Uncheck "Block all public access"** (we need public read access for website hosting)
   - Acknowledge the warning about making the bucket public
6. Scroll down and enable **"Static website hosting"**
7. Index document: `index.html`
8. Error document: `index.html` (important for React Router/SPA routing)
9. Click "Create bucket"

### Step 3: Configure Bucket Policy
1. Go to your bucket → Permissions → Bucket Policy
2. Add this policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```
Replace `your-bucket-name` with your actual bucket name.

### Step 4: Upload Files

**Option A: Using AWS CLI (Faster for Updates)**
```bash
# Install AWS CLI first: https://aws.amazon.com/cli/
# Configure with: aws configure (you'll need AWS Access Key ID and Secret)

# Upload all files from dist/ folder to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# The --delete flag removes files in S3 that don't exist in dist/
```

**Option B: Using AWS Console (Easier for First Time)**
1. Go to your S3 bucket in AWS Console
2. Click "Upload"
3. Click "Add files" or drag and drop
4. Select **ALL files and folders** from your `dist/` directory:
   - `index.html`
   - `assets/` folder (with all JS, CSS files)
   - Any other files in `dist/`
5. Click "Upload"
6. Wait for upload to complete

### Step 5: Get Your Website URL
1. Go to Properties → Static website hosting
2. Your website endpoint will be shown
3. Format: `http://your-bucket-name.s3-website-region.amazonaws.com`

### Step 6: Optional - Setup CloudFront (CDN) for HTTPS

> **Note:** S3 website hosting provides HTTP only. For HTTPS and better performance, use CloudFront.

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click "Create distribution"
3. **Origin domain:** Select your S3 bucket (choose the website endpoint, not the REST API endpoint)
4. **Viewer protocol policy:** "Redirect HTTP to HTTPS" (to force HTTPS)
5. **Default root object:** `index.html`
6. **Error pages:** 
   - Add custom error response for 403: redirect to `/index.html` with HTTP 200
   - Add custom error response for 404: redirect to `/index.html` with HTTP 200
   (This is crucial for React SPA routing)
7. Click "Create distribution"
8. Wait for deployment (~15 minutes)
9. Your app will be available at: `https://[distribution-id].cloudfront.net`

**After CloudFront is active:**
- Update your Google Cloud API key restrictions to include the CloudFront URL
- Use the CloudFront URL instead of the S3 website URL

## Option 2: AWS Amplify (Easiest)

### Step 1: Prepare Repository
1. Push your code to GitHub/GitLab/Bitbucket
2. Ensure `.env.example` is in the repository

### Step 2: Create Amplify App
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Choose your Git provider
4. Authorize and select your repository
5. Select the branch (usually `main` or `master`)

### Step 3: Configure Build Settings
The `amplify.yml` file is already configured, but verify:
- Build command: `npm run build`
- Output directory: `dist`

### Step 4: Add Environment Variables
1. In Amplify Console → App settings → Environment variables
2. Add variable:
   - Key: `VITE_GOOGLE_CLOUD_VISION_API_KEY`
   - Value: Your API key
3. Save

### Step 5: Deploy
1. Click "Save and deploy"
2. Wait for build to complete (~5-10 minutes)
3. Your app will be live at: `https://[branch-name].[app-id].amplifyapp.com`

### Step 6: Custom Domain (Optional)
1. In Amplify Console → Domain management
2. Add your custom domain
3. Follow DNS setup instructions

## Option 3: Vercel

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
# Build first
npm run build

# Deploy
vercel
```

### Step 3: Add Environment Variables
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `VITE_GOOGLE_CLOUD_VISION_API_KEY`
5. Redeploy

### Alternative: GitHub Integration
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add environment variables
5. Deploy automatically

## Option 4: Netlify

### Step 1: Build Settings
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Step 3: Add Environment Variables
1. Go to Netlify Dashboard
2. Site settings → Environment variables
3. Add: `VITE_GOOGLE_CLOUD_VISION_API_KEY`
4. Redeploy

### Alternative: Drag & Drop
1. Build: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag `dist` folder
4. Add environment variables in site settings

## 🔒 Security Best Practices

### API Key Security
- ❌ Never commit `.env` file to Git
- ✅ Use environment variables in hosting platform
- ✅ Restrict API key in Google Cloud Console
- ✅ Set up API key restrictions to allow only Cloud Vision API
- ✅ Set HTTP referrer restrictions for web apps

### Google Cloud API Key Restrictions
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under "Application restrictions":
   - Select "HTTP referrers"
   - Add your domain(s): `https://yourdomain.com/*`
4. Under "API restrictions":
   - Select "Restrict key"
   - Choose "Cloud Vision API"
5. Save

## 🌍 CORS Configuration

If you encounter CORS issues:

1. **Google Cloud**: Ensure your API key has proper restrictions
2. **AWS**: If using CloudFront, configure CORS headers
3. **Custom Backend**: Consider using a backend proxy for API calls

## 📊 Performance Optimization

### After Deployment:
1. Enable compression (gzip/brotli)
2. Enable caching headers
3. Use CDN (CloudFront/Vercel Edge/Netlify CDN)
4. Optimize images before upload
5. Enable HTTPS (all platforms do this automatically)

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

### Environment Variables Not Working
- Ensure variable name starts with `VITE_`
- Restart dev server after adding variables
- Check hosting platform's environment variable settings

### API Errors
- Verify API key is correct
- Check API key restrictions
- Ensure Vision API is enabled
- Check browser console for detailed errors

### Routing Issues (404 on refresh)
- Configure redirect rules (all routes → index.html)
- Check hosting platform's SPA configuration

## 📝 Quick Reference

| Platform | Build Command | Output Dir | URL Format |
|----------|--------------|------------|------------|
| AWS S3 | `npm run build` | `dist` | `http://bucket.s3-website-region.amazonaws.com` |
| AWS Amplify | Auto | `dist` | `https://branch.app-id.amplifyapp.com` |
| Vercel | Auto | `dist` | `https://project.vercel.app` |
| Netlify | Auto | `dist` | `https://project.netlify.app` |

## ✅ Post-Deployment Checklist

- [ ] App loads correctly
- [ ] Image upload works
- [ ] API calls succeed
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Custom domain configured (if needed)
- [ ] Analytics added (optional)
- [ ] Error tracking set up (optional)

---

**Happy Deploying! 🚀**

