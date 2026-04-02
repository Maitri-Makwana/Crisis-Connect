Remove-Item .git -Recurse -Force -ErrorAction SilentlyContinue

git init

git add .gitignore README.md frontend/package.json frontend/package-lock.json frontend/eslint.config.js frontend/vite.config.js frontend/index.html
git commit -m "Initial setup: Add project configuration and core module architectures"

git add backend/package.json backend/package-lock.json backend/server.js backend/db.js backend/.gitignore
git commit -m "Initialize Node backend and Supabase database connection pooling"

git add backend/schema.sql backend/migration.sql backend/init-db.js backend/test-db-connection.js backend/test-server-integration.js alter_db.js backend/debug-register.js
git commit -m "Define PostgreSQL relational schema and validation layers"

git add frontend/src/App.jsx frontend/src/main.jsx frontend/src/index.css frontend/src/context/AuthContext.jsx frontend/src/components/ProtectedRoute.jsx
git commit -m "Implement global Authentication Context and secure routing"

git add frontend/src/components/Navbar.jsx frontend/src/assets/ frontend/public/
git commit -m "Develop shared UI navigation frameworks and visual assets"

git add frontend/src/pages/Home.jsx frontend/src/pages/About.jsx frontend/src/pages/Contact.jsx frontend/src/pages/Services.jsx
git commit -m "Engineer robust landing pages for public information routing"

git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx frontend/src/pages/ForgotPassword.jsx frontend/src/pages/Unauthorized.jsx
git commit -m "Construct responsive identity verification views"

git add frontend/src/supabaseClient.js
git commit -m "Inject Supabase Client SDK for external user management"

git add frontend/src/pages/Dashboard.jsx
git commit -m "Build advanced Coordinator command metrics Dashboard"

git add frontend/src/pages/ActiveResponses.jsx
git commit -m "Develop real-time Incident Tracking with Nominatim geocoding"

git add frontend/src/pages/Tasks.jsx frontend/src/components/Members.jsx
git commit -m "Introduce group-task assignment protocol for volunteer logistics"

git add frontend/src/pages/MapPage.jsx frontend/src/pages/DemoMap.jsx
git commit -m "Deploy geospatial operations interface with reverse-geocoding"

git add frontend/src/pages/Resources.jsx frontend/src/pages/Training.jsx
git commit -m "Construct organizational Resource Registry and Training modules"

git add frontend/src/pages/Donate.jsx frontend/src/components/DonationModal.jsx frontend/src/components/FakeDonationToast.jsx frontend/src/components/NearbyFoodBanks.jsx frontend/src/data/odhf_sample.json
git commit -m "Assemble global Donation systems and emergency notifications"

git add backend/seed-data.js
git commit -m "Architect comprehensive payload simulations for Canadian emergencies"

git add .
git commit -m "Final integration polish and artifact inclusion"

git branch -M main
git remote add origin https://github.com/Maitri-Makwana/Crisis-Connect.git
