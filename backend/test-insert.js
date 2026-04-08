const db = require('./db');
// Try to dispatch task 1 to volunteer 5
async function testAssign() {
    try {
        const id = 1;
        const vol_id = 5;
        const assigned_by = 2;
        await db.query(`
            INSERT INTO task_assignments (task_id, volunteer_id, assigned_by, status)
            VALUES ($1, $2, $3, 'Assigned')
            ON CONFLICT (task_id, volunteer_id) DO NOTHING
        `, [id, vol_id, assigned_by]);
        console.log("Insert success!");
    } catch(err) {
        console.error("Insert failed:", err);
    }
    process.exit(0);
}
testAssign();
