import { EmbedBuilder } from 'discord.js';
import { colors } from '../config/bot.js';
import { formatUptime } from '../utils/uptime.js';

export async function handleHealth(interaction) {
    const uptime = formatUptime(process.uptime());
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    
    const embed = new EmbedBuilder()
        .setColor(colors.success)
        .setTitle('🏥 Status Bot')
        .addFields(
            { name: '✅ Status', value: 'Online & Running', inline: true },
            { name: '⏱️ Uptime', value: uptime, inline: true },
            { name: '💾 Memory', value: `${memoryUsage} MB`, inline: true },
            { name: '📡 Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
            { name: '🌐 Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
            { name: '👥 Users', value: `${interaction.client.users.cache.size}`, inline: true }
        )
        .setFooter({ text: 'Druth or Tare Bot • Healthy' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
