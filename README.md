# LCL - Geometry Dash Level Challenge List

A community-based Geometry Dash level leaderboard and submission platform built with vanilla HTML, CSS, and JavaScript using browser local storage.

## Features

### 🏠 Main Features
- **Home Page**: Displays a leaderboard of all approved community levels
- **Level Submission**: Users can submit new levels with details (name, ID, URL, YouTube link, thumbnail)
- **Rules Page**: Clear guidelines for level submissions
- **User Authentication**: Register and login system with local storage
- **Settings**: Customize theme, language, and background preferences
- **Admin Panel**: Admin users can manage pending submissions and level positions

### 👤 User Features
- **Registration**: Create an account with email, display name, and password
- **Login/Logout**: Secure authentication using local storage
- **Submit Levels**: Upload new levels for admin approval
- **View Leaderboard**: See all approved levels with thumbnails and details

### 🛡️ Admin Features
- **Approve/Reject Submissions**: Review and approve pending level submissions
- **Manage Levels**: Delete levels, reorder levels in the leaderboard
- **Replace Positions**: Move levels to different positions in the leaderboard
- **View YouTube Videos**: Watch and verify level submissions

### ⚙️ Settings
- **Theme**: Choose between Dark, Light, or Auto theme
- **Dark Background**: Toggle enhanced dark background
- **Language**: Select preferred language (English, Spanish, French, German, Portuguese)

## Getting Started

### Two Options:

#### 🐍 **EASIEST: Python Server (Recommended)**
```powershell
python server.py
```
Then open: `http://localhost:3000` in any browser

See [PYTHON_SERVER.md](PYTHON_SERVER.md) for details

#### 📦 **Node.js Server (Advanced)**
```powershell
npm install
npm start
```
Then open: `http://localhost:3000` in any browser

See [SERVER_SETUP.md](SERVER_SETUP.md) for details

#### 🌐 **No Server (Separate Data per Browser)**
Just open `index.html` directly
- Works immediately
- ⚠️ Each browser has different data
- Use Export/Import to sync manually

### Admin Account
Use these credentials to access the admin panel:
- **Email**: `maencopra@gmail.com`
- **Password**: `maenissocool12345gGs`

### Discord Community
Join our Discord community: https://discord.com/channels/1479132434661511248/1479132436079317087

## Rules for Level Submission

1. **Duration**: Your level must be at least 1 minute long
2. **Features**: CBF (circle back flying) is allowed, but cheats are NOT allowed
3. **Proof**: You must record your clicks (show proof of completion)
4. **Gamedodes**: All gamedodes are allowed (Wave, Cube, Ship, Ball, UFO, Robot, Spider, Swing Copter)

## Data Storage

The application uses **browser local storage** to store all data:
- User accounts and passwords
- Approved levels
- Pending submissions
- User settings and preferences

**Important**: Data is stored locally in your browser. Clearing browser data will clear all application data.

## Project Structure

```
LCL-level-challange-list/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling (dark theme by default)
├── js/
│   ├── storage.js      # Local storage management
│   ├── auth.js         # Authentication system
│   └── app.js          # Main application logic
└── README.md           # This file
```

## Navigation

Use the 🏡 button in the top-left to open the menu and navigate between:
- **Home**: Main leaderboard
- **Send Level**: Submit a new level
- **Rules**: View submission rules
- **Settings**: Customize preferences
- **Log In/Register**: Authentication
- **Admin Panel** (Admin only): Manage levels
- **Join our Discord**: Visit community Discord
- **Log Out**: Sign out

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Features Details

### Leaderboard
- Displays levels in order (#1, #2, #3, etc.)
- Shows level thumbnail, name, and ID
- Click on any level to see more details and watch on YouTube

### Level Details Modal
- Level thumbnail image
- Level ID
- Difficulty level
- Link to YouTube video
- "Watch on YouTube" button

### Admin Management
- **Pending Submissions**: Review new level submissions
  - Approve: Adds level to leaderboard
  - Reject: Removes pending submission
- **Level Management**: Control approved levels
  - Replace: Move level to different position
  - Delete: Remove level from leaderboard

### Settings Persistence
All settings are saved to local storage:
- Theme preference (Dark/Light/Auto)
- Selected language
- Dark background toggle
- These settings persist across browser sessions

## Keyboard Shortcuts
- Use Tab to navigate through menu items
- Press Enter to select items
- Click the × button or press Esc to close modals

## Note on Security

**This is a demonstration/learning project**. In a production environment:
- Passwords should be hashed and never stored in browser local storage
- A proper backend server is required for security
- Use HTTPS and proper authentication tokens
- Implement proper authorization and validation

## Customization

You can easily customize:
- **Colors**: Edit `:root` CSS variables in `css/styles.css`
- **Texts**: All text is in `index.html`
- **Rules**: Modify the rules section in `index.html`
- **Discord Link**: Update the URL in the menu

## Troubleshooting

### Data Not Saving?
- Check if local storage is enabled in your browser
- Try clearing browser cache and reloading
- Check browser developer tools for storage errors

### Can't Login?
- Use the admin account credentials provided
- Or create a new account via Register
- Passwords are case-sensitive

### Theme Not Changing?
- Clear browser cache and reload
- Check if cookies/local storage is enabled

## License

Free to use and modify for personal or educational purposes.

## Support

For issues or questions:
1. Join our Discord community
2. Check the rules and guidelines
3. Contact the admin team

---

**Version**: 1.0
**Last Updated**: March 9, 2026
**Status**: Ready for use ✅
