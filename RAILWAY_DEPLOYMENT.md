# Railway Deployment Guide

This guide helps you deploy the LCL (Level Challenge List) project to Railway with Supabase as the backend database.

## Prerequisites

1. A [Supabase](https://supabase.com) account (free tier available)
2. A [Railway](https://railway.app) account
3. Your project code on GitHub (Railway works best with GitHub)

## Step 1: Set Up Supabase Database

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in details:
   - **Project name**: LCL-Challenge
   - **Database password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for initialization (2-3 minutes)

### 1.2 Create Database Tables

Once your Supabase project is ready:

1. Open your project and go to the **SQL Editor**
2. Click "New Query"
3. Copy and paste this SQL to create all required tables:

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  displayname TEXT NOT NULL,
  password TEXT NOT NULL,
  isadmin BOOLEAN DEFAULT FALSE,
  createdat TIMESTAMP DEFAULT NOW()
);

-- Levels table (approved levels)
CREATE TABLE levels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  levelid INTEGER,
  url TEXT,
  youtubeurl TEXT,
  thumbnail TEXT,
  difficulty TEXT,
  submittedby TEXT,
  submitteddate TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'approved',
  position INTEGER
);

-- Pending levels table (awaiting approval)
CREATE TABLE pending_levels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  levelid INTEGER,
  url TEXT,
  youtubeurl TEXT,
  thumbnail TEXT,
  difficulty TEXT,
  submittedby TEXT,
  submitteddate TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Settings table
CREATE TABLE settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en',
  darkbackground BOOLEAN DEFAULT TRUE
);

-- Create index for faster queries
CREATE INDEX idx_levels_status ON levels(status);
CREATE INDEX idx_pending_status ON pending_levels(status);
CREATE INDEX idx_users_email ON users(email);
```

4. Click "Run" to execute the SQL

### 1.3 Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (under "URLs") → This is your `SUPABASE_URL`
   - **anon public** key (under "Project API keys") → This is your `SUPABASE_KEY`

> ⚠️ **IMPORTANT**: Keep these credentials safe! They control access to your database.

## Step 2: Deploy to Railway

### 2.1 Connect Your GitHub Repository

1. Push your code to GitHub (or verify it's there)
2. Go to [Railway.app](https://railway.app)
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Authorize Railway to access your GitHub account
6. Select your repository (e.g., `LCL-level-challenge-list`)
7. Railway will auto-detect `package.json` and start deployment

### 2.2 Set Environment Variables on Railway

1. In Railway dashboard, find your project
2. Go to the **Variables** tab
3. Click "New Variable" and add:
   - **Name**: `SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL

4. Click "New Variable" again and add:
   - **Name**: `SUPABASE_KEY`
   - **Value**: Paste your Supabase anon public key

5. The deployment will automatically redeploy with these env vars

### 2.3 Get Your Railway App URL

1. Go to the **Deployments** tab
2. Your app URL will appear (like `https://lcl-proj-production.up.railway.app`)
3. This is your public app URL

## Step 3: Test Your Deployment

1. Open your Railway app URL in a browser
2. You should see the LCL app interface
3. Try these actions:
   - ✅ Register a new user
   - ✅ Submit a level
   - ✅ Check if data persists after refresh
   - ✅ Check browser console for any errors (F12)

## Troubleshooting

### 404 Error - "Failed to load resource"

**Cause**: Supabase credentials are missing or wrong

**Fix**:
1. Check environment variables in Railway:
   - Go to Variables tab
   - Verify both `SUPABASE_URL` and `SUPABASE_KEY` are set
   - Verify no typos or extra spaces
2. Check Supabase tables exist:
   - Go to Supabase Dashboard
   - Navigate to Table Editor
   - Verify you see: `users`, `levels`, `pending_levels`, `settings` tables
3. Redeploy after fixing:
   - In Railway, go to Deployments
   - Click the "Redeploy" button on latest deployment

### Database Connection Fails

**Cause**: Supabase project is asleep or tables missing

**Fix**:
1. Wake up your Supabase project (they sleep after 1 week of inactivity on free tier)
2. Verify tables were created with the SQL script above
3. Check Supabase project status: go to Project Settings → Health

### Variables Not Taking Effect

**Cause**: Railway cached old deployment

**Fix**:
1. Add/edit variables in Railway
2. Go to Deployments
3. Click "Redeploy" on the latest deployment
4. Wait for the redeploy to complete
5. Refresh your browser

### Application Won't Start

**Cause**: Missing dependencies

**Fix**:
1. Run locally first: `npm install && npm start`
2. Push `.env` setup to GitHub
3. In Railway, go to Deployments → View Logs
4. Look for error messages about missing packages
5. Manually redeploy if needed

## Local Development Setup

To test locally before deploying:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Supabase credentials:
   ```
   SUPABASE_URL=your_url_here
   SUPABASE_KEY=your_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Visit `http://localhost:3000` in your browser

## Monitoring Your Deployment

### View Railway Logs

1. In Railway dashboard, select your project
2. Go to **Deployments** → Click latest deployment
3. Scroll down to see live logs
4. Look for:
   - ✅ "Server running on" = good
   - ✅ "Supabase connected" = database working
   - ❌ Database errors = check your tables and credentials

### Monitor Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Check **Database** → **Usage** to see activity
4. Go to **SQL Editor** to run test queries:
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM levels;
   ```

## Next Steps

- **Add custom domain**: In Railway settings, link your domain
- **Enable auto-redeploy**: Set up auto-redeploy on GitHub push
- **Backup database**: Use Supabase backups feature (Project Settings → Backups)
- **Monitor performance**: Use Railway insights and Supabase analytics

## Common Errors Reference

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Wrong credentials or missing tables | Verify env vars in Railway, check Supabase tables |
| 401 Unauthorized | Invalid API key | Get new key from Supabase → API settings |
| Connection timeout | Firewall or network issue | Check Supabase project status, verify IP whitelist |
| Port already in use | Conflict with local testing | Railway auto-assigns PORT, use `process.env.PORT` |

## Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Express.js Guide](https://expressjs.com)
- Project Issues: Check your deployment logs first!

---

**Last Updated**: March 2026
**Project**: LCL - Level Challenge List
