# ⚡ Python Server - Easiest Way to Sync (No npm Needed!)

## 🎯 Why Python?

- ✅ Already installed on most computers
- ✅ No `npm install` needed
- ✅ Works exactly like Node.js server
- ✅ Single file: `server.py`
- ✅ Same shared data across all browsers

## 🚀 Setup (1 minute)

### Step 1: Check if Python is Installed

**On Windows, open PowerShell and type:**
```powershell
python --version
```

**If you see a version number** (like `Python 3.10.0`), skip to Step 2!

**If you see "not recognized":**
- Download Python from: https://www.python.org/downloads/
- During install, **CHECK** "Add Python to PATH"
- Then restart terminal

### Step 2: Start Server

**Open PowerShell in your project folder:**
1. Open the `LCL-level challange list` folder
2. Hold `Shift` and right-click
3. Select "Open PowerShell window here"

**Run the server:**
```powershell
python server.py
```

You should see:
```
╔════════════════════════════════════════╗
║  LCL - Level Challenge List Server     ║
║  (Python Edition - No npm needed!)     ║
╠════════════════════════════════════════╣
║  🚀 Server running on:                 ║
║  http://localhost:3000                 ║
║  ...
```

## 📖 Use It

### Open in Multiple Browsers

**Microsoft Edge:**
```
http://localhost:3000
```

**Brave:**
```
http://localhost:3000
```

**Chrome:**
```
http://localhost:3000
```

**Firefox:**
```
http://localhost:3000
```

### Test Syncing

1. Login in **Edge** as admin
2. Delete the level
3. Go to **Brave** and refresh the page
4. The level is gone! ✅

## 🆚 Python vs Node.js

| Feature | Python | Node.js |
|---------|--------|---------|
| Setup | 1 minute | 3-5 minutes |
| Install | Already on PC | Need npm install |
| Start | `python server.py` | `npm start` |
| Performance | Same | Same |
| Data Sync | ✅ | ✅ |
| Complexity | Simpler | More steps |

**Recommendation: Use Python if you have it!**

## 🛑 Stop Server

Press **Ctrl+C** in the terminal.

All data in `lcl_data.json` is saved!

## 📝 Common Issues

**"python: command not found"**
- Python isn't installed or not in PATH
- Install from: https://www.python.org/downloads/
- Check "Add Python to PATH" during install
- Restart terminal

**"Address already in use"**
- Another app is using port 3000
- Close the other app
- Or close this terminal and reopen

**Can't access `http://localhost:3000`**
- Is the server running? (Check terminal)
- Make sure URL has `http://` (not `https://`)
- Refresh the page

**Still seeing old data in another browser?**
- All browsers MUST connect to `http://localhost:3000`
- Refresh the page after changes
- Check that server is still running

## 💡 Tips

- **Backup data**: Copy `lcl_data.json` to save
- **Portable**: Move entire folder to another computer
- **Monitor**: Watch terminal to see all changes in real-time
- **24/7**: Keep terminal open while using app
- **Shared**: Give friends the URL to use on same network

---

**Choose Python Server → Enjoy Easy Sync!** 🎉
