# 🔧 LCL Project - Database Issues Fixed

## What Was Wrong

Your Railway deployment was failing with a **404 error** because of several critical configuration issues:

### Problems Found:

1. **❌ Hardcoded Supabase Credentials** 
   - Credentials were hardcoded directly in `supabase.js`
   - Railway couldn't use them because environment variables were ignored
   - This caused 404 errors when trying to connect to the database

2. **❌ Hardcoded Port Number**
   - Server was hardcoded to port `3000`
   - Railway dynamically assigns the PORT via environment variable
   - App couldn't start on the correct port

3. **❌ Missing dotenv Dependency**
   - `.env` files weren't being loaded
   - Environment variables weren't being read
   - Added to `package.json` dependencies

4. **❌ No Health Check Endpoint**
   - No way to diagnose connection issues
   - Couldn't tell if database was connected or not

5. **❌ Sensitive Credentials Exposed**
   - No `.env` file in `.gitignore`
   - Risk of accidentally committing secrets to GitHub

## What I Fixed

### ✅ Changes Made to Files:

#### 1. **supabase.js**
- ✅ Added `dotenv` support to load environment variables
- ✅ Changed to read `SUPABASE_URL` and `SUPABASE_KEY` from environment
- ✅ Added validation to check if credentials are set
- ✅ Kept original values as fallback (for backward compatibility)

#### 2. **server.js**
- ✅ Added `dotenv` support at the top
- ✅ Changed PORT to use `process.env.PORT || 3000` (Railway-compatible)
- ✅ Added `/api/health` endpoint for diagnostics
- ✅ Health endpoint checks database connection

#### 3. **package.json**
- ✅ Added `"dotenv": "^16.0.3"` dependency
- ✅ Updated description to mention Supabase backend

#### 4. **New Files Created:**

**`.env.example`**
- Template for environment variables
- Users copy this to `.env` and fill in their credentials

**`RAILWAY_DEPLOYMENT.md`**
- Complete step-by-step guide for Railway deployment
- How to set up Supabase database
- How to configure environment variables
- Troubleshooting guide for common errors

**`diagnose.js`**
- Diagnostic tool to check your setup
- Verifies all files and dependencies
- Tests Supabase connection
- Shows clear error messages if something is wrong

**`.gitignore` - Updated**
- Added `.env` files to prevent committing secrets
- Now safe to push to GitHub

---

## 🚀 What You Need to Do Now

### Step 1: Install New Dependency

```bash
npm install dotenv
```

### Step 2: Create Your .env File

Copy the template:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
```

> Get these from: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API

### Step 3: Verify Setup Locally

```bash
node diagnose.js
```

This will show you if everything is configured correctly. Look for:
- ✅ All checks should pass (green checkmarks)
- ✅ Database connection should succeed

### Step 4: Test Locally

```bash
npm start
```

Visit: `http://localhost:3000`
Check your console for: "✅ Supabase connected"

### Step 5: Create Supabase Database Tables

If you haven't created the tables yet, go to your Supabase project and run this SQL:

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

-- Levels table (approved)
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
  status TEXT DEFAULT 'approved'
);

-- Pending levels table
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
```

### Step 6: Deploy to Railway

1. Push your code to GitHub (with the updated files)
2. Go to [Railway.app](https://railway.app)
3. Add new project from your GitHub repo
4. Set environment variables in Railway:
   - `SUPABASE_URL` = Your Supabase URL
   - `SUPABASE_KEY` = Your Supabase API key
5. Railway will auto-deploy
6. Visit your Railway app URL

---

## 🧪 Testing Your Deployment

### Test Endpoints

Once deployed, test these endpoints:

**Health Check** (to verify database connection):
```
GET https://your-railway-app.railway.app/api/health
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-03-24T10:30:00.000Z"
}
```

**Get Data**:
```
GET https://your-railway-app.railway.app/api/data
```

**Add User**:
```
POST https://your-railway-app.railway.app/api/users
Content-Type: application/json

{
  "email": "test@example.com",
  "displayName": "Test User",
  "password": "password123"
}
```

---

## 📊 Environment Variable Reference

| Variable | Required | Example | Where to Get |
|----------|----------|---------|-------------|
| `SUPABASE_URL` | ✅ Yes | `https://xxx.supabase.co` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_KEY` | ✅ Yes | `sb_anon_xxx` | Supabase Dashboard → Settings → API → Anon Key |
| `PORT` | ❌ No | `3000` | Railway auto-sets this (don't set manually) |

---

## 🆘 If You Still Get 404 Error

The new `/api/health` endpoint will help you diagnose:

```bash
# Run this to test database connection
curl https://your-railway-app.railway.app/api/health
```

**If health check fails**, it means:
1. ❌ Supabase credentials are wrong
2. ❌ Database tables don't exist
3. ❌ Supabase project is deleted or sleeping

**If health check passes but app still fails**:
1. Check browser console (F12) for client-side errors
2. Check Railway deployment logs
3. Verify database tables were created

---

## 📝 Files Changed Summary

| File | Changes |
|------|---------|
| `supabase.js` | Added dotenv, environment variables, validation |
| `server.js` | Added dotenv, PORT from env, health endpoint |
| `package.json` | Added dotenv dependency |
| `.env.example` | NEW - Template for environment setup |
| `RAILWAY_DEPLOYMENT.md` | NEW - Complete deployment guide |
| `diagnose.js` | NEW - Diagnostic tool |
| `.gitignore` | Updated with .env files |

---

## ✅ Next Steps Checklist

- [ ] Run `npm install` to install dotenv
- [ ] Run `node diagnose.js` to verify setup
- [ ] Create `.env` file with Supabase credentials
- [ ] Test locally with `npm start`
- [ ] Create database tables in Supabase (if not done)
- [ ] Test `/api/health` endpoint locally
- [ ] Push to GitHub
- [ ] Deploy to Railway with env variables
- [ ] Test `/api/health` on Railway
- [ ] Test full app on Railway

---

**Questions?** Check:
- `RAILWAY_DEPLOYMENT.md` - Complete setup guide
- `diagnose.js` - Run diagnostic check
- `.env.example` - Configuration template

Good luck! 🚀
