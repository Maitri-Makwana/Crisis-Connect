# 🚨 Crisis Connect

**Crisis Connect** is a real-time emergency management and coordination platform built for Capstone Project. It enables Admins, Coordinators, and Volunteers to collaborate efficiently during crisis events.

## 🌟 Features

- **Role-Based Dashboards** — Distinct UIs for Admin, Coordinator, and Volunteer roles
- **Incident Management** — Create, track, and resolve emergency incidents
- **Resource Inventory** — Manage shelters, food banks, and medical supplies with live status
- **Live Operations Map** — Real-time map using React-Leaflet with color-coded markers
- **Task Assignment System** — Coordinators assign tasks; volunteers accept/reject/complete them
- **Real-Time Notifications** — Supabase WebSockets push instant alerts to the Navbar bell
- **Email Notifications** — NodeMailer triggers an email when a task is assigned to a volunteer
- **Nearby Food Banks Widget** — Locates the closest resources using the browser Geolocation API and Haversine distance calculation
- **ODHF Healthcare Demo Map** — Visualizes official Canadian health facility data from Statistics Canada's Open Database of Healthcare Facilities

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React + Vite, React-Leaflet, Lucide |
| Backend   | Node.js + Express                   |
| Database  | PostgreSQL (via Supabase)           |
| Real-time | Supabase Realtime WebSockets        |
| Email     | NodeMailer + Ethereal Email         |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Supabase project with the schema applied (see `backend/schema.sql`)

### Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Harshilkumar-Rao/Crisis-Management-.git
   cd Crisis-Management-
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `backend/.env` file:
   ```
   DATABASE_URL=your_supabase_postgresql_connection_string
   PORT=5000
   ```
   Start the backend:
   ```bash
   npx nodemon server.js
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `frontend/.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

---

## 👥 Team

| Name | Role |
|------|------|
| Maitri Makwana | Project Lead / Frontend Developer |
| Harshil Rao | Backend Developer / Admin |
| Shivani Patel | Quality Assurance / Documentation |
| Jalpan Patel | System Design / Research |

---

## 📚 Data Sources

- **ODHF:** [Open Database of Healthcare Facilities](https://www.statcan.gc.ca/en/lode/databases/odhf) — Statistics Canada
