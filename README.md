# 🎮 BetterSMP Bot - Minecraft Admin Helper & Activity Bot

A lightweight admin helper bot for Minecraft servers. Keeps your server active, helps players automatically, and acts like a real player - all without API keys or external services!

## ✨ Features

### Core Functionality
- 🤖 **Realistic Player Behavior** - Acts like a real player, not an obvious bot
- 🎓 **Smart Admin Helper** - Automatically helps players with rules, tips, and commands (NEW!)
- 💬 **Context-Aware Responses** - Understands questions and provides helpful answers (NO API NEEDED!)
- 📢 **Automated Announcements** - Randomly timed promotional messages about your server
- 🔄 **Auto-Reconnect** - Automatically reconnects if disconnected
- 🎯 **Advanced Anti-AFK** - Multiple movement patterns to avoid detection
- 🚶 **Pathfinding** - Can navigate to specific coordinates (optional)
- 🔐 **Auto-Authentication** - Supports server login systems (optional)
- 📊 **Enhanced Dashboard** - JSON API with health checks and player statistics

### Admin Helper Features ⭐
- **Welcome Messages** - Greets new players automatically
- **Rule Reminders** - Responds to rule questions
- **Mining Tips** - Helps with diamond/ore locations  
- **Building Advice** - Gives building tips and tricks
- **Command Help** - Explains server commands
- **Server Info** - Provides Discord/website links
- **Player Tracking** - Tracks player activity and stats

### Why This Bot?
- **Zero Dependencies** - No API keys, no external services, just works!
- **Lightweight** - Minimal CPU and memory usage (~50MB RAM)
- **Server-Friendly** - Low network overhead, smart anti-kick protection
- **Intelligent** - Context-aware responses using smart templates
- **Admin Tool** - Helps manage server and assist players 24/7
- **Fully Automated** - Set it and forget it
- **Easy Setup** - Works on Replit, Termux, or any server in minutes

## 📦 Quick Start

### Prerequisites
- Node.js 14+ installed
- A Minecraft account (can be offline mode)
- Basic knowledge of JSON configuration

### Installation

1. **Clone or Download this repository**
   ```bash
   git clone <your-repo-url>
   cd bettersmp-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   ```bash
   cp config/example.settings.json config/settings.json
   nano config/settings.json
   ```

4. **Start the bot**
   ```bash
   node index.js
   ```

## ⚙️ Configuration

Edit `config/settings.json` to customize your bot:

### Bot Account
```json
"bot-account": {
  "username": "YourUsername",
  "password": "",
  "type": "mojang"
}
```
- **username**: Your Minecraft username
- **password**: Leave empty for offline servers
- **type**: "mojang" or "microsoft"

### Server Settings
```json
"server": {
  "ip": "your.server.ip",
  "port": 25565,
  "version": "1.12.1"
}
```
- **ip**: Your Minecraft server address
- **port**: Server port (usually 25565)
- **version**: Minecraft version (e.g., "1.12.1", "1.19.2")

### Position (Optional)
```json
"position": {
  "enabled": false,
  "x": 0,
  "y": 0,
  "z": 0
}
```
Enable to make the bot walk to specific coordinates on spawn.

### Chat Messages
```json
"chat-messages": {
  "enabled": true,
  "repeat": true,
  "repeat-delay": 180,
  "messages": [
    "Welcome to BetterSMP, the best Minecraft server!!!",
    "This SMP is amazing!",
    "Love this server!"
  ]
}
```
- **enabled**: Turn chat messages on/off
- **repeat**: Keep sending messages
- **repeat-delay**: Base delay between messages in seconds (adds random variation)
- **messages**: Array of messages to randomly send

### Smart Responses & Admin Helper (No API Needed!)
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
- **smart-responses**: Bot responds intelligently to player questions using pre-built templates
- **welcome-new-players**: Automatically greets new players
- **answer-questions**: Helps with rules, commands, tips, and server info
- **provide-tips**: Gives mining, building, and gameplay advice

The bot understands context and responds appropriately to:
- Questions about rules, commands, help
- Mining and building questions
- Welcome messages and greetings
- Server information requests
- And much more!

### Anti-AFK
```json
"anti-afk": {
  "enabled": true,
  "sneak": false,
  "advanced": true
}
```
- **enabled**: Keeps bot active
- **sneak**: Also activate sneaking occasionally
- **advanced**: Uses varied random movements (jump, forward, back, left, right)

### Auto-Reconnect
```json
"auto-reconnect": true,
"auto-reconnect-delay": 5000
```
Automatically reconnects if disconnected (delay in milliseconds).

## 🚀 Deployment Options

### Option 1: Run Locally
```bash
node index.js
```
Simple and quick for testing.

### Option 2: Run on Replit
1. Import this project to Replit
2. Configure `config/settings.json`
3. Click "Run"
4. For 24/7: Publish to Reserved VM deployment

### Option 3: Run on Termux (Android 24/7)

Perfect for running 24/7 from your phone!

1. **Install Termux** (from F-Droid, not Play Store)

2. **Setup in Termux:**
   ```bash
   pkg update && pkg upgrade -y
   pkg install nodejs-lts git -y
   npm install -g pm2
   
   git clone <your-repo-url>
   cd bettersmp-bot
   npm install
   
   # Configure your settings
   nano config/settings.json
   
   # Run with PM2
   pm2 start index.js --name minecraft-bot
   pm2 save
   termux-wake-lock
   ```

3. **Important:** Disable battery optimization for Termux in Android settings

See `TERMUX-GUIDE.md` for detailed instructions.

### Option 4: Run on VPS/Server
```bash
# Install PM2 for process management
npm install -g pm2

# Start bot
pm2 start index.js --name minecraft-bot

# Save configuration
pm2 save

# Enable startup on boot
pm2 startup
```

## 📊 Web Dashboard & Health Monitoring

The bot includes an enhanced JSON API accessible at `http://localhost:5000` (or your deployment URL).

### Endpoints:

**`GET /`** - Full bot status
```json
{
  "status": "running",
  "bot": {
    "connected": true,
    "username": "Steve_2847",
    "server": "BetterSMP-J787.aternos.me",
    "uptime": 1234567,
    "lastActivity": 1760432685830,
    "features": {
      "antiAfk": true,
      "autoAuth": false,
      "chatMessages": true,
      "smartResponses": true,
      "adminHelper": true
    },
    "stats": {
      "messagesReceived": 45,
      "responsesSent": 12,
      "playersTracked": 8
    }
  },
  "message": "BetterSMP Bot - Active and Running ✅"
}
```

**`GET /health`** - Health check endpoint
```json
{
  "status": "healthy",
  "connected": true,
  "username": "Steve_2847",
  "server": "BetterSMP-J787.aternos.me",
  "uptime": 1234567,
  "lastActivity": 1760432685830,
  "features": {
    "antiAfk": true,
    "autoAuth": false,
    "chatMessages": true,
    "smartResponses": true,
    "adminHelper": true
  },
  "stats": {
    "messagesReceived": 45,
    "responsesSent": 12,
    "playersTracked": 8
  }
}
```

## 🛠️ Advanced Usage

### PM2 Process Management

```bash
# View status
pm2 list

# View logs
pm2 logs minecraft-bot

# Restart bot
pm2 restart minecraft-bot

# Stop bot
pm2 stop minecraft-bot

# Monitor resources
pm2 monit
```

### Customizing Chat Messages

Edit `config/settings.json` to add your own messages:

```json
"messages": [
  "Welcome to [YourServer]!",
  "This is the best SMP ever!",
  "Join us at play.yourserver.com",
  "Amazing community here!",
  "Best server features and gameplay!"
]
```

**Tips for realistic messages:**
- Mix promotional and casual messages
- Use varied language and enthusiasm
- Avoid obvious bot patterns
- Include your server name/IP strategically

### Multiple Bots

To run multiple bots:

1. Create separate config files:
   ```bash
   cp config/settings.json config/settings-bot2.json
   ```

2. Modify the bot to accept config parameter (or create separate instances)

3. Run each with PM2:
   ```bash
   pm2 start index.js --name bot1
   pm2 start index.js --name bot2
   ```

## 🔧 Troubleshooting

### Bot Won't Connect
- Check server IP and port
- Verify Minecraft version matches
- Ensure server allows the account type (online/offline)

### Bot Gets Kicked
- Check for anti-bot plugins on server
- Reduce chat message frequency
- Disable anti-afk if server has its own AFK detection

### High CPU Usage
- Disable pathfinding if not needed
- Increase chat message delay
- Use sneak: false in anti-afk

### Disconnects Frequently
- Check internet connection stability
- Verify auto-reconnect is enabled
- Check server whitelist/allowlist

## 📁 Project Structure

```
bettersmp-bot/
├── config/
│   ├── settings.json          # Your configuration (gitignored)
│   └── example.settings.json  # Example configuration
├── bot-responses.js          # Smart response system
├── index.js                   # Main bot code
├── package.json              # Dependencies
├── README.md                 # This file
├── QUICKSTART.md            # Quick start guide
├── SMART-RESPONSES.md       # Smart responses documentation
├── TERMUX-GUIDE.md          # Detailed Termux setup guide
├── termux-setup.sh          # Automated Termux setup script
└── .gitignore               # Git ignore rules
```

## 🔒 Security Notes

- ⚠️ **Never commit `config/settings.json`** - It's in .gitignore for protection
- 🔐 Keep your Minecraft credentials secure
- 🌐 Don't expose web dashboard publicly without authentication
- 📝 Use example.settings.json as template, not your real settings

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This bot is for educational and server management purposes. Always:
- Get permission from server admins before using bots
- Follow server rules and terms of service
- Use responsibly and don't spam
- Respect Minecraft's Terms of Service

## 🆘 Support

Having issues? 

1. Check the troubleshooting section above
2. Review your configuration in `config/settings.json`
3. Check logs with `pm2 logs` or console output
4. Ensure all dependencies are installed: `npm install`

## 🎯 Use Cases

- **Admin Helper** - Automatically assists players with rules, tips, and commands
- **Server Activity** - Keeps servers active and prevents auto-sleep
- **Community Engagement** - Welcomes new players and maintains friendly atmosphere
- **Server Promotion** - Spreads the word about your server naturally
- **Development & Testing** - Test plugins and server configurations
- **Player Support** - Provides helpful responses 24/7 without admin presence
- **Information Hub** - Answers questions about mining, building, and server info

---

**Made for BetterSMP and the Minecraft community** 🎮

*Keep your servers active, keep your community engaged!*
