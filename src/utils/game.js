export const gameState = new Map();

export function getRandomQuestion(cachedQuestions, type) {
    const questions = type === 'truth' ? cachedQuestions.truths : cachedQuestions.dares;
    return questions[Math.floor(Math.random() * questions.length)];
}

export function getRandomMember(guild) {
    const members = guild.members.cache;
    const humanMembers = members.filter(member => !member.user.bot);
    
    if (humanMembers.size === 0) {
        throw new Error('Tidak ada member manusia yang ditemukan.');
    }
    
    return humanMembers.random();
}
