#!/data/data/com.termux/files/usr/bin/bash

echo "========================================="
echo "  BetterSMP Bot - Termux 24/7 Setup"
echo "========================================="
echo ""

echo "[1/6] Updating Termux packages..."
pkg update -y && pkg upgrade -y

echo ""
echo "[2/6] Installing Node.js and Git..."
pkg install nodejs-lts git -y

echo ""
echo "[3/6] Installing PM2 process manager..."
npm install -g pm2

echo ""
echo "[4/6] Installing bot dependencies..."
npm install

echo ""
echo "[5/6] Acquiring wakelock to prevent sleep..."
termux-wake-lock

echo ""
echo "[6/6] Checking configuration..."
if [ ! -f "config/settings.json" ]; then
  echo "⚠️  No settings.json found. Copying from example..."
  cp config/example.settings.json config/settings.json
  echo "📝 Please edit config/settings.json with your settings"
fi

echo ""
echo "[7/7] Starting bot with PM2..."
pm2 start index.js --name bettersmp-bot
pm2 save

echo ""
echo "========================================="
echo "  ✅ Setup Complete!"
echo "========================================="
echo ""
echo "Your BetterSMP bot is now running 24/7!"
echo ""
echo "📱 IMPORTANT - Manual Steps Required:"
echo ""
echo "1. Go to Android Settings → Apps → Termux → Battery"
echo "   - Enable 'Allow background activity'"
echo "   - Disable battery optimization"
echo ""
echo "2. Keep your phone plugged in for 24/7 operation"
echo ""
echo "3. Keep Termux app open (minimized is OK)"
echo ""
echo "========================================="
echo "  Useful Commands:"
echo "========================================="
echo ""
echo "pm2 list          - Show running processes"
echo "pm2 logs          - View bot logs"
echo "pm2 restart all   - Restart the bot"
echo "pm2 stop all      - Stop the bot"
echo "pm2 monit         - Monitor resources"
echo ""
echo "To start bot on phone reboot:"
echo "pm2 startup       - Follow the instructions shown"
echo ""
