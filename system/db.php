<?php
// SQLite DB bootstrap (local dev)
$dbPath = __DIR__ . '/scharade.sqlite';

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys = ON');

    // Tables
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        ID_User INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        Erstellungszeitpunkt DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS Kategorie (
        ID_Kategorie INTEGER PRIMARY KEY AUTOINCREMENT,
        Kategorie_Name TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS Begriff (
        ID_Begriff INTEGER PRIMARY KEY AUTOINCREMENT,
        Begriff_Name TEXT NOT NULL UNIQUE,
        ID_Kategorie INTEGER NOT NULL,
        ID_User INTEGER NOT NULL,
        Bild BLOB,
        Status TEXT DEFAULT 'wird geprüft',
        Erstellungszeitpunkt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ID_Kategorie) REFERENCES Kategorie(ID_Kategorie),
        FOREIGN KEY (ID_User) REFERENCES users(ID_User)
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS Rechtschreibung (
        ID_Rechtschreibung INTEGER PRIMARY KEY AUTOINCREMENT,
        ID_Begriff INTEGER NOT NULL,
        Check_Rechtschreibung INTEGER DEFAULT 0,
        Fehlermeldung TEXT,
        Erstellungszeitpunkt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ID_Begriff) REFERENCES Begriff(ID_Begriff) ON DELETE CASCADE
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS Blacklist (
        ID_Blacklist INTEGER PRIMARY KEY AUTOINCREMENT,
        Wort TEXT NOT NULL UNIQUE
    )");


    $pdo->exec("CREATE TABLE IF NOT EXISTS Likes (
        ID_Like INTEGER PRIMARY KEY AUTOINCREMENT,
        ID_Begriff INTEGER NOT NULL,
        ID_User INTEGER NOT NULL,
        Erstellungszeitpunkt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (ID_Begriff, ID_User),
        FOREIGN KEY (ID_Begriff) REFERENCES Begriff(ID_Begriff) ON DELETE CASCADE,
        FOREIGN KEY (ID_User) REFERENCES users(ID_User) ON DELETE CASCADE
    )");

    // Seed categories if empty
    $count = $pdo->query("SELECT COUNT(*) FROM Kategorie")->fetchColumn();
    if ((int)$count === 0) {
        $seed = [
            'Allgemein',
            'Film & Serien',
            'Tiere',
            'Berufe',
            'Orte',
            'Sport'
        ];
        $stmt = $pdo->prepare("INSERT INTO Kategorie (Kategorie_Name) VALUES (?)");
        foreach ($seed as $k) {
            $stmt->execute([$k]);
        }
    }

} catch (PDOException $e) {
    error_log('SQLite init error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Datenbankfehler."]);
    exit;
}
