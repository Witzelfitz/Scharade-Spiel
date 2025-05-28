<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    header('Content-Type: application/json');
    echo json_encode(["status" => "error", "message" => "Nur POST-Anfragen erlaubt."]);
    exit;
}

$_SESSION = [];
session_destroy();

// Optional: Session-Cookie löschen
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

header('Content-Type: application/json');
echo json_encode(["status" => "success"]);
exit;
