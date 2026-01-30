<?php
header('Content-Type: application/json');
require_once '../../system/db.php';

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
if ($limit <= 0 || $limit > 50) $limit = 10;

try {
    $sql = "
      SELECT Begriff.ID_Begriff, Begriff.Begriff_Name, COUNT(Likes.ID_Like) as likes
      FROM Begriff
      LEFT JOIN Likes ON Likes.ID_Begriff = Begriff.ID_Begriff
      WHERE Begriff.Status = 'aktiv'
      GROUP BY Begriff.ID_Begriff
      ORDER BY likes DESC, Begriff.Begriff_Name ASC
      LIMIT ?
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$limit]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $data]);
} catch (PDOException $e) {
    error_log('Top error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Datenbankfehler."]);
}
