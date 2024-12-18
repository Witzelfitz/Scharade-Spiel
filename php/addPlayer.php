<?php
require_once 'connection.php';

function addPlayer($gameId, $username) {
    $pdo = getPDO();

    // Check if the game exists and is in 'waiting' status
    $stmt = $pdo->prepare("SELECT id FROM Game WHERE game_id = ? AND status = 'waiting'");
    $stmt->execute([$gameId]);
    $game = $stmt->fetch();

    if (!$game) {
        return ['success' => false, 'error' => 'Game not found or already started'];
    }

    // Add or get the player
    $stmt = $pdo->prepare("INSERT INTO Player (username) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)");
    $stmt->execute([$username]);
    $playerId = $pdo->lastInsertId();

    // Add player to the game
    $stmt = $pdo->prepare("INSERT INTO GamePlayer (game_id, player_id) VALUES (?, ?)");
    $stmt->execute([$game['id'], $playerId]);

    return ['success' => true];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $gameId = $_POST['gameId'] ?? '';
    $username = $_POST['username'] ?? '';

    if (empty($gameId) || empty($username)) {
        echo json_encode(['success' => false, 'error' => 'Missing gameId or username']);
    } else {
        $result = addPlayer($gameId, $username);
        echo json_encode($result);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
