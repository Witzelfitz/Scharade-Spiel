<?php
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
session_start();

header('Content-Type: application/json');

require_once '../system/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Nur POST-Anfragen erlaubt."]);
    exit;
}

// JSON- oder POST-Body lesen
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $email    = trim($input['email'] ?? '');
    $password = trim($input['password'] ?? '');
} else {
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
}

// Eingaben prüfen
if (!$username || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Alle Felder sind erforderlich."]);
    exit;
}

// Username: nur Buchstaben, Zahlen, Unterstrich (3–30 Zeichen)
if (!preg_match('/^[a-zA-Z0-9_]{3,30}$/', $username)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Benutzername ungültig. Nur Buchstaben, Zahlen und Unterstriche erlaubt (3–30 Zeichen)."]);
    exit;
}

// E-Mail validieren
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Ungültige E-Mail-Adresse."]);
    exit;
}

// Passwortregeln: mind. 8 Zeichen, 1 Sonderzeichen
if (strlen($password) < 8 || !preg_match('/[\W_]/', $password)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Passwort muss mindestens 8 Zeichen lang sein und mindestens 1 Sonderzeichen enthalten."
    ]);
    exit;
}

try {
    // Doppelte E-Mail prüfen
    $stmt = $pdo->prepare("SELECT Id_User FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);

    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["status" => "error", "message" => "E-Mail ist bereits registriert."]);
        exit;
    }

    // Passwort hashen und User speichern
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $insert = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :pass)");
    $insert->execute([
        ':username' => $username,
        ':email'    => $email,
        ':pass'     => $hashedPassword
    ]);

    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "Registrierung erfolgreich."]);

} catch (PDOException $e) {
    error_log("Register-Fehler: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Datenbankfehler."]);
}