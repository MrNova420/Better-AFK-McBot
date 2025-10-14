# BetterSMP Bot - Minecraft Server Activity Bot

## Overview

BetterSMP Bot is a lightweight Minecraft bot designed to maintain server activity and promote community engagement by simulating realistic player behavior. It connects to Minecraft servers using the Mineflayer library, providing features like automated chat messages, anti-AFK movements, and optional pathfinding. The bot aims to appear as a natural player, not an obvious automation tool, and supports 24/7 operation on platforms like Replit and Termux. It includes a simple web dashboard for monitoring status and is built with Node.js, focusing on minimal resource usage across various Minecraft server versions and authentication systems. The project's ambition is to offer a robust, easy-to-deploy solution for server administrators looking to enhance their community's online presence and activity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Type
Single-process Node.js application running a Minecraft bot client and a basic web server for status monitoring.

### Core Components

**Bot Client Architecture**
- Utilizes Mineflayer for Minecraft protocol implementation.
- Features a plugin-based architecture, including mineflayer-pathfinder for navigation.
- Employs an event-driven pattern for handling server interactions.
- Uses a Promise-based queue for sequential command execution to prevent server spam.
- Includes auto-reconnection logic with configurable delays.

**Configuration System**
- JSON-based configuration in `config/settings.json`, which is gitignored for security.
- Hierarchical structure for bot account, server connection, positioning, and features.
- Provides `config/example.settings.json` as a template; does not use environment variables.

**Anti-AFK Mechanism**
- Executes periodic movements (jump, sneak) to prevent AFK kicks, configurable for different server detection systems.

**Chat System**
- Generates randomized, natural-sounding chat messages from a diverse pool.
- Incorporates dynamic delays between messages for realistic timing.
- Supports chat logging.

**Authentication System**
- Supports server-side authentication plugins (e.g., `/register`, `/login`) with configurable auto-authentication.
- Handles event-based detection of authentication prompts.

**Pathfinding (Optional)**
- Integrates `mineflayer-pathfinder` for goal-based navigation.

**Web Dashboard**
- Express.js-based HTTP server on port 5000 providing a minimal status endpoint for health checks and uptime monitoring.

### Technology Stack

**Runtime & Core Libraries**
- Node.js 14+ (currently upgraded to v22).
- Mineflayer (v4.3.0) for core bot functionality.
- mineflayer-pathfinder (v2.1.1) for navigation.
- Express.js (v4.18.1) for the web server.

**Authentication Support**
- Mojang authentication.
- Microsoft authentication via `@azure/msal-node` and `@xboxreplay/xboxlive-auth`.
- Offline mode support.

### Deployment Architecture

**Multi-Platform Support**
- Compatible with standard Node.js environments, Replit cloud, and Termux for Android.
- Includes PM2 scripts for process management.

### Design Decisions

- **Mineflayer Choice**: Selected for its maturity, plugin ecosystem, and version-agnostic design.
- **Single JSON Configuration**: Simplifies deployment, version control, and separation of concerns.
- **Promise-based Command Queue**: Prevents rate limiting, ensures sequential execution, and improves error handling.
- **Minimal Web Dashboard**: Focuses on core bot functionality, providing essential monitoring without complex UI.
- **Event-Driven Architecture**: Naturally fits the Minecraft protocol, allowing for easy extension and clean separation of concerns.

## External Dependencies

### Third-Party Libraries

**Minecraft Protocol & Bot Framework**
- `mineflayer` (v4.3.0): Core Minecraft bot implementation.
- `mineflayer-pathfinder` (v2.1.1): Pathfinding and navigation.
- `minecraft-data`: Used for version-specific game data.

**Web Server**
- `express` (v4.18.1): HTTP server for status and health monitoring.

**Authentication Services**
- `@azure/msal-node` (v1.9.1): Microsoft authentication library.
- `@xboxreplay/xboxlive-auth` (v3.3.3): Xbox Live authentication.

### External Services

**Minecraft Servers**
- Connects to any Minecraft Java Edition server (version-configurable), supporting both online and offline modes, and authentication plugins.

**Microsoft/Xbox Live Services**
- Utilized when the bot account type is set to "microsoft" for OAuth flow.

### Infrastructure Requirements

**Runtime Environment**
- Node.js 22+ runtime.
- Network connectivity to Minecraft servers (TCP) and HTTPS for Microsoft authentication.
- Persistent storage for configuration files.

**Network & Ports**
- Inbound: Port 5000 (Express web dashboard, bound to 0.0.0.0).
- Outbound: Minecraft server port (default 25565, configurable) and HTTPS 443 for Microsoft authentication.