# Running BetterSMP Bot 24/7 in Termux

This guide will help you run your BetterSMP bot 24/7 on your Android phone using Termux.

## 📋 Prerequisites

- Android phone (keep it plugged in for 24/7 operation)
- Stable internet connection (WiFi recommended)
- Termux app (get from F-Droid or GitHub, NOT Google Play Store)

## 🚀 Quick Setup (Automated)

### Step 1: Install Termux

1. **Download Termux from one of these sources:**
   - [F-Droid](https://f-droid.org/en/packages/com.termux/) (Recommended)
   - [GitHub Releases](https://github.com/termux/termux-app/releases)
   
   ⚠️ **DO NOT use Google Play Store version** - it's outdated!

### Step 2: Download Your Bot Files

In Termux, run these commands:

```bash
# Give Termux storage access
termux-setup-storage

# Go to downloads or clone from Git
cd ~/storage/downloads

# If your bot is on this Repl, download it:
# (Replace with your actual Repl URL)
git clone <your-repl-git-url> bettersmp-bot
cd bettersmp-bot
```

### Step 3: Run Automated Setup

```bash
# Make setup script executable
chmod +x termux-setup.sh

# Run the setup (this does everything automatically!)
./termux-setup.sh
```

The script will:
- ✅ Update Termux packages
- ✅ Install Node.js
- ✅ Install PM2 process manager
- ✅ Install bot dependencies
- ✅ Acquire wakelock (prevents phone sleep)
- ✅ Start your bot and save configuration

## ⚙️ Manual Steps (Critical for 24/7 Operation)

After the automated setup, you MUST do these manually:

### 1. Disable Battery Optimization for Termux

1. Go to **Android Settings**
2. Navigate to **Apps → Termux**
3. Tap **Battery**
4. Enable **"Allow background activity"**
5. Select **"No restrictions"** or disable battery optimization

### 2. For Samsung/Xiaomi/OnePlus Devices

Additional steps needed due to aggressive battery management:

**Samsung:**
- Settings → Device Care → Battery → Background usage limits
- Add Termux to "Never sleeping apps"

**Xiaomi (MIUI):**
- Settings → Battery & Performance → App Battery Saver
- Select Termux → No restrictions
- Settings → Apps → Manage Apps → Termux → Autostart (enable)

**OnePlus:**
- Settings → Battery → Battery Optimization
- Termux → Don't optimize

### 3. Keep Phone Plugged In

For true 24/7 operation, keep your phone:
- Plugged into power
- Connected to WiFi (more stable than mobile data)
- In a cool, ventilated place

## 📱 Using Your Bot

### View Bot Status
```bash
pm2 list
```

### View Live Logs
```bash
pm2 logs bettersmp-bot
```

### Monitor Resources
```bash
pm2 monit
```

### Restart Bot
```bash
pm2 restart bettersmp-bot
```

### Stop Bot
```bash
pm2 stop bettersmp-bot
```

### Start Bot Again
```bash
pm2 start bettersmp-bot
```

## 🔄 Auto-Start on Phone Reboot

To make your bot start automatically when you restart your phone:

```bash
pm2 startup
```

Follow the instructions it gives you, then run:

```bash
pm2 save
```

## 🛠️ Configure Your Bot

Before starting, edit your bot settings:

```bash
nano settings.json
```

Update:
- Minecraft server IP and port
- Bot username/password
- Any other settings you need

Press `Ctrl + X`, then `Y`, then `Enter` to save.

## ⚠️ Important Notes

### Battery Life
- Running 24/7 will drain battery if unplugged
- Keep phone plugged in for continuous operation
- Consider using an old phone dedicated to this

### Network
- Bot will disconnect if you lose internet
- WiFi is more stable than mobile data
- Auto-reconnect is enabled in the bot code

### Phone Performance
- The bot uses minimal resources
- Your phone will still be usable for other tasks
- Keep Termux running in background (minimized is fine)

### Wakelock
The bot acquires a wakelock to keep running. You'll see a persistent notification. Don't dismiss it!

## 🔍 Troubleshooting

### Bot stops when screen turns off
- Ensure wakelock is acquired: `termux-wake-lock`
- Check battery optimization is disabled
- Enable "Allow background activity" for Termux

### Bot stops after a few hours
- Check all battery optimization settings
- Verify auto-start/autorun permissions
- Some phones still kill apps - try root access (advanced)

### PM2 not working
```bash
pm2 delete all
pm2 kill
npm install -g pm2
pm2 start index.js --name bettersmp-bot
pm2 save
```

### Check if Node is running
```bash
ps aux | grep node
```

### Restart everything
```bash
pm2 restart all
```

## 📊 Checking if Bot is Active

1. **In Termux:**
   ```bash
   pm2 list
   ```
   Should show "online" status

2. **Check logs:**
   ```bash
   pm2 logs --lines 20
   ```

3. **On Minecraft Server:**
   - Your bot should appear online
   - Check with `/list` command

## 💡 Pro Tips

1. **Use an old phone** - Dedicate an old Android device for hosting
2. **WiFi only** - Turn off mobile data to save battery
3. **Keep it cool** - Place phone in ventilated area, remove case
4. **Monitor logs** - Regularly check `pm2 logs` for issues
5. **Backup config** - Keep a copy of `settings.json` saved elsewhere

## 🆘 Need Help?

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Verify Node is running: `ps aux | grep node`
3. Restart: `pm2 restart all`
4. Check battery settings again

---

**Your bot should now be running 24/7! Keep your phone plugged in and enjoy!** 🎮
