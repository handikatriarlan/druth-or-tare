import { EmbedBuilder } from 'discord.js';
import { colors } from '../config/bot.js';

export async function handleHelp(interaction) {
    const embed = new EmbedBuilder()
        .setColor(colors.primary)
        .setTitle('📖 Cara Main Truth or Dare')
        .setDescription('Permainan Truth or Dare dengan mekanisme putar botol!')
        .addFields(
            { name: '🎮 Cara Main', value: '1. Ketik `/tod` untuk mulai\n2. Bot akan pilih pemain random\n3. Pilih Truth 🤔, Dare 🔥, atau Random 🎲\n4. Klik "Putar Lagi!" untuk pemain berikutnya' },
            { name: '⏭️ Skip', value: 'Pemain lain bisa klik "Skip" jika pemain terpilih AFK' },
            { name: '🔒 Proteksi', value: 'Hanya pemain terpilih yang bisa jawab Truth/Dare' }
        )
        .setFooter({ text: 'Druth or Tare Bot • Have Fun!' });

    await interaction.reply({ embeds: [embed] });
}
