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

    /*
    *   /api/v1/users functions
    */

    public static function getUserData(string $username): array {
        $pdo = self::getInstance();

        $stmt = $pdo->prepare("
            SELECT id, user, firstname, lastname
            FROM user
            WHERE user = :user
        ");
        $stmt->bindParam(":user", $username, PDO::PARAM_STR);
        $stmt->execute();

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: [];
    }

    public static function getLoginData(string $username): array {
        $pdo = self::getInstance();

        $stmt = $pdo->prepare("
            SELECT id, user, password, firstname, lastname
            FROM user
            WHERE user = :user
        ");
        $stmt->bindParam(":user", $username, PDO::PARAM_STR);
        $stmt->execute();

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: [];
    }

    public static function getLoginList(): ?array {
        $pdo = self::getInstance();

        $stmt = $pdo->prepare("
            SELECT user, passwordstring
            FROM user
        ");
        $stmt->execute();

        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $res ?: [];
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
            $setClauses[] = "$column = :$column";
        }
        $setClause = implode(', ', $setClauses);

        $sql = "UPDATE user SET $setClause WHERE id = :id";

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

        return $stmt->rowCount() > 0;
    }
    
    /*
    *   /api/v1/parking functions
    */

    // get a list of all parking lots
    public static function getLots(): array {
        $pdo = self::getInstance();
        $stmt = $pdo->prepare("SELECT * FROM parking_lot");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    // get all spaces in a lot or on a specific floor of a lot
    public static function getSpaces(string $lot_id, string $level): array {
        $pdo = self::getInstance();
        $sql = "
                SELECT slot_id, level, parked
                FROM parking
                WHERE lot_id = :lot_id
            ";
        if ($level !== "") {
            $sql = $sql . " AND level = :level";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(":level", $level, PDO::PARAM_STR);
        } else {
            $stmt = $pdo->prepare($sql);
        }
        $stmt->bindParam(":lot_id", $lot_id, PDO::PARAM_STR);
        $stmt->execute();

        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $res ?: [];
    }

    public static function generateParkingSlip(array $customer, string $lot_id): array {
        $pdo = self::getInstance();
        $now = new DateTime();
        // add new customer
        $sql = "
            INSERT INTO customer (firstname, lastname, licenseplate, make, model)
                VALUES(:firstname, :lastname, :licenseplate, :make, :model)
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":firstname", $customer["lastname"], PDO::PARAM_STR);
        $stmt->bindValue(':lastname', $customer["lastname"], PDO::PARAM_STR);
        $stmt->bindValue(':licenseplate', $customer["licenseplate"], PDO::PARAM_STR);
        $stmt->bindValue(':make', $customer["make"], PDO::PARAM_STR);
        $stmt->bindValue(':model', $customer["model"], PDO::PARAM_STR);
        $stmt->execute();
        $customer_id = $pdo->lastInsertId();
        // park into first empty slot
        $sql = "
            INSERT INTO parking_slip (slot, customer, start)
                SELECT slot_id, :customer, :created_at
                FROM parking
                WHERE lot_id = :lot_id
                AND parked IS NULL
                LIMIT 1;
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":lot_id", $lot_id, PDO::PARAM_STR);
        $stmt->bindValue(':customer', $customer_id, PDO::PARAM_STR);
        $stmt->bindValue(':created_at', $now->format('Y-m-d H:i:s'), PDO::PARAM_STR);
        $stmt->execute();
        $slip_id = $pdo->lastInsertId();

        // get the spot number to put on the ticket
        $sql = "SELECT spot FROM parking WHERE parked = :licenseplate LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":licenseplate", $customer["licenseplate"], PDO::PARAM_STR);
        $stmt->execute();
        $spot = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            "slip_id" => $slip_id,
            "licenseplate" => $customer['licenseplate'],
            "start" => $now->getTimestamp(),
            "spot" => $spot
        ];
    }

    // car leaves the parking lot
    public static function vehicleExit(int $slip_id): int {
        $pdo = self::getInstance();
        // set the end time of a parking slip
        $sql = "UPDATE parking_slip SET end = NOW() WHERE id = :id and end is NULL";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":id", $slip_id, PDO::PARAM_INT);
        $stmt->execute();
        if (!$rows) {
            return -1;
        }


        // return the duration parked in minutes
        $sql = "SELECT TIMESTAMPDIFF(MINUTE, start, end) FROM parking_slip WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":id", $slip_id, PDO::PARAM_INT);
        $stmt->execute();

        $minutes = $stmt->fetch(PDO::FETCH_ASSOC)["TIMESTAMPDIFF(MINUTE, start, end)"];
        return $minutes;
    }
}
