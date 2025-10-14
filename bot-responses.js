class BotResponses {
   constructor(botName, serverName, config = {}) {
      this.botName = botName;
      this.serverName = serverName;
      this.config = config;
      this.lastResponses = [];
      this.conversationContext = new Map();
      this.playerStats = new Map();
      this.serverStartTime = Date.now();
   }

   async shouldRespondToMessage(message, playerName) {
      if (!this.config.enabled) return false;
      
      const lowerMessage = message.toLowerCase();
      const lowerBotName = this.botName.toLowerCase();
      
      if (lowerMessage.includes('bot')) return false;
      if (lowerMessage.includes(lowerBotName)) return true;
      
      if (!this.config.answerQuestions) {
         return lowerMessage.includes(lowerBotName);
      }
      
      if (lowerMessage.startsWith('!') || lowerMessage.startsWith('/help')) return true;
      
      if (lowerMessage.includes('welcome') || lowerMessage.includes('new here')) return true;
      if (lowerMessage.includes('rules') || lowerMessage.includes('rule')) return Math.random() < 0.8;
      if (lowerMessage.includes('help') || lowerMessage.includes('how to')) return Math.random() < 0.7;
      if (lowerMessage.includes('?')) return Math.random() < 0.4;
      if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) return Math.random() < 0.6;
      if (lowerMessage.includes('discord') || lowerMessage.includes('website')) return Math.random() < 0.5;
      
      return Math.random() < 0.12;
   }

   async generateResponse(playerMessage, playerName) {
      const lowerMessage = playerMessage.toLowerCase();
      
      this.trackPlayerActivity(playerName);
      
      if (lowerMessage.includes('rules') || lowerMessage.includes('rule')) {
         return this.getRandomResponse(this.getRulesResponses());
      }
      
      if (lowerMessage.includes('help') || lowerMessage.includes('how to') || lowerMessage.includes('commands')) {
         return this.getRandomResponse(this.getHelpResponses());
      }
      
      if (lowerMessage.includes('welcome') || lowerMessage.includes('new here') || lowerMessage.includes('first time')) {
         return this.getRandomResponse(this.getWelcomeResponses(playerName));
      }
      
      if (lowerMessage.includes('discord') || lowerMessage.includes('website') || lowerMessage.includes('link')) {
         return this.getRandomResponse(this.getServerInfoResponses());
      }
      
      if (this.config.provideTips) {
         if (lowerMessage.includes('diamond') || lowerMessage.includes('ore') || lowerMessage.includes('mine')) {
            return this.getRandomResponse(this.getMiningTips());
         }
         
         if (lowerMessage.includes('build') || lowerMessage.includes('base') || lowerMessage.includes('house')) {
            return this.getRandomResponse(this.getBuildingTips());
         }
         
         if (lowerMessage.includes('spawn') || lowerMessage.includes('where') || lowerMessage.includes('location')) {
            return this.getRandomResponse(this.getLocationHelp());
         }
      }
      
      if (lowerMessage.includes('?')) {
         return this.getRandomResponse(this.getQuestionResponses());
      }
      
      if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
         return this.getRandomResponse(this.getGreetingResponses(playerName));
      }
      
      if (lowerMessage.includes('thanks') || lowerMessage.includes('thank')) {
         return this.getRandomResponse(this.getThankYouResponses());
      }
      
      if (lowerMessage.includes(this.botName.toLowerCase())) {
         return this.getRandomResponse(this.getDirectMentionResponses());
      }
      
      return this.getRandomResponse(this.getCasualResponses());
   }

   getRulesResponses() {
      return [
         "Main rules: No griefing, no stealing, respect everyone!",
         "Remember: PvP only in arenas, no cheating, be friendly!",
         "Server rules: Build 100 blocks from others, no hacks, have fun!",
         "Golden rules: Respect builds, ask before entering bases, play fair!",
         "Key rules: No spam, no toxicity, work together when you can!"
      ];
   }

   getHelpResponses() {
      return [
         "Need help? Ask admins or check /spawn for info boards!",
         "Try /sethome to save your base location!",
         "Use /tpa [player] to teleport to friends!",
         "Check /help for all commands available!",
         "For beginner tips, head to spawn - there's a guide area!",
         "Stuck? Try /back to return to your last location!",
         "Type /warp to see available teleport locations!"
      ];
   }

   getWelcomeResponses(playerName) {
      return [
         `Welcome ${playerName}! Glad to have you on ${this.serverName}!`,
         `Hey ${playerName}! First time here? Feel free to explore!`,
         `Welcome to the server ${playerName}! Check out spawn for starter info!`,
         `Nice to meet you ${playerName}! Need help getting started?`,
         `Hey ${playerName}! This server is awesome, you'll love it here!`
      ];
   }

   getServerInfoResponses() {
      return [
         "Join our Discord for updates and events!",
         "Visit our website for server rules and news!",
         "Check the forums at our website for guides!",
         "Discord link is in the server description!",
         "Find all server info at spawn!"
      ];
   }

   getMiningTips() {
      return [
         "Best diamonds are around Y: -59 to Y: -64!",
         "Branch mining at Y: 11 works great for most ores!",
         "Don't forget to bring torches and food when mining!",
         "Iron is super common around Y: 16!",
         "Strip mine at diamond level for best results!",
         "Ancient debris is around Y: 15 in the Nether!"
      ];
   }

   getBuildingTips() {
      return [
         "Add depth to builds using stairs and slabs!",
         "Mix different block types for better textures!",
         "Don't forget lighting - it prevents mobs!",
         "Plan your base layout before building big!",
         "Check other builds for inspiration!",
         "Use trapdoors and buttons for decoration!"
      ];
   }

   getLocationHelp() {
      return [
         "Type /spawn to get back to spawn point!",
         "Use /sethome at your base to save location!",
         "F3 shows your coordinates in-game!",
         "Spawn is usually at 0, 0 coordinates!",
         "Build a nether portal for fast travel!",
         "Make sure to mark your base with torches!"
      ];
   }

   getQuestionResponses() {
      return [
         "Good question! Let me think about that...",
         "Hmm, not 100% sure but I can help you figure it out!",
         "That's something worth asking an admin!",
         "Interesting question! Try asking in chat, someone knows!",
         "I'm not totally sure, but check the wiki maybe?",
         "Ask an admin, they'll know for sure!"
      ];
   }

   getGreetingResponses(playerName) {
      return [
         `Hey ${playerName}! How's it going?`,
         `Hi ${playerName}! Good to see you online!`,
         `Hello ${playerName}! What are you working on today?`,
         `Hey there ${playerName}!`,
         `Hi ${playerName}! Welcome back!`,
         "Hey! How's your day going?",
         "Hello! Good to see you here!",
         "Hi there! What's up?"
      ];
   }

   getThankYouResponses() {
      return [
         "No problem, happy to help!",
         "Anytime! That's what we're here for!",
         "You're welcome! Enjoy the server!",
         "Glad I could help!",
         "No worries! Have fun!",
         "Happy to help out!"
      ];
   }

   getDirectMentionResponses() {
      return [
         "Yeah? What's up!",
         "Hey! Need something?",
         "I'm here! How can I help?",
         "What's going on?",
         "Yeah, I'm here!",
         "Need help with something?"
      ];
   }

   getCasualResponses() {
      return [
         "Nice! Sounds fun!",
         "That's cool!",
         "Awesome stuff!",
         "Yeah, I agree!",
         "Sounds good to me!",
         "That's pretty neat!",
         "Cool, cool!",
         "Interesting!",
         "Nice work!",
         "That's great!"
      ];
   }

   generatePromoMessage() {
      const uptime = this.getUptime();
      const playerCount = this.playerStats.size;
      
      const messages = [
         `Welcome to ${this.serverName}! We've been online for ${uptime}!`,
         `${this.serverName} - Building an amazing community together!`,
         `Having a great time on ${this.serverName}!`,
         `${playerCount} players have joined today! Come be part of our community!`,
         "The community here is really friendly and helpful!",
         `${this.serverName} has some awesome features and events!`,
         "Anyone want to team up and build something cool?",
         "Great server for both new and experienced players!",
         "Enjoying the survival experience here!",
         `${this.serverName} is a solid choice for multiplayer!`,
         "Nice builds around spawn - check them out!",
         "Remember: respect everyone's builds and have fun!",
         "Don't forget to set your home point with /sethome!",
         "Server tip: Use /tpa to teleport to friends!",
         "Events coming soon - stay tuned in Discord!",
         "Building something cool? Share screenshots in Discord!",
         "Need help? Admins and players here are super helpful!",
         "New to the server? Check the guide boards at spawn!"
      ];
      
      return messages[Math.floor(Math.random() * messages.length)];
   }

   getRandomResponse(responses) {
      const availableResponses = responses.filter(r => !this.lastResponses.includes(r));
      const responsePool = availableResponses.length > 0 ? availableResponses : responses;
      const response = responsePool[Math.floor(Math.random() * responsePool.length)];
      
      this.lastResponses.push(response);
      if (this.lastResponses.length > 5) {
         this.lastResponses.shift();
      }
      
      return response;
   }

   trackPlayerActivity(playerName) {
      const now = Date.now();
      if (!this.playerStats.has(playerName)) {
         this.playerStats.set(playerName, {
            firstSeen: now,
            lastSeen: now,
            messageCount: 1
         });
      } else {
         const stats = this.playerStats.get(playerName);
         stats.lastSeen = now;
         stats.messageCount++;
      }
   }

   getUptime() {
      const uptime = Date.now() - this.serverStartTime;
      const hours = Math.floor(uptime / (1000 * 60 * 60));
      if (hours < 1) return "just started";
      if (hours < 24) return `${hours} hours`;
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''}`;
   }

   getWelcomeMessage(playerName) {
      if (!this.config.enabled || !this.config.welcomeNewPlayers) return null;
      
      const isNewPlayer = !this.playerStats.has(playerName);
      if (isNewPlayer) {
         return `Welcome to ${this.serverName}, ${playerName}! Type 'help' if you need anything!`;
      } else {
         const stats = this.playerStats.get(playerName);
         const timeSinceLastSeen = Date.now() - stats.lastSeen;
         const hours = Math.floor(timeSinceLastSeen / (1000 * 60 * 60));
         if (hours > 24) {
            return `Welcome back ${playerName}! Haven't seen you in ${Math.floor(hours/24)} days!`;
         }
      }
      return null;
   }
}

module.exports = BotResponses;
