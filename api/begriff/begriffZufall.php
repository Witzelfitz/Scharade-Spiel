<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once '../../system/db.php';

$anzahl = isset($_GET['anzahl']) ? intval($_GET['anzahl']) : 7;
$kategorien = isset($_GET['kategorie']) ? $_GET['kategorie'] : null;

if ($anzahl <= 0 || $anzahl > 100) {
  echo json_encode(["status" => "error", "message" => "Ungültige Anzahl Begriffe"]);
  exit;
}

try {
  if ($kategorien) {
    $kategorienArray = array_filter(array_map('intval', explode(',', $kategorien)), fn($v) => $v > 0);

    if (count($kategorienArray) === 0) {
      echo json_encode(["status" => "error", "message" => "Ungültige Kategorieauswahl"]);
      exit;
    }

    $placeholders = implode(',', array_fill(0, count($kategorienArray), '?'));
    $sql = "
      SELECT Begriff.ID_Begriff, Begriff.Begriff_Name, users.username
      FROM Begriff
      JOIN users ON Begriff.ID_User = users.ID_User
      WHERE Begriff.Status = 'aktiv' AND Begriff.ID_Kategorie IN ($placeholders)
      ORDER BY RANDOM() LIMIT ?
    ";

    $stmt = $pdo->prepare($sql);
    $params = array_merge($kategorienArray, [$anzahl]);
    $stmt->execute($params);

  } else {
    $sql = "
      SELECT Begriff.ID_Begriff, Begriff.Begriff_Name, users.username
      FROM Begriff
      JOIN users ON Begriff.ID_User = users.ID_User
      WHERE Begriff.Status = 'aktiv'
      ORDER BY RANDOM() LIMIT ?
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$anzahl]);
  }

  $begriffe = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(["status" => "success", "begriffe" => $begriffe]);

} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => "Serverfehler: " . $e->getMessage()]);
}
