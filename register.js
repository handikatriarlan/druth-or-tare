import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import { commands } from './src/config/commands.js';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function main() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

main();
