# 🌐 Local Network Setup - Share Database with Others

## What You Can Now Do
- ✅ Multiple people on the same local network can access your database
- ✅ All changes sync instantly across everyone's devices
- ✅ No internet needed - works over WiFi or Ethernet
- ✅ Data stays in your JSON file on your computer

## ⚙️ Setup Steps

### 1. Start the Server on Your Computer
Open PowerShell in the project folder and run:
```powershell
npm start
```

You'll see output like:
```
🚀 Server running on:
Local PC: http://localhost:3000

🌐 Network Access (share with others):
http://192.168.x.x:3000
```
**Copy the network address** (the one with 192.168...)

### 2. Share the Address
Give this address to anyone who should access the database:
```
http://192.168.x.x:3000
```

### 3. Others Connect from Their Devices
On each person's computer/phone/tablet:
1. Open a web browser (Chrome, Edge, Firefox, etc.)
2. Type in the address bar: `http://192.168.x.x:3000`
3. They can now see and edit the same database as you
 zwxefdset
## ⚠️ Important Notes

### Network Requirements
- ✅ Everyone must be on the **same WiFi network** or connected to the same router
- ✅ Your computer must stay **turned on and the server running**
- ❌ Won't work if people try to access from outside your local network (internet)

### Data Safety
- 📁 Data is saved in `lcl_data.json` on your computer
- 🔒 Make sure only trusted people have access
- 💾 Regular backups: Your data file updates automatically

### Firewall Issues?
If people can't connect:
1. Windows might block the server
2. When asked, click **"Allow"** to let the server through the firewall
3. Or manually add it in Windows Defender Firewall

### Troubleshooting

**"Can't connect - connection refused"**
- Make sure your server is still running (check the terminal)
- Verify the IP address is correct (it starts with 192.168...)
- Check they're on the same network

**"Can't find device"**
- Both devices need to be on the same WiFi
- Try pinging the IP first: Open cmd and type `ping 192.168.x.x`

**"Port already in use"**
- Something else is using port 3000
- Change PORT in `server.js` to `3001` or `3100`

## 🔄 Real-World Example

**Your Setup:**
- Computer: Windows PC at home
- Your IP: `192.168.1.100`
- Server running on port 3000

**Your Friend's Setup:**
- On same WiFi
- Opens browser: `http://192.168.1.100:3000`
- Sees exact same data as you
- Edits instantly sync back to your PC

## 🚀 Tips

1. **Keep server running** while others are using it
2. **Use hostname instead of IP** (if supported): Each person can try `http://computername:3000`
3. **Multiple browser tabs** on same device all sync with each other
4. **Mobile access** - Works on phones too if they're on your WiFi!

## 📊 How It Works

```
Your Computer                Other Users' Devices
    ┌─────────────┐          ┌────────────────┐
    │ Node Server │◄────────►│ Browser (any)  │
    ├─────────────┤     ║    └────────────────┘
    │lcl_data.json│─────╬────► Sync instantly
    └─────────────┘     ║    
                        ║    ┌────────────────┐
                        └───►│ Browser (any)  │
                             └────────────────┘
```

All changes go through your server and update the JSON file.
