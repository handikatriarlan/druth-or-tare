import 'dotenv/config';
import { initDatabase } from './src/database/init.js';

initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
