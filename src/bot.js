import { Client, Events } from 'discord.js';
import 'dotenv/config';
import { botConfig } from './config/bot.js';
import { getQuestions } from './database/questions.js';
import { handlePing } from './commands/ping.js';
import { handleHello } from './commands/hello.js';
import { handleHelp } from './commands/help.js';
import { handleTod, handleTodButton, handleSpinAgain } from './commands/tod.js';

const client = new Client(botConfig);
let cachedQuestions = { truths: [], dares: [] };

async function loadQuestions() {
    cachedQuestions = await getQuestions();
    console.log(`Loaded ${cachedQuestions.truths.length} truths and ${cachedQuestions.dares.length} dares`);
}

client.once(Events.ClientReady, async () => {
    console.log(`Bot ready as ${client.user.tag}`);

    await loadQuestions();

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

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'ping') await handlePing(interaction);
        if (commandName === 'hello') await handleHello(interaction);
        if (commandName === 'help') await handleHelp(interaction);
        if (commandName === 'tod') await handleTod(interaction, cachedQuestions);
    }

    if (interaction.isButton()) {
        const { customId } = interaction;

        if (['truth_btn', 'dare_btn', 'random_btn', 'skip_btn'].includes(customId)) {
            await handleTodButton(interaction, cachedQuestions);
        }

        if (customId === 'spin_again_btn') {
            await handleSpinAgain(interaction, cachedQuestions);
        }
    }
});

client.login(process.env.TOKEN);

export { client };
