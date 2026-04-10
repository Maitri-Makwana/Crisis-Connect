const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/Tasks.jsx',
    'src/pages/Resources.jsx',
    'src/pages/MapPage.jsx',
    'src/pages/ForgotPassword.jsx',
    'src/pages/Dashboard.jsx',
    'src/pages/ActiveResponses.jsx',
    'src/context/AuthContext.jsx',
    'src/components/NearbyFoodBanks.jsx',
    'src/components/Navbar.jsx'
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Add import statement at the beginning
    if (!content.includes('import { API_URL }')) {
        // If it's in components, pages, or context, it's one level deep from src (e.g., src/pages)
        // config.js is in src/config.js. So from src/pages, it's '../config'
        content = `import { API_URL } from '../config';\n` + content;
    }

    // Replace 'http://localhost:5000/api...' with `${API_URL}/api...`
    // First pass: replace static string literals (single quotes)
    content = content.replace(/'http:\/\/localhost:5000\/api([^']*)'/g, '`${API_URL}/api$1`');
    
    // Second pass: replace instances within existing template literals
    content = content.replace(/http:\/\/localhost:5000\/api/g, '${API_URL}/api');

    fs.writeFileSync(fullPath, content);
    console.log('Updated: ' + file);
});
