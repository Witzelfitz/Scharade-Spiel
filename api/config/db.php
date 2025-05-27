<?php
$pdo = new PDO(
    'mysql:host=iu6x22.myd.infomaniak.com;dbname=iu6x22_Begriffe_Scharade;charset=utf8mb4',
    'iu6x22_Begriffe',
    'X9wGf&Rab93aPo!&Je',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
);