<?php
header('Content-Type: application/json');

// Load DB credentials from environment variables
$dbHost = getenv('DBHOST');
$dbName = getenv('DBNAME');
$dbUser = getenv('DBUSER');  // Fetch DB_USER from environment
$dbPassword = getenv('DBPASSWORD');  // Fetch DB_PASSWORD from environment

try {
    $dsn = "mysql:host=$dbHost;dbname=$dbName";
    $pdo = new PDO($dsn, $dbUser, $dbPassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute the SHOW TABLES query
    $stmt = $pdo->query('SHOW TABLES;');

    // Fetch the results and output them
    $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['tables' => $tables]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
