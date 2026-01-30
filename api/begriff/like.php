<?php
header('Content-Type: application/json');
require_once '../../system/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Nur POST erlaubt."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$idBegriff = intval($input['ID_Begriff'] ?? 0);
$idUser = intval($input['ID_User'] ?? 0);

if ($idBegriff <= 0 || $idUser <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Ungültige Daten."]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT OR IGNORE INTO Likes (ID_Begriff, ID_User) VALUES (:b, :u)");
    $stmt->execute([':b' => $idBegriff, ':u' => $idUser]);

    // count likes
    $count = $pdo->prepare("SELECT COUNT(*) FROM Likes WHERE ID_Begriff = :b");
    $count->execute([':b' => $idBegriff]);
    $likes = (int)$count->fetchColumn();

    echo json_encode(["status" => "success", "likes" => $likes]);
} catch (PDOException $e) {
    error_log('Like error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Datenbankfehler."]);
}
