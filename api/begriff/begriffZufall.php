<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once '../../system/configBegriff.php'; // DB-Verbindung

// Parameter einlesen
$anzahl = isset($_GET['anzahl']) ? intval($_GET['anzahl']) : 7;
$kategorie = isset($_GET['kategorie']) ? intval($_GET['kategorie']) : null;

// Sicherheitsprüfung
if ($anzahl <= 0 || $anzahl > 100) {
  echo json_encode(["status" => "error", "message" => "Ungültige Anzahl Begriffe"]);
  exit;
}

try {
  if ($kategorie !== null && $kategorie > 0) {
    $sql = "SELECT Begriff_Name FROM Begriff WHERE Status = 'aktiv' AND ID_Kategorie = ? ORDER BY RAND() LIMIT ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $kategorie, $anzahl);
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

  // Prüfen, ob Begriffe gefunden wurden
  if (empty($begriffe)) {
    echo json_encode([
      "status" => "error",
      "message" => "Keine Begriffe in dieser Kategorie vorhanden."
    ]);
    exit;
  }

  echo json_encode(["status" => "success", "begriffe" => $begriffe]);

} catch (Exception $e) {
  echo json_encode(["status" => "error", "message" => "Serverfehler: " . $e->getMessage()]);
}
?>