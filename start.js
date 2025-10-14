#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('\n🎮 BetterSMP Bot - Auto Launcher\n');

// Check if config exists and is properly set up
const configPath = path.join(__dirname, 'config', 'settings.json');
const examplePath = path.join(__dirname, 'config', 'example.settings.json');

let needsSetup = false;

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Check if config has placeholder values
  const isPlaceholder = 
    config['bot-account'].username.includes('Your') ||
    config['bot-account'].username.includes('SETUP_REQUIRED') ||
    config.server.ip.includes('your.') ||
    config.server.ip.includes('SETUP_REQUIRED');
  
  if (isPlaceholder) {
    console.log('⚠️  Configuration not set up yet!\n');
    needsSetup = true;
  }
} catch (error) {
  console.log('⚠️  Configuration file missing!\n');
  needsSetup = true;
}

if (needsSetup) {
  // Check if running in non-interactive environment (workflow, CI, etc.)
  const isNonInteractive = 
    process.env.REPL_ID || // Replit environment
    process.env.CI || // CI environment  
    !process.stdin.isTTY || // No TTY
    process.env.NODE_ENV === 'production'; // Production mode
  
  if (isNonInteractive) {
    // Non-interactive mode (workflow, cron, etc.) - just start with current config
    console.log('⚠️  Configuration uses placeholder values\n');
    console.log('📝 To configure your bot, run: npm run setup\n');
    console.log('🚀 Starting with current config...\n');
    require('./index.js');
  } else {
    // Interactive mode - ask user what to do
    console.log('Would you like to run the setup wizard? (recommended)\n');
    console.log('Option 1: Run setup wizard (easy & guided)');
    console.log('   Command: node setup.js\n');
    console.log('Option 2: Edit config manually');
    console.log('   File: config/settings.json\n');
    console.log('Option 3: Just run with current config (dashboard only)\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Choose option (1/2/3): ', (answer) => {
      rl.close();
      
      if (answer === '1') {
        // Run setup wizard
        console.log('\n🚀 Starting setup wizard...\n');
        const setup = spawn('node', ['setup.js'], { stdio: 'inherit' });
        setup.on('close', (code) => {
          if (code !== 0) process.exit(code);
        });
      } else if (answer === '2') {
        console.log('\n📝 Please edit config/settings.json, then run: node start.js\n');
        process.exit(0);
      } else {
        // Run with current config
        console.log('\n⚠️  Running with current config (dashboard only, no server connection)\n');
        require('./index.js');
      }
    });
  }
} else {
  // Config is good, start the bot
  console.log('✅ Configuration found!\n');
  console.log('🚀 Starting bot...\n');
  require('./index.js');
}
