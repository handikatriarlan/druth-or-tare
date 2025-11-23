const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// event ready, ini yang bener buat discord.js v14
client.once('clientReady', () => {
    console.log(`Bot ready as ${client.user.tag}`);
});

// SLASH COMMAND HANDLER
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        interaction.reply('Pong! 🏓');
    }

    if (interaction.commandName === 'hello') {
        interaction.reply('Halo juga brayy 😎🔥');
    }
});

client.login(process.env.TOKEN);