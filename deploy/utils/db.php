<?php
class DB {
    private static ?PDO $instance = null;
    private static $usernames = [];

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

    private static function getLicensePlate() {
        $letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $plate = '';
        $plate .= random_int(1, 9);
        for ($i = 0; $i < 3; $i++) {$plate .= $letters[random_int(0, 25)];}
        for ($i = 0; $i < 3; $i++) {$plate .= random_int(0, 9);}
        return $plate;
    }

    private static function getVehicle() {
        $carMakesAndModels = [
            'Toyota' => ['Camry', 'Corolla', 'RAV4', 'Prius', 'Highlander'],
            'Honda' => ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'],
            'Ford' => ['F-150', 'Mustang', 'Explorer', 'Escape', 'Fusion'],
            'Chevrolet' => ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Impala'],
            'BMW' => ['3 Series', '5 Series', 'X3', 'X5', '7 Series'],
            'Mercedes-Benz' => ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class'],
            'Nissan' => ['Altima', 'Sentra', 'Rogue', 'Versa', 'Murano'],
            'Volkswagen' => ['Golf', 'Passat', 'Tiguan', 'Jetta', 'Atlas'],
            'Hyundai' => ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Venue'],
            'Kia' => ['Soul', 'Sportage', 'Sorento', 'Forte', 'Optima'],
            'Audi' => ['A3', 'A4', 'Q5', 'Q7', 'A6'],
            'Subaru' => ['Outback', 'Forester', 'Impreza', 'Crosstrek', 'Legacy'],
            'Mazda' => ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5 Miata'],
            'Tesla' => ['Model S', 'Model 3', 'Model X', 'Model Y'],
            'Jeep' => ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade'],
        ];
        $makes = array_keys($carMakesAndModels);
        $make = $makes[array_rand($makes)];
        $models = $carMakesAndModels[$make];
        $model = $models[array_rand($models)];
        return ['make' => $make, 'model' => $model];
    }

    private static function getCustomerInfo() {
        $res = @file_get_contents('https://randomuser.me/api/');
        $data = @json_decode($res, true);
        if ($res === false || !isset($data["results"][0]["name"]["first"]) || !isset($data["results"][0]["name"]["last"])) {
            return [
                "firstname" => "Random",
                "lastname" => "Personson"
            ];
        }
        return [
            "firstname" => $data["results"][0]["name"]["first"],
            "lastname" => $data["results"][0]["name"]["last"]
        ];
    }

    private static function superCoolAIThatIdentifiesCarsAndPeopleAndStuff() {
        $vehicle = self::getVehicle();
        $customer = self::getCustomerInfo();
        return [
            "firstname" => $customer["firstname"],
            "lastname" => $customer["lastname"],
            "licenseplate" => self::getLicensePlate(),
            "make" => $vehicle["make"],
            "model" => $vehicle["model"]
        ];
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
            SELECT id, user, password, firstname, lastname, role
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
        $columns = ['user', 'passwordstring', 'password', 'firstname', 'lastname', 'role'];

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

    public static function generateParkingSlip(string $lot_id): array {
        $customer = self::superCoolAIThatIdentifiesCarsAndPeopleAndStuff();
        $pdo = self::getInstance();
        $now = new DateTime();
        // add new customer
        $sql = "
            INSERT INTO customer (firstname, lastname, licenseplate, make, model)
                VALUES(:firstname, :lastname, :licenseplate, :make, :model)
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":firstname", $customer["firstname"], PDO::PARAM_STR);
        $stmt->bindValue(':lastname', $customer["lastname"], PDO::PARAM_STR);
        $stmt->bindValue(':licenseplate', $customer["licenseplate"], PDO::PARAM_STR);
        $stmt->bindValue(':make', $customer["make"], PDO::PARAM_STR);
        $stmt->bindValue(':model', $customer["model"], PDO::PARAM_STR);
        $stmt->execute();
        $customer_id = $pdo->lastInsertId();
        // park into first empty slot
        $sql = "
            INSERT INTO parking_slip (slot, customer, start, valet, carwash)
                SELECT slot_id, :customer, :created_at, 0, 0
                FROM parking
                WHERE lot_id = :lot_id
                AND parked IS NULL AND level != 1
                LIMIT 1;
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":lot_id", $lot_id, PDO::PARAM_STR);
        $stmt->bindValue(':customer', $customer_id, PDO::PARAM_STR);
        $stmt->bindValue(':created_at', $now->format('Y-m-d H:i:s'), PDO::PARAM_STR);
        $stmt->execute();
        $slip_id = $pdo->lastInsertId();

        // get the spot number to put on the ticket
        $sql = "SELECT spot FROM parking WHERE parked = :slip_id LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":slip_id", $slip_id, PDO::PARAM_STR);
        $stmt->execute();
        $spot = $stmt->fetch(PDO::FETCH_ASSOC);

        return array_merge([
            "slip_id" => $slip_id,
            "start" => $now->getTimestamp(),
            "spot" => $spot["spot"]
        ], $customer);
    }

    // car leaves the parking lot
    public static function vehicleExit(int $slip_id): array|null {
        $pdo = self::getInstance();
        // set the end time of a parking slip
        $sql = "UPDATE parking_slip SET end = NOW() WHERE id = :id and end is NULL";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":id", $slip_id, PDO::PARAM_INT);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            return null;
        }


        // return the duration parked in minutes
        $sql = "SELECT start, end FROM parking_slip WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":id", $slip_id, PDO::PARAM_INT);
        $stmt->execute();

        $start = $stmt->fetch(PDO::FETCH_ASSOC);
        return $start;
    }
    
    /*
    *   /api/v1/valet functions
    */

    public static function getValetSpaces(string $lot_id): array {
        $pdo = self::getInstance();
        $sql = "
                SELECT spot, slot_id, slip_id, firstname, lastname, licenseplate, make, model, carwash, washed, start
                FROM valet
                WHERE lot_id = :lot_id;
            ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":lot_id", $lot_id, PDO::PARAM_STR);
        $stmt->execute();

        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $res ?: [];
    }

    public static function generateValetSlip(string $spot_id, bool $carwash): array {
        $customer = self::superCoolAIThatIdentifiesCarsAndPeopleAndStuff();
        $pdo = self::getInstance();
        $now = new DateTime();
        // add new customer
        $sql = "
            INSERT INTO customer (firstname, lastname, licenseplate, make, model)
                VALUES(:firstname, :lastname, :licenseplate, :make, :model)
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":firstname", $customer["firstname"], PDO::PARAM_STR);
        $stmt->bindValue(':lastname', $customer["lastname"], PDO::PARAM_STR);
        $stmt->bindValue(':licenseplate', $customer["licenseplate"], PDO::PARAM_STR);
        $stmt->bindValue(':make', $customer["make"], PDO::PARAM_STR);
        $stmt->bindValue(':model', $customer["model"], PDO::PARAM_STR);
        $stmt->execute();
        $customer_id = $pdo->lastInsertId();
        $customer["id"] = $customer_id;
        // park into first empty slot
        $sql = "
            INSERT INTO parking_slip (slot, customer, start, valet, carwash)
                SELECT :spot_id, :customer, :created_at, 1, :carwash;
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":spot_id", $spot_id, PDO::PARAM_STR);
        $stmt->bindValue(':customer', $customer_id, PDO::PARAM_STR);
        $stmt->bindValue(':created_at', $now->format('Y-m-d H:i:s'), PDO::PARAM_STR);
        $stmt->bindParam(":carwash", $carwash, PDO::PARAM_INT);
        $stmt->execute();
        $slip_id = $pdo->lastInsertId();

        // get the spot number to put on the ticket
        $sql = "SELECT spot FROM parking WHERE parked = :slip_id LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":slip_id", $slip_id, PDO::PARAM_STR);
        $stmt->execute();
        $spot = $stmt->fetch(PDO::FETCH_ASSOC);

        return array_merge([
            "slip_id" => $slip_id,
            "start" => $now->getTimestamp()
        ], $customer);
    }

    public static function washVehicle(string $slip_id): bool {
        $pdo = self::getInstance();

        $sql = "UPDATE valet SET washed = 1 WHERE slip_id = :slip_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(":slip_id", $slip_id, PDO::PARAM_STR);

        return $stmt->execute();
    }
}
