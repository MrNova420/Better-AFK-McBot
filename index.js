const mineflayer = require('mineflayer');
const Movements = require('mineflayer-pathfinder').Movements;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalBlock } = require('mineflayer-pathfinder').goals;

const config = require('./config/settings.json');
const express = require('express');
const BotResponses = require('./bot-responses');
const ConversationTracker = require('./conversation-tracker');
const DeviceMonitor = require('./device-monitor');
const ShelterBuilder = require('./shelter-builder');
const { startMemoryMonitoring, getMemoryUsage, cleanupOldData } = require('./utils');

const app = express();

let bot = null;
let reconnectAttempts = 0;
let maxReconnectAttempts = 100;
let reconnectDelay = config.utils['auto-reconnect-delay'] || 5000;
let antiKickTimer = null;
let chatMessageTimer = null;
let isShuttingDown = false;

const conversationTracker = new ConversationTracker({
   enabled: config['advanced-behavior'] && config['advanced-behavior']['conversation-memory'] ? 
      config['advanced-behavior']['conversation-memory'].enabled : true,
   contextLength: config['advanced-behavior'] && config['advanced-behavior']['conversation-memory'] ? 
      config['advanced-behavior']['conversation-memory']['context-length'] : 10
});

const deviceMonitor = new DeviceMonitor({
   enabled: config['device-health'] && config['device-health']['cpu-throttling'] ?
      config['device-health']['cpu-throttling'].enabled : true,
   maxCpuPercent: config['device-health'] && config['device-health']['cpu-throttling'] ?
      config['device-health']['cpu-throttling']['max-cpu-percent'] : 25,
   maxMemoryMb: config['device-health'] && config['device-health']['memory-limits'] ?
      config['device-health']['memory-limits']['max-memory-mb'] : 200
});

let shelterBuilder = null;

let botStatus = {
   connected: false,
   username: config['bot-account']['username'],
   server: config.server.ip,
   uptime: 0,
   startTime: Date.now(),
   lastActivity: Date.now(),
   reconnectAttempts: 0,
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
      playersTracked: 0,
      errors: 0,
      kicks: 0,
      deaths: 0
   },
   health: 'healthy'
};

function log(level, message, data = null) {
   const timestamp = new Date().toISOString();
   const colors = {
      INFO: '\x1b[36m',
      SUCCESS: '\x1b[32m',
      WARNING: '\x1b[33m',
      ERROR: '\x1b[31m',
      DEBUG: '\x1b[35m'
   };
   const reset = '\x1b[0m';
   const color = colors[level] || '';
   
   console.log(`${color}[${timestamp}] [${level}] ${message}${reset}`);
   if (data) {
      console.log(`${color}${JSON.stringify(data, null, 2)}${reset}`);
   }
}

app.use((req, res, next) => {
   res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
   res.header('Pragma', 'no-cache');
   res.header('Expires', '0');
   next();
});

app.get('/', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - botStatus.startTime) / 1000);
  res.json({
     status: 'running',
     bot: {
        ...botStatus,
        uptimeSeconds,
        uptimeFormatted: formatUptime(uptimeSeconds)
     },
     message: 'BetterSMP Bot - Active and Running ✅'
  });
});

app.get('/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - botStatus.startTime) / 1000);
  const isHealthy = botStatus.connected && (Date.now() - botStatus.lastActivity < 60000);
  
  res.status(isHealthy ? 200 : 503).json({
     status: isHealthy ? 'healthy' : 'unhealthy',
     connected: botStatus.connected,
     lastActivity: botStatus.lastActivity,
     timeSinceActivity: Date.now() - botStatus.lastActivity,
     uptimeSeconds,
     ...botStatus
  });
});

app.get('/stats', (req, res) => {
   const deviceHealth = deviceMonitor.getSystemHealth();
   const convStats = conversationTracker.getStats();
   
   res.json({
      stats: botStatus.stats,
      uptime: Math.floor((Date.now() - botStatus.startTime) / 1000),
      reconnectAttempts: reconnectAttempts,
      health: botStatus.health,
      memory: getMemoryUsage(),
      deviceHealth: deviceHealth,
      conversations: convStats,
      shelter: shelterBuilder ? shelterBuilder.getStatus() : null,
      process: {
         pid: process.pid,
         uptime: Math.floor(process.uptime()),
         nodeVersion: process.version
      }
   });
});

function formatUptime(seconds) {
   const days = Math.floor(seconds / 86400);
   const hours = Math.floor((seconds % 86400) / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const secs = seconds % 60;
   
   if (days > 0) return `${days}d ${hours}h ${minutes}m`;
   if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
   if (minutes > 0) return `${minutes}m ${secs}s`;
   return `${secs}s`;
}

app.listen(5000, '0.0.0.0', () => {
  log('SUCCESS', 'Web dashboard started on port 5000');
  log('INFO', 'Dashboard: http://localhost:5000');
  log('INFO', 'Health check: http://localhost:5000/health');
  log('INFO', 'Statistics: http://localhost:5000/stats');
});

function validateConfig() {
   log('INFO', 'Validating configuration...');
   
   if (!config['bot-account'] || !config['bot-account']['username']) {
      throw new Error('Bot account username is required in config/settings.json');
   }
   
   if (!config.server || !config.server.ip || config.server.ip === 'your.server.ip') {
      log('WARNING', 'Server IP not configured - bot will not connect to Minecraft server');
      log('WARNING', 'Edit config/settings.json to set your Minecraft server details');
      return false;
   }
   
   if (!config.server.port || !config.server.version) {
      throw new Error('Server port and version are required in config/settings.json');
   }
   
   log('SUCCESS', 'Configuration validated successfully');
   return true;
}

function cleanupTimers() {
   if (antiKickTimer) {
      clearTimeout(antiKickTimer);
      antiKickTimer = null;
   }
   if (chatMessageTimer) {
      clearTimeout(chatMessageTimer);
      chatMessageTimer = null;
   }
}

function createBot() {
   if (isShuttingDown) {
      log('INFO', 'Shutdown in progress, not creating new bot instance');
      return;
   }

   if (!validateConfig()) {
      log('WARNING', 'Configuration incomplete - running in dashboard-only mode');
      botStatus.health = 'configuration_required';
      return;
   }

   cleanupTimers();

   try {
      log('INFO', `Creating bot instance (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})...`);
      
      bot = mineflayer.createBot({
         username: config['bot-account']['username'],
         password: config['bot-account']['password'] || undefined,
         auth: config['bot-account']['type'],
         host: config.server.ip,
         port: config.server.port,
         version: config.server.version,
         hideErrors: false
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
         responseConfig,
         conversationTracker
      );

      shelterBuilder = new ShelterBuilder(bot, 
         config['advanced-behavior'] && config['advanced-behavior']['auto-shelter'] ? 
            config['advanced-behavior']['auto-shelter'] : { enabled: false }
      );

      let pendingPromise = Promise.resolve();

      function sendRegister(password) {
         return new Promise((resolve, reject) => {
            bot.chat(`/register ${password} ${password}`);
            log('INFO', 'Sent /register command');

            const timeout = setTimeout(() => {
               reject(new Error('Registration timeout - no response from server'));
            }, 10000);

            bot.once('chat', (username, message) => {
               clearTimeout(timeout);
               log('DEBUG', `Auth response from ${username}: ${message}`);

               if (message.includes('successfully registered') || message.includes('registered successfully')) {
                  log('SUCCESS', 'Registration confirmed');
                  resolve();
               } else if (message.includes('already registered')) {
                  log('INFO', 'Bot was already registered');
                  resolve();
               } else if (message.includes('Invalid command')) {
                  reject(new Error(`Registration failed: Invalid command. Response: "${message}"`));
               } else {
                  reject(new Error(`Registration failed: unexpected message "${message}"`));
               }
            });
         });
      }

      function sendLogin(password) {
         return new Promise((resolve, reject) => {
            bot.chat(`/login ${password}`);
            log('INFO', 'Sent /login command');

            const timeout = setTimeout(() => {
               reject(new Error('Login timeout - no response from server'));
            }, 10000);

            bot.once('chat', (username, message) => {
               clearTimeout(timeout);
               log('DEBUG', `Auth response from ${username}: ${message}`);

               if (message.includes('successfully logged in') || message.includes('logged in successfully')) {
                  log('SUCCESS', 'Login successful');
                  resolve();
               } else if (message.includes('Invalid password')) {
                  reject(new Error(`Login failed: Invalid password. Response: "${message}"`));
               } else if (message.includes('not registered')) {
                  reject(new Error(`Login failed: Not registered. Response: "${message}"`));
               } else {
                  reject(new Error(`Login failed: unexpected message "${message}"`));
               }
            });
         });
      }

      bot.once('spawn', async () => {
         log('SUCCESS', `Bot successfully joined ${config.server.ip}:${config.server.port}`);
         log('INFO', `Position: ${bot.entity.position}`);
         
         botStatus.connected = true;
         botStatus.uptime = Date.now();
         botStatus.lastActivity = Date.now();
         botStatus.health = 'healthy';
         botStatus.reconnectAttempts = reconnectAttempts;
         reconnectAttempts = 0;

         if (config['advanced-behavior'] && config['advanced-behavior']['auto-shelter'] && 
             config['advanced-behavior']['auto-shelter'].enabled) {
            setTimeout(async () => {
               try {
                  await shelterBuilder.buildShelter();
               } catch (error) {
                  log('ERROR', `Shelter building failed: ${error.message}`);
               }
            }, 3000);
         }
         
         if (bot.settings) {
            bot.settings.colorsEnabled = false;
         }

         if (config.utils['auto-auth'].enabled) {
            log('INFO', 'Auto-authentication module started');

            const password = config.utils['auto-auth'].password;

            pendingPromise = pendingPromise
               .then(() => sendRegister(password))
               .then(() => sendLogin(password))
               .catch(error => {
                  log('ERROR', `Authentication error: ${error.message}`);
                  botStatus.stats.errors++;
               });
         }

         if (config.utils['smart-responses'] ? config.utils['smart-responses'].enabled : true) {
            log('INFO', 'Smart response system enabled - bot will assist players intelligently');
            
            bot.on('chat', async (username, message) => {
               if (username === bot.username) return;
               
               botStatus.stats.messagesReceived++;
               botStatus.lastActivity = Date.now();
               
               try {
                  const welcomeMsg = botResponses.getWelcomeMessage(username);
                  if (welcomeMsg) {
                     setTimeout(() => {
                        bot.chat(welcomeMsg);
                        log('INFO', `[Welcome] Greeted ${username}`);
                     }, 500);
                  }
                  
                  const shouldRespond = await botResponses.shouldRespondToMessage(message, username);
                  
                  if (shouldRespond) {
                     const response = await botResponses.generateResponse(message, username);
                     if (response) {
                        const delay = 800 + Math.random() * 1500;
                        setTimeout(() => {
                           bot.chat(response);
                           botStatus.stats.responsesSent++;
                           botStatus.stats.playersTracked = botResponses.playerStats.size;
                           log('INFO', `[Response] ${username}: "${message.substring(0, 50)}..." → "${response.substring(0, 50)}..."`);
                        }, delay);
                     }
                  }
               } catch (error) {
                  log('ERROR', `Error in chat handler: ${error.message}`);
                  botStatus.stats.errors++;
               }
            });
         }

         if (config.utils['chat-messages'].enabled) {
            log('INFO', 'Promotional chat messages module started');
            const messages = config.utils['chat-messages']['messages'];

            if (config.utils['chat-messages'].repeat) {
               const baseDelay = config.utils['chat-messages']['repeat-delay'];
               
               const sendRandomMessage = () => {
                  if (isShuttingDown || !botStatus.connected) return;
                  
                  try {
                     const msg = botResponses.generatePromoMessage();
                     bot.chat(msg);
                     botStatus.lastActivity = Date.now();
                     log('INFO', `[Promo] ${msg.substring(0, 60)}...`);
                  } catch (error) {
                     log('ERROR', `Error sending promo message: ${error.message}`);
                  }
                  
                  const randomDelay = (baseDelay + Math.floor(Math.random() * 60)) * 1000;
                  chatMessageTimer = setTimeout(sendRandomMessage, randomDelay);
               };
               
               const initialDelay = Math.floor(Math.random() * 30) * 1000;
               chatMessageTimer = setTimeout(sendRandomMessage, initialDelay);
            } else {
               messages.forEach((msg, index) => {
                  setTimeout(() => bot.chat(msg), index * 2000);
               });
            }
         }

         const pos = config.position;

         if (config.position.enabled) {
            log('INFO', `Pathfinding to target: (${pos.x}, ${pos.y}, ${pos.z})`);
            try {
               bot.pathfinder.setMovements(defaultMove);
               bot.pathfinder.setGoal(new GoalBlock(pos.x, pos.y, pos.z));
            } catch (error) {
               log('ERROR', `Pathfinding error: ${error.message}`);
            }
         }

         if (config.utils['anti-afk'].enabled) {
            log('INFO', 'Advanced anti-AFK system activated');
            
            const performAntiAFK = () => {
               if (isShuttingDown || !botStatus.connected) return;
               
               try {
                  const throttleMultiplier = deviceMonitor.getThrottleDelay();
                  
                  if (throttleMultiplier > 1.5) {
                     log('WARNING', `Device under stress, reducing activity (${throttleMultiplier.toFixed(1)}x delay)`);
                  }
                  
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
                  
                  if (config['advanced-behavior'] && config['advanced-behavior']['realistic-movement']) {
                     if (config['advanced-behavior']['realistic-movement']['look-around'] && Math.random() < 0.3) {
                        const yaw = Math.random() * Math.PI * 2;
                        const pitch = (Math.random() - 0.5) * 0.5;
                        bot.look(yaw, pitch, false);
                     }
                  }
                  
                  botStatus.lastActivity = Date.now();
                  
                  let nextAction = 8000 + Math.floor(Math.random() * 12000);
                  nextAction = nextAction * throttleMultiplier;
                  antiKickTimer = setTimeout(performAntiAFK, nextAction);
               } catch (error) {
                  log('ERROR', `Anti-AFK error: ${error.message}`);
                  botStatus.stats.errors++;
               }
            };
            
            antiKickTimer = setTimeout(performAntiAFK, 5000);
         }
      });

      bot.on('goal_reached', () => {
         log('SUCCESS', `Arrived at target location: ${bot.entity.position}`);
      });

      bot.on('death', () => {
         botStatus.stats.deaths++;
         log('WARNING', `Bot died and respawned at: ${bot.entity.position}`);
      });

      bot.on('health', () => {
         if (bot.health <= 5) {
            log('WARNING', `Low health: ${bot.health}/20`);
         }
      });

      bot.on('kicked', (reason) => {
         botStatus.stats.kicks++;
         botStatus.connected = false;
         botStatus.health = 'kicked';
         
         let reasonText = reason;
         try {
            if (typeof reason === 'object') {
               reasonText = JSON.stringify(reason);
            }
         } catch (e) {
            reasonText = String(reason);
         }
         
         log('WARNING', `Kicked from server. Reason: ${reasonText}`);
      });

      bot.on('error', (err) => {
         botStatus.stats.errors++;
         botStatus.health = 'error';
         
         if (err.message.includes('ENOTFOUND')) {
            log('ERROR', `Cannot resolve server hostname: ${config.server.ip}`);
            log('ERROR', 'Please check your internet connection and server IP');
         } else if (err.message.includes('ECONNREFUSED')) {
            log('ERROR', `Server refused connection: ${config.server.ip}:${config.server.port}`);
            log('ERROR', 'Please check if the server is online');
         } else if (err.message.includes('Invalid credentials')) {
            log('ERROR', 'Invalid Minecraft account credentials');
            log('ERROR', 'Please check your username and password in config/settings.json');
         } else {
            log('ERROR', `Bot error: ${err.message}`);
         }
      });

      if (config.utils['auto-reconnect']) {
         bot.on('end', (reason) => {
            botStatus.connected = false;
            botStatus.health = 'disconnected';
            cleanupTimers();
            
            log('WARNING', `Bot disconnected. Reason: ${reason || 'Unknown'}`);
            
            if (isShuttingDown) {
               log('INFO', 'Shutdown requested, not reconnecting');
               return;
            }

            if (reconnectAttempts >= maxReconnectAttempts) {
               log('ERROR', `Max reconnection attempts (${maxReconnectAttempts}) reached. Stopping.`);
               botStatus.health = 'failed';
               return;
            }

            reconnectAttempts++;
            botStatus.reconnectAttempts = reconnectAttempts;
            
            const delay = Math.min(reconnectDelay * Math.pow(1.5, reconnectAttempts - 1), 60000);
            
            log('INFO', `Reconnecting in ${Math.floor(delay / 1000)} seconds... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            
            setTimeout(() => {
               createBot();
            }, delay);
         });
      }

   } catch (error) {
      log('ERROR', `Failed to create bot: ${error.message}`);
      botStatus.stats.errors++;
      botStatus.health = 'error';
      
      if (reconnectAttempts < maxReconnectAttempts && config.utils['auto-reconnect']) {
         reconnectAttempts++;
         setTimeout(createBot, reconnectDelay);
      }
   }
}

function gracefulShutdown(signal) {
   if (isShuttingDown) return;
   
   isShuttingDown = true;
   log('INFO', `Received ${signal}, shutting down gracefully...`);
   
   cleanupTimers();
   
   if (bot) {
      try {
         bot.end();
         log('INFO', 'Bot disconnected');
      } catch (error) {
         log('ERROR', `Error during bot shutdown: ${error.message}`);
      }
   }
   
   log('INFO', 'Shutdown complete');
   process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error) => {
   log('ERROR', `Uncaught exception: ${error.message}`);
   log('ERROR', error.stack);
   botStatus.stats.errors++;
});
process.on('unhandledRejection', (reason, promise) => {
   log('ERROR', `Unhandled rejection at: ${promise}, reason: ${reason}`);
   botStatus.stats.errors++;
});

log('INFO', '='.repeat(60));
log('INFO', 'BetterSMP Bot v4.0 - Lightweight Minecraft Admin Helper');
log('INFO', '='.repeat(60));
log('INFO', `Username: ${config['bot-account']['username']}`);
log('INFO', `Server: ${config.server.ip}:${config.server.port}`);
log('INFO', `Version: ${config.server.version}`);
log('INFO', `Node.js: ${process.version}`);
log('INFO', '='.repeat(60));

startMemoryMonitoring(30);
deviceMonitor.startMonitoring(5);

setInterval(() => {
   if (bot && bot._client) {
      const botResponses = bot._botResponses;
      if (botResponses && botResponses.playerStats) {
         cleanupOldData(botResponses.playerStats, 7 * 24 * 60 * 60 * 1000);
      }
   }
   
   conversationTracker.cleanup();
   
   const health = deviceMonitor.getSystemHealth();
   if (health.cpu.isHigh || health.memory.isHigh) {
      log('WARNING', 'Device health check: High resource usage detected');
      if (health.recommendations) {
         health.recommendations.forEach(rec => log('INFO', `  - ${rec}`));
      }
   }
}, 24 * 60 * 60 * 1000);

setInterval(() => {
   conversationTracker.cleanup();
}, 3600000);

createBot();
