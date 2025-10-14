# BetterSMP Bot - Minecraft Server Activity Bot

## Overview

BetterSMP Bot is a lightweight Minecraft bot designed to maintain server activity and promote community engagement. The bot connects to Minecraft servers using the Mineflayer library and simulates realistic player behavior through automated chat messages, anti-AFK movements, and optional pathfinding capabilities. It includes a simple web dashboard for monitoring bot status and supports 24/7 operation on various platforms including Replit, Termux, and traditional servers.

The bot is built with Node.js and emphasizes minimal resource usage while appearing as a natural player rather than an obvious automation tool. It supports various Minecraft server versions and authentication systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (October 2025)

### October 14, 2025 - Replit Environment Setup
- **UPGRADED**: Node.js from v14 to v22 to meet mineflayer dependencies
- **CONFIGURED**: Express server to bind to 0.0.0.0:5000 for Replit compatibility
- **SETUP**: Workflow configured for console output with web dashboard
- **READY**: Project fully configured for Replit deployment
- **NOTE**: Users must configure `config/settings.json` with their Minecraft server details before use

### October 14, 2025 - Version 4.0 - Smart Admin Helper Bot
- **REMOVED**: OpenAI API dependency - bot now works with zero external services!
- **NEW**: Smart response system with 100+ pre-written context-aware templates
- **NEW**: Admin helper features - welcomes players, answers questions, gives tips
- **NEW**: Player activity tracking and statistics
- **NEW**: Enhanced promotional messages with server uptime and player count
- **IMPROVED**: Configuration simplified - admin features work out of the box
- **FIXED**: All stability issues, bot runs reliably 24/7
- **UPDATED**: Documentation reflects new admin helper capabilities

### October 14, 2025 - Dependency Fix & Verification
- **Fixed**: Missing npm dependencies - openai package was not installed despite being in package.json
- **Updated**: Security patches applied via npm audit fix (fixed 11 vulnerabilities)
- **Verified**: All features working correctly (AI chat, anti-AFK, chat messages, dashboard)
- **Confirmed**: All documentation complete (README, QUICKSTART, TERMUX-GUIDE)

### Version 3.0 - Major Overhaul
- **Rebranded** from "AFK Bot" to "BetterSMP Bot" with focus on realistic player simulation
- **Improved chat system**: Random message selection with dynamic timing for natural appearance
- **Better project structure**: Configuration moved to `config/` directory
- **Enhanced documentation**: Comprehensive README, QUICKSTART guide, and Termux setup
- **Bug fixes**: Fixed auto-reconnect delay typo, improved error handling
- **Security**: Added config/settings.json to .gitignore for credential protection
- **Chat messages**: Updated to sound like real players, not obvious bot messages
- **Package updates**: NPM scripts for easy PM2 management, better metadata

## System Architecture

### Application Type
Single-process Node.js application that runs a Minecraft bot client and a basic web server for status monitoring.

### Core Components

**Bot Client Architecture**
- Uses Mineflayer library as the primary Minecraft protocol implementation
- Implements plugin-based architecture with mineflayer-pathfinder for navigation
- Event-driven pattern for handling Minecraft server events (chat, spawn, kicked, etc.)
- Promise-based queueing system for sequential command execution to prevent server spam
- Auto-reconnection logic with configurable delays for handling disconnections

**Configuration System**
- JSON-based configuration in `config/settings.json` (gitignored for security)
- Hierarchical structure separating bot account, server connection, positioning, and utility features
- Template configuration provided in `config/example.settings.json` for easy setup
- No environment variables - all configuration through JSON files
- Organized config directory for better project structure

**Anti-AFK Mechanism**
- Periodic movement commands (jump, sneak) to prevent server AFK kicks
- Configurable sneak behavior for servers with different AFK detection systems
- Minimal resource overhead by using simple position updates rather than complex pathfinding

**Chat System**
- Randomized chat messages with natural variation
- Random selection from message pool (not sequential)
- Dynamic delay system: base delay + random 0-60s variation
- Initial random delay (0-30s) before first message
- Chat logging capability for monitoring server interactions
- Messages designed to sound like real player interactions

**Authentication System**
- Support for server-side authentication plugins (e.g., `/register`, `/login`)
- Configurable password-based auto-authentication
- Event-based detection of authentication prompts
- Fallback handling for already-registered accounts

**Pathfinding (Optional)**
- Integration with mineflayer-pathfinder plugin
- Goal-based navigation to specific coordinates
- Configurable via position settings in config
- Uses minecraft-data for version-specific movement logic

**Web Dashboard**
- Express.js-based HTTP server on port 5000
- Simple status endpoint showing bot operational state
- Designed for uptime monitoring and health checks
- Minimal UI - primarily for programmatic status checks

### Technology Stack

**Runtime & Core Libraries**
- Node.js 14+ (specified in package.json engines)
- Mineflayer v4.3.0 - Minecraft bot framework
- mineflayer-pathfinder v2.1.1 - Navigation and movement
- Express.js v4.18.1 - Web server for status endpoint

**Authentication Support**
- Mojang authentication (legacy)
- Microsoft authentication via dependencies (@azure/msal-node, @xboxreplay/xboxlive-auth)
- Offline mode support

### Deployment Architecture

**Multi-Platform Support**
- Standard Node.js environments (Linux, Windows, macOS)
- Replit cloud deployment (web server on port 5000 for always-on)
- Termux for Android 24/7 operation (dedicated setup script)
- Process management via PM2 scripts included

**Process Management**
- Direct node execution for development (`npm start`)
- PM2 scripts for production deployment with auto-restart
- Built-in reconnection logic eliminates need for external monitoring in simple cases

### Design Decisions

**Why Mineflayer over alternatives:**
- Mature, well-maintained Minecraft protocol library
- Plugin ecosystem for extensibility
- Version-agnostic design supporting multiple Minecraft versions
- Lower-level control compared to higher-level frameworks

**Single JSON configuration file:**
- Simplifies deployment across platforms
- Easy to version control and share configurations
- No environment variable management needed
- Clear separation of concerns within structured JSON

**Promise-based command queue:**
- Prevents server-side rate limiting and kicks
- Ensures sequential execution of critical commands (auth, movement)
- Better error handling and recovery
- Avoids race conditions in authentication flow

**Minimal web dashboard:**
- Keeps application lightweight and focused on bot functionality
- Provides just enough feedback for monitoring without complex UI
- Port 5000 chosen for Replit compatibility (uptime monitoring)

**Event-driven architecture:**
- Natural fit for Minecraft protocol's event-based nature
- Easy to extend with new behaviors
- Clean separation between different bot capabilities
- Simplifies state management and error recovery

## External Dependencies

### Third-Party Libraries

**Minecraft Protocol & Bot Framework**
- `mineflayer` (v4.3.0) - Core Minecraft bot implementation, handles protocol communication, entity management, and world interaction
- `mineflayer-pathfinder` (v2.1.1) - Pathfinding and navigation plugin providing A* pathfinding and movement goals
- `minecraft-data` - Implicitly used via mineflayer for version-specific game data

**Web Server**
- `express` (v4.18.1) - HTTP server for status endpoint and health monitoring

**Authentication Services**
- `@azure/msal-node` (v1.9.1) - Microsoft authentication library for Minecraft Microsoft accounts
- `@xboxreplay/xboxlive-auth` (v3.3.3) - Xbox Live authentication for Microsoft account flow
- Supports Mojang legacy authentication (built into mineflayer)

### External Services

**Minecraft Servers**
- Connects to any Minecraft Java Edition server (version-configurable)
- Example configuration uses Aternos free hosting (BetterSMP-J787.aternos.me)
- Supports both online and offline mode servers
- Compatible with authentication plugins (AuthMe, etc.)

**Microsoft/Xbox Live Services**
- Used when bot account type is set to "microsoft"
- OAuth flow handled through Azure MSAL
- Required for Minecraft accounts migrated to Microsoft

### Infrastructure Requirements

**Runtime Environment**
- Node.js 22+ required (mineflayer v4.33.0+ dependency)
- Replit setup: Node.js 22.17.0 installed and configured
- Network connectivity to Minecraft servers (TCP, configurable port)
- Persistent storage for configuration files (config directory)

**Optional Infrastructure**
- PM2 process manager for production deployments
- Replit platform support (web server for always-on functionality)
- Termux for Android 24/7 hosting (automated setup provided)

**Network & Ports**
- Inbound: Port 5000 (Express web dashboard, bound to 0.0.0.0 for Replit)
- Outbound: Minecraft server port (default 25565, configurable)
- Outbound: HTTPS 443 for Microsoft authentication (when applicable)

## Replit-Specific Setup

### Configuration Required
Before the bot can connect to a Minecraft server, you must edit `config/settings.json`:

1. **Bot Account Settings**
   - Set your Minecraft username
   - For offline servers: leave password empty
   - For Microsoft accounts: set type to "microsoft" and provide credentials
   - Note: Mojang authentication is deprecated (accounts must be migrated to Microsoft)

2. **Server Settings**
   - Set the Minecraft server IP address
   - Set the server port (default: 25565)
   - Set the Minecraft version to match your server
   - Optionally set a server name for messages

3. **Feature Configuration**
   - Configure anti-AFK, chat messages, smart responses as desired
   - All features are pre-configured with sensible defaults

### Running on Replit
- The workflow is configured to run automatically on start
- Web dashboard is accessible at the preview URL
- Console output shows bot activity and connection status
- Logs include connection attempts, chat messages, and errors

### Deployment
To run this bot 24/7 on Replit:
1. Configure your settings in `config/settings.json`
2. Deploy using Replit's Reserved VM deployment option
3. The bot will automatically start and maintain the connection
4. Monitor status via the web dashboard at `/health` endpoint