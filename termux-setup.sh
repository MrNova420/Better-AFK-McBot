#!/data/data/com.termux/files/usr/bin/bash

# BetterSMP Bot - Simple Termux Setup
# Installs and configures the bot automatically

clear
echo "🎮 BetterSMP Bot - Termux Setup"
echo "================================"
echo ""

# Install Node.js if needed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    pkg update -y && pkg install nodejs-lts -y
fi

# Install dependencies
echo "📦 Installing bot dependencies..."
npm install

# Run setup wizard
echo ""
echo "🚀 Starting setup wizard..."
echo ""
npm run setup

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start your bot anytime, run: npm start"
echo ""
