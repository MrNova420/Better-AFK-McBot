# 🎓 Smart Responses & Admin Helper Guide

The BetterSMP Bot includes an intelligent admin helper system that automatically assists players **without requiring any API keys or external services!**

## 🌟 Features

### What It Does
- **Welcomes New Players** - Automatically greets players joining for the first time
- **Answers Questions** - Responds intelligently to player questions about:
  - Server rules and guidelines
  - Commands and how to use them
  - Mining tips (diamond locations, ore finding)
  - Building advice and decoration tips
  - Server information (Discord, website)
  - Location help (spawn, coordinates)
- **Provides Context-Aware Help** - Understands what players are asking and gives relevant answers
- **Tracks Player Activity** - Monitors who's online and their activity

### How It Works
The bot uses **100+ pre-written smart templates** that are selected based on what players say. No AI API needed - it's all built-in logic!

## 📊 Response Categories

### 1. Rule Questions
**Triggers:** "rules", "rule"

**Example Responses:**
- "Main rules: No griefing, no stealing, respect everyone!"
- "Remember: PvP only in arenas, no cheating, be friendly!"
- "Server rules: Build 100 blocks from others, no hacks, have fun!"

### 2. Help & Commands
**Triggers:** "help", "how to", "commands"

**Example Responses:**
- "Need help? Ask admins or check /spawn for info boards!"
- "Try /sethome to save your base location!"
- "Use /tpa [player] to teleport to friends!"

### 3. Mining Tips
**Triggers:** "diamond", "ore", "mine"

**Example Responses:**
- "Best diamonds are around Y: -59 to Y: -64!"
- "Branch mining at Y: 11 works great for most ores!"
- "Ancient debris is around Y: 15 in the Nether!"

### 4. Building Advice
**Triggers:** "build", "base", "house"

**Example Responses:**
- "Add depth to builds using stairs and slabs!"
- "Mix different block types for better textures!"
- "Use trapdoors and buttons for decoration!"

### 5. Location Help
**Triggers:** "spawn", "where", "location"

**Example Responses:**
- "Type /spawn to get back to spawn point!"
- "F3 shows your coordinates in-game!"
- "Build a nether portal for fast travel!"

### 6. Welcome Messages
**Automatically sent to new players**

**Examples:**
- "Welcome PlayerName! Glad to have you on BetterSMP!"
- "Hey PlayerName! First time here? Feel free to explore!"
- "Welcome to the server PlayerName! Check out spawn for starter info!"

### 7. Greetings
**Triggers:** "hi", "hello", "hey"

**Example Responses:**
- "Hey PlayerName! How's it going?"
- "Hi PlayerName! Good to see you online!"
- "Hello PlayerName! What are you working on today?"

### 8. Server Information
**Triggers:** "discord", "website", "link"

**Example Responses:**
- "Join our Discord for updates and events!"
- "Visit our website for server rules and news!"
- "Discord link is in the server description!"

## ⚙️ Configuration

Edit `config/settings.json`:

```json
{
  "utils": {
    "smart-responses": {
      "enabled": true
    },
    "admin-helper": {
      "enabled": true,
      "welcome-new-players": true,
      "answer-questions": true,
      "provide-tips": true
    }
  }
}
```

### Options Explained

- **smart-responses.enabled** - Turn the entire smart response system on/off
- **admin-helper.enabled** - Enable admin helper features
- **welcome-new-players** - Automatically greet new players
- **answer-questions** - Respond to player questions
- **provide-tips** - Give gameplay tips and advice

## 🎯 Response Logic

The bot decides when to respond based on:

1. **Direct Mentions** - Always responds if mentioned by name
2. **Commands** - Always responds to `/help` or messages starting with `!`
3. **Keywords** - Higher chance for important keywords:
   - Rules: 80% response rate
   - Help: 70% response rate
   - Welcome: 100% response rate
   - Questions (?): 40% response rate
   - Greetings: 60% response rate
4. **Random** - 12% chance for casual conversation
5. **Ignores "bot"** - Never responds to messages containing "bot" (to avoid detection)

## 📈 Player Tracking

The bot tracks:
- **First Seen** - When player joined for the first time
- **Last Seen** - Most recent activity
- **Message Count** - How many messages they've sent

This data is used to:
- Welcome new players appropriately
- Welcome back returning players
- Track server activity statistics

## 🎨 Promotional Messages

The bot generates dynamic promotional messages including:
- Server uptime
- Player count
- Helpful tips
- Event announcements
- Community building messages

**Examples:**
- "Welcome to BetterSMP! We've been online for 2 days!"
- "5 players have joined today! Come be part of our community!"
- "Server tip: Use /tpa to teleport to friends!"

## 💡 Customization Tips

### Add Your Own Responses

Edit `bot-responses.js` and add to any response array:

```javascript
getRulesResponses() {
   return [
      "Main rules: No griefing, no stealing, respect everyone!",
      "Your custom rule message here!",
      // Add more...
   ];
}
```

### Adjust Response Rates

In `shouldRespondToMessage()`, change probabilities:

```javascript
if (lowerMessage.includes('help')) return Math.random() < 0.7; // 70% chance
```

Change `0.7` to:
- `1.0` = Always respond (100%)
- `0.5` = Respond half the time (50%)
- `0.1` = Rarely respond (10%)

### Add New Trigger Words

Add new conditions in `generateResponse()`:

```javascript
if (lowerMessage.includes('your-keyword')) {
   return this.getRandomResponse(this.getYourCustomResponses());
}
```

## 🔍 Monitoring

### Check Response Stats

Visit: `http://localhost:5000/health`

You'll see:
```json
{
  "stats": {
    "messagesReceived": 45,
    "responsesSent": 12,
    "playersTracked": 8
  }
}
```

### View Logs

The bot logs all smart responses:
```
[Smart Response] PlayerName: how do I find diamonds? → Best diamonds are around Y: -59 to Y: -64!
[Welcome] Welcome PlayerName! Glad to have you on BetterSMP!
[Promo] Server tip: Use /tpa to teleport to friends!
```

## ⚡ Performance

- **Memory Usage**: ~50MB RAM (no API overhead)
- **Response Time**: Instant (< 100ms)
- **Network**: Minimal (no external API calls)
- **CPU**: Very low (simple template matching)

## 🎉 Benefits Over AI APIs

✅ **No Cost** - Zero API fees, completely free
✅ **No Setup** - Works immediately, no API keys needed
✅ **Always Online** - No rate limits or service outages
✅ **Privacy** - No data sent to third parties
✅ **Fast** - Instant responses, no network delay
✅ **Customizable** - Full control over all responses
✅ **Lightweight** - Minimal resource usage

## 🔧 Troubleshooting

### Bot Not Responding

**Check:**
1. `smart-responses.enabled` is `true` in config
2. Bot is connected to server
3. Messages don't contain "bot" (bot ignores these)
4. Check logs for `[Smart Response]` entries

### Bot Responding Too Much

**Solution:**
- Lower probability values in `shouldRespondToMessage()`
- Disable certain response types
- Adjust keyword triggers

### Bot Not Welcoming Players

**Check:**
1. `admin-helper.welcome-new-players` is `true`
2. Player is actually new (not already tracked)
3. Check logs for `[Welcome]` entries

---

## 🎮 Ready to Use!

Your bot is now an intelligent admin helper that:
- ✅ Welcomes players automatically
- ✅ Answers questions intelligently  
- ✅ Provides helpful tips
- ✅ Tracks player activity
- ✅ Keeps server engaging

**All without any API keys or external services!** 🚀
