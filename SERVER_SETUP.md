# 🔄 LCL SERVER SETUP - Sync Across All Browsers

## 📋 What This Does

Instead of each browser having separate data, the **LCL Server** stores all data in a shared file (`lcl_data.json`). This means:

- ✅ **Edge, Brave, Chrome, Firefox** all see the SAME leaderboard
- ✅ Changes in one browser instantly sync to all others
- ✅ Pending levels show up in Admin Panel across all browsers
- ✅ Deletions, additions, and replacements sync everywhere
- ✅ Data persists even after server restart

## 🚀 Quick Setup (3 minutes)

### Step 1: Install Node.js
Download and install from: https://nodejs.org/
- Choose the LTS (Long Term Support) version
- Run the installer and follow the steps

### Step 2: Open Terminal in Project Folder

**On Windows:**
1. Open the `LCL-level challange list` folder
2. Hold `Shift` and right-click in empty space
3. Select "Open PowerShell window here" or "Open Terminal here"

### Step 3: Install Dependencies
```powershell
npm install
```
This installs Express, the web framework needed to run the server.

### Step 4: Start the Server
```powershell
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║  LCL - Level Challenge List Server     ║
╠════════════════════════════════════════╣
║  🚀 Server running on:                 ║
║  http://localhost:3000                 ║
║                                        ║
║  📍 Open in all browsers:              ║
║  Edge: http://localhost:3000           ║
║  Brave: http://localhost:3000          ║
║  Chrome: http://localhost:3000         ║
║                                        ║
║  💾 Data file:                         ║
║  C:\Users\...\LCL-level-challange-list\lcl_data.json
║                                        ║
║  ✅ All data is shared across browsers! ║
║  Press Ctrl+C to stop server           ║
╚════════════════════════════════════════╝
```

## 📖 Using the App with Server

### Open in Multiple Browsers

Instead of opening `index.html` directly, open:
```
http://localhost:3000
```

**Do this in each browser:**
1. **Microsoft Edge**: Go to `http://localhost:3000`
2. **Brave**: Go to `http://localhost:3000`
3. **Chrome**: Go to `http://localhost:3000`
4. **Firefox**: Go to `http://localhost:3000`

All browsers now share the same data!

### Test the Sync

1. **In Edge:**
   - Login as admin
   - Delete the "Stereo Madness" level
   - Go to Admin Panel → Manage Levels
   - You should see it's gone

2. **In Brave (without refreshing):**
   - Open Admin Panel → Manage Levels
   - **Refresh the page** (F5)
   - The level is gone! 🎉 It synced across browsers!

3. **In Chrome as Guest:**
   - Go to Home page
   - Refresh the page
   - The level is gone across all browsers!

## 📝 How It Works

```
┌─────────────┐
│   Edge      │
│ Browser     │ ──┐
└─────────────┘   │
                  │    ┌──────────────┐
┌─────────────┐   │───▶│   Server     │───▶ lcl_data.json
│   Brave     │ ──┤    │ localhost:   │      (Shared File)
│ Browser     │   │    │   3000       │
└─────────────┘   │    └──────────────┘
                  │
┌─────────────┐   │
│   Chrome    │ ──┘
│ Browser     │
└─────────────┘

All browsers talk to the server, which saves data to ONE file.
Everyone sees the same data!
```

## ✅ Features Now Working

- ✅ **Pending Levels**: Submit in one browser, appears in all
- ✅ **Admin Approvals**: Approve in Edge, see approved in Brave
- ✅ **Deletions**: Delete in Chrome, gone in all browsers
- ✅ **Level Replacements**: Replace in one browser, reordered in all
- ✅ **User Accounts**: Create account in Edge, login from Brave
- ✅ **Settings**: Change theme in Chrome, loads in Firefox

## 🛑 Stop the Server

Press **Ctrl+C** in the terminal to stop the server.

When you stop it:
- ❌ The web pages won't load
- ✅ But all data in `lcl_data.json` is saved
- ✅ When you start the server again, all data is there

## 📂 Where's My Data?

The file `lcl_data.json` is in your project folder:
```
C:\Users\mainPc\Desktop\LCL-level challange list\lcl_data.json
```

You can:
- 💾 **Backup**: Copy this file to save it
- 📥 **Restore**: Copy a backup file here to restore data
- 👀 **View**: Open it in Notepad to see the raw data

## 🔧 Troubleshooting

### "npm: The term 'npm' is not recognized"
- Node.js isn't installed or not in PATH
- Restart your terminal and try again
- Or reinstall Node.js

### "Port 3000 is already in use"
- Another app is using port 3000
- Option 1: Stop the other app
- Option 2: Close the terminal and try again

### "Cannot find module 'express'"
- Dependencies not installed
- Run: `npm install`

### "Pages won't load"
- Is the server running? (Check terminal)
- Use correct URL: `http://localhost:3000` (not file://)
- Make sure all files are in the project folder

### Data not syncing between browsers
- Make sure ALL browsers are connected to `http://localhost:3000`
- Refresh the page after making changes in other browsers
- Check the server terminal for error messages

### Server won't start
- Try a different terminal (like cmd instead of PowerShell)
- Check if Node.js is properly installed
- Restart your computer
- Delete `node_modules` folder and run `npm install` again

## 🎯 Advanced: Custom Port

If port 3000 is in use, edit `server.js`:

Find:
```javascript
const PORT = 3000;
```

Change to:
```javascript
const PORT = 8000;  // Or any unused port
```

Then use: `http://localhost:8000`

## 🌐 Access from Another Computer

**On your computer (where server runs):**
Find your IP address by running:
```powershell
ipconfig
```
Look for "IPv4 Address:" (something like `192.168.x.x`)

**On another computer on same network:**
Open: `http://192.168.x.x:3000`

All computers share the same data!

## 📚 File Structure

```
LCL-level-challange-list/
├── server.js              ← Node.js server
├── package.json           ← Dependencies list
├── lcl_data.json          ← SHARED DATA FILE (created on first run)
├── index.html             ← Web interface
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── auth.js
│   └── storage.js         ← Updated for server sync
└── README.md
```

## ✨ Pro Tips

1. **Backup before big changes**: Copy `lcl_data.json` before testing
2. **Server running 24/7**: Keep terminal open while using app
3. **Share the URL**: Give `http://localhost:3000` to friends on same network
4. **Monitor server**: Watch the terminal to see changes in real-time
5. **Portable**: The whole folder can be moved to another computer

## 📞 Support

If something doesn't work:
1. Check the terminal for error messages
2. Restart the server
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart your computer
5. Reinstall Node.js

---

**Version 2.0 - Server Edition**
**Status: Ready to Deploy** ✅
