# 🍾 Druth or Tare - Discord Bot

A fun Indonesian Truth or Dare Discord bot with spin-the-bottle mechanics. Players are randomly selected and must choose between answering a truth question or completing a dare challenge.

## ✨ Features

- 🎯 **Random Player Selection** - Spin the bottle to pick a random player
- 🤔 **Truth Questions** - Indonesian truth questions stored in Neon PostgreSQL
- 🔥 **Dare Challenges** - Indonesian dare challenges stored in database
- 🎲 **Random Mode** - Let fate decide between truth or dare
- ⏭️ **Skip Function** - Other players can skip if someone is AFK
- 🔒 **Turn Protection** - Only the selected player can answer
- 🎨 **Rich Embeds** - Beautiful Discord embeds with colors and emojis
- 💾 **Database Storage** - Questions stored in Neon PostgreSQL
- 🌐 **Web Interface** - Add new questions via key-protected web page
- 🚀 **Production Ready** - Deployed on Fly.io with health monitoring
- ⚡ **All-in-One** - Bot and web interface run on the same port
- 🎮 **Interactive Commands** - Fun mini-games and utilities

## 🎮 Commands

### Game Commands

| Command     | Description                      |
| ----------- | -------------------------------- |
| `/tod`      | Start a new Truth or Dare game   |

### Info Commands

| Command        | Description                      |
| -------------- | -------------------------------- |
| `/health`      | Check bot status and uptime      |
| `/stats`       | View question statistics         |
| `/addquestion` | Get info on how to add questions |

### Basic Commands

| Command  | Description                       |
| -------- | --------------------------------- |
| `/ping`  | Check bot latency                 |
| `/hello` | Get a friendly greeting           |
| `/help`  | Show all commands and how to play |

## 🎯 How to Play

1. Type `/tod` to start the game
2. Bot randomly selects a player (spin the bottle)
3. Selected player chooses:
   - **Truth** 🤔 - Answer a personal question
   - **Dare** 🔥 - Complete a challenge
   - **Random** 🎲 - Let the bot decide
4. After completing, click **"Putar Lagi!"** to select next player
5. Other players can click **"Skip"** if someone is AFK

## 📁 Project Structure

```
druth-or-tare/
├── src/
│   ├── bot.js                 # Main bot + web server (all-in-one)
│   ├── commands/              # Command handlers
│   │   ├── ping.js
│   │   ├── hello.js
│   │   ├── help.js
│   │   ├── tod.js            # Truth or Dare game logic
│   │   ├── health.js         # Bot status
│   │   ├── stats.js          # Question statistics
│   │   ├── addquestion.js    # Add question info
│   ├── config/                # Configuration files
│   │   ├── bot.js            # Bot settings & colors
│   │   └── commands.js       # Command definitions
│   ├── database/              # Database layer
│   │   ├── connection.js     # Neon PostgreSQL connection
│   │   ├── questions.js      # Question queries
│   │   └── init.js           # Database initialization
│   └── utils/                 # Utility functions
│       ├── game.js           # Game logic helpers
│       └── uptime.js         # Uptime formatter
├── data/                      # Static data
│   └── questions.js          # Initial questions for seeding
├── index.js                   # Application entry point
├── register.js                # Register slash commands
├── init-db.js                 # Initialize database
├── Dockerfile                 # Docker configuration
├── fly.toml                   # Fly.io deployment config
└── package.json
```

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) v1.3.2
- **Library**: [Discord.js](https://discord.js.org) v14
- **Database**: [Neon](https://neon.tech) PostgreSQL (Serverless)
- **Deployment**: [Fly.io](https://fly.io)
- **Language**: JavaScript (ES Modules)

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh) installed
- Discord Bot Token ([Get one here](https://discord.com/developers/applications))
- Neon Database ([Create one here](https://console.neon.tech))
- Fly.io account (for deployment)

### Getting Discord Credentials

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** and give it a name
3. Go to **"Bot"** tab:
   - Click **"Reset Token"** and copy your `TOKEN`
   - Enable these intents:
     - ✅ Presence Intent
     - ✅ Server Members Intent
     - ✅ Message Content Intent
4. Go to **"OAuth2"** tab:
   - Copy your `CLIENT_ID` (Application ID)
5. Get your `GUILD_ID`:
   - Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
   - Right-click your server → Copy Server ID

### Local Setup

1. **Clone the repository:**

```bash
git clone https://github.com/handikatriarlan/druth-or-tare
cd druth-or-tare
```

2. **Install dependencies:**

```bash
bun install
```

3. **Create `.env` file:**

```env
TOKEN=your_discord_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
DATABASE_URL=your_neon_database_url
ADMIN_KEY=your_secure_key
PORT=3000
```

4. **Initialize database:**

```bash
bun run init-db
```

5. **Register slash commands:**

```bash
bun run register
```

6. **Run the bot:**

```bash
bun run start
```

7. **Access web interface:**

   - Open `http://localhost:3000/admin` in your browser
   - Bot and web run on the same port!

8. **Invite bot to your server:**

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274878024768&scope=bot%20applications.commands
```

Replace `YOUR_CLIENT_ID` with your actual Client ID.

## 🌐 Web Interface

The bot includes a built-in web interface accessible at the same URL:

- **Health Check**: `http://localhost:3000/`
- **Admin Panel**: `http://localhost:3000/admin`

### Adding Questions:

1. Go to `/admin` endpoint
2. Enter admin key (from `.env`)
3. Select question type (Truth or Dare)
4. Enter the question
5. Submit - questions are **immediately available** (no restart needed!)

## 🚀 Available Scripts

| Script             | Description                            |
| ------------------ | -------------------------------------- |
| `bun run start`    | Start the bot (includes web interface) |
| `bun run dev`      | Start with auto-reload                 |
| `bun run register` | Register Discord commands              |
| `bun run init-db`  | Initialize database                    |
| `bun run deploy`   | Deploy to Fly.io                       |
| `bun run logs`     | View Fly.io logs                       |

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start bot
docker-compose up -d

# View logs
docker-compose logs -f

# Stop bot
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

## ☁️ Deploy to Fly.io

### Quick Deploy

1. **Install Fly CLI:**

```bash
curl -L https://fly.io/install.sh | sh
```

2. **Login:**

```bash
flyctl auth login
```

3. **Set secrets:**

```bash
flyctl secrets set TOKEN=your_token
flyctl secrets set DATABASE_URL=your_neon_url
flyctl secrets set CLIENT_ID=your_client_id
flyctl secrets set GUILD_ID=your_guild_id
flyctl secrets set ADMIN_KEY=your_key
```

4. **Deploy:**

```bash
bun run deploy
```

5. **Setup (one time):**

```bash
flyctl ssh console
bun run register.js
bun run init-db.js
exit
```

6. **Access your bot:**

   - Health: `https://druth-or-tare.fly.dev/`
   - Admin: `https://druth-or-tare.fly.dev/admin`

7. **Monitor:**

```bash
bun run logs
```

### Useful Fly.io Commands

```bash
# View logs
flyctl logs -f

# Check status
flyctl status

# Restart app
flyctl apps restart

# SSH into machine
flyctl ssh console

# Check secrets
flyctl secrets list
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description                       | Required |
| ---------------- | --------------------------------- | -------- |
| `TOKEN`          | Discord Bot Token                 | ✅ Yes   |
| `CLIENT_ID`      | Discord Application ID            | ✅ Yes   |
| `GUILD_ID`       | Discord Server ID                 | ✅ Yes   |
| `DATABASE_URL`   | Neon PostgreSQL connection string | ✅ Yes   |
| `ADMIN_KEY` | Web interface key            | ✅ Yes   |
| `PORT`           | Server port (default: 3000)       | ❌ No    |

### Bot Permissions Required

- Read Messages/View Channels
- Send Messages
- Embed Links
- Use Slash Commands
- Read Message History

### Discord Intents Required

- `Guilds`
- `GuildMessages`
- `MessageContent`
- `GuildMembers`

## 📝 Adding Questions

### Via Web Interface (Recommended)

1. Access `/admin` endpoint (local: `http://localhost:3000/admin`)
2. Enter admin key
3. Select type and add question
4. Questions are **immediately available** (no restart needed!)

### Via Database Directly

Edit `data/questions.js` and run:

```bash
bun run init-db
```

## 🎨 Bot Features

### All-in-One Server

- Bot and web interface run on the same port
- Single deployment, single process
- Efficient resource usage

### State Management

- Uses `Map` to track active player per channel
- Prevents multiple simultaneous games in same channel
- Clears state after each round

### Member Caching

- Pre-fetches all guild members on startup
- Reduces API calls and prevents rate limiting
- Filters out bot accounts automatically

### Error Handling

- Graceful error messages for users
- Comprehensive logging
- Handles rate limits and API failures

### Button Interactions

- **Truth/Dare/Random** - Only active player can click
- **Skip** - Any player except active player can skip
- **Spin Again** - Starts new round with new player

### Health Monitoring

- HTTP endpoint on port 3000
- Returns bot status and formatted uptime
- Used by Fly.io for health checks

## 🐛 Troubleshooting

### Bot not responding to commands

- Check if bot is online: `/ping`
- Verify slash commands are registered: `bun run register`
- Check bot has proper permissions in server

### "Gagal memuat member" error

- Bot is being rate limited
- Wait a few seconds and try again
- Check bot has `GuildMembers` intent enabled

### Database connection errors

- Verify `DATABASE_URL` is correct
- Check Neon database is active
- Run `bun run init-db` to initialize

### Deployment fails on Fly.io

- Check logs: `flyctl logs`
- Verify all secrets are set: `flyctl secrets list`
- Ensure Dockerfile builds locally: `docker build .`

### Questions not loading

- Questions reload automatically after adding via web
- Check database has questions: SSH and query
- Verify `DATABASE_URL` is correct

### Can't access admin panel

- Check bot is running: `flyctl status`
- Verify URL: `https://your-app.fly.dev/admin`
- Check `ADMIN_KEY` secret is set

## 🤝 Contributing

Contributions are welcome! The project follows a modular structure:

- Add new commands in `src/commands/`
- Add database functions in `src/database/`
- Add utilities in `src/utils/`
- Update configuration in `src/config/`

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 👨‍💻 Author

Created with ❤️ by [Handika Tri Arlan](https://github.com/handikatriarlan)

Built using Bun and Discord.js

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org) - Discord API wrapper
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Fly.io](https://fly.io) - Deployment platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/handikatriarlan/druth-or-tare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/handikatriarlan/druth-or-tare/discussions)

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Note**: This bot is designed for Indonesian-speaking Discord communities. All questions and dares are in Bahasa Indonesia.

**Live Demo**: Try the bot in action! [Invite Link](https://discord.com/api/oauth2/authorize?client_id=1442182772256018482&permissions=274878024768&scope=bot%20applications.commands)
