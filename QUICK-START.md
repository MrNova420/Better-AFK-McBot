# 🚀 Quick Start Guide - Get Running in 60 Seconds!

## ⚡ Super Fast Setup

### 📱 Termux (Android) - One Command Install:
```bash
curl -o install.sh https://raw.githubusercontent.com/yourusername/bettersmp-bot/main/termux-install.sh && bash install.sh
```

### 💻 Desktop/Laptop/Replit - Three Commands:
```bash
npm install
npm run setup
npm start
```

That's it! 🎉

---

## 📋 What Happens?

1. **npm install** - Installs the bot (one time only)
2. **npm run setup** - Setup wizard asks you 3 simple questions:
   - Bot username
   - Server IP address  
   - Minecraft version
3. **npm start** - Your bot connects and starts working!

---

## 🎮 Example Setup

```
$ npm run setup

🎮 BetterSMP Bot - Easy Setup Wizard

This will configure your Minecraft bot in 5 simple steps!
Make sure you have a Minecraft server ready to connect to.

📝 Let's configure your bot...

Enter your bot username (e.g., BetterBot): MyAwesomeBot
Enter Minecraft server IP (e.g., play.example.com): play.myserver.com
Enter server port [25565]: 
Enter Minecraft version (e.g., 1.20.1, 1.19.4, 1.12.2): 1.20.1
Account type (1=offline/cracked, 2=Microsoft, 3=Mojang): 1

✅ Configuration saved successfully!
🚀 Starting your bot...
```

---

## 🔧 Need to Change Settings?

**Option 1: Run setup again**
```bash
npm run setup
```

**Option 2: Edit config manually**
```bash
nano config/settings.json
```

---

## 🤖 Bot Features (All Automatic!)

Once running, your bot will automatically:
- ✅ Connect to your Minecraft server
- ✅ Welcome new players
- ✅ Answer questions about rules, commands, tips
- ✅ Provide mining & building advice  
- ✅ Keep server active 24/7
- ✅ Prevent AFK kicks
- ✅ Send promotional messages
- ✅ Auto-reconnect if disconnected

**No configuration needed** - it just works!

---

## 📱 Run 24/7 on Termux (Android)

After setup, keep it running forever:
```bash
npm install -g pm2
pm2 start index.js --name minecraft-bot
pm2 save
termux-wake-lock
```

**Important:** Disable battery optimization for Termux in Android settings!

---

## 🖥️ Run 24/7 on Replit

1. Import project to Replit
2. Run: `npm run setup`
3. Click "Publish" → "Reserved VM"
4. Done! Bot runs forever

---

## ❓ Troubleshooting

### Bot won't connect?
- Make sure server IP and version are correct
- Check if server is online
- For offline/cracked servers, use account type 1

### Need different settings?
- Run `npm run setup` again anytime
- Or edit `config/settings.json` directly

### Want to see what's happening?
- Dashboard: http://localhost:5000
- Health check: http://localhost:5000/health
- Stats: http://localhost:5000/stats

---

## 🎯 That's It!

You now have a fully automated Minecraft bot running 24/7! 

For advanced configuration, see [SETUP-GUIDE.md](SETUP-GUIDE.md)
