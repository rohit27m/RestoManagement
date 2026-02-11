CREATE DATABASE IF NOT EXISTS restaurant_management;
USE restaurant_management;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS restaurant_info;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('waiter', 'chef', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_info (
  id INT PRIMARY KEY CHECK(id = 1),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  tax_rate DECIMAL(5,2) DEFAULT 0
);

CREATE TABLE menu_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  half_price DECIMAL(10,2),
  full_price DECIMAL(10,2) NOT NULL,
  available BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tables (
  id INT PRIMARY KEY AUTO_INCREMENT,
  table_number INT UNIQUE NOT NULL,
  capacity INT DEFAULT 4,
  status ENUM('available', 'occupied', 'reserved') DEFAULT 'available'
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  table_id INT NOT NULL,
  waiter_id INT NOT NULL,
  status ENUM('pending', 'preparing', 'ready', 'served', 'completed') DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (waiter_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  `portion` ENUM('half', 'full') NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'preparing', 'ready') DEFAULT 'pending',
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$10$YourHashedPasswordHere1', 'admin'),
('waiter1', '$2b$10$YourHashedPasswordHere2', 'waiter'),
('chef1', '$2b$10$YourHashedPasswordHere3', 'chef');

INSERT INTO restaurant_info (id, name, address, phone, tax_rate) VALUES 
(1, 'My Restaurant', '123 Main Street, City', '+1-234-567-8900', 5.0);

INSERT INTO tables (table_number, capacity) VALUES 
(1, 4), (2, 4), (3, 4), (4, 4), (5, 4),
(6, 4), (7, 4), (8, 4), (9, 4), (10, 4);
