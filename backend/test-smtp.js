const nodemailer = require('nodemailer');

async function testAuth(user, pass) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });
    try {
        await transporter.verify();
        console.log(`✅ Success for ${user} with pass ${pass}`);
        process.exit(0);
    } catch(err) {
        console.error(`❌ Failed for ${pass}: ${err.message}`);
    }
}

async function run() {
    console.log("Testing password 1...");
    await testAuth('maitrimakwana2425@gmail.com', 'hkybuxgtwghhpcpk');
    console.log("Testing password 2...");
    await testAuth('maitrimakwana2425@gmail.com', 'pugrnqzalvfjtmfe');
    process.exit(1);
}

run();
