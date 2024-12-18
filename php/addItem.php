<?php
require_once 'connection.php';

function addItem($gameId, $item) {
    $pdo = getPDO();

    // Check if the game exists and is in 'waiting' status
    $stmt = $pdo->prepare("SELECT id FROM Game WHERE game_id = ? AND status = 'waiting'");
    $stmt->execute([$gameId]);
    $game = $stmt->fetch();

    if (!$game) {
        return ['success' => false, 'error' => 'Game not found or already started'];
    }

    // Add the item to the game
    $stmt = $pdo->prepare("INSERT INTO GameItem (game_id, item) VALUES (?, ?)");
    $stmt->execute([$game['id'], $item]);

    return ['success' => true];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $gameId = $_POST['gameId'] ?? '';
    $item = $_POST['item'] ?? '';

    if (empty($gameId) || empty($item)) {
        echo json_encode(['success' => false, 'error' => 'Missing gameId or item']);
    } else {
        $result = addItem($gameId, $item);
        echo json_encode($result);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
