const db = require('./db');
require('dotenv').config();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runSimulation() {
    console.log("=================================================");
    console.log("🔥 CrisisConnect Simulation Suite Initiated");
    console.log("=================================================\n");

    try {
        // 1. Get a Coordinator and Volunteer for the mock
        const coordRes = await db.query("SELECT user_id, full_name FROM users WHERE role_id = (SELECT role_id FROM roles WHERE role_name = 'Coordinator') LIMIT 1");
        const volRes = await db.query("SELECT user_id, full_name, email FROM users WHERE role_id = (SELECT role_id FROM roles WHERE role_name = 'Volunteer') LIMIT 1");
        
        let coordinator = coordRes.rows[0];
        let volunteer = volRes.rows[0];

        if (!coordinator || !volunteer) {
            console.log("⚠️ Could not find a Coordinator and Volunteer in the database! Please register at least one of each.");
            process.exit(1);
        }

        console.log(`👨‍💼 Using Coordinator: ${coordinator.full_name}`);
        console.log(`👷 Using Volunteer: ${volunteer.full_name} (${volunteer.email})\n`);

        await sleep(2000);

        // --- SCENARIO 1: NEW EMERGENCY ---
        console.log("🚨 [SCENARIO 1] Breaking News: Flash Flood Reported in Downtown Area!");
        const floodRes = await db.query(`
            INSERT INTO incidents (incident_type, severity, status, latitude, longitude, created_by)
            VALUES ('Flood', 5, 'Active', 43.6532, -79.3832, $1)
            RETURNING incident_id
        `, [coordinator.user_id]);
        const incidentId = floodRes.rows[0].incident_id;
        console.log(`   ✅ Incident #${incidentId} logged in the system.\n`);

        await sleep(2000);

        // --- SCENARIO 2: SHELTERS AND FOOD ---
        console.log("⛺ [SCENARIO 2] Setting up Emergency Shelters and tracking supplies...");
        const res1 = await db.query(`
            INSERT INTO resources (incident_id, resource_name, resource_type, status, quantity, latitude, longitude)
            VALUES ($1, 'Downtown Relief Center', 'Shelter', 'Full', 0, 43.6550, -79.3800)
            RETURNING resource_id
        `, [incidentId]);
        console.log(`   ✅ Shelter added. Alert: Shelter capacity is now 'Full'!`);

        const res2 = await db.query(`
            INSERT INTO resources (incident_id, resource_name, resource_type, status, quantity, latitude, longitude)
            VALUES ($1, 'Food Bank Reserve', 'Food', 'Low', 20, 43.6600, -79.3900)
            RETURNING resource_id
        `, [incidentId]);
        console.log(`   ✅ Food supplies added. Alert: Status dropped to 'Low'!\n`);

        await sleep(2000);

        // --- SCENARIO 3: URGENT DISPATCH ---
        console.log("⚠️ [SCENARIO 3] Urgent Medical Task created and Volunteer Dispatched!");
        const taskRes = await db.query(`
            INSERT INTO tasks (incident_id, description, urgency_level, status, task_type, latitude, longitude)
            VALUES ($1, 'Deliver emergency first-aid kits to trapped residents', 'Critical', 'Assigned', 'Medical Aid', 43.6540, -79.3850)
            RETURNING task_id
        `, [incidentId]);
        const taskId = taskRes.rows[0].task_id;
        console.log(`   ✅ Task Created: Deliver first-aid kits (Critical Urgency).`);

        // Trigger the live API to send the real email!
        console.log(`   ✉️  Triggering Live Email Notification dispatch system...`);
        
        try {
            const apiRes = await fetch(`http://localhost:5000/api/tasks/${taskId}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    volunteer_ids: [volunteer.user_id],
                    assigned_by: coordinator.user_id
                })
            });
            if (apiRes.ok) {
                console.log(`   ✅ Volunteer ${volunteer.full_name} has been formally assigned and notified!`);
            } else {
                console.log(`   ⚠️ Failed to trigger API dispatch.`);
            }
        } catch (fetchErr) {
            console.log(`   ⚠️ API fetch failed. Make sure the backend server (node server.js) is currently running.`);
        }

        console.log("\n=================================================");
        console.log("🏁 Simulation Complete! Check your browser map to see new markers.");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Simulation failed:", err);
        process.exit(1);
    }
}

runSimulation();
