<?php
require_once 'connection.php';

function readItems($gameId) {
    $pdo = getPDO();

    // Get the game ID from the game_id
    $stmt = $pdo->prepare("SELECT id FROM Game WHERE game_id = ?");
    $stmt->execute([$gameId]);
    $game = $stmt->fetch();

    if (!$game) {
        return ['success' => false, 'error' => 'Game not found'];
    }

    // Fetch items for the game
    $stmt = $pdo->prepare("SELECT item FROM GameItem WHERE game_id = ?");
    $stmt->execute([$game['id']]);
    $items = $stmt->fetchAll(PDO::FETCH_COLUMN);

    return ['success' => true, 'items' => $items];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $gameId = $_GET['gameId'] ?? '';

    if (empty($gameId)) {
        echo json_encode(['success' => false, 'error' => 'Missing gameId']);
    } else {
        $result = readItems($gameId);
        echo json_encode($result);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
