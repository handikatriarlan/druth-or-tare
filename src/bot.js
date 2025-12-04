import { Client, Events, MessageFlags } from 'discord.js';
import 'dotenv/config';
import { botConfig } from './config/bot.js';
import { getQuestions, addQuestion } from './database/questions.js';
import { handlePing } from './commands/ping.js';
import { handleHello } from './commands/hello.js';
import { handleHelp } from './commands/help.js';
import { handleTod, handleTodButton, handleSpinAgain } from './commands/tod.js';
import { handleHealth } from './commands/health.js';
import { handleAddQuestion } from './commands/addquestion.js';
import { handleStats } from './commands/stats.js';
import { formatUptime } from './utils/uptime.js';

const client = new Client(botConfig);
let cachedQuestions = { truths: [], dares: [] };

// Rate limiting for web requests
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    
    // Remove old requests outside the window
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS) {
        return false;
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    return true;
}

// Clean up rate limit map every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, requests] of rateLimitMap.entries()) {
        const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
        if (recentRequests.length === 0) {
            rateLimitMap.delete(ip);
        } else {
            rateLimitMap.set(ip, recentRequests);
        }
    }
}, 300000);

async function loadQuestions() {
    try {
        cachedQuestions = await getQuestions();
        console.log(`Loaded ${cachedQuestions.truths.length} truths and ${cachedQuestions.dares.length} dares`);
    } catch (error) {
        console.error('Failed to load questions:', error);
        // Use empty arrays as fallback
        cachedQuestions = { truths: [], dares: [] };
    }
}

// Combined HTTP server for health check and web interface
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const server = Bun.serve({
    port: PORT,
    async fetch(req) {
        try {
            const url = new URL(req.url);
            const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
            
            // Rate limiting (except for health check)
            if (url.pathname !== '/' && url.pathname !== '/health') {
                if (!checkRateLimit(clientIP)) {
                    return new Response('Too many requests. Please try again later.', { 
                        status: 429,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                }
            }
        
        // Health check endpoint
        if (url.pathname === '/') {
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
    <title>Admin - Druth or Tare</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #fafafa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container { 
            background: #fff;
            padding: 48px;
            border-radius: 16px;
            max-width: 440px;
            width: 100%;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .logo {
            font-size: 40px;
            text-align: center;
            margin-bottom: 16px;
        }
        
        h1 { 
            color: #000;
            font-size: 22px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            color: #666;
            text-align: center;
            font-size: 14px;
            font-weight: 400;
            margin-bottom: 40px;
        }
        
        .form-group { 
            margin-bottom: 24px;
        }
        
        label { 
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.3px;
        }
        
        input, select, textarea { 
            width: 100%;
            padding: 12px 14px;
            background: #fafafa;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            font-size: 15px;
            color: #000;
            font-family: 'Inter', sans-serif;
            transition: all 0.2s ease;
        }
        
        input:focus, select:focus, textarea:focus { 
            outline: none;
            background: #fff;
            border-color: #000;
        }
        
        input::placeholder, textarea::placeholder {
            color: #999;
        }
        
        select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            padding-right: 40px;
        }
        
        select option {
            background: #fff;
            color: #000;
        }
        
        textarea { 
            resize: vertical;
            min-height: 120px;
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
        }
        
        button { 
            width: 100%;
            padding: 14px;
            background: #000;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            letter-spacing: 0.3px;
            margin-top: 8px;
        }
        
        button:hover { 
            background: #333;
        }
        
        button:active {
            transform: scale(0.98);
        }
        
        @media (max-width: 640px) {
            .container {
                padding: 32px 24px;
            }
            
            h1 {
                font-size: 20px;
            }
            
            .logo {
                font-size: 36px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🍾</div>
        <h1>Admin Panel</h1>
        <p class="subtitle">Tambah pertanyaan Truth or Dare</p>
        
        <form method="POST" action="/admin/add">
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="Masukkan password">
            </div>
            
            <div class="form-group">
                <label for="type">Tipe Pertanyaan</label>
                <select id="type" name="type" required>
                    <option value="truth">🤔 Truth</option>
                    <option value="dare">🔥 Dare</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="question">Pertanyaan</label>
                <textarea id="question" name="question" required placeholder="Tulis pertanyaan atau tantangan di sini..."></textarea>
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #fafafa; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: #fff; padding: 48px; border-radius: 16px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
        .icon { font-size: 56px; margin-bottom: 16px; }
        h1 { color: #000; margin-bottom: 8px; font-size: 20px; font-weight: 600; }
        p { color: #666; margin-bottom: 32px; font-size: 14px; }
        a { display: inline-block; padding: 12px 28px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; transition: all 0.2s ease; }
        a:hover { background: #333; }
        a:active { transform: scale(0.98); }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔒</div>
        <h1>Password Salah</h1>
        <p>Silakan coba lagi dengan password yang benar</p>
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #fafafa; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: #fff; padding: 48px; border-radius: 16px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
        .icon { font-size: 56px; margin-bottom: 16px; }
        h1 { color: #000; margin-bottom: 8px; font-size: 20px; font-weight: 600; }
        p { color: #666; margin-bottom: 32px; font-size: 14px; }
        a { display: inline-block; padding: 12px 28px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; transition: all 0.2s ease; }
        a:hover { background: #333; }
        a:active { transform: scale(0.98); }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">⚠️</div>
        <h1>Data Tidak Valid</h1>
        <p>Pastikan semua field terisi dengan benar</p>
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #fafafa; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: #fff; padding: 48px; border-radius: 16px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
        .icon { font-size: 56px; margin-bottom: 16px; }
        h1 { color: #000; margin-bottom: 8px; font-size: 20px; font-weight: 600; }
        p { color: #666; margin-bottom: 32px; font-size: 14px; line-height: 1.6; }
        a { display: inline-block; padding: 12px 28px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; transition: all 0.2s ease; }
        a:hover { background: #333; }
        a:active { transform: scale(0.98); }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✓</div>
        <h1>Berhasil Ditambahkan</h1>
        <p>Pertanyaan ${type === 'truth' ? 'Truth' : 'Dare'} telah ditambahkan dan langsung tersedia untuk dimainkan</p>
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #fafafa; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .container { background: #fff; padding: 48px; border-radius: 16px; max-width: 400px; width: 100%; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
        .icon { font-size: 56px; margin-bottom: 16px; }
        h1 { color: #000; margin-bottom: 8px; font-size: 20px; font-weight: 600; }
        p { color: #666; margin-bottom: 32px; font-size: 14px; }
        a { display: inline-block; padding: 12px 28px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; transition: all 0.2s ease; }
        a:hover { background: #333; }
        a:active { transform: scale(0.98); }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✕</div>
        <h1>Terjadi Kesalahan</h1>
        <p>Gagal menambahkan pertanyaan. Silakan coba lagi</p>
        <a href="/admin">Kembali</a>
    </div>
</body>
</html>
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
        } catch (error) {
            console.error('Web server error:', error);
            return new Response('Internal Server Error', { 
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
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
    try {
        if (interaction.isChatInputCommand()) {
            const { commandName } = interaction;

            if (commandName === 'ping') await handlePing(interaction);
            if (commandName === 'hello') await handleHello(interaction);
            if (commandName === 'help') await handleHelp(interaction);
            if (commandName === 'tod') await handleTod(interaction, cachedQuestions);
            if (commandName === 'health') await handleHealth(interaction);
            if (commandName === 'addquestion') await handleAddQuestion(interaction);
            if (commandName === 'stats') await handleStats(interaction, cachedQuestions);
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
    } catch (error) {
        console.error('Error handling interaction:', error);
        try {
            const replyOptions = { content: 'Terjadi kesalahan. Silakan coba lagi.', flags: MessageFlags.Ephemeral };
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply(replyOptions);
            } else if (interaction.deferred) {
                await interaction.editReply(replyOptions);
            } else {
                await interaction.followUp(replyOptions);
            }
        } catch (e) {
            console.error('Failed to send error message:', e);
        }
    }
});

// Error handlers
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

client.on('warn', (warning) => {
    console.warn('Discord client warning:', warning);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    // Don't exit, let Fly.io handle restart if needed
});

// Graceful shutdown
async function shutdown() {
    console.log('Shutting down gracefully...');
    try {
        await client.destroy();
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Login with retry logic
async function loginWithRetry(maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await client.login(process.env.TOKEN);
            console.log('Successfully logged in to Discord');
            return;
        } catch (error) {
            console.error(`Login attempt ${i + 1} failed:`, error);
            if (i < maxRetries - 1) {
                const delay = Math.min(1000 * Math.pow(2, i), 10000); // Exponential backoff
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Max login retries reached. Exiting...');
                process.exit(1);
            }
        }
    }
}

loginWithRetry();

export { client };
