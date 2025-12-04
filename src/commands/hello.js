export async function handleHello(interaction) {
    await interaction.editReply(`Halo ${interaction.user}! 👋`);
}
