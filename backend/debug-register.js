const db = require('./db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function debugRegister() {
    try {
        console.log('--- Debugging Registration ---');

        // 1. Check Roles
        console.log('Checking roles table...');
        const roles = await db.query('SELECT * FROM roles');
        console.log('Roles found:', roles.rows);

        if (roles.rows.length === 0) {
            console.error('ERROR: Roles table is empty! Schema seed data missing.');
        }

        // 2. Simulate User Insert
        const testUser = {
            name: 'Debug User',
            email: `debug_${Date.now()}@test.com`,
            password: 'password123',
            role: 'Volunteer'
        };

        console.log(`Simulating registration for: ${JSON.stringify(testUser)}`);

        // Logic from server.js
        const roleResult = await db.query('SELECT role_id FROM roles WHERE role_name = $1', [testUser.role]);
        let role_id;

        if (roleResult.rows.length === 0) {
            console.log('Role not found immediately. Trying fallback...');
            const defaultRole = await db.query("SELECT role_id FROM roles WHERE role_name = 'Volunteer'");
            if (defaultRole.rows.length > 0) {
                role_id = defaultRole.rows[0].role_id;
                console.log('Fallback role found:', role_id);
            } else {
                console.error('CRITICAL: Default "Volunteer" role also not found.');
                role_id = null;
            }
        } else {
            role_id = roleResult.rows[0].role_id;
            console.log('Role found:', role_id);
        }

        if (!role_id) {
            throw new Error('Cannot proceed without role_id');
        }

        console.log('Attempting INSERT...');
        const { rows } = await db.query(`
            INSERT INTO users (full_name, email, password_hash, role_id)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, full_name, email, role_id
        `, [testUser.name, testUser.email, testUser.password, role_id]);

        console.log('SUCCESS: User inserted:', rows[0]);
        process.exit(0);

    } catch (err) {
        console.error('DEBUG FAILED:', err);
        process.exit(1);
    }
}

debugRegister();
