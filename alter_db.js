const db = require('./backend/db');

async function alterTable() {
    try {
        await db.query('ALTER TABLE incidents ADD COLUMN IF NOT EXISTS description TEXT');
        console.log('Successfully added description column to incidents.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

alterTable();
