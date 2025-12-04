import { sql } from './connection.js';

export async function getQuestions() {
    const truths = await sql`SELECT question FROM questions WHERE type = 'truth'`;
    const dares = await sql`SELECT question FROM questions WHERE type = 'dare'`;
    
    return {
        truths: truths.map(row => row.question),
        dares: dares.map(row => row.question)
    };
}

export async function addQuestion(type, question) {
    await sql`INSERT INTO questions (type, question) VALUES (${type}, ${question})`;
}
