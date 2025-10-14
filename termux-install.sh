#!/data/data/com.termux/files/usr/bin/bash

# BetterSMP Bot - Termux Quick Install Script
# This script automatically sets up the Minecraft bot on Android/Termux

echo ""
echo "🎮 BetterSMP Bot - Termux Auto Installer"
echo "========================================"
echo ""

# Detect if running in Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo "⚠️  This script is designed for Termux (Android)"
    echo "For desktop/laptop, use: npm install && npm start"
    echo ""
    exit 1
fi

echo "✅ Termux detected! Starting installation..."
echo ""

# Update packages
echo "📦 Updating Termux packages..."
pkg update -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    pkg install nodejs-lts -y
else
    echo "✅ Node.js already installed ($(node -v))"
fi

# Install git if not installed
if ! command -v git &> /dev/null; then
    echo "📦 Installing git..."
    pkg install git -y
else
    echo "✅ Git already installed"
fi

# Install dependencies
echo ""
echo "📦 Installing bot dependencies..."
npm install

# Run setup wizard
echo ""
echo "🚀 Running setup wizard..."
echo ""
node setup.js

# Offer to install PM2 for 24/7 operation
echo ""
echo "Would you like to install PM2 for 24/7 operation? (recommended)"
read -p "Install PM2? (y/n): " install_pm2

if [ "$install_pm2" = "y" ] || [ "$install_pm2" = "Y" ]; then
    echo "📦 Installing PM2..."
    npm install -g pm2
    
    echo ""
    echo "✅ PM2 installed! You can now run:"
    echo "   pm2 start index.js --name minecraft-bot"
    echo "   pm2 save"
    echo "   pm2 startup (to auto-start on reboot)"
    echo ""
    
    # Enable wake lock
    if command -v termux-wake-lock &> /dev/null; then
        termux-wake-lock
        echo "✅ Wake lock enabled (prevents Android from sleeping)"
    fi
    
    echo ""
    echo "⚠️  IMPORTANT: Disable battery optimization for Termux in Android settings!"
    echo ""
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Your bot is configured and ready to use!"
echo ""
echo "Quick commands:"
echo "  npm start          - Start the bot"
echo "  npm run setup      - Run setup wizard again"
echo "  pm2 start index.js - Run 24/7 with PM2 (if installed)"
echo ""
