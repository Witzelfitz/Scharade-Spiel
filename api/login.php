<?php
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
// ini_set('session.cookie_secure', 1); // Nur bei HTTPS aktivieren

session_start();
header('Content-Type: application/json');

require_once '../system/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Nur POST erlaubt."]);
    exit;
}

// JSON-Body einlesen
$input = json_decode(file_get_contents('php://input'), true);

$username = trim($input['username'] ?? '');
$email    = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

// Eingaben validieren
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Ungültige E-Mail-Adresse."]);
    exit;
}
if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Benutzername und Passwort sind erforderlich."]);
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
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "E-Mail oder Passwort falsch."]);
    }

} catch (Exception $e) {
    error_log("Login-Fehler: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Interner Serverfehler."]);
}