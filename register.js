import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const commands = [
    {
        name: 'ping',
        description: 'jawab pong',
    },
    {
        name: 'hello',
        description: 'bot nyapa balik',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function main() {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands },
        );

        console.log('Sukses daftar command (GUILD)!');
    } catch (err) {
        console.error(err);
    }
}

main();
