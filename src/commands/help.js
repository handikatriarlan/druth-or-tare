import { EmbedBuilder } from 'discord.js';
import { colors } from '../config/bot.js';

export async function handleHelp(interaction) {
    const embed = new EmbedBuilder()
        .setColor(colors.primary)
        .setTitle('📖 Panduan Bot')
        .setDescription('Daftar lengkap semua command yang tersedia')
        .addFields(
            { 
                name: '🎮 Game Commands', 
                value: '`/tod` - Mulai Truth or Dare\n`' 
            },
            { 
                name: '📊 Info Commands', 
                value: '`/health` - Status & uptime bot\n`/stats` - Statistik pertanyaan\n`/addquestion` - Cara tambah pertanyaan' 
            },
            { 
                name: '💬 Basic Commands', 
                value: '`/ping` - Cek latency bot\n`/hello` - Sapa bot\n`/help` - Lihat panduan ini' 
            },
            { 
                name: '🎯 Cara Main Truth or Dare', 
                value: '1. Ketik `/tod` untuk mulai\n2. Bot pilih pemain random\n3. Pilih Truth 🤔 / Dare 🔥 / Random 🎲\n4. Klik "Putar Lagi!" untuk lanjut\n5. Pemain lain bisa "Skip" jika AFK' 
            }
        )
        .setFooter({ text: 'Druth or Tare Bot • Total: 10 Commands' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
