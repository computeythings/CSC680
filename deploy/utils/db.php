<?php
class DB {
    private static ?PDO $instance = null;

    // Prevent instantiation and cloning
    private function __construct() {}
    private function __clone() {}

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $host = getenv("DBHOST");
            $db   = getenv("DBNAME");
            $user = getenv("DBUSER"); 
            $pass = getenv("DBPASSWORD"); 
            $charset = "utf8mb4";

            $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                die("Database connection failed: " . $e->getMessage());
            }
        }

        return self::$instance;
    }

    public static function getUserData(string $username): ?array {
        $pdo = self::getInstance();

        $stmt = $pdo->prepare("
            SELECT id, user, firstname, lastname
            FROM user
            WHERE user = :user
        ");
        $stmt->bindParam(":user", $username, PDO::PARAM_STR);
        $stmt->execute();

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function getLoginData(string $username): ?array {
        $pdo = self::getInstance();

        $stmt = $pdo->prepare("
            SELECT id, user, password, firstname, lastname
            FROM user
            WHERE user = :user
        ");
        $stmt->bindParam(":user", $username, PDO::PARAM_STR);
        $stmt->execute();

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function getLoginList(): ?array {
        $pdo = self::getInstance();

        $stmt = $pdo->prepare("
            SELECT user, passwordstring
            FROM user
        ");
        $stmt->execute();

        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function insertUser(array $userData): bool {
        $pdo = self::getInstance();
        $columns = ['user', 'passwordstring', 'password', 'firstname', 'lastname'];

        // Build column and placeholder lists
        $columnNames = implode(', ', array_keys($userData));
        $placeholders = ':' . implode(', :', array_keys($userData));

        $sql = "INSERT INTO user ($columnNames) VALUES ($placeholders)";
        $stmt = $pdo->prepare($sql);

        // Bind parameters
        foreach ($userData as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }

        return $stmt->execute();
    }

    public static function updateUser(int $userId, array $userData): bool {
        $pdo = self::getInstance();
        if (empty($userData)) {
            return false; // Nothing to update
        }

        // Build the SET part of the SQL statement dynamically
        $setClauses = [];
        foreach ($userData as $column => $value) {
            $setClauses[] = "`$column` = :$column";
        }
        $setClause = implode(', ', $setClauses);

        $sql = "UPDATE `user` SET $setClause WHERE `id` = :id";

        $stmt = $pdo->prepare($sql);

        // Bind values from the array
        foreach ($userData as $column => $value) {
            $stmt->bindValue(":$column", $value);
        }

        // Bind the user ID
        $stmt->bindValue(':id', $userId, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public static function deleteUser(string $userId): bool {
        $pdo = self::getInstance();

        $stmt = $pdo->prepare("
            DELETE
            FROM user
            WHERE id = :id
        ");
        $stmt->bindParam(":id", $userId, PDO::PARAM_STR);
        $stmt->execute();

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: false;
    }
}
