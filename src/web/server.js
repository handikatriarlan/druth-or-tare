import express from 'express';
import 'dotenv/config';
import { addQuestion } from '../database/questions.js';

const app = express();
const PORT = process.env.WEB_PORT || 8080;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
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
        <form method="POST" action="/add">
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
    `);
});

app.post('/add', async (req, res) => {
    const { password, type, question } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
        return res.send(`
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
        <a href="/">Kembali</a>
    </div>
</body>
</html>
        `);
    }
    
    if (!type || !question || !['truth', 'dare'].includes(type)) {
        return res.send(`
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
        <a href="/">Kembali</a>
    </div>
</body>
</html>
        `);
    }
    
    try {
        await addQuestion(type, question.trim());
        
        res.send(`
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
        <p>Pertanyaan ${type === 'truth' ? 'Truth' : 'Dare'} telah ditambahkan ke database.</p>
        <a href="/">Tambah Lagi</a>
    </div>
</body>
</html>
        `);
    } catch (error) {
        console.error('Error adding question:', error);
        res.send(`
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
        <a href="/">Kembali</a>
    </div>
</body>
</html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Web server running on http://localhost:${PORT}`);
});
