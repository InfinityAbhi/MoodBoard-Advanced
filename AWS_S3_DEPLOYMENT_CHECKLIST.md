# ✅ AWS S3 Deployment Checklist

Quick reference guide for deploying MoodBoard to AWS S3.

## 📋 Pre-Deployment

- [ ] Google Cloud Vision API key is ready
- [ ] `.env` file exists with `VITE_GOOGLE_CLOUD_VISION_API_KEY=your_key`
- [ ] AWS account is created (free tier is fine)
- [ ] Node.js 18+ is installed

## 🏗️ Build Steps

- [ ] Run `npm install` (if not done already)
- [ ] Verify `.env` file has your API key
- [ ] Run `npm run build`
- [ ] Check that `dist/` folder was created with files

## ☁️ AWS S3 Setup

### Create Bucket
- [ ] Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
- [ ] Click "Create bucket"
- [ ] Enter unique bucket name (e.g., `moodboard-yourname-2024`)
- [ ] Select region (e.g., `us-east-1`)
- [ ] **Uncheck "Block all public access"**
- [ ] Acknowledge public access warning
- [ ] Scroll to "Static website hosting" section
- [ ] Enable static website hosting
- [ ] Set index document: `index.html`
- [ ] Set error document: `index.html`
- [ ] Click "Create bucket"

### Configure Permissions
- [ ] Go to bucket → Permissions tab
- [ ] Click "Bucket Policy"
- [ ] Paste the bucket policy (replace `your-bucket-name`):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```
- [ ] Click "Save changes"

### Upload Files
**Option 1: AWS Console (Recommended for Workshop)**
- [ ] Go to bucket → Objects tab
- [ ] Click "Upload"
- [ ] Click "Add files"
- [ ] Select ALL files from `dist/` folder:
  - [ ] `index.html`
  - [ ] Entire `assets/` folder
- [ ] Click "Upload"
- [ ] Wait for upload to complete

**Option 2: AWS CLI**
- [ ] Install AWS CLI: `brew install awscli` (Mac) or download from AWS
- [ ] Configure: `aws configure`
- [ ] Upload: `aws s3 sync dist/ s3://your-bucket-name --delete`

## 🌐 Access Your Site

- [ ] Go to bucket → Properties tab
- [ ] Scroll to "Static website hosting"
- [ ] Copy the "Bucket website endpoint" URL
- [ ] Format: `http://your-bucket-name.s3-website-region.amazonaws.com`
- [ ] Open URL in browser
- [ ] Test image upload and analysis

## 🔒 Secure Your API Key

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [ ] Click on your API key
- [ ] Under "Application restrictions" → Select "HTTP referrers"
- [ ] Add your S3 website URL: `http://your-bucket-name.s3-website-*.amazonaws.com/*`
- [ ] Under "API restrictions" → Select "Restrict key"
- [ ] Choose "Cloud Vision API"
- [ ] Click "Save"

## 🚀 Optional: Add HTTPS with CloudFront

- [ ] Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
- [ ] Click "Create distribution"
- [ ] Origin domain: Select your S3 bucket website endpoint
- [ ] Viewer protocol: "Redirect HTTP to HTTPS"
- [ ] Default root object: `index.html`
- [ ] Add error pages:
  - [ ] 403 → `/index.html` (200)
  - [ ] 404 → `/index.html` (200)
- [ ] Click "Create distribution"
- [ ] Wait ~15 minutes for deployment
- [ ] Use CloudFront URL: `https://[id].cloudfront.net`
- [ ] Update Google Cloud API key restrictions with CloudFront URL

## ✅ Final Verification

- [ ] Website loads correctly
- [ ] Can upload images
- [ ] Image analysis works
- [ ] Labels appear after analysis
- [ ] Works on mobile device
- [ ] API key is restricted to your domain

## 🎉 Success!

Your MoodBoard is now live on AWS S3!

**Share your URL:** `http://your-bucket-name.s3-website-region.amazonaws.com`

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
