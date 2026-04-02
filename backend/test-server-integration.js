// Set a different port to avoid conflicts if zombie exists
process.env.PORT = 5001;

const path = require('path');
// Manually load dotenv before requiring server
require('dotenv').config({ path: path.join(__dirname, '.env') });

const http = require('http');

console.log('Starting server in-process...');
// Requiring server.js will execute it and start listening
try {
    require('./server');
} catch (e) {
    console.error('Failed to require server:', e);
}

// Wait for server to start
setTimeout(() => {
    console.log('Sending request to localhost:5001...');

    const data = JSON.stringify({
        name: "Integration Test User",
        email: `integration_${Date.now()}@test.com`,
        password: "password123",
        role: "Volunteer"
    });

    const options = {
        hostname: 'localhost',
        port: 5001,
        path: '/api/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('BODY:', body);
            process.exit(0);
        });
    });

    req.on('error', (e) => {
        console.error('REQUEST ERROR:', e);
        process.exit(1);
    });

    req.write(data);
    req.end();
}, 3000);
