<?php
require_once 'connection.php';

function readPlayers($gameId) {
    $pdo = getPDO();

    // Get the game ID from the game_id
    $stmt = $pdo->prepare("SELECT id FROM Game WHERE game_id = ?");
    $stmt->execute([$gameId]);
    $game = $stmt->fetch();

    if (!$game) {
        return ['success' => false, 'error' => 'Game not found'];
    }

    // Fetch players for the game
    $stmt = $pdo->prepare("
        SELECT p.username 
        FROM GamePlayer gp
        JOIN Player p ON gp.player_id = p.id
        WHERE gp.game_id = ?
    ");
    $stmt->execute([$game['id']]);
    $players = $stmt->fetchAll(PDO::FETCH_COLUMN);

    return ['success' => true, 'players' => $players];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $gameId = $_GET['gameId'] ?? '';

    if (empty($gameId)) {
        echo json_encode(['success' => false, 'error' => 'Missing gameId']);
    } else {
        $result = readPlayers($gameId);
        echo json_encode($result);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
