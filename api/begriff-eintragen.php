<?php
// api/begriff-eintragen.php

header('Content-Type: application/json');
require_once '../system/db.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (
        !isset($input['begriff_name'], $input['ID_Kategorie'], $input['ID_User']) ||
        trim($input['begriff_name']) === ''
    ) {
        http_response_code(400);
        echo json_encode(['message' => 'Ungültige Eingabe.']);
        exit;
    }

    $begriff = trim($input['begriff_name']);
    $idKategorie = intval($input['ID_Kategorie']);
    $idUser = intval($input['ID_User']);

    // Länge prüfen
    $laenge = mb_strlen($begriff);
    if ($laenge < 4) {
        http_response_code(400);
        echo json_encode(['message' => 'Begriff ist zu kurz (mind. 4 Zeichen).']);
        exit;
    }
    if ($laenge > 100) {
        http_response_code(400);
        echo json_encode(['message' => 'Begriff ist zu lang (max. 100 Zeichen).']);
        exit;
    }

    // Zeichenprüfung: erlaubt sind Buchstaben, Ziffern, Leerzeichen, -, (), !?,.: 
    if (!preg_match('/^[\p{L}\p{N}\s\-()!?.,:]+$/u', $begriff)) {
        http_response_code(400);
        echo json_encode(['message' => 'Ungültige Zeichen im Begriff.']);
        exit;
    }

    // Blacklist-Prüfung
    $stmtBlacklist = $pdo->query("SELECT Wort FROM Blacklist");
    $blacklist = $stmtBlacklist->fetchAll(PDO::FETCH_COLUMN);

    foreach ($blacklist as $verboten) {
        if (stripos($begriff, $verboten) !== false) {
            http_response_code(400);
            echo json_encode(['message' => 'Begriff enthält unzulässige Inhalte.']);
            exit;
        }
    }

    // Kategorie und User-ID prüfen
    if ($idKategorie <= 0 || $idUser <= 0) {
        http_response_code(400);
        echo json_encode(['message' => 'Ungültige Kategorie- oder Benutzer-ID.']);
        exit;
    }

    // Begriff speichern
    $stmt = $pdo->prepare(
        'INSERT INTO Begriff (Begriff_Name, ID_Kategorie, ID_User, Status) VALUES (?, ?, ?, "aktiv")'
    );
    $stmt->execute([$begriff, $idKategorie, $idUser]);

    echo json_encode(['message' => 'Begriff erfolgreich gespeichert.']);

} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        http_response_code(409);
        echo json_encode(['message' => 'Begriff existiert bereits.']);
    } else {
        error_log('DB-Fehler: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['message' => 'Serverfehler.']);
    }
}