-- Crée la base de données s'il elle n'existe pas
CREATE DATABASE IF NOT EXISTS fisc_db;

-- Utilise la base de données fisc_db
USE fisc_db;

-- Table user
CREATE TABLE IF NOT EXISTS user (
  id              INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name            VARCHAR(255) DEFAULT NULL,
  forename        VARCHAR(255) DEFAULT NULL,
  email           VARCHAR(255) DEFAULT NULL,
  password        VARCHAR(255) DEFAULT NULL
);

-- Table server
CREATE TABLE IF NOT EXISTS server (
    id            INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name          VARCHAR(255) DEFAULT NULL
);

-- Table userServer
CREATE TABLE IF NOT EXISTS userServer (
    id            INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id       INT NOT NULL,
    server_id     INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY(server_id) REFERENCES server(id) ON DELETE CASCADE
);