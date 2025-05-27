<?php
require_once "../../utils/jwt.php";
require_once "../../utils/db.php";

header("Content-Type: application/json");

// validate token for all requests
$headers = getallheaders();
$auth_header = isset($headers["Authorization"]) ? $headers["Authorization"] : "";
// fetch sends headers in all lowercase
if (empty($auth_header)) {
    $auth_header = isset($headers["authorization"]) ? $headers["authorization"] : "";
}

if (empty($auth_header) || !preg_match("/Bearer\s(\S+)/", $auth_header, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "unauthorized"]);
    exit;
}

$token = $matches[1];
try {
    // Valet accesses parking API as well as parking_attendant and admin
    $valid = JWT::validateToken($token, ["admin","parking_attendant","valet"]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Token validation error"
    ]);
    error_log("SERVER ERROR: ". $e->getMessage());
    exit;
}


if (!$valid) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "invalid token"]);
    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "GET" && empty($_SERVER["QUERY_STRING"])) {
    try {
        $payload = DB::getLots();
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Request successful",
            "data" => $payload
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error"
        ]);
        error_log("SERVER ERROR: ". $e->getMessage());
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // get json data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    // get json data from request body
    $action = $data["action"];
    if (
        ($action == "park" && !isset($data["lot_id"])) || 
        ($action == "exit" && !isset($data["slip_id"]))
    ) {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "message" => "Missing 'slip_id'"
        ]);
        exit;
    }
    try {
        switch ($action) {
            case "park":
                $parking_slip = DB::generateParkingSlip($data["lot_id"]);
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "message" => "Request successful",
                    "data" => $parking_slip
                ]);
                break;
            case "exit":
                $times = DB::vehicleExit($data["slip_id"]);
                if (!$times) {
                    error_log("BAD CHECKOUT FOR " . $data["slip_id"]);
                    http_response_code(409);
                    echo json_encode([
                        "status" => "error", 
                        "message" => "Invalid slip."
                    ]);
                    exit;
                }
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "message" => "Request successful",
                    "data" => $times
                ]);
                break;
            default:
                http_response_code(400);
                echo json_encode([
                    "status" => "error", 
                    "message" => "Missing parking 'action'"
                ]);
        }
    }  catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error"
        ]);
        error_log("SERVER ERROR: ". $e->getMessage());
    }
    exit;
}
// Query `?lot_id=<lot_id>&floor=<floor_level>`
elseif (isset($_GET["lot_id"])) {
    $lot = $_GET["lot_id"];
    try {
        $floor = isset($_GET["floor"]) ? $_GET["floor"] : "";
        $payload = DB::getSpaces($lot, $floor);
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Request successful",
            "data" => $payload
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error"
        ]);
        error_log("SERVER ERROR: ". $e->getMessage());
    }
    exit;
}

// handle invalid request
http_response_code(400);
echo json_encode(["status" => "error", "message" => "Invalid request"]);