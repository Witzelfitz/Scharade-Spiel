<?php
require_once 'connection.php';

function generateGameId() {
    return substr(str_shuffle(str_repeat('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 2)), 0, 6);
}

function startGame() {
    $pdo = getPDO();
    $gameId = generateGameId();

    $stmt = $pdo->prepare("INSERT INTO Game (game_id, status) VALUES (?, 'waiting')");
    $stmt->execute([$gameId]);

    return $gameId;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $gameId = startGame();
    echo json_encode(['success' => true, 'gameId' => $gameId]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
