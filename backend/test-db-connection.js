const db = require('./db');
require('dotenv').config(); // Ensure env is loaded for this script even if db.js has issues

async function testConnection() {
    try {
        console.log('Testing connection...');
        const res = await db.query('SELECT NOW() as now');
        console.log('Connection SUCCESS:', res.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error('Connection FAILED:', err);
        process.exit(1);
    }
}

testConnection();
