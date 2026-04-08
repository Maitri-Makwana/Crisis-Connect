const db = require('./db');

async function diagnose() {
    try {
        console.log('--- Database Diagnostic ---');
        
        const tables = ['users', 'incidents', 'resources', 'tasks', 'task_assignments', 'notifications'];
        
        for (let table of tables) {
            try {
                const countRes = await db.query(`SELECT COUNT(*) FROM ${table}`);
                const colsRes = await db.query(`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = $1
                `, [table]);
                
                console.log(`\nTable: ${table}`);
                console.log(`Row Count: ${countRes.rows[0].count}`);
                console.log(`Columns: ${colsRes.rows.map(c => c.column_name).join(', ')}`);
            } catch (tableErr) {
                console.log(`\nTable: ${table} - FAILED to query: ${tableErr.message}`);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('DIAGNOSTIC FAILED:', err);
        process.exit(1);
    }
}

diagnose();
