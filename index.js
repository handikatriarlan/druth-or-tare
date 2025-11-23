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
client.once('ready', () => {
    console.log(`Bot ready as ${client.user.tag}`);
});

// PREFIX COMMAND
client.on('messageCreate', (msg) => {
    if (msg.author.bot) return;

    const prefix = '!';
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        msg.reply('Pong! 🏓');
    }

    if (command === 'test') {
        msg.reply('Oke gas oke gas 😎✌️');
    }
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