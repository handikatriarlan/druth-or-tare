import { EmbedBuilder } from 'discord.js';
import { colors } from '../config/bot.js';

export async function handleAddQuestion(interaction) {
    const embed = new EmbedBuilder()
        .setColor(colors.primary)
        .setTitle('📝 Cara Menambah Pertanyaan')
        .setDescription('Ingin menambahkan pertanyaan Truth or Dare baru?')
        .addFields(
            { 
                name: '🌐 Via Web Interface', 
                value: '1. Buka: https://druth-or-tare.fly.dev/admin\n2. Masukkan password admin\n3. Pilih tipe (Truth/Dare)\n4. Tulis pertanyaan\n5. Submit!' 
            },
            { 
                name: '🔑 Butuh Password?', 
                value: 'Hubungi admin bot:\n<@433946156511395841>' 
            },
            { 
                name: '✨ Keuntungan', 
                value: '• Pertanyaan langsung tersedia\n• Tidak perlu restart bot\n• Interface yang mudah' 
            }
        )
        .setFooter({ text: 'Druth or Tare Bot • Admin Panel' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
