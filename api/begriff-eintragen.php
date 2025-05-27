<?php
// api/begriff-eintragen.php

header('Content-Type: application/json');
require_once '../config/db.php'; // DB-Verbindung (PDO $pdo)

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

    $stmt = $pdo->prepare('INSERT INTO begriff (begriff_name, ID_Kategorie, ID_User, status) VALUES (?, ?, ?, "aktiv")');
    $stmt->execute([$begriff, $idKategorie, $idUser]);

    echo json_encode(['message' => 'Begriff erfolgreich gespeichert.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Datenbankfehler.', 'error' => $e->getMessage()]);
}