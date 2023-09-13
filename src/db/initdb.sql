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
  password        VARCHAR(255) DEFAULT NULL,
  isadmin         BOOLEAN DEFAULT false,
  status          BOOLEAN DEFAULT true,
  creationDate    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table server
CREATE TABLE IF NOT EXISTS server (
    id            INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    serverName    VARCHAR(255) DEFAULT 'nextcloud_server',
    serverSize    INT DEFAULT 20,
    user_id       INT NOT NULL
);
