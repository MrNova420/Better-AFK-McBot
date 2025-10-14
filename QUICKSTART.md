# 🚀 Quick Start Guide - BetterSMP Bot

Get your bot running in under 5 minutes!

## ⚡ Super Quick Setup

### 1. Download & Install

**Option A: Clone with Git**
```bash
git clone <your-repo-url>
cd bettersmp-bot
npm install
```

**Option B: Download ZIP**
1. Download the ZIP file from this repository
2. Extract it to a folder
3. Open terminal/command prompt in that folder
4. Run: `npm install`

### 2. Configure Your Bot

```bash
# Copy the example configuration
cp config/example.settings.json config/settings.json

# Edit with your favorite editor
nano config/settings.json
# or
notepad config/settings.json
```

**Minimum required settings:**
```json
{
  "bot-account": {
    "username": "YourMinecraftUsername",
    "password": "",
    "type": "mojang"
  },
  "server": {
    "ip": "your.server.ip",
    "port": 25565,
    "version": "1.12.1"
  }
}
```

### 3. Run the Bot

```bash
node index.js
```

That's it! Your bot is now running! 🎉

## 📱 Run 24/7 on Android (Termux)

### One-Line Auto Setup:
```bash
curl -O <raw-url-to-termux-setup.sh> && chmod +x termux-setup.sh && ./termux-setup.sh
```

### Manual Termux Setup:
```bash
# Update and install Node.js
pkg update && pkg install nodejs-lts git -y

# Install PM2
npm install -g pm2

# Clone bot
git clone <your-repo-url>
cd bettersmp-bot
npm install

# Configure
cp config/example.settings.json config/settings.json
nano config/settings.json

# Run with PM2
pm2 start index.js --name bettersmp-bot
pm2 save
termux-wake-lock

# Disable battery optimization in Android settings!
```

## 🖥️ Run on Replit

1. **Import to Replit**
   - Click "Create Repl" → "Import from GitHub"
   - Paste repository URL

2. **Configure**
   - Copy `config/example.settings.json` to `config/settings.json`
   - Edit with your server details

3. **Run**
   - Click the "Run" button
   - Bot will start automatically!

4. **24/7 Hosting**
   - Click "Publish" → Choose "Reserved VM"
   - Your bot runs forever!

## ⚙️ Essential Configuration

### Smart Responses & Admin Helper (Automatic!)
The bot now automatically helps players with NO configuration needed! It will:
- Welcome new players
- Answer questions about rules, commands, tips
- Provide mining and building advice
- Give server information

This feature is **enabled by default** - just start the bot and it works!

### Chat Messages (Promotional Announcements)

Edit `config/settings.json`:

```json
"chat-messages": {
  "enabled": true,
  "repeat": true,
  "repeat-delay": 180,
  "messages": [
    "Welcome to BetterSMP, the best Minecraft server!!!",
    "This SMP is amazing! Having so much fun here",
    "BetterSMP has the best community!",
    "Love playing on this server"
  ]
}
```

**Tips:**
- `repeat-delay`: Base time between messages (seconds) + random 0-60s
- Messages are picked randomly for natural variation
- Customize for your server name!

### Anti-AFK Settings

```json
"anti-afk": {
  "enabled": true,
  "sneak": false
}
```

- `enabled`: Keeps bot moving (lightweight jumping)
- `sneak`: Also sneaks (more obvious, use with caution)

### Auto-Reconnect

```json
"auto-reconnect": true,
"auto-reconnect-delay": 5000
```

Bot automatically reconnects if disconnected (delay in milliseconds).

## 🔍 Check Bot Status

### Web Dashboard
Open in browser: `http://localhost:5000`

Shows:
- ✅ Bot active status
- 📊 Connection info

### PM2 Commands (if using PM2)
```bash
pm2 list              # Show status
pm2 logs bettersmp-bot   # View logs
pm2 restart bettersmp-bot # Restart
pm2 stop bettersmp-bot   # Stop
```

### Console Output
Watch the terminal for:
- `[BetterSMP Bot] Bot joined the server` ✅
- `Server started on port 5000` ✅

## ⚠️ Troubleshooting

### "Cannot connect to server"
- ✅ Check server IP and port
- ✅ Verify Minecraft version matches
- ✅ Ensure server is online

### "Bot kicked for spam"
- ✅ Increase `repeat-delay` (try 300)
- ✅ Reduce number of messages
- ✅ Check server anti-spam rules

### "Module not found"
```bash
npm install
```

### "Permission denied" (Linux/Mac)
```bash
chmod +x termux-setup.sh
```

## 📊 Common Use Cases

### Server Promotion Bot
```json
"messages": [
  "Welcome to [YourServer]! IP: play.yourserver.com",
  "Best SMP in 2025!",
  "Join our Discord: discord.gg/yourserver",
  "Amazing community and features!"
]
```

### AFK Keeper (Silent)
```json
"chat-messages": {
  "enabled": false
},
"anti-afk": {
  "enabled": true
}
```

### Pathfinding Bot (Go to location)
```json
"position": {
  "enabled": true,
  "x": 100,
  "y": 64,
  "z": -200
}
```

## 🎯 Next Steps

1. ✅ Bot running? Great!
2. 📝 Customize chat messages for your server
3. 🔧 Adjust timing and settings
4. 📱 Set up 24/7 hosting (Termux/Replit/VPS)
5. 📊 Monitor with `pm2 logs` or web dashboard

## 🆘 Need Help?

1. Check the full **README.md** for detailed docs
2. Review **TERMUX-GUIDE.md** for Android setup
3. Verify your `config/settings.json` configuration
4. Check logs for error messages

---

**You're all set! Enjoy your BetterSMP bot!** 🎮

*Questions? Check the README.md for comprehensive documentation.*
