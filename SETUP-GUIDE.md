# BetterSMP Bot - Complete Setup Guide

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Detailed Configuration](#detailed-configuration)
- [Replit Setup](#replit-setup)
- [Termux Setup](#termux-setup)
- [Troubleshooting](#troubleshooting)
- [24/7 Operation Tips](#247-operation-tips)

## 🚀 Quick Start

### 1. Configure Your Bot

Edit `config/settings.json` with your details:

```json
{
  "bot-account": {
    "username": "YourMinecraftUsername",
    "password": "",
    "type": "microsoft"
  },
  "server": {
    "ip": "play.yourserver.com",
    "port": 25565,
    "version": "1.20.1",
    "name": "Your Server Name"
  }
}
```

**Important Notes:**
- For **offline servers**: Leave password empty
- For **Microsoft accounts**: Set type to "microsoft" (required for modern accounts)
- For **Mojang accounts**: Note that Mojang authentication is deprecated
- Match the Minecraft **version** exactly with your server

### 2. Start the Bot

```bash
npm start
```

The bot will:
- ✅ Connect to your Minecraft server
- ✅ Start the web dashboard on port 5000
- ✅ Begin helping players automatically
- ✅ Keep the server active 24/7

## ⚙️ Detailed Configuration

### Bot Account Settings

```json
"bot-account": {
  "username": "BotName123",
  "password": "your-password-if-needed",
  "type": "microsoft"
}
```

**Options:**
- `username`: Your Minecraft account username
- `password`: Leave empty for offline servers, or provide for online authentication
- `type`: Either "microsoft" (recommended) or "mojang" (deprecated)

### Server Connection

```json
"server": {
  "ip": "play.hypixel.net",
  "port": 25565,
  "version": "1.20.1",
  "name": "Hypixel"
}
```

**Options:**
- `ip`: Server address (domain or IP)
- `port`: Server port (usually 25565)
- `version`: Minecraft version (e.g., "1.8.9", "1.12.2", "1.19.4", "1.20.1")
- `name`: Server name for chat messages

**Finding the Right Version:**
- Check your server's website or login screen
- Common versions: 1.8.9, 1.12.2, 1.16.5, 1.18.2, 1.19.4, 1.20.1
- Use the exact version for best compatibility

### Position (Optional Pathfinding)

```json
"position": {
  "enabled": false,
  "x": 100,
  "y": 64,
  "z": -200
}
```

Enable this to make the bot walk to specific coordinates on spawn.

### Auto-Authentication

```json
"auto-auth": {
  "enabled": false,
  "password": "YourAuthPassword"
}
```

Enable if your server requires `/register` and `/login` commands.

### Smart Responses & Admin Helper

```json
"smart-responses": {
  "enabled": true
},
"admin-helper": {
  "enabled": true,
  "welcome-new-players": true,
  "answer-questions": true,
  "provide-tips": true
}
```

The bot will:
- Welcome new players automatically
- Answer questions about rules, commands, and tips
- Help with mining, building, and gameplay advice
- Respond naturally like a helpful player

### Anti-AFK System

```json
"anti-afk": {
  "enabled": true,
  "sneak": false,
  "advanced": true
}
```

**Options:**
- `enabled`: Keep bot active to prevent AFK kicks
- `sneak`: Also use sneaking movements (some servers detect this)
- `advanced`: Use varied random movements (jump, walk, etc.)

### Chat Messages

```json
"chat-messages": {
  "enabled": true,
  "repeat": true,
  "repeat-delay": 180,
  "messages": [
    "Welcome to our awesome server!",
    "Having a great time here!",
    "Check out the cool builds at spawn!"
  ]
}
```

**Options:**
- `enabled`: Turn promotional messages on/off
- `repeat`: Keep sending messages periodically
- `repeat-delay`: Base delay in seconds (adds random 0-60s variation)
- `messages`: Array of messages to randomly choose from

**Tips for Good Messages:**
- Mix promotional and casual messages
- Sound like a real player, not a bot
- Mention server features naturally
- Keep messages friendly and helpful

### Auto-Reconnect

```json
"auto-reconnect": true,
"auto-reconnect-delay": 5000
```

Bot automatically reconnects if disconnected (delay in milliseconds).

## 🔧 Replit Setup

### Step 1: Configure Settings

1. Edit `config/settings.json` with your Minecraft server details
2. Make sure all required fields are filled

### Step 2: Run the Bot

1. Click the "Run" button in Replit
2. The bot will start automatically
3. View the web dashboard in the preview pane

### Step 3: Monitor Status

- **Dashboard**: View in the webview panel
- **Logs**: Check the console for detailed activity
- **Health**: Visit `/health` endpoint for status

### Step 4: Deploy for 24/7 (Optional)

1. Click "Deploy" in Replit
2. Choose "Reserved VM" for always-on functionality
3. The bot will run continuously

**Replit Benefits:**
- ✅ Automatic restarts on crashes
- ✅ Built-in monitoring
- ✅ Easy to manage and update
- ✅ Web dashboard included

## 📱 Termux Setup (Android 24/7)

Run a Minecraft bot from your phone!

### Prerequisites

1. **Install Termux from F-Droid** (NOT Google Play)
   - Download F-Droid: https://f-droid.org
   - Install Termux from F-Droid

2. **Allow Battery Usage**
   - Go to Android Settings → Apps → Termux
   - Disable battery optimization
   - This prevents Android from killing the app

### Installation

```bash
# Update packages
pkg update && pkg upgrade -y

# Install Node.js and Git
pkg install nodejs-lts git -y

# Install PM2 for process management
npm install -g pm2

# Clone the repository
git clone <your-repo-url>
cd bettersmp-bot

# Install dependencies
npm install

# Configure the bot
nano config/settings.json
```

### Running with PM2

```bash
# Start the bot
pm2 start index.js --name minecraft-bot

# Save PM2 configuration
pm2 save

# Setup PM2 to start on Termux launch
pm2 startup

# Acquire wake lock (keep phone awake)
termux-wake-lock
```

### Managing the Bot

```bash
# View status
pm2 list

# View logs
pm2 logs minecraft-bot

# Restart bot
pm2 restart minecraft-bot

# Stop bot
pm2 stop minecraft-bot

# View detailed info
pm2 show minecraft-bot
```

### Termux Best Practices

1. **Keep Termux in Recent Apps**: Don't swipe it away
2. **Disable Battery Optimization**: Critical for 24/7 operation
3. **Use Wake Lock**: Run `termux-wake-lock` to prevent sleep
4. **Stable WiFi**: Use stable internet connection
5. **Keep Phone Charging**: For true 24/7 operation

## 🔍 Troubleshooting

### Bot Won't Connect

**Problem**: `ENOTFOUND` or `Cannot resolve hostname`

**Solutions:**
- Check internet connection
- Verify server IP is correct
- Try using IP address instead of domain
- Check if server is online

---

**Problem**: `ECONNREFUSED` or `Connection refused`

**Solutions:**
- Verify server port (usually 25565)
- Check if server is online
- Ensure server accepts connections
- Check firewall settings

---

**Problem**: `Invalid credentials` or authentication error

**Solutions:**
- Verify username is correct
- For online servers, check password
- For Microsoft accounts, ensure proper authentication
- For offline servers, leave password empty

### Bot Gets Kicked

**Problem**: Server kicks bot for suspicious activity

**Solutions:**
- Reduce chat message frequency (increase `repeat-delay`)
- Disable anti-AFK if server has sensitive detection
- Set `sneak: false` in anti-AFK config
- Check server rules about bots

### High Memory Usage

**Problem**: Bot uses too much RAM

**Solutions:**
- Restart bot periodically (PM2 handles this)
- Disable pathfinding if not needed
- Reduce chat message frequency
- Monitor with `/stats` endpoint

### Connection Drops

**Problem**: Bot disconnects frequently

**Solutions:**
- Check internet stability
- Verify auto-reconnect is enabled
- Increase `auto-reconnect-delay` to 10000
- Check server whitelist/allowlist

### Configuration Errors

**Problem**: Bot won't start due to config issues

**Solutions:**
- Validate JSON syntax (use JSONLint.com)
- Check all required fields are present
- Remove any comments from JSON
- Use the example config as reference

## 🎯 24/7 Operation Tips

### Stability Checklist

✅ **Configuration**
- Valid Minecraft server details
- Correct version specified
- Auto-reconnect enabled

✅ **Network**
- Stable internet connection
- Server is reliable and online
- Firewall allows connection

✅ **Resource Management**
- Sufficient RAM available (100MB recommended)
- CPU usage is reasonable
- Monitor memory with `/stats` endpoint

✅ **Monitoring**
- Check web dashboard regularly
- Review logs for errors
- Set up uptime monitoring (optional)

### Recommended Settings for 24/7

```json
{
  "utils": {
    "anti-afk": {
      "enabled": true,
      "sneak": false,
      "advanced": true
    },
    "chat-messages": {
      "enabled": true,
      "repeat": true,
      "repeat-delay": 300
    },
    "auto-reconnect": true,
    "auto-reconnect-delay": 10000
  }
}
```

### Monitoring Your Bot

**Web Dashboard:**
- Main status: http://localhost:5000
- Health check: http://localhost:5000/health
- Statistics: http://localhost:5000/stats

**What to Monitor:**
- Connection status
- Last activity timestamp
- Error count
- Reconnection attempts
- Memory usage

### Using PM2 for Reliability

```bash
# Start with auto-restart
pm2 start index.js --name minecraft-bot --max-memory-restart 500M

# Monitor in real-time
pm2 monit

# View logs
pm2 logs minecraft-bot --lines 100

# Set up automatic restart on crash
pm2 startup
pm2 save
```

## 📊 Performance Guidelines

### Resource Usage (Typical)

- **RAM**: 50-100 MB
- **CPU**: 1-5% idle, 10-20% active
- **Network**: Minimal (< 1 KB/s)
- **Disk**: < 100 MB total

### Optimization Tips

1. **Reduce chat frequency** for lighter load
2. **Disable pathfinding** if not needed
3. **Limit smart responses** to reduce processing
4. **Use PM2** for automatic memory management
5. **Monitor regularly** via dashboard

## 🆘 Getting Help

If you're still having issues:

1. ✅ Check this guide thoroughly
2. ✅ Review console logs for errors
3. ✅ Verify configuration is correct
4. ✅ Test with a different server
5. ✅ Check GitHub issues
6. ✅ Ask in Discord or forum

## 📝 Quick Reference

### Essential Commands

```bash
# Start bot
npm start

# Start with PM2
pm2 start index.js --name minecraft-bot

# View logs
pm2 logs minecraft-bot

# Restart
pm2 restart minecraft-bot

# Stop
pm2 stop minecraft-bot

# Check status
pm2 list
```

### Essential Endpoints

- Status: `http://localhost:5000/`
- Health: `http://localhost:5000/health`
- Stats: `http://localhost:5000/stats`

### Essential Config

- Bot account: `config/settings.json` → `bot-account`
- Server: `config/settings.json` → `server`
- Features: `config/settings.json` → `utils`

---

**You're all set!** Your bot should now be running smoothly 24/7. Enjoy! 🎮
