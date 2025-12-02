# 🍾 Druth or Tare - Discord Bot

A fun Indonesian Truth or Dare Discord bot with spin-the-bottle mechanics. Players are randomly selected and must choose between answering a truth question or completing a dare challenge.

## ✨ Features

- 🎯 **Random Player Selection** - Spin the bottle to pick a random player
- 🤔 **Truth Questions** - 60 Indonesian truth questions (casual, wild, and deep)
- 🔥 **Dare Challenges** - 60 Indonesian dare challenges
- 🎲 **Random Mode** - Let fate decide between truth or dare
- ⏭️ **Skip Function** - Other players can skip if someone is AFK
- 🔒 **Turn Protection** - Only the selected player can answer
- 🎨 **Rich Embeds** - Beautiful Discord embeds with colors and emojis

## 🎮 Commands

| Command | Description |
|---------|-------------|
| `/tod` | Start a new Truth or Dare game |
| `/help` | Show help and game rules |
| `/ping` | Check if bot is alive |
| `/hello` | Get a friendly greeting |

## 🎯 How to Play

1. Type `/tod` to start the game
2. Bot randomly selects a player (spin the bottle)
3. Selected player chooses:
   - **Truth** 🤔 - Answer a personal question
   - **Dare** 🔥 - Complete a challenge
   - **Random** 🎲 - Let the bot decide
4. After completing, click **"Putar Lagi!"** to select next player
5. Other players can click **"Skip"** if someone is AFK

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) v1.3.2
- **Library**: [Discord.js](https://discord.js.org) v14
- **Language**: JavaScript (ES Modules)
- **Deployment**: Docker + Fly.io

## 📦 Installation

### Prerequisites
- [Bun](https://bun.sh) installed
- Discord Bot Token ([Get one here](https://discord.com/developers/applications))

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
TOKEN=your_discord_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_server_id_here
```

4. Register slash commands:
```bash
bun run register.js
```

5. Run the bot:
```bash
bun run index.js
```

6. Invite bot to your server:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274878024768&scope=bot%20applications.commands
```
Replace `YOUR_CLIENT_ID` with your actual Client ID.

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

### First Time Setup

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login to Fly.io:
```bash
flyctl auth login
```

3. Launch app:
```bash
flyctl launch --no-deploy
```

4. Set Discord token:
```bash
flyctl secrets set TOKEN=your_discord_bot_token_here
```

5. Deploy:
```bash
flyctl deploy
```

### Update Deployment

After making code changes:
```bash
flyctl deploy
```

### Useful Fly.io Commands

```bash
# View logs
flyctl logs

# Check status
flyctl status

# SSH into machine
flyctl ssh console

# Stop app
flyctl apps stop

# Start app
flyctl apps start
```

## 📁 Project Structure

```
druth-or-tare/
├── index.js           # Main bot logic
├── questions.js       # Truth and dare questions
├── register.js        # Slash command registration
├── config.json        # Bot configuration
├── package.json       # Dependencies
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose setup
├── fly.toml          # Fly.io configuration
├── .env              # Environment variables (not in git)
└── README.md         # This file
```

## 🎨 Bot Features Explained

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
- Logs errors to `error.log` file
- Handles rate limits and API failures

### Button Interactions
- **Truth/Dare/Random** - Only active player can click
- **Skip** - Any player except active player can skip
- **Spin Again** - Starts new round with new player

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TOKEN` | Discord Bot Token | ✅ Yes |
| `CLIENT_ID` | Discord Application ID | ✅ Yes (for registering commands) |
| `GUILD_ID` | Discord Server ID | ✅ Yes (for registering commands) |

### Bot Permissions Required

- Read Messages/View Channels
- Send Messages
- Embed Links
- Use Slash Commands
- Read Message History

### Intents Required

- `Guilds`
- `GuildMessages`
- `MessageContent`
- `GuildMembers`

## 📝 Adding Questions

Edit `questions.js` to add more questions:

```javascript
export const questions = {
    truths: [
        "Your truth question here...",
        // Add more truths
    ],
    dares: [
        "Your dare challenge here...",
        // Add more dares
    ]
};
```

## 🐛 Troubleshooting

### Bot not responding to commands
- Check if bot is online: `/ping`
- Verify slash commands are registered: `bun run register.js`
- Check bot has proper permissions in server

### "Gagal memuat member" error
- Bot is being rate limited
- Wait a few seconds and try again
- Check bot has `GuildMembers` intent enabled

### Deployment fails on Fly.io
- Check logs: `flyctl logs`
- Verify TOKEN secret is set: `flyctl secrets list`
- Ensure Dockerfile builds locally: `docker build .`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add more questions
- Improve error handling
- Add new features
- Fix bugs

## 👨‍💻 Author

Created with ❤️ using Bun and Discord.js

---

**Note**: This bot is designed for Indonesian-speaking Discord communities. All questions and dares are in Bahasa Indonesia.
