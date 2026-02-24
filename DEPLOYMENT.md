# Deployment Guide - JobShield AI

## Quick Deploy to Vercel (Recommended - FREE)

### Prerequisites
1. GitHub account (already done ✅)
2. Vercel account (free at https://vercel.com)
3. Your Groq API key
4. PostgreSQL database (Neon free tier)

### Step-by-Step Deployment

#### 1. Sign up for Vercel
- Go to https://vercel.com/signup
- Sign up with your GitHub account
- Authorize Vercel to access your repositories

#### 2. Import Your Project
- Click "Add New Project"
- Select "Import Git Repository"
- Choose `Rajkishore25/hackrush`
- Click "Import"

#### 3. Configure Environment Variables
In the Vercel project settings, add these environment variables:

```
DATABASE_URL=your_neon_postgresql_url
GROQ_API_KEY=your_groq_api_key_here
SESSION_SECRET=your_random_secret_key_here
NODE_ENV=production
PORT=5000
```

**To get DATABASE_URL:**
- Go to https://console.neon.tech
- Sign up for free
- Create a new project
- Copy the connection string
- Or use the existing one from your local .env

#### 4. Deploy
- Click "Deploy"
- Wait 2-3 minutes for build to complete
- Your app will be live at: `https://your-project-name.vercel.app`

#### 5. Set up Database
After deployment, run migrations:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run database migration
vercel env pull .env.production
npm run db:push
```

---

## Alternative: Deploy to Render (Also FREE)

### Step-by-Step for Render

#### 1. Sign up for Render
- Go to https://render.com/register
- Sign up with GitHub

#### 2. Create PostgreSQL Database
- Click "New +"
- Select "PostgreSQL"
- Name: `jobshield-db`
- Plan: Free
- Click "Create Database"
- Copy the "Internal Database URL"

#### 3. Create Web Service
- Click "New +"
- Select "Web Service"
- Connect your GitHub repository: `Rajkishore25/hackrush`
- Configure:
  - **Name**: `jobshield-ai`
  - **Environment**: Node
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
  - **Plan**: Free

#### 4. Add Environment Variables
In the "Environment" section, add:
```
DATABASE_URL=<paste_internal_database_url>
GROQ_API_KEY=<your_groq_api_key>
SESSION_SECRET=<generate_random_string>
NODE_ENV=production
```

#### 5. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Your app will be live at: `https://jobshield-ai.onrender.com`

#### 6. Run Database Migrations
- Go to your web service dashboard
- Click "Shell" tab
- Run: `npm run db:push`

---

## Alternative: Deploy to Railway (FREE)

### Step-by-Step for Railway

#### 1. Sign up for Railway
- Go to https://railway.app
- Sign up with GitHub

#### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose `Rajkishore25/hackrush`

#### 3. Add PostgreSQL
- Click "New"
- Select "Database"
- Choose "PostgreSQL"
- Railway will automatically create and link it

#### 4. Configure Environment Variables
- Click on your web service
- Go to "Variables" tab
- Add:
```
GROQ_API_KEY=<your_groq_api_key>
SESSION_SECRET=<random_string>
NODE_ENV=production
```

#### 5. Deploy
- Railway auto-deploys on push
- Your app will be live at: `https://your-app.up.railway.app`

---

## Post-Deployment Checklist

✅ Database is connected and migrations are run
✅ Environment variables are set correctly
✅ App is accessible via the deployment URL
✅ Test the scan functionality
✅ Generate a test report
✅ Check error logs if something fails

---

## Troubleshooting

### Build Fails
- Check build logs in deployment platform
- Ensure all dependencies are in package.json
- Verify Node version (should be 20+)

### Database Connection Error
- Verify DATABASE_URL is correct
- Check if database allows external connections
- Run `npm run db:push` to create tables

### API Key Issues
- Verify GROQ_API_KEY is set correctly
- Check if key has rate limits
- Test key at https://console.groq.com

### Session Errors
- Generate a strong SESSION_SECRET
- Use: `openssl rand -base64 32`

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS CNAME record

---

## Monitoring & Logs

### Vercel
- View logs: Project → Deployments → Click deployment → Logs
- Real-time: `vercel logs`

### Render
- View logs: Dashboard → Your Service → Logs tab

### Railway
- View logs: Project → Service → Deployments → Logs

---

## Cost Estimates

All platforms offer FREE tiers:

| Platform | Free Tier | Limits |
|----------|-----------|--------|
| Vercel | ✅ Free | 100GB bandwidth/month |
| Render | ✅ Free | 750 hours/month |
| Railway | ✅ Free | $5 credit/month |
| Neon DB | ✅ Free | 512MB storage |
| Groq API | ✅ Free | Rate limited |

**Total Cost: $0/month** 🎉

---

## Need Help?

- Check deployment logs for errors
- Verify all environment variables
- Test database connection
- Contact support on respective platforms
