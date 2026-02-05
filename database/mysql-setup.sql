-- ================================================================
-- Database Setup Script for Expense Tracker
-- ================================================================
-- This script creates the database, user, and tables
-- Run this script with a MySQL root user or admin privileges
-- ================================================================

-- Drop existing database if you want a fresh start (CAUTION: This deletes all data)
-- DROP DATABASE IF EXISTS expensedb;

-- ================================================================
-- Create Database
-- ================================================================
CREATE DATABASE IF NOT EXISTS expensedb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE expensedb;

-- ================================================================
-- Create Database User (Production Setup)
-- ================================================================
-- Drop user if exists to avoid errors on re-run
DROP USER IF EXISTS 'expense_user'@'localhost';

-- Create new user with secure password
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'expense_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON expensedb.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;

-- ================================================================
-- Create Users Table
-- ================================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- Create Expenses Table
-- ================================================================
CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(19,2) NOT NULL CHECK (amount >= 0),
    category VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expense_date (expense_date),
    INDEX idx_user_date (user_id, expense_date),
    INDEX idx_category (category),
    INDEX idx_amount (amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- Verify Tables Created
-- ================================================================
SHOW TABLES;

SELECT 'Database setup completed successfully!' AS Status;
SELECT CONCAT('Tables created: ', COUNT(*)) AS Info 
FROM information_schema.tables 
WHERE table_schema = 'expensedb';