import { GatewayIntentBits } from 'discord.js';

export const botConfig = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
};

export const colors = {
    primary: 0x0099FF,
    success: 0x00FF00,
    danger: 0xFF0000,
    warning: 0xFFFF00
};
