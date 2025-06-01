<?php
// api/begriff-eintragen.php

header('Content-Type: application/json');
require_once 'config/db.php'; // stellt sicher, dass $pdo vorhanden ist
// session_start(); // nur wenn du Sessions einsetzen willst

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

    // Begrenzung: max. 100 Zeichen
    if (mb_strlen($begriff) > 100) {
        http_response_code(400);
        echo json_encode(['message' => 'Begriff ist zu lang (max. 100 Zeichen).']);
        exit;
    }

    // Zeichensatz filtern (nur Buchstaben, Zahlen, Satzzeichen erlaubt)
    if (!preg_match('/^[\p{L}\p{N}\s\-\?!.,:()]{1,100}$/u', $begriff)) {
        http_response_code(400);
        echo json_encode(['message' => 'Ungültige Zeichen im Begriff.']);
        exit;
    }

    // ID prüfen (nicht negativ oder 0)
    if ($idKategorie <= 0 || $idUser <= 0) {
        http_response_code(400);
        echo json_encode(['message' => 'Ungültige Kategorie- oder Benutzer-ID.']);
        exit;
    }

    // Optional: Existiert die Kategorie überhaupt?
    /*
    $stmtCheck = $pdo->prepare('SELECT COUNT(*) FROM Kategorie WHERE ID_Kategorie = ?');
    $stmtCheck->execute([$idKategorie]);
    if ($stmtCheck->fetchColumn() == 0) {
        http_response_code(400);
        echo json_encode(['message' => 'Kategorie existiert nicht.']);
        exit;
    }
    */

    // Begriff speichern
    $stmt = $pdo->prepare(
        'INSERT INTO Begriff (Begriff_Name, ID_Kategorie, ID_User, Status) VALUES (?, ?, ?, "aktiv")'
    );
    $stmt->execute([$begriff, $idKategorie, $idUser]);

    echo json_encode(['message' => 'Begriff erfolgreich gespeichert.']);

} catch (PDOException $e) {
    // Bei Dubletten: 23000 (Integrity constraint violation)
    if ($e->getCode() === '23000') {
        http_response_code(409);
        echo json_encode(['message' => 'Begriff existiert bereits.']);
    } else {
        error_log('DB-Fehler: ' . $e->getMessage()); // nur Serverlog
        http_response_code(500);
        echo json_encode(['message' => 'Serverfehler.']);
    }
}