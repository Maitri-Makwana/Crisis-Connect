# Implementation Plan - Core Platform Features

The goal is to implement a comprehensive suite of Emergency Response features utilizing the existing Supabase PostgreSQL schema.

## Proposed Changes

### Phase 1: Real-Time Infrastructure & Auth (Foundation)
- **Supabase Client**: Initialize `@supabase/supabase-js` on the frontend for Realtime subscriptions (WebSockets) to automatically refresh data when the database changes.
- **Forgot Password**: Implement a basic password reset flow (UI + Backend logic).
- **Role-Based Dashboards**: Refine [Dashboard.jsx](file:///c:/Users/maitr/OneDrive/Desktop/CrisisConnectWebsite/frontend/src/pages/Dashboard.jsx) to show different views based on role (Admin vs Coordinator vs Volunteer).

### Phase 2: Incident Management
- **Backend**: Create CRUD endpoints for `incidents` (`GET`, `POST`, `PUT` /api/incidents).
- **Frontend**: 
  - Update [ActiveResponses.jsx](file:///c:/Users/maitr/OneDrive/Desktop/CrisisConnectWebsite/frontend/src/pages/ActiveResponses.jsx) to fetch live incidents from the backend.
  - Create a modal/page to "Create New Incident" (Coordinator/Admin only).
  - Add "Incident Detail" view with editing capabilities (Status: Active/Resolved).

### Phase 3: Resource Management & Live Map
- **Backend**: Add `DELETE /api/resources/:id` endpoint.
- **Frontend (Resources)**: Ensure [Resources.jsx](file:///c:/Users/maitr/OneDrive/Desktop/CrisisConnectWebsite/frontend/src/pages/Resources.jsx) supports full CRUD operations reflecting the DB standard statuses (`Available`, `Low`, `Full`, `Closed`).
- **Frontend (Live Map)**: 
  - Update [MapPage.jsx](file:///c:/Users/maitr/OneDrive/Desktop/CrisisConnectWebsite/frontend/src/pages/MapPage.jsx) to fetch live resources and incidents.
  - Implement Leaflet or equivalent map markers changing color based on status (e.g., Green=Available, Red=Low/Closed).
  - Add filter controls (by type, by status) to the map UI.
  - Connect Map to Supabase Realtime to update markers without page refresh.

### Phase 4: Volunteer Workflow & Tasks
- **Backend**: 
  - Create endpoints for `tasks` (Create, List, Update status).
  - Create endpoints for `task_assignments` (Assign volunteer, updates from volunteer).
- **Frontend (Coordinator View)**:
  - UI to Create Task, set Urgency (Low/Medium/High), and map to an Incident.
  - UI to Assign volunteers to tasks and monitor live progress.
- **Frontend (Volunteer View)**:
  - Volunteer Dashboard showing assigned tasks.
  - Buttons to Accept/Reject and update status (In Progress, Completed).

### Phase 5: Notifications System
- **Backend**: Add an endpoint to fetch/create notifications (`/api/notifications`).
- **Frontend**: 
  - Add a Notification Bell to [Navbar.jsx](file:///c:/Users/maitr/OneDrive/Desktop/CrisisConnectWebsite/frontend/src/components/Navbar.jsx) with a dropdown menu displaying unread notifications.
  - Implement triggers: Generate a notification when a task is assigned to a volunteer, or when an incident status changes.
  - Setup basic email simulation (or real email if SMTP is provided) for urgent alerts.

### Phase 7: Email & Proximity Features
- **Email/SMS Simulation**: Integrate `nodemailer` with Ethereal Email (a free testing service) on the backend. When a task is assigned to a volunteer, the backend will generate and log an email with a preview URL.
- **Nearby Food Banks & Resources**:
  - Add `GET /api/resources/nearby` endpoint calculating geospatial distance (Haversine formula) in PostgreSQL to sort and return nearest resources.
  - Frontend: Create a 'Find Nearby Resources' widget in the User/Volunteer dashboard that prompts the user for their browser `Geolocation` (lat/lng), then displays the closest food banks and shelters.

### Phase 8: ODHF Healthcare Facilities Demo
- **Dataset Integration**: Instead of downloading the massive 15MB+ ODHF CSV file directly in the browser (which causes performance and CORS issues), we will extract a curated subset of real Canadian Healthcare Facilities from the ODHF dataset into a local JSON file (`odhf_sample.json`).
- **Demo Map Component**: Create a standalone `DemoMap.jsx` page (accessible at `/demo-map`).
- **Visualization**: Use `react-leaflet` to read the local ODHF JSON dataset and plot the healthcare facilities as distinct markers on a map, proving the concept of integrating government Open Data.

## Verification Plan

### Manual Verification
- **Auth**: Test role switching, verify dashboard UI restricts access appropriately.
- **Workflow**: Assign tasks to volunteers and verify Email Preview links are generated in the backend console.
- **Proximity**: Allow browser location access on the dashboard, verify it returns resources sorted correctly by distance.
- **ODHF Demo**: Navigate to `/demo-map` and verify the map successfully plots the curated Canadian healthcare facilities from the static JSON dataset.
