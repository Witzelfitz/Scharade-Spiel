<?php
$host = 'iu6x22.myd.infomaniak.com';
$db   = 'iu6x22_Begriffe_Scharade';
$user = 'iu6x22_Begriffe';
$pass = 'X9wGf&Rab93aPo!&Je';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // wichtig!
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Datenbankverbindung fehlgeschlagen.']);
    exit;
}