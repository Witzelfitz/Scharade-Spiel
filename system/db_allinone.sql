-- ======================================
-- 1. USERS (mit Umbau)
-- ======================================

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  UUID CHAR(36) NOT NULL DEFAULT (UUID()),
  Erstellungszeitpunkt DATETIME DEFAULT CURRENT_TIMESTAMP,
  ID_User INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (ID_User),
  UNIQUE KEY (email)
);

-- ======================================
-- 2. KATEGORIE
-- ======================================

DROP TABLE IF EXISTS Kategorie;
CREATE TABLE Kategorie (
  UUID CHAR(36) NOT NULL DEFAULT (UUID()),
  Erstellungszeitpunkt DATETIME DEFAULT CURRENT_TIMESTAMP,
  ID_Kategorie INT AUTO_INCREMENT PRIMARY KEY,
  Kategorie_Name VARCHAR(255) NOT NULL
);

-- ======================================
-- 3. BEGRIFF (noch ohne Rechtschreibung-FK)
-- ======================================

DROP TABLE IF EXISTS Begriff;
CREATE TABLE Begriff (
  UUID CHAR(36) NOT NULL DEFAULT (UUID()),
  Erstellungszeitpunkt DATETIME DEFAULT CURRENT_TIMESTAMP,
  ID_Begriff INT AUTO_INCREMENT PRIMARY KEY,
  Begriff_Name VARCHAR(255) NOT NULL UNIQUE,
  ID_Kategorie INT NOT NULL,
  ID_User INT NOT NULL,
  Bild LONGBLOB,
  Status ENUM('aktiv', 'wird geprüft', 'inaktiv') DEFAULT 'wird geprüft',

  FOREIGN KEY (ID_Kategorie) REFERENCES Kategorie(ID_Kategorie),
  FOREIGN KEY (ID_User) REFERENCES users(ID_User)
);

-- ======================================
-- 4. RECHTSCHREIBUNG
-- ======================================

DROP TABLE IF EXISTS Rechtschreibung;
CREATE TABLE Rechtschreibung (
  UUID CHAR(36) NOT NULL DEFAULT (UUID()),
  Erstellungszeitpunkt DATETIME DEFAULT CURRENT_TIMESTAMP,
  ID_Rechtschreibung INT AUTO_INCREMENT PRIMARY KEY,
  ID_Begriff INT NOT NULL,
  Check_Rechtschreibung TINYINT(1) DEFAULT 0,
  Fehlermeldung TEXT,

  FOREIGN KEY (ID_Begriff) REFERENCES Begriff(ID_Begriff) ON DELETE CASCADE
);

-- ======================================
-- 5. BEGRIFF nachträglich erweitern um FK zu Rechtschreibung
-- ======================================

ALTER TABLE Begriff
ADD COLUMN ID_Rechtschreibung INT NULL,
ADD FOREIGN KEY (ID_Rechtschreibung) REFERENCES Rechtschreibung(ID_Rechtschreibung) ON DELETE SET NULL;
