const db = require('./db');

async function testDispatch() {
    try {
        await db.query('BEGIN');
        await db.query(`
            INSERT INTO task_assignments (task_id, volunteer_id, assigned_by, status)
            VALUES ($1, $2, $3, 'Assigned')
            ON CONFLICT (task_id, volunteer_id) DO NOTHING
        `, [1, 1, 1]);
        await db.query('ROLLBACK');
        console.log('SUCCESS');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}
testDispatch();
