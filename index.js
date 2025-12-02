import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, MessageFlags } from 'discord.js';
import 'dotenv/config';
import { getRandomQuestion } from './questions.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// State Management: Map<channelId, { activePlayerId: string, activePlayerName: string }>
const gameState = new Map();

// HTTP Server for health check
const PORT = process.env.PORT || 3000;
const server = Bun.serve({
    port: PORT,
    fetch(req) {
        const url = new URL(req.url);
        
        if (url.pathname === '/') {
            return new Response(`
<!DOCTYPE html>
<html>
<head>
    <title>Druth or Tare Bot</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #2c2f33; color: #fff; }
        .status { padding: 20px; background: #23272a; border-radius: 8px; margin: 20px 0; }
        .online { color: #43b581; }
        .offline { color: #f04747; }
        h1 { color: #7289da; }
        .info { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Druth or Tare Bot</h1>
    <div class="status">
        <h2>Status: <span class="${client.user ? 'online' : 'offline'}">${client.user ? 'Online' : 'Offline'}</span></h2>
        ${client.user ? `
        <div class="info"><strong>Bot Name:</strong> ${client.user.tag}</div>
        <div class="info"><strong>Servers:</strong> ${client.guilds.cache.size}</div>
        <div class="info"><strong>Uptime:</strong> ${Math.floor(process.uptime())}s</div>
        ` : '<p>Bot is starting...</p>'}
    </div>
    <p>Indonesian Truth or Dare Discord Bot with spin-the-bottle mechanics.</p>
</body>
</html>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        if (url.pathname === '/health') {
            return Response.json({ 
                status: 'ok', 
                bot: client.user?.tag || 'starting',
                uptime: process.uptime()
            });
        }
        
        return new Response('Not Found', { status: 404 });
    }
});

console.log(`HTTP server running on http://localhost:${PORT}`);

client.once(Events.ClientReady, async () => {
    console.log(`Bot ready as ${client.user.tag}`);

    // Pre-fetch members on startup to populate cache and avoid rate limits during game
    console.log('Populating member cache...');
    for (const guild of client.guilds.cache.values()) {
        try {
            await guild.members.fetch();
            console.log(`Cached members for guild: ${guild.name}`);
        } catch (e) {
            console.error(`Failed to cache members for ${guild.name}:`, e);
        }
    }
});

async function startGameRound(interaction, isNewGame = false) {
    // 1. Pick a random player
    if (!interaction.guild) {
        return interaction.reply({ content: 'Fitur ini cuma bisa dipake di server!', flags: MessageFlags.Ephemeral });
    }

    // Defer if it's a button click (update) or reply if it's a command
    if (interaction.isButton() && !interaction.deferred && !interaction.replied) {
        await interaction.deferUpdate();
    } else if (interaction.isChatInputCommand() && !interaction.deferred && !interaction.replied) {
        await interaction.deferReply();
    }

    try {
        // Optimization: Rely strictly on cache which is populated at startup
        const members = interaction.guild.members.cache;
        let humanMembers = members.filter(member => !member.user.bot);

        if (humanMembers.size === 0) {
            // Fallback: If cache is somehow empty, try one fetch but catch error
            try {
                const fetched = await interaction.guild.members.fetch({ time: 1000 });
                humanMembers = fetched.filter(m => !m.user.bot);
                if (humanMembers.size === 0) throw new Error('No humans found');
            } catch (e) {
                throw new Error('Gagal memuat member (Rate Limit). Tunggu sebentar dan coba lagi.');
            }
        }

        // Re-check after potential fallback
        const finalHumans = interaction.guild.members.cache.filter(member => !member.user.bot);
        if (finalHumans.size === 0) throw new Error('Tidak ada member manusia yang ditemukan.');

        const randomMember = finalHumans.random();

        // 2. Set State
        gameState.set(interaction.channelId, {
            activePlayerId: randomMember.id,
            activePlayerName: randomMember.user.username
        });

        // 3. Send Embed
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🍾 Botol Berputar...')
            .setDescription(`Botol berhenti di arah... **${randomMember}**! 🎯\n\nSilakan pilih tantanganmu!`)
            .setThumbnail(randomMember.user.displayAvatarURL())
            .setFooter({ text: 'Druth or Tare Bot • Giliranmu!' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('truth_btn')
                    .setLabel('Truth')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🤔'),
                new ButtonBuilder()
                    .setCustomId('dare_btn')
                    .setLabel('Dare')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔥'),
                new ButtonBuilder()
                    .setCustomId('random_btn')
                    .setLabel('Random')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🎲'),
                new ButtonBuilder()
                    .setCustomId('skip_btn')
                    .setLabel('Skip / Ganti Pemain')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⏭️'),
            );

        if (isNewGame) {
            await interaction.editReply({ embeds: [embed], components: [row] });
        } else {
            // Send as new message to keep chat flowing down
            await interaction.channel.send({ embeds: [embed], components: [row] });
            // Optionally delete previous message components to prevent confusion?
            // For now let's keep it simple.
        }

    } catch (error) {
        console.error('Error in startGameRound:', error);
        // Log to file for debugging
        const fs = require('fs');
        fs.appendFileSync('error.log', `${new Date().toISOString()} - ${error.stack || error}\n`);

        const msg = `Gagal memulai ronde: ${error.message}`;

        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: msg, flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral });
            }
        } catch (e) {
            console.error('Error sending error message:', e);
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    // Handle Slash Commands
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'tod') {
            await startGameRound(interaction, true);
        }

        if (interaction.commandName === 'ping') await interaction.reply('Pong! 🏓');
        if (interaction.commandName === 'hello') await interaction.reply('Halo juga brayy 😎🔥');

        if (interaction.commandName === 'help') {
            const embed = new EmbedBuilder()
                .setColor(0x00b894)
                .setTitle('Bantuan Druth or Tare')
                .setDescription('Cara main:')
                .addFields(
                    { name: '`/tod`', value: 'Mulai permainan. Bot akan otomatis memilih pemain.' },
                    { name: 'Aturan Main', value: '• Bot memilih pemain secara acak.\n• Hanya pemain yang terpilih yang bisa menekan tombol Truth/Dare.\n• Gunakan tombol **Skip** jika pemain AFK.' }
                );
            await interaction.reply({ embeds: [embed] });
        }
    }

    // Handle Buttons
    if (interaction.isButton()) {
        const { customId } = interaction;
        const channelState = gameState.get(interaction.channelId);

        // Handle Skip
        if (customId === 'skip_btn') {
            // Restriction: Active player cannot skip their own turn
            if (channelState && interaction.user.id === channelState.activePlayerId) {
                return interaction.reply({
                    content: '❌ Gabisa skip giliran sendiri dong! Harus orang lain yang skip kalo kamu kelamaan.',
                    flags: MessageFlags.Ephemeral
                });
            }

            // 1. Disable buttons on the old message to prevent spam
            const disabledRow = new ActionRowBuilder();
            interaction.message.components[0].components.forEach(comp => {
                disabledRow.addComponents(ButtonBuilder.from(comp).setDisabled(true));
            });

            // 2. Update the old message
            await interaction.update({
                content: `⏭️ **${interaction.user.username}** menekan tombol skip!`,
                components: [disabledRow]
            });

            // 3. Start a new round (pass interaction, but startGameRound handles replied state)
            await startGameRound(interaction);
            return;
        }

        // Check Turn
        if (!channelState || interaction.user.id !== channelState.activePlayerId) {
            return interaction.reply({
                content: `Eits, bukan giliranmu! Ini giliran **${channelState?.activePlayerName || 'Hantu'}**. 👻`,
                flags: MessageFlags.Ephemeral
            });
        }

        // Handle T/D/R
        if (['truth_btn', 'dare_btn', 'random_btn'].includes(customId)) {
            let type = '';
            let title = '';
            let color = 0x000000;

            if (customId === 'truth_btn') {
                type = 'truth';
                title = 'TRUTH 🤔';
                color = 0x3498db;
            } else if (customId === 'dare_btn') {
                type = 'dare';
                title = 'DARE 🔥';
                color = 0xe74c3c;
            } else {
                type = 'random'; // Helper handles random logic
                title = 'RANDOM 🎲';
                color = 0x9b59b6;
            }

            const question = getRandomQuestion(type);

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(title)
                .setDescription(`**${question}**`)
                .setFooter({ text: `Pemain: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('spin_again_btn')
                        .setLabel('Putar Lagi! 🍾')
                        .setStyle(ButtonStyle.Success)
                );

            await interaction.update({ embeds: [embed], components: [row] });
        }

        if (customId === 'spin_again_btn') {
            await startGameRound(interaction);
        }
    }
});

client.login(process.env.TOKEN);