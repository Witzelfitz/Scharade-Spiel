<?php
ini_set('session.cookie_httponly', 1);
// ini_set('session.cookie_secure', 1); // Nur aktivieren, wenn HTTPS aktiv ist
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$username || !$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Alle Felder sind erforderlich."]);
        exit;
    }

    // Holen
    $stmt = $pdo->prepare("SELECT Id_User, username, password FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true);
        $_SESSION['user_id']  = $user['Id_User'];
        $_SESSION['email']    = $email;
        $_SESSION['username'] = $user['username'];

        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Ungültige Anmeldedaten."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Ungültige Anfragemethode."]);
}
?>
