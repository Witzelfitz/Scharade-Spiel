<?php
header('Content-Type: application/json');
require_once '../../system/config.php'; // Verbdindung zur Datenbank

// Parameter einlesen
$anzahl = isset($_GET['anzahl']) ? intval($_GET['anzahl']) : 7;
$kategorie = isset($_GET['kategorie']) ? intval($_GET['kategorie']) : null;

// Sicherheitsprüfung
if ($anzahl <= 0 || $anzahl > 100) {
  echo json_encode(["status" => "error", "message" => "Ungültige Anzahl Begriffe"]);
  exit;
}

try {
  // Grund-Query
  $sql = "SELECT Begriff_Name FROM Begriff WHERE Status = 'bestätigt'";
  $params = [];

  // Filter nach Kategorie, wenn gesetzt
  if ($kategorie !== null) {
    $sql .= " AND ID_Kategorie = ?";
    $params[] = $kategorie;
  }

  // Zufällige Begriffe und Limit
  $sql .= " ORDER BY RAND() LIMIT ?";
  $params[] = $anzahl;

  // Anfrage vorbereiten und ausführen
  $stmt = $conn->prepare($sql);

  // Dynamisch binden
  if (count($params) === 2) {
    $stmt->bind_param("ii", $params[0], $params[1]);
  } else {
    $stmt->bind_param("i", $params[0]);
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
?>