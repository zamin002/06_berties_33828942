# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS users (
    id     INT AUTO_INCREMENT,
    username     VARCHAR(50) NOT NULL UNIQUE,
    first_name     VARCHAR(50) NOT NULL,
    last_name     VARCHAR(50) NOT NULL,
    email     VARCHAR(255) NOT NULL,
    hashedPassword     VARCHAR(255) NOT NULL,
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS login_audit (
    id     INT AUTO_INCREMENT,
    username     VARCHAR(50),
    success     INT(1) NOT NULL,
    ip_address     VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );    
    
# Create the application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON berties_books.* TO ' berties_books_app'@'localhost';
