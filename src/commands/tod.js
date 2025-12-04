import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { gameState, getRandomMember, getRandomQuestion } from '../utils/game.js';
import { colors } from '../config/bot.js';

export async function handleTod(interaction, cachedQuestions) {
    if (!interaction.guild) {
        return interaction.reply({ content: 'Fitur ini cuma bisa dipake di server!', flags: MessageFlags.Ephemeral });
    }

    await interaction.deferReply();

    try {
        const randomMember = getRandomMember(interaction.guild);

        gameState.set(interaction.channelId, {
            activePlayerId: randomMember.id,
            activePlayerName: randomMember.user.username
        });

        const embed = new EmbedBuilder()
            .setColor(colors.primary)
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
                    .setEmoji('⏭️')
            );

        await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
        console.error('Error in handleTod:', error);
        await interaction.editReply({ content: `Gagal memulai game: ${error.message}` });
    }
}

export async function handleTodButton(interaction, cachedQuestions) {
    const { customId } = interaction;
    const channelState = gameState.get(interaction.channelId);

    // Handle Skip
    if (customId === 'skip_btn') {
        // Check permission first (fast check)
        if (interaction.user.id === channelState?.activePlayerId) {
            return interaction.reply({
                content: '❌ Gabisa skip giliran sendiri dong! Harus orang lain yang skip kalo kamu kelamaan.',
                flags: MessageFlags.Ephemeral
            });
        }

        // Defer immediately to prevent timeout
        await interaction.deferUpdate();

        if (!channelState) {
            return interaction.followUp({ content: '❌ Belum ada game aktif. Ketik `/tod` dulu!', flags: MessageFlags.Ephemeral });
        }

        const disabledRow = new ActionRowBuilder();
        interaction.message.components[0].components.forEach(comp => {
            disabledRow.addComponents(ButtonBuilder.from(comp).setDisabled(true));
        });

        await interaction.editReply({ components: [disabledRow] });

        const randomMember = getRandomMember(interaction.guild);

        gameState.set(interaction.channelId, {
            activePlayerId: randomMember.id,
            activePlayerName: randomMember.user.username
        });

        const embed = new EmbedBuilder()
            .setColor(colors.primary)
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
                    .setEmoji('⏭️')
            );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        return;
    }

    // Handle Truth/Dare/Random - Defer immediately
    await interaction.deferUpdate();

    if (!channelState) {
        return interaction.followUp({ content: '❌ Belum ada game aktif. Ketik `/tod` dulu!', flags: MessageFlags.Ephemeral });
    }

    // Check permission after deferring
    if (interaction.user.id !== channelState.activePlayerId) {
        return interaction.followUp({
            content: `❌ Bukan giliran kamu! Yang main sekarang: **${channelState.activePlayerName}**`,
            flags: MessageFlags.Ephemeral
        });
    }

    let type = customId === 'truth_btn' ? 'truth' : customId === 'dare_btn' ? 'dare' : null;

    if (customId === 'random_btn') {
        type = Math.random() < 0.5 ? 'truth' : 'dare';
    }

    const question = getRandomQuestion(cachedQuestions, type);

    const embed = new EmbedBuilder()
        .setColor(type === 'truth' ? 0x3498db : 0xe74c3c)
        .setTitle(type === 'truth' ? '🤔 Truth' : '🔥 Dare')
        .setDescription(question)
        .setFooter({ text: `Untuk: ${channelState.activePlayerName}` });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('spin_again_btn')
                .setLabel('Putar Lagi!')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🔄')
        );

    await interaction.editReply({ embeds: [embed], components: [row] });
    gameState.delete(interaction.channelId);
}

export async function handleSpinAgain(interaction, cachedQuestions) {
    await interaction.deferUpdate();

    const disabledRow = new ActionRowBuilder();
    interaction.message.components[0].components.forEach(comp => {
        disabledRow.addComponents(ButtonBuilder.from(comp).setDisabled(true));
    });

    await interaction.editReply({ components: [disabledRow] });

    const randomMember = getRandomMember(interaction.guild);

    gameState.set(interaction.channelId, {
        activePlayerId: randomMember.id,
        activePlayerName: randomMember.user.username
    });

    const embed = new EmbedBuilder()
        .setColor(colors.primary)
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
                .setEmoji('⏭️')
        );

    await interaction.channel.send({ embeds: [embed], components: [row] });
}
