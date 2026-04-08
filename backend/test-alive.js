const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Nodemailer Ethereal test account
let transporter;
const initializeTransporter = async () => {
    try {
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
        console.log('Nodemailer initialized with Ethereal Email');
    } catch (err) {
        console.error('Failed to create a testing account. ' + err.message);
    }
};

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function start() {
    await initializeTransporter();
    
    app.listen(PORT, (err) => {
        if (err) {
            console.error('SERVER FAILED TO START:', err);
            return;
        }
        console.log(`HEALTH CHECK: Server listening on port ${PORT}`);
    });
}

// Keep it alive forcibly
setInterval(() => {
    // heartbeat
}, 10000);

start();
