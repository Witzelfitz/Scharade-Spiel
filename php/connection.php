<?php

// Database configuration
$db_host = 'host';  // Replace with your database host
$db_name = 'name';  // Replace with your database name
$db_user = 'user';  // Replace with your database username
$db_pass = 'password';  // Replace with your database password

// DSN (Data Source Name)
$dsn = "mysql:host=$db_host;dbname=$db_name;charset=utf8mb4";

// Options for PDO
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Create a PDO instance
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (\PDOException $e) {
    // If there's an error in the connection, throw an exception
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Function to get the PDO instance
function getPDO() {
    global $pdo;
    return $pdo;
}
?>
