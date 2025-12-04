# 🍾 Druth or Tare - Discord Bot

A fun Indonesian Truth or Dare Discord bot with spin-the-bottle mechanics. Players are randomly selected and must choose between answering a truth question or completing a dare challenge.

## ✨ Features

- 🎯 **Random Player Selection** - Spin the bottle to pick a random player
- 🤔 **Truth Questions** - Indonesian truth questions stored in database
- 🔥 **Dare Challenges** - Indonesian dare challenges stored in database
- 🎲 **Random Mode** - Let fate decide between truth or dare
- ⏭️ **Skip Function** - Other players can skip if someone is AFK
- 🔒 **Turn Protection** - Only the selected player can answer
- 🎨 **Rich Embeds** - Beautiful Discord embeds with colors and emojis
- 💾 **Database Storage** - Questions stored in Neon PostgreSQL
- 🌐 **Web Interface** - Add new questions via password-protected web page

## 🎮 Commands

| Command | Description |
|---------|-------------|
| `/tod` | Start a new Truth or Dare game |
| `/help` | Show help and game rules |
| `/ping` | Check if bot is alive |
| `/hello` | Get a friendly greeting |

## 📁 Project Structure

```
druth-or-tare/
├── src/
│   ├── bot.js                 # Main bot entry point
│   ├── commands/              # Command handlers
│   │   ├── ping.js
│   │   ├── hello.js
│   │   ├── help.js
│   │   └── tod.js
│   ├── config/                # Configuration files
│   │   ├── bot.js
│   │   └── commands.js
│   ├── database/              # Database layer
│   │   ├── connection.js
│   │   ├── questions.js
│   │   └── init.js
│   ├── utils/                 # Utility functions
│   │   └── game.js
│   └── web/                   # Web server
│       └── server.js
├── data/                      # Static data
│   └── questions.js           # Initial questions for seeding
├── index.js                   # Application entry point
├── register.js                # Register slash commands
├── init-db.js                 # Initialize database
├── web-server.js              # Web server entry point
├── package.json
└── .env
```

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) v1.3.2
- **Library**: [Discord.js](https://discord.js.org) v14
- **Database**: [Neon](https://neon.tech) PostgreSQL
- **Web Framework**: Express.js
- **Language**: JavaScript (ES Modules)

## 📦 Installation

### Prerequisites
- [Bun](https://bun.sh) installed
- Discord Bot Token ([Get one here](https://discord.com/developers/applications))
- Neon Database ([Create one here](https://console.neon.tech))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/handikatriarlan/druth-or-tare
cd druth-or-tare
```

2. Install dependencies:
```bash
bun install
```

3. Create `.env` file:
```bash
TOKEN=your_discord_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
DATABASE_URL=your_neon_database_url
ADMIN_PASSWORD=your_secure_password
WEB_PORT=8080
```

4. Initialize database:
```bash
bun run init-db
```

5. Register slash commands:
```bash
bun run register
```

6. Run the bot:
```bash
bun run start
```

7. Run web server (separate terminal):
```bash
bun run web
```

## 🌐 Web Interface

Access the web interface at `http://localhost:8080` to add new questions:

1. Enter admin password (from `.env`)
2. Select question type (Truth or Dare)
3. Enter the question
4. Submit

**Note**: Restart the bot to load new questions from database.

## 🚀 Available Scripts

| Script | Description |
|--------|-------------|
| `bun run start` | Start the bot |
| `bun run dev` | Start with auto-reload |
| `bun run web` | Start web server |
| `bun run register` | Register Discord commands |
| `bun run init-db` | Initialize database |

## 🐳 Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## ☁️ Deploy to Fly.io

```bash
# Login
flyctl auth login

# Launch
flyctl launch --no-deploy

# Set secrets
flyctl secrets set TOKEN=your_token
flyctl secrets set DATABASE_URL=your_db_url
flyctl secrets set ADMIN_PASSWORD=your_password

# Deploy
flyctl deploy
```

## 🤝 Contributing

Contributions are welcome! The project follows a modular structure:

- Add new commands in `src/commands/`
- Add database functions in `src/database/`
- Add utilities in `src/utils/`
- Update configuration in `src/config/`

## 📝 License

MIT

## 👨‍💻 Author

Created with ❤️ using Bun and Discord.js

---

**Note**: This bot is designed for Indonesian-speaking Discord communities.
