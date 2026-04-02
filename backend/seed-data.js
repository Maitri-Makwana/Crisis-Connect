const db = require('./db');

const firstNames = ["James", "Marie", "Ali", "David", "Sarah", "Emily", "Wei", "Chloe", "Mohamed", "Sofia", "Liam", "Olivia", "Noah", "Emma", "Jackson", "Ava", "Lucas", "Charlotte", "Ethan", "Amelia", "Logan", "Mia", "Jacob", "Harper", "Oliver", "Evelyn", "Daniel", "Abigail", "Matthew", "Emily", "Henry", "Elizabeth", "Joseph", "Mila", "Samuel", "Avery", "Sebastian", "Ella", "Jack", "Madison", "John", "Scarlett", "Luke", "Victoria", "Jayden", "Aria", "Dylan", "Grace", "Levi"];
const lastNames = ["Smith", "Dubois", "Tremblay", "Khan", "Johnson", "Brown", "Taylor", "Roy", "Gagnon", "Lee", "Martin", "Morin", "White", "Anderson", "Pelletier", "Singh", "Chen", "Wang", "Bouchard", "Gauthier", "Li", "Jones", "Williams", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young"];

const locations = [
    "Toronto, ON", "Vancouver, BC", "Montreal, QC", "Calgary, AB", "Halifax, NS", 
    "Edmonton, AB", "Ottawa, ON", "Winnipeg, MB", "Quebec City, QC", "Victoria, BC"
];
const skills = [
    "First Aid, CPR", "Heavy Equipment Ops", "Logistics", "Search & Rescue", "Medical (RN)", 
    "Communications", "Shelter Management", "Driving (Class 1)", "Translation", "IT Support"
];

const incidents = [
    { type: "Extreme Heat (Above Safe Threshold)", severity: 4, status: "Active", lat: 50.233, lon: -121.583, created_by: null }, // Lytton, BC
    { type: "Gas Shortage & Supply Chain Failure", severity: 3, status: "Active", lat: 44.648, lon: -63.575, created_by: null }, // Halifax, NS
    { type: "City-wide Blackout During Peak Hours", severity: 5, status: "Active", lat: 43.653, lon: -79.383, created_by: null }, // Toronto, ON
    { type: "Wildfire Evacuation Zone", severity: 5, status: "Active", lat: 56.726, lon: -111.380, created_by: null }, // Fort McMurray, AB
    { type: "Severe Winter Ice Storm", severity: 4, status: "Active", lat: 45.501, lon: -73.567, created_by: null }, // Montreal, QC
    { type: "Catastrophic River Flooding", severity: 4, status: "Active", lat: 49.050, lon: -122.328, created_by: null }, // Abbotsford, BC
    { type: "Tsunami Warning Protocol", severity: 5, status: "Active", lat: 49.153, lon: -125.906, created_by: null }, // Tofino, BC
    { type: "Industrial Chemical Spill", severity: 4, status: "Active", lat: 42.974, lon: -82.406, created_by: null }, // Sarnia, ON
    { type: "High-Altitude Avalanche", severity: 3, status: "Active", lat: 50.116, lon: -122.957, created_by: null }, // Whistler, BC
    { type: "Tornado Touchdown Warning", severity: 4, status: "Active", lat: 50.445, lon: -104.618, created_by: null }  // Regina, SK
];

async function seedData() {
    try {
        console.log("Seeding data... This may take a moment.");

        // 1. Get Volunteer Role ID
        const roleRes = await db.query("SELECT role_id FROM roles WHERE role_name = 'Volunteer'");
        if (roleRes.rows.length === 0) throw new Error("Volunteer role not found!");
        const roleId = roleRes.rows[0].role_id;

        // 2. Insert 50 Users
        for (let i = 0; i < 50; i++) {
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@crisisconnect.com`;
            const phone = `+1 555 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;
            const location = locations[Math.floor(Math.random() * locations.length)];
            const skill = skills[Math.floor(Math.random() * skills.length)];

            // Ignore if email duplicates
            await db.query(`
                INSERT INTO users (full_name, email, password_hash, role_id, phone, location, skills)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (email) DO NOTHING
            `, [`${fName} ${lName}`, email, 'hashed_secret', roleId, phone, location, skill]);
        }
        console.log("✅ 50 Volunteers seeded successfully.");

        // 3. Get Admin User ID for created_by
        const adminRes = await db.query("SELECT user_id FROM users WHERE role_id = (SELECT role_id FROM roles WHERE role_name = 'Admin') LIMIT 1");
        const adminId = adminRes.rows.length > 0 ? adminRes.rows[0].user_id : null;

        // 4. Insert 10 Authentic Incidents
        for (const inc of incidents) {
            await db.query(`
                INSERT INTO incidents (incident_type, severity, status, latitude, longitude, created_by)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [inc.type, inc.severity, inc.status, inc.lat, inc.lon, adminId]);
        }
        console.log("✅ 10 Realistic Canadian Incidents seeded successfully.");

        console.log("Database Seeding Complete!");
        process.exit(0);

    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
}

seedData();
