<?php
ini_set('session.cookie_httponly', 1);
// ini_set('session.cookie_secure', 1); // Nur aktivieren, wenn HTTPS aktiv ist
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Ungültige Anfragemethode."]);
    exit;
}

// JSON-Body einlesen
$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$email    = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

// Eingaben validieren
if (!$username || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Alle Felder sind erforderlich."]);
    exit;
}

try {
    // Benutzer abfragen
    $stmt = $pdo->prepare("SELECT Id_User, username, password FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['user_id']  = $user['Id_User'];
        $_SESSION['email']    = $email;
        $_SESSION['username'] = $user['username'];

        echo json_encode([
            "status"   => "success",
            "ID_User"  => $user['Id_User'],
            "username" => $user['username']
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Ungültige Anmeldedaten."]);
    }
} catch (Exception $e) {
    error_log("Login-Fehler: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Datenbankfehler."]);
}
?>
