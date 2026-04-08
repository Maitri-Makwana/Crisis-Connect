const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Nodemailer (Gmail App Password or Ethereal fallback)
let transporter;
const initializeTransporter = async () => {
    try {
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
            console.log(`✅ SMTP initialized with REAL Gmail Account: ${process.env.SMTP_USER}`);
        } else {
            let testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log('🧪 SMTP running in Simulation Mode (Ethereal Email)');
        }
    } catch (err) {
        console.error('Failed to initialize email system: ' + err.message);
    }
};
initializeTransporter();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Body:', JSON.stringify(req.body));
    next();
});

// Routes

// GET /api/resources/nearby
// Calculates distance using Haversine formula and returns closest resources
app.get('/api/resources/nearby', async (req, res) => {
    const { lat, lng, type } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

    try {
        let query = `
            SELECT 
                resource_id as id, 
                resource_name as name,
                resource_type as type, 
                quantity as capacity, 
                status, 
                contact_info as contact, 
                latitude, 
                longitude,
                (
                    6371 * acos(
                        cos(radians($1)) * cos(radians(latitude)) *
                        cos(radians(longitude) - radians($2)) +
                        sin(radians($1)) * sin(radians(latitude))
                    )
                ) AS distance_km
            FROM resources
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        `;
        let params = [lat, lng];

        if (type) {
            query += ` AND resource_type = $3`;
            params.push(type);
        }

        query += ` ORDER BY distance_km ASC LIMIT 5`;

        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('GET NEARBY RESOURCES ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET /api/resources
// Maps SQL columns (resource_name, resource_type, quantity, contact_info) -> Frontend keys (name, type, capacity, contact)
app.get('/api/resources', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT 
                resource_id as id,
                resource_name as name,
                resource_type as type,
                status,
                latitude,
                longitude,
                quantity as capacity,
                contact_info as contact
            FROM resources
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        // Fallback or Empty
        res.json([]);
    }
});

// POST /api/resources
app.post('/api/resources', async (req, res) => {
    const { name, type, status, latitude, longitude, capacity, contact } = req.body;
    try {
        const { rows } = await db.query(`
            INSERT INTO resources (resource_name, resource_type, status, latitude, longitude, quantity, contact_info)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING 
                resource_id as id,
                resource_name as name,
                resource_type as type,
                status,
                latitude,
                longitude,
                quantity as capacity,
                contact_info as contact
        `, [name, type, status, latitude, longitude, capacity, contact]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE /api/resources/:id
app.put('/api/resources/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Usually mainly updating status
    try {
        const { rows } = await db.query(`
            UPDATE resources
            SET status = $1, last_updated = CURRENT_TIMESTAMP
            WHERE resource_id = $2
            RETURNING *
        `, [status, id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE /api/resources/:id
app.delete('/api/resources/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await db.query(`DELETE FROM resources WHERE resource_id = $1`, [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Resource not found' });
        res.json({ message: 'Resource deleted' });
    } catch (err) {
        console.error('DELETE RESOURCE ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- INCIDENTS API ---

// GET /api/incidents
app.get('/api/incidents', async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT 
                incident_id as id,
                incident_type as type,
                severity,
                status,
                latitude,
                longitude,
                created_by,
                created_at as time
            FROM incidents
            ORDER BY created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('GET INCIDENTS ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /api/incidents
app.post('/api/incidents', async (req, res) => {
    const { type, severity, status, latitude, longitude, created_by } = req.body;
    try {
        const { rows } = await db.query(`
            INSERT INTO incidents (incident_type, severity, status, latitude, longitude, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING 
                incident_id as id,
                incident_type as type,
                severity,
                status,
                latitude,
                longitude,
                created_by,
                created_at as time
        `, [type, severity, status || 'Active', latitude, longitude, created_by]);
        res.json(rows[0]);
    } catch (err) {
        console.error('POST INCIDENT ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT /api/incidents/:id (Update status/severity)
app.put('/api/incidents/:id', async (req, res) => {
    const { id } = req.params;
    const { status, severity } = req.body;
    try {
        const { rows } = await db.query(`
            UPDATE incidents
            SET 
                status = COALESCE($1, status),
                severity = COALESCE($2, severity)
            WHERE incident_id = $3
            RETURNING 
                incident_id as id,
                incident_type as type,
                severity,
                status,
                latitude,
                longitude,
                created_by,
                created_at as time
        `, [status, severity, id]);
        res.json(rows[0]);
    } catch (err) {
        console.error('PUT INCIDENT ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- END INCIDENTS API ---

// --- TASKS API ---

// GET /api/tasks
app.get('/api/tasks', async (req, res) => {
    const { volunteer_id } = req.query;
    try {
        let query = `
            SELECT t.task_id as id, t.incident_id, i.incident_type, t.description, t.urgency_level as urgency, t.status, t.required_skills, t.task_type, t.latitude, t.longitude,
                   COALESCE(
                       json_agg(
                           json_build_object(
                               'assignment_id', ta.assignment_id, 
                               'volunteer_id', ta.volunteer_id, 
                               'status', ta.status,
                               'volunteer_name', u.full_name
                           )
                       ) FILTER (WHERE ta.assignment_id IS NOT NULL), '[]'
                   ) as assignments
            FROM tasks t
            LEFT JOIN incidents i ON t.incident_id = i.incident_id
            LEFT JOIN task_assignments ta ON t.task_id = ta.task_id
            LEFT JOIN users u ON ta.volunteer_id = u.user_id
        `;
        let params = [];
        
        if (volunteer_id) {
            // Ensure ID comparison is robust
            query += ` WHERE EXISTS (SELECT 1 FROM task_assignments sq WHERE sq.task_id = t.task_id AND (sq.volunteer_id = $1 OR sq.volunteer_id::text = $1::text))`;
            params.push(volunteer_id);
        }
        
        query += ` GROUP BY t.task_id, i.incident_type ORDER BY t.created_at DESC`;
        
        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('GET TASKS ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /api/tasks (Create a task)
app.post('/api/tasks', async (req, res) => {
    const { incident_id, description, urgency, required_skills, task_type, latitude, longitude } = req.body;
    try {
        const { rows } = await db.query(`
            INSERT INTO tasks (incident_id, description, urgency_level, status, task_type, latitude, longitude)
            VALUES ($1, $2, $3, 'Open', $4, $5, $6)
            RETURNING task_id as id, incident_id, description, urgency_level as urgency, status, required_skills, task_type, latitude, longitude
        `, [incident_id || null, description, urgency, task_type || 'General Support', latitude || null, longitude || null]);
        res.json(rows[0]);
    } catch (err) {
        console.error('POST TASK ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /api/tasks/:id/assign (Assign task to multiple volunteers)
app.post('/api/tasks/:id/assign', async (req, res) => {
    const { id } = req.params;
    const { volunteer_ids, assigned_by } = req.body;
    try {
        await db.query('BEGIN');
        
        // Fetch task details for the email payload
        const taskResult = await db.query(`
            SELECT t.description, t.urgency_level as urgency, t.task_type, i.incident_type
            FROM tasks t
            LEFT JOIN incidents i ON t.incident_id = i.incident_id
            WHERE t.task_id = $1
        `, [id]);
        const taskData = taskResult.rows[0] || {};

        // Use globally instantiated Ethereal transporter
        console.log("\n=================== DISPATCHING EMAILS ===================");

        for (let vol_id of volunteer_ids) {
            await db.query(`
                INSERT INTO task_assignments (task_id, volunteer_id, assigned_by, status)
                VALUES ($1, $2, $3, 'Assigned')
                ON CONFLICT (task_id, volunteer_id) DO NOTHING
            `, [id, vol_id, assigned_by]);
            
            // Notify the volunteer internally
            await db.query(`
                INSERT INTO notifications (user_id, message, type)
                VALUES ($1, $2, 'Task')
            `, [vol_id, `You have been assigned to a new task (${taskData.task_type}). Check your inbox.`]);
            
            // Fetch volunteer details for email
            const volResult = await db.query('SELECT full_name, email FROM users WHERE user_id = $1', [vol_id]);
            const volunteer = volResult.rows[0];

            if (volunteer) {
                try {
                    // Send real or simulated email
                    let info = await transporter.sendMail({
                        from: '"CrisisConnect Command" <dispatch@crisisconnect.ca>',
                        to: volunteer.email,
                        subject: `🚨 URGENT DEPLOYMENT: ${taskData.urgency} Priority Tasks`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #d32f2f; border-top: 5px solid #d32f2f;">
                                <h2 style="color: #d32f2f;">Deployment Activation</h2>
                                <p><strong>Hello ${volunteer.full_name},</strong></p>
                                <p>You have been urgently requested for an active response operation. Please review the details below:</p>
                                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                    <tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa;"><strong>Incident:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${taskData.incident_type || 'General Support Task'}</td></tr>
                                    <tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa;"><strong>Task Type:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${taskData.task_type}</td></tr>
                                    <tr><td style="padding: 8px; border: 1px solid #ddd; background: #fafafa;"><strong>Objectives:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${taskData.description}</td></tr>
                                </table>
                                <p>Please log in immediately to the <a href="http://localhost:5173/tasks">CrisisConnect Task Dashboard</a> to <strong>Accept</strong> or <strong>Reject</strong> this deployment.</p>
                                <p style="font-size: 0.8rem; color: gray;">This is an automated dispatch from CrisisConnect Canada.</p>
                            </div>
                        `
                    });
                    
                    console.log(`✉️ Email Sent to ${volunteer.full_name}`);
                    if (nodemailer.getTestMessageUrl(info)) {
                        console.log(`🔗 VIEW EMAIL LIVE: ${nodemailer.getTestMessageUrl(info)}\n`);
                    }
                } catch (emailErr) {
                    console.error(`⚠️ Failed to send email to ${volunteer.full_name}:`, emailErr.message);
                }
            }
        }
        
        console.log("==========================================================\n");

        
        // Update task status to Assigned
        await db.query(`UPDATE tasks SET status = 'Assigned' WHERE task_id = $1`, [id]);
        
        await db.query('COMMIT');
        res.json({ message: 'Mass assignment completed' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('ASSIGN TASK ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT /api/tasks/assignments/:assignment_id (Update Assignment Status - Accept/Complete)
app.put('/api/tasks/assignments/:assignment_id', async (req, res) => {
    const { assignment_id } = req.params;
    const { status, task_id } = req.body; // 'Accepted', 'Completed', 'Rejected'
    try {
        if (status === 'Rejected') {
            await db.query(`DELETE FROM task_assignments WHERE assignment_id = $1`, [assignment_id]);
            await db.query(`UPDATE tasks SET status = 'Open' WHERE task_id = $1`, [task_id]);
            res.json({ message: 'Assignment rejected' });
            return;
        }

        const { rows } = await db.query(`
            UPDATE task_assignments
            SET status = $1
            WHERE assignment_id = $2
            RETURNING *
        `, [status, assignment_id]);
        
        // If completed or accepted, mirror to task
        if (status === 'Completed' || status === 'In Progress') {
             await db.query(`UPDATE tasks SET status = $1 WHERE task_id = $2`, [status, task_id]);
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('UPDATE ASSIGNMENT ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- END TASKS API ---

// --- NOTIFICATIONS API ---
// GET /api/notifications
app.get('/api/notifications', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });
    try {
        const { rows } = await db.query(`
            SELECT notification_id as id, message, type, is_read, created_at
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        `, [user_id]);
        res.json(rows);
    } catch (err) {
        console.error('GET NOTIFICATIONS ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT /api/notifications/:id/read
app.put('/api/notifications/:id/read', async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(`
            UPDATE notifications
            SET is_read = TRUE
            WHERE notification_id = $1
            RETURNING *
        `, [id]);
        res.json(rows[0]);
    } catch (err) {
        console.error('UPDATE NOTIFICATION ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});
// --- END NOTIFICATIONS API ---

// --- USERS API ---
// GET /api/users
app.get('/api/users', async (req, res) => {
    const { role } = req.query;
    try {
        let query = `
            SELECT u.user_id, u.full_name as name, u.email, r.role_name as role, u.phone, u.location, u.skills 
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
        `;
        let params = [];
        if (role) {
            query += ` WHERE r.role_name = $1`;
            params.push(role);
        }
        const { rows } = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('GET USERS ERROR:', err);
        res.status(500).json({ error: 'Database error' });
    }
});
// --- END USERS API ---

// REGISTER
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // 1. Get Role ID
        const roleResult = await db.query('SELECT role_id FROM roles WHERE role_name = $1', [role]);
        let role_id;
        if (roleResult.rows.length === 0) {
            // Default to Volunteer if not found (or handle error)
            const defaultRole = await db.query("SELECT role_id FROM roles WHERE role_name = 'Volunteer'");
            role_id = defaultRole.rows[0].role_id;
        } else {
            role_id = roleResult.rows[0].role_id;
        }

        // 2. Insert User
        const { rows } = await db.query(`
            INSERT INTO users (full_name, email, password_hash, role_id)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, full_name, email, role_id
        `, [name, email, password, role_id]); // Storing plain text password for demo simplicity

        const newUser = rows[0];
        newUser.role = role; // Send back the role name for frontend context

        res.json(newUser);
    } catch (err) {
        console.error('REGISTER ERROR:', err);
        console.error('Input Data:', { name, email, role });
        if (err.code === '23505') { // Unique violation (email)
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Database error: ' + err.message });
        }
    }
});

// LOGIN (Simple Mock-check against DB)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; // Added password check
    try {
        const { rows } = await db.query(`
            SELECT u.user_id, u.full_name, u.email, u.password_hash, r.role_name as role 
            FROM users u
            JOIN roles r ON u.role_id = r.role_id
            WHERE email = $1
        `, [email]);

        if (rows.length > 0) {
            const user = rows[0];
            // Simple password check for demo (plain text)
            if (user.password_hash === password) {
                delete user.password_hash; // Don't send password back
                res.json(user);
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB connection failed' });
    }
});

// FORGOT PASSWORD (Mock)
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        // In a real app, generate a token, save to DB, and send an email via SendGrid/AWS SES.
        // For this demo, we just verify if user exists (optional) and return success.
        const { rows } = await db.query('SELECT user_id FROM users WHERE email = $1', [email]);
        
        // Wait briefly to simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (rows.length > 0) {
            console.log(`[Mock Email] Password reset link sent to: ${email}`);
        } else {
            console.log(`[Mock Email] Requested reset for non-existent email: ${email}`);
        }

        // Always return success to prevent email enumeration
        res.json({ message: 'If an account with that email exists, we have sent a password reset link.' });
    } catch (err) {
        console.error('FORGOT PASSWORD ERROR:', err);
        res.status(500).json({ error: 'Failed to process request' });
    }
});


const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`ERROR: Port ${PORT} is already in use by another process.`);
        console.error('The backend could not start. Please kill existing node processes and try again.');
        process.exit(1);
    } else {
        console.error('SERVER ERROR:', err);
    }
});

process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
