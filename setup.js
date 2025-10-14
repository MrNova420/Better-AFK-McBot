#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎮 BetterSMP Bot - Easy Setup Wizard\n');
console.log('This will configure your Minecraft bot in 5 simple steps!\n');
console.log('Make sure you have a Minecraft server ready to connect to.\n');

const questions = {
  username: 'Enter your bot username (e.g., BetterBot): ',
  serverIp: 'Enter Minecraft server IP (e.g., play.example.com): ',
  serverPort: 'Enter server port [25565]: ',
  serverVersion: 'Enter Minecraft version (e.g., 1.20.1, 1.19.4, 1.12.2): ',
  accountType: 'Account type (1=offline/cracked, 2=Microsoft, 3=Mojang): ',
  password: 'Enter password (leave empty for offline servers): '
};

const answers = {};

function ask(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer.trim());
    });
  });
}

async function setupBot() {
  try {
    console.log('📝 Let\'s configure your bot...\n');
    
    // Get bot username
    answers.username = await ask(questions.username);
    if (!answers.username) {
      throw new Error('Bot username is required!');
    }
    
    // Get server IP
    answers.serverIp = await ask(questions.serverIp);
    if (!answers.serverIp) {
      throw new Error('Server IP is required!');
    }
    
    // Get server port
    const port = await ask(questions.serverPort);
    answers.serverPort = port || '25565';
    
    // Get Minecraft version
    answers.serverVersion = await ask(questions.serverVersion);
    if (!answers.serverVersion) {
      throw new Error('Minecraft version is required!');
    }
    
    // Get account type
    const accountType = await ask(questions.accountType);
    switch(accountType) {
      case '2':
        answers.accountType = 'microsoft';
        break;
      case '3':
        answers.accountType = 'mojang';
        break;
      default:
        answers.accountType = 'offline';
    }
    
    // Get password if needed
    if (answers.accountType !== 'offline') {
      answers.password = await ask(questions.password);
    } else {
      answers.password = '';
    }
    
    // Load existing config or use example
    let config;
    const configPath = path.join(__dirname, 'config', 'settings.json');
    const examplePath = path.join(__dirname, 'config', 'example.settings.json');
    
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch {
      config = JSON.parse(fs.readFileSync(examplePath, 'utf8'));
    }
    
    // Update config with user's answers
    config['bot-account'].username = answers.username;
    config['bot-account'].password = answers.password;
    config['bot-account'].type = answers.accountType;
    
    config.server.ip = answers.serverIp;
    config.server.port = parseInt(answers.serverPort);
    config.server.version = answers.serverVersion;
    config.server.name = answers.serverIp.split('.')[0];
    
    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log('\n✅ Configuration saved successfully!\n');
    console.log('🚀 Starting your bot...\n');
    
    rl.close();
    
    // Start the bot
    require('./index.js');
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
    rl.close();
    process.exit(1);
  }
}

setupBot();
