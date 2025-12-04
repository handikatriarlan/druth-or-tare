import { Client, Events } from 'discord.js';
import 'dotenv/config';
import { botConfig } from './config/bot.js';
import { getQuestions, addQuestion } from './database/questions.js';
import { handlePing } from './commands/ping.js';
import { handleHello } from './commands/hello.js';
import { handleHelp } from './commands/help.js';
import { handleTod, handleTodButton, handleSpinAgain } from './commands/tod.js';
import { formatUptime } from './utils/uptime.js';

const client = new Client(botConfig);
let cachedQuestions = { truths: [], dares: [] };

async function loadQuestions() {
    cachedQuestions = await getQuestions();
    console.log(`Loaded ${cachedQuestions.truths.length} truths and ${cachedQuestions.dares.length} dares`);
}

// Combined HTTP server for health check and web interface
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const server = Bun.serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);
        
        // Health check endpoint
        if (url.pathname === '/' || url.pathname === '/health') {
            return new Response(JSON.stringify({ 
                status: 'ok', 
                bot: client.user?.tag || 'starting',
                uptime: formatUptime(process.uptime())
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Web interface for adding questions
        if (url.pathname === '/admin') {
            return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Pertanyaan - Druth or Tare</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; }
        h1 { color: #667eea; margin-bottom: 30px; text-align: center; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #333; font-weight: bold; }
        input, select, textarea { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; transition: border-color 0.3s; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #667eea; }
        textarea { resize: vertical; min-height: 100px; font-family: Arial, sans-serif; }
        button { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
        button:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍾 Tambah Pertanyaan</h1>
        <form method="POST" action="/admin/add">
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <label for="type">Tipe:</label>
                <select id="type" name="type" required>
                    <option value="truth">Truth 🤔</option>
                    <option value="dare">Dare 🔥</option>
                </select>
            </div>
            <div class="form-group">
                <label for="question">Pertanyaan:</label>
                <textarea id="question" name="question" required placeholder="Masukkan pertanyaan atau tantangan..."></textarea>
            </div>
            <button type="submit">Tambah Pertanyaan</button>
        </form>
    </div>
</body>
</html>
            `, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Handle form submission
        if (url.pathname === '/admin/add' && req.method === 'POST') {
            try {
                const formData = await req.formData();
                const password = formData.get('password');
                const type = formData.get('type');
                const question = formData.get('question');

                if (password !== ADMIN_PASSWORD) {
                    return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Druth or Tare</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; text-align: center; }
        h1 { color: #721c24; margin-bottom: 20px; }
        a { display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>❌ Password Salah!</h1>
        <a href="/admin">Kembali</a>
    </div>
</body>
</html>
                    `, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }

                if (!type || !question || !['truth', 'dare'].includes(type)) {
                    return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Druth or Tare</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; text-align: center; }
        h1 { color: #721c24; margin-bottom: 20px; }
        a { display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>❌ Data Tidak Valid!</h1>
        <a href="/admin">Kembali</a>
    </div>
</body>
</html>
                    `, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }

                await addQuestion(type, question.trim());
                await loadQuestions(); // Reload questions immediately

                return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Berhasil - Druth or Tare</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; text-align: center; }
        h1 { color: #155724; margin-bottom: 20px; }
        p { color: #666; margin-bottom: 20px; }
        a { display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✅ Berhasil Ditambahkan!</h1>
        <p>Pertanyaan ${type === 'truth' ? 'Truth' : 'Dare'} telah ditambahkan dan langsung tersedia.</p>
        <a href="/admin">Tambah Lagi</a>
    </div>
</body>
</html>
                `, {
                    headers: { 'Content-Type': 'text/html' }
                });
            } catch (error) {
                console.error('Error adding question:', error);
                return new Response(`
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Druth or Tare</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; text-align: center; }
        h1 { color: #721c24; margin-bottom: 20px; }
        a { display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>❌ Terjadi Kesalahan!</h1>
        <a href="/admin">Kembali</a>
    </div>
</body>
</html>
                `, {
                    headers: { 'Content-Type': 'text/html' }
                });
            }
        }

        return new Response('Not Found', { status: 404 });
    }
});

console.log(`Server running on port ${PORT}`);

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
