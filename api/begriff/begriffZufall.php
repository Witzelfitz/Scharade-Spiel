<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once '../../system/configBegriff.php';

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
    $sql = "SELECT Begriff_Name FROM Begriff WHERE Status = 'aktiv' AND ID_Kategorie IN ($placeholders) ORDER BY RAND() LIMIT ?";

    $stmt = $conn->prepare($sql);

    $types = str_repeat('i', count($kategorienArray)) . 'i';
    $params = array_merge($kategorienArray, [$anzahl]);

    // Bind-Parameter dynamisch
    $stmt->bind_param($types, ...$params);

  } else {
    $sql = "SELECT Begriff_Name FROM Begriff WHERE Status = 'aktiv' ORDER BY RAND() LIMIT ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $anzahl);
  }

  $stmt->execute();
  $result = $stmt->get_result();

  $begriffe = [];
  while ($row = $result->fetch_assoc()) {
    $begriffe[] = ['Begriff_Name' => $row['Begriff_Name']];
  }

  echo json_encode(["status" => "success", "begriffe" => $begriffe]);

} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => "Serverfehler: " . $e->getMessage()]);
}