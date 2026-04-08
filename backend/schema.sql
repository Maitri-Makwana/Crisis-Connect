-- Rerun this entire script in your Supabase SQL Editor to set up the strict schema

-- ROLES
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(30) UNIQUE NOT NULL
);

INSERT INTO roles (role_name)
VALUES ('Admin'), ('Coordinator'), ('Volunteer')
ON CONFLICT (role_name) DO NOTHING;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    skills TEXT,
    role_id INT REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INCIDENTS
CREATE TABLE IF NOT EXISTS incidents (
    incident_id SERIAL PRIMARY KEY,
    incident_type VARCHAR(50) NOT NULL,
    severity INT CHECK (severity BETWEEN 1 AND 5),
    status VARCHAR(20) CHECK (status IN ('Active', 'Resolved')) NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RESOURCES
CREATE TABLE IF NOT EXISTS resources (
    resource_id SERIAL PRIMARY KEY,
    incident_id INT REFERENCES incidents(incident_id) ON DELETE CASCADE,
    resource_name VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) CHECK (
        status IN ('Available', 'Low', 'Full', 'Closed')
    ),
    quantity INT,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    contact_info VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
    task_id SERIAL PRIMARY KEY,
    incident_id INT REFERENCES incidents(incident_id),
    task_type VARCHAR(100) NOT NULL,
    urgency VARCHAR(20) CHECK (
        urgency IN ('Low', 'Medium', 'High', 'Critical')
    ),
    status VARCHAR(20) CHECK (
        status IN ('Open', 'Assigned', 'In Progress', 'Completed')
    ),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TASK ASSIGNMENTS
CREATE TABLE IF NOT EXISTS task_assignments (
    assignment_id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(task_id) ON DELETE CASCADE,
    volunteer_id INT REFERENCES users(user_id),
    assigned_by INT REFERENCES users(user_id),
    assignment_status VARCHAR(20) CHECK (
        assignment_status IN ('Assigned', 'Accepted', 'In Progress', 'Completed', 'Rejected')
    ),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    message TEXT NOT NULL,
    type VARCHAR(20) CHECK (
        type IN ('Email', 'In-App', 'SMS', 'Task')
    ),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA
INSERT INTO users (full_name, email, password_hash, phone, role_id)
VALUES
('System Admin', 'admin@crisisconnect.com', 'hashed_secret', '416-000-0001', 1),
('Maitri Makwana', 'maitri.coord@crisisconnect.com', 'hashed_secret', '416-000-0002', 2),
('Shivani Patel', 'shivani.coord@crisisconnect.com', 'hashed_secret', '416-000-0003', 2),
('Jalpan Patel', 'jalpan.coord@crisisconnect.com', 'hashed_secret', '416-000-0003', 2),
('John Volunteer', 'john.vol@crisisconnect.com', 'hashed_secret', '416-000-0004', 3),
('Sara Volunteer', 'sara.vol@crisisconnect.com', 'hashed_secret', '416-000-0005', 3),
('Mike Volunteer', 'mike.vol@crisisconnect.com', 'hashed_secret', '416-000-0006', 3)
ON CONFLICT (email) DO NOTHING;
