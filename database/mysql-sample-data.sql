-- ================================================================
-- Sample Data Script for Expense Tracker
-- ================================================================
-- This script creates sample users and expenses for testing
-- Run this after setting up the database with mysql-setup.sql
-- ================================================================

USE expensedb;

-- ================================================================
-- Clear existing data (optional - uncomment if you want to reset)
-- ================================================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE expenses;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ================================================================
-- Sample Users
-- ================================================================
-- Note: All passwords are bcrypt hashed
-- Password for all users: "Password123"
-- Correct BCrypt hash generated with BCryptPasswordEncoder (strength 10)

-- Delete existing sample users first to avoid duplicates
DELETE FROM users WHERE email IN (
    'john.doe@example.com',
    'jane.smith@example.com', 
    'bob.johnson@example.com',
    'alice.williams@example.com',
    'admin@expensetracker.com'
);

-- Insert fresh users with correct password hash
INSERT INTO users (email, password, first_name, last_name, created_at) VALUES
('john.doe@example.com', '$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKMSZ9.mP9vpMu0ssKi8GW', 'John', 'Doe', NOW()),
('jane.smith@example.com', '$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKMSZ9.mP9vpMu0ssKi8GW', 'Jane', 'Smith', NOW()),
('bob.johnson@example.com', '$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKMSZ9.mP9vpMu0ssKi8GW', 'Bob', 'Johnson', NOW()),
('alice.williams@example.com', '$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKMSZ9.mP9vpMu0ssKi8GW', 'Alice', 'Williams', NOW()),
('admin@expensetracker.com', '$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKMSZ9.mP9vpMu0ssKi8GW', 'Admin', 'User', NOW());