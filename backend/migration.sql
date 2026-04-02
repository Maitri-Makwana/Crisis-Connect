-- Migration: Align schema columns with server.js queries
-- Run this in Supabase SQL Editor

-- TASKS: rename task_type -> description, urgency -> urgency_level, add required_skills
ALTER TABLE tasks RENAME COLUMN task_type TO description;
ALTER TABLE tasks RENAME COLUMN urgency TO urgency_level;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_urgency_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_urgency_level_check CHECK (urgency_level IN ('Low', 'Medium', 'High', 'Critical'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS required_skills TEXT;

-- TASK_ASSIGNMENTS: rename assignment_status -> status, add assigned_by
ALTER TABLE task_assignments RENAME COLUMN assignment_status TO status;
ALTER TABLE task_assignments DROP CONSTRAINT IF EXISTS task_assignments_assignment_status_check;
ALTER TABLE task_assignments ADD CONSTRAINT task_assignments_status_check CHECK (status IN ('Assigned', 'Accepted', 'In Progress', 'Completed', 'Rejected'));
ALTER TABLE task_assignments ALTER COLUMN status SET DEFAULT 'Assigned';
ALTER TABLE task_assignments ADD COLUMN IF NOT EXISTS assigned_by INT REFERENCES users(user_id);

-- NOTIFICATIONS: rename notification_type -> type
ALTER TABLE notifications RENAME COLUMN notification_type TO type;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_notification_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('Email', 'In-App', 'SMS', 'Task'));

-- USERS: Add columns used in /api/users endpoint
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT;

-- Backfill: Copy full_name -> name for existing users
UPDATE users SET name = full_name WHERE name IS NULL;

-- TASKS: Update status constraint to include 'Pending'
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('Open', 'Pending', 'Assigned', 'In Progress', 'Completed'));
ALTER TABLE tasks ALTER COLUMN status SET DEFAULT 'Pending';
