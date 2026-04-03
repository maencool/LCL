# Quick Start Guide - LCL Level Challenge List

## ⚡ Quick Setup (2 minutes)

### Step 1: Open the App
1. Simply open the `index.html` file in your web browser
2. The application launches immediately - no installation needed!

### Step 2: Explore as Guest
- Click the 🏡 button (top-left) to open the menu
- Browse available levels
- Read the rules
- Customize settings

### Step 3: Login as Admin (Optional)
To access the admin panel:
1. Click 🏡 → Log In
2. Enter:
   - Email: `maencopra@gmail.com`
   - Password: `maenissocool12345gGs`
3. Click "Log In"
4. The 🏡 menu now shows "Admin Panel" option

### Step 4: Test Features

**As Guest:**
- View the leaderboard (currently has 1 demo level)
- Read rules
- Try the settings (theme, language, background)

**As Admin:**
- View "Admin Panel" in menu
- See pending level submissions section
- See manage levels section
- Try the Replace button to reorder levels
- Try the Delete button to remove levels

## 🚀 Main Features to Try

### 1. **Submit a Level**
```
Menu → Send Level
- Level Name: My GD Level
- Level ID: 123456
- Level URL: https://example.com
- YouTube URL: https://youtube.com/watch?v=...
- Thumbnail: (optional)
- Click "Send Level to Admin!"
```
*Note: Must be logged in. After submitting, level appears in Admin → Pending Submissions*

### 2. **Create a New Account**
```
Menu → Register
- Email: your@email.com
- Display Name: YourName
- Password: yourpassword
Click "Register" then login with these credentials
```

### 3. **Change Settings**
```
Menu → Settings
- Theme: Light, Dark, or Auto
- Dark Background: Toggle switch
- Language: Choose your language
```
All changes save automatically to local storage!

### 4. **Admin Management**
```
(Login as admin first)
Menu → Admin Panel

Pending Submissions:
- Review submitted levels
- Click "Approve" to add to leaderboard
- Click "Reject" to remove

Manage Levels:
- Click "Replace" to reorder levels
- Click "Delete" to remove levels
```

## 📊 Current Demo Data

The app comes with one pre-loaded level:
- **Name**: Stereo Madness
- **ID**: 1
- **Status**: Approved

## 💾 Local Storage

All data is saved in your browser:
- ✅ User accounts
- ✅ Levels and leaderboard
- ✅ Settings preferences
- ✅ Pending submissions

**Data persists** even after:
- Closing and reopening browser
- Restarting computer
- Switching between pages

**Data is LOST** if you:
- Clear browser cache/cookies
- Use private/incognito mode (temporary)

## 🎨 Customization

### Change Colors
Edit `css/styles.css` - look for `:root` section:
```css
:root {
    --primary-color: #ff6b6b;      /* Red accent */
    --secondary-color: #4c6ef5;    /* Blue accent */
    --background: #1a1a1a;         /* Dark background */
}
```

### Change Discord Link
In `index.html`, find:
```html
<a href="https://discord.com/channels/..." class="menu-link discord-link">
```
Replace with your server URL

### Add More Rules
In `index.html`, find the Rules section and add new rule cards:
```html
<div class="rule-card">
    <h3>Rule 5</h3>
    <p>Your new rule here</p>
</div>
```

## 📱 Mobile Friendly

The app is responsive and works on:
- 📱 Phone screens
- 📱 Tablets
- 💻 Desktop computers

Touch-friendly navigation with large buttons!

## 🔧 Troubleshooting

### App won't load?
- Make sure all files are in the same folder:
  - `index.html`
  - `css/styles.css`
  - `js/app.js`, `js/auth.js`, `js/storage.js`

### Local storage not working?
- Check if cookies are enabled
- Try a different browser
- Check browser's security settings

### Can't see changes after editing CSS?
- Press Ctrl+Shift+R (hard refresh)
- Clear browser cache

### Can't login?
- Password is case-sensitive
- Make sure Caps Lock is off
- Try registering a new account

## 🎯 Next Steps

1. **Customize**: Edit colors, text, and branding
2. **Deploy**: Upload to a web server or GitHub Pages
3. **Share**: Give friends the URL to test
4. **Expand**: Add more features like comments, ratings, etc.

## 💡 Pro Tips

- 💾 Backup your data by exporting browser data before clearing cache
- 🎨 Use browser's theme options in Settings to match your preference
- 👤 Create test accounts to see different user experiences
- 🏆 Use Replace function to organize levels by difficulty
- 📲 Add to phone home screen for app-like experience

## Questions?

Check the full README.md for detailed documentation or visit the Discord community!

---

**Ready to go!** 🎮 Open `index.html` and start using LCL!
