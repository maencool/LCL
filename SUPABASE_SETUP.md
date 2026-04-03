# Supabase Setup Guide

## Step 1: Create Supabase Tables

Go to your Supabase dashboard and run the following SQL in the **SQL Editor** (top menu → SQL Editor → New Query):

### Create Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  displayName VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO users (id, email, displayName, password, isAdmin)
VALUES ('admin1', 'maencopra@gmail.com', 'Admin', 'maenissocool12345gGs', true)
ON CONFLICT DO NOTHING;
```

### Create Levels Table
```sql
CREATE TABLE IF NOT EXISTS levels (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  levelId INTEGER,
  url VARCHAR(500),
  youtubeUrl VARCHAR(500),
  thumbnail LONGTEXT,
  difficulty VARCHAR(50),
  submittedBy VARCHAR(255),
  submittedDate TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'approved'
);

-- Insert example level
INSERT INTO levels (id, name, levelId, url, difficulty, submittedBy, status)
VALUES ('level_1', 'Stereo Madness', 1, 'https://example.com/level1', 'Easy', 'Admin', 'approved')
ON CONFLICT DO NOTHING;
```

### Create Pending Levels Table
```sql
CREATE TABLE IF NOT EXISTS pending_levels (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  levelId INTEGER,
  url VARCHAR(500),
  youtubeUrl VARCHAR(500),
  thumbnail LONGTEXT,
  difficulty VARCHAR(50),
  submittedBy VARCHAR(255),
  submittedDate TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending'
);
```

### Create Settings Table
```sql
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  theme VARCHAR(50) DEFAULT 'dark',
  language VARCHAR(10) DEFAULT 'en',
  darkBackground BOOLEAN DEFAULT true,
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (id, theme, language, darkBackground)
VALUES ('default', 'dark', 'en', true)
ON CONFLICT DO NOTHING;
```

## Step 2: Enable Row Level Security (Optional but Recommended)

If you want to restrict access, add these policies:

```sql
-- Allow public read access to levels and users
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read on levels
CREATE POLICY "Allow read levels" ON levels
  FOR SELECT USING (true);

-- Allow anonymous read on users (for auth purposes)
CREATE POLICY "Allow read users" ON users
  FOR SELECT USING (true);

-- Allow authenticated write on pending levels
CREATE POLICY "Allow insert pending" ON pending_levels
  FOR INSERT WITH CHECK (true);
```

## Step 3: Start Your Server

```bash
npm start
```

Your app will now:
- ✅ Load all data from Supabase
- ✅ Use localStorage as a backup for offline support
- ✅ Sync changes automatically to Supabase
- ✅ Work even if Supabase is temporarily unavailable

## Testing

1. Open your app and check the console (F12) for connection logs
2. Try creating/updating levels and users
3. Refresh the page - data should persist from Supabase
4. Go offline and try adding data - it saves to localStorage backup

## Troubleshooting

**"Connection Error" in console:**
- Check that your SUPABASE_URL and SUPABASE_KEY in `.env` are correct
- Make sure tables are created in Supabase

**Data not syncing:**
- Check browser console for errors
- Verify RLS policies aren't blocking access
- Try browser DevTools Network tab to see API calls

**Missing admin user:**
- Run the "Insert default admin user" SQL from Step 1
