import { sql } from './connection.js';
import { questions } from '../../data/questions.js';

export async function initDatabase() {
    console.log('Creating table...');
    
    await sql`
        CREATE TABLE IF NOT EXISTS questions (
            id SERIAL PRIMARY KEY,
            type VARCHAR(10) NOT NULL,
            question TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    const existing = await sql`SELECT COUNT(*) as count FROM questions`;
    
    if (existing[0].count === '0') {
        console.log('Inserting initial questions...');
        
        for (const truth of questions.truths) {
            await sql`INSERT INTO questions (type, question) VALUES ('truth', ${truth})`;
        }
        
        for (const dare of questions.dares) {
            await sql`INSERT INTO questions (type, question) VALUES ('dare', ${dare})`;
        }
        
        console.log(`Inserted ${questions.truths.length} truths and ${questions.dares.length} dares`);
    } else {
        console.log('Questions already exist in database');
    }
    
    console.log('Database initialized!');
}
