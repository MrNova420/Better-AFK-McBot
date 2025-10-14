const mineflayer = require('mineflayer');
const Movements = require('mineflayer-pathfinder').Movements;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalBlock } = require('mineflayer-pathfinder').goals;

const config = require('./config/settings.json');
const express = require('express');
const BotResponses = require('./bot-responses');

const app = express();

let botStatus = {
   connected: false,
   username: config['bot-account']['username'],
   server: config.server.ip,
   uptime: 0,
   lastActivity: Date.now(),
   features: {
      antiAfk: config.utils['anti-afk'].enabled,
      autoAuth: config.utils['auto-auth'].enabled,
      chatMessages: config.utils['chat-messages'].enabled,
      smartResponses: config.utils['smart-responses'] ? config.utils['smart-responses'].enabled : true,
      adminHelper: config.utils['admin-helper'] ? config.utils['admin-helper'].enabled : true
   },
   stats: {
      messagesReceived: 0,
      responsesSent: 0,
      playersTracked: 0
   }
};

app.get('/', (req, res) => {
  res.json({
     status: 'running',
     bot: botStatus,
     message: 'BetterSMP Bot - Active and Running ✅'
  });
});

app.get('/health', (req, res) => {
  res.json({
     status: botStatus.connected ? 'healthy' : 'disconnected',
     ...botStatus
  });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server started on port 5000');
  console.log('Dashboard: http://localhost:5000');
  console.log('Health check: http://localhost:5000/health');
});

function createBot() {
   const bot = mineflayer.createBot({
      username: config['bot-account']['username'],
      password: config['bot-account']['password'],
      auth: config['bot-account']['type'],
      host: config.server.ip,
      port: config.server.port,
      version: config.server.version,
   });

   bot.loadPlugin(pathfinder);
   const mcData = require('minecraft-data')(bot.version);
   const defaultMove = new Movements(bot, mcData);

   const smartResponsesEnabled = config.utils['smart-responses'] ? config.utils['smart-responses'].enabled : true;
   const adminHelperEnabled = config.utils['admin-helper'] ? config.utils['admin-helper'].enabled : true;
   
   const responseConfig = {
      enabled: smartResponsesEnabled,
      welcomeNewPlayers: adminHelperEnabled && (config.utils['admin-helper'] ? config.utils['admin-helper']['welcome-new-players'] : true),
      answerQuestions: adminHelperEnabled && (config.utils['admin-helper'] ? config.utils['admin-helper']['answer-questions'] : true),
      provideTips: adminHelperEnabled && (config.utils['admin-helper'] ? config.utils['admin-helper']['provide-tips'] : true)
   };
   
   const botResponses = new BotResponses(
      config['bot-account']['username'],
      config.server.name || 'BetterSMP',
      responseConfig
   );

   let pendingPromise = Promise.resolve();
   let antiKickTimer = null;

   function sendRegister(password) {
      return new Promise((resolve, reject) => {
         bot.chat(`/register ${password} ${password}`);
         console.log(`[Auth] Sent /register command.`);

         bot.once('chat', (username, message) => {
            console.log(`[ChatLog] <${username}> ${message}`); // Log all chat messages

            // Check for various possible responses
            if (message.includes('successfully registered')) {
               console.log('[INFO] Registration confirmed.');
               resolve();
            } else if (message.includes('already registered')) {
               console.log('[INFO] Bot was already registered.');
               resolve(); // Resolve if already registered
            } else if (message.includes('Invalid command')) {
               reject(`Registration failed: Invalid command. Message: "${message}"`);
            } else {
               reject(`Registration failed: unexpected message "${message}".`);
            }
         });
      });
   }

   function sendLogin(password) {
      return new Promise((resolve, reject) => {
         bot.chat(`/login ${password}`);
         console.log(`[Auth] Sent /login command.`);

         bot.once('chat', (username, message) => {
            console.log(`[ChatLog] <${username}> ${message}`); // Log all chat messages

            if (message.includes('successfully logged in')) {
               console.log('[INFO] Login successful.');
               resolve();
            } else if (message.includes('Invalid password')) {
               reject(`Login failed: Invalid password. Message: "${message}"`);
            } else if (message.includes('not registered')) {
               reject(`Login failed: Not registered. Message: "${message}"`);
            } else {
               reject(`Login failed: unexpected message "${message}".`);
            }
         });
      });
   }

   bot.once('spawn', () => {
      console.log('\x1b[33m[BetterSMP Bot] Bot joined the server', '\x1b[0m');
      botStatus.connected = true;
      botStatus.uptime = Date.now();
      botStatus.lastActivity = Date.now();
      
      if (bot.settings) {
         bot.settings.colorsEnabled = false;
      }

      if (config.utils['auto-auth'].enabled) {
         console.log('[INFO] Started auto-auth module');

         const password = config.utils['auto-auth'].password;

         pendingPromise = pendingPromise
            .then(() => sendRegister(password))
            .then(() => sendLogin(password))
            .catch(error => console.error('[ERROR]', error));
      }

      if (config.utils['smart-responses'] ? config.utils['smart-responses'].enabled : true) {
         console.log('[INFO] Smart Responses enabled - bot will help players intelligently');
         
         bot.on('chat', async (username, message) => {
            if (username === bot.username) return;
            
            botStatus.stats.messagesReceived++;
            
            const welcomeMsg = botResponses.getWelcomeMessage(username);
            if (welcomeMsg) {
               setTimeout(() => {
                  bot.chat(welcomeMsg);
                  console.log(`[Welcome] ${welcomeMsg}`);
               }, 500);
            }
            
            const shouldRespond = await botResponses.shouldRespondToMessage(message, username);
            
            if (shouldRespond) {
               const response = await botResponses.generateResponse(message, username);
               if (response) {
                  setTimeout(() => {
                     bot.chat(response);
                     botStatus.stats.responsesSent++;
                     botStatus.stats.playersTracked = botResponses.playerStats.size;
                     console.log(`[Smart Response] ${username}: ${message} → ${response}`);
                  }, 800 + Math.random() * 1500);
               }
            }
         });
      }

      if (config.utils['chat-messages'].enabled) {
         console.log('[INFO] Started chat-messages module');
         const messages = config.utils['chat-messages']['messages'];

         if (config.utils['chat-messages'].repeat) {
            const baseDelay = config.utils['chat-messages']['repeat-delay'];
            
            const sendRandomMessage = () => {
               const msg = botResponses.generatePromoMessage();
               bot.chat(msg);
               console.log(`[Promo] ${msg}`);
               
               const randomDelay = baseDelay + Math.floor(Math.random() * 60);
               setTimeout(sendRandomMessage, randomDelay * 1000);
            };
            
            const initialDelay = Math.floor(Math.random() * 30) * 1000;
            setTimeout(sendRandomMessage, initialDelay);
         } else {
            messages.forEach((msg) => {
               bot.chat(msg);
            });
         }
      }

      const pos = config.position;

      if (config.position.enabled) {
         console.log(
            `\x1b[32m[BetterSMP Bot] Moving to target location (${pos.x}, ${pos.y}, ${pos.z})\x1b[0m`
         );
         bot.pathfinder.setMovements(defaultMove);
         bot.pathfinder.setGoal(new GoalBlock(pos.x, pos.y, pos.z));
      }

      if (config.utils['anti-afk'].enabled) {
         console.log('[INFO] Advanced anti-AFK system activated');
         
         const performAntiAFK = () => {
            const actions = ['jump', 'forward', 'back', 'left', 'right'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            
            bot.setControlState(action, true);
            setTimeout(() => {
               bot.setControlState(action, false);
            }, 100 + Math.random() * 400);
            
            if (config.utils['anti-afk'].sneak && Math.random() < 0.3) {
               bot.setControlState('sneak', true);
               setTimeout(() => {
                  bot.setControlState('sneak', false);
               }, 500 + Math.random() * 1000);
            }
            
            const nextAction = 8000 + Math.floor(Math.random() * 12000);
            antiKickTimer = setTimeout(performAntiAFK, nextAction);
         };
         
         setTimeout(performAntiAFK, 5000);
      }
   });

   bot.on('goal_reached', () => {
      console.log(
         `\x1b[32m[BetterSMP Bot] Arrived at target location. ${bot.entity.position}\x1b[0m`
      );
   });

   bot.on('death', () => {
      console.log(
         `\x1b[33m[BetterSMP Bot] Died and respawned at ${bot.entity.position}`,
         '\x1b[0m'
      );
   });

   if (config.utils['auto-reconnect']) {
      bot.on('end', () => {
         console.log('[INFO] Bot disconnected. Reconnecting...');
         botStatus.connected = false;
         if (antiKickTimer) clearTimeout(antiKickTimer);
         
         setTimeout(() => {
            createBot();
         }, config.utils['auto-reconnect-delay']);
      });
   }

   bot.on('kicked', (reason) => {
      console.log(
         '\x1b[33m',
         `[BetterSMP Bot] Kicked from server. Reason: \n${reason}`,
         '\x1b[0m'
      );
      botStatus.connected = false;
   });

   bot.on('error', (err) =>
      console.log(`\x1b[31m[ERROR] ${err.message}`, '\x1b[0m')
   );
}

createBot();
