<?php
header('Content-Type: application/json');
require_once '../system/db.php';

try {
    $stmt = $pdo->query('SELECT ID_Kategorie, Kategorie_Name FROM Kategorie ORDER BY ID_Kategorie');
    $kategorien = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($kategorien);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Datenbankfehler."]);
}
