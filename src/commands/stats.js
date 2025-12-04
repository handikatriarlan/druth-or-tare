import { EmbedBuilder } from 'discord.js';
import { colors } from '../config/bot.js';

export async function handleStats(interaction, cachedQuestions) {
    const totalQuestions = cachedQuestions.truths.length + cachedQuestions.dares.length;
    
    const embed = new EmbedBuilder()
        .setColor(colors.primary)
        .setTitle('📊 Statistik Pertanyaan')
        .setDescription('Jumlah pertanyaan yang tersedia di database')
        .addFields(
            { name: '🤔 Truth', value: `${cachedQuestions.truths.length} pertanyaan`, inline: true },
            { name: '🔥 Dare', value: `${cachedQuestions.dares.length} pertanyaan`, inline: true },
            { name: '📝 Total', value: `${totalQuestions} pertanyaan`, inline: true }
        )
        .setFooter({ text: 'Druth or Tare Bot • Database Stats' })
        .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
}
