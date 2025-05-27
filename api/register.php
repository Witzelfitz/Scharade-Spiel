<?php
// Prüfung
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Ungültige Anfrage"]);
    exit;
}

$username = trim($_POST['username'] ?? '');
$email    = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (!$username || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Alle Felder sind erforderlich."]);
    exit;
}

// Try & Catch
try {
    // Prüfe, ob E-Mail bereits existiert
    $stmt = $pdo->prepare("SELECT Id_User FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "E-Mail ist bereits vergeben."]);
        exit;
    }

    // Passwort hashen
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Benutzer einfügen
    $insert = $pdo->prepare("INSERT INTO users (username, email, password) 
                             VALUES (:username, :email, :pass)");
    $insert->execute([
        ':username' => $username,
        ':email'    => $email,
        ':pass'     => $hashedPassword
    ]);

    echo json_encode(["status" => "success"]);
    exit;

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Fehler beim Einfügen: " . $e->getMessage()]);
    exit;
}
?>
