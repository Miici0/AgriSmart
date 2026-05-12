-- Creazione del Database
CREATE DATABASE IF NOT EXISTS AgriSmart CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE AgriSmart;

-- Nota: Assicurati che l'utente 'AgriSmart' con password 'tomaru' sia creato su XAMPP
-- GRANT ALL PRIVILEGES ON AgriSmart.* TO 'AgriSmart'@'localhost' IDENTIFIED BY 'tomaru';

-- Tabella Aziende Agricole
CREATE TABLE IF NOT EXISTS farmtable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- Tabella Utenti
CREATE TABLE IF NOT EXISTS usertable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'farmer',
    language VARCHAR(10) NOT NULL DEFAULT 'it',
    farm_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farmtable(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabella Campi
CREATE TABLE IF NOT EXISTS fieldtable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    crop_type VARCHAR(255) NOT NULL,
    farm_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farmtable(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabella Sensori
CREATE TABLE IF NOT EXISTS sensortable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    field_id INT NOT NULL,
    FOREIGN KEY (field_id) REFERENCES fieldtable(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabella Letture Sensori
CREATE TABLE IF NOT EXISTS sensorreadingtable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DOUBLE NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sensor_id INT NOT NULL,
    FOREIGN KEY (sensor_id) REFERENCES sensortable(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabella Veicoli
CREATE TABLE IF NOT EXISTS vehicletable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    license_plate VARCHAR(255) NOT NULL,
    device_id VARCHAR(255) NOT NULL UNIQUE,
    farm_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farmtable(id) ON DELETE CASCADE,
    INDEX (device_id)
) ENGINE=InnoDB;

-- Tabella Diagnostica Veicoli
CREATE TABLE IF NOT EXISTS vehiclediagnostictable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rpm DOUBLE,
    coolant_temp DOUBLE,
    speed DOUBLE,
    error_code VARCHAR(255),
    operating_hours DOUBLE,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    vehicle_id INT NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicletable(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabella Dipendenti
CREATE TABLE IF NOT EXISTS employeetable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'it',
    certifications TEXT NOT NULL,
    farm_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farmtable(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabella Raccomandazioni AI
CREATE TABLE IF NOT EXISTS recommendationtable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    farm_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farmtable(id) ON DELETE CASCADE
) ENGINE=InnoDB;
