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
$valid = JWT::validateToken($token);

if (!$valid) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "invalid token"]);
    exit;
}
if ($_SERVER["REQUEST_METHOD"] === "GET" && empty($_SERVER["QUERY_STRING"])) {
    #TODO: return get all parking lots
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

if (isset($_GET["action"])) {
    // get json data from request body
    $action = $_GET["action"];
    if (
        ($action == "park" && !isset($_GET["lot_id"])) || 
        ($action == "exit" && !isset($_GET["slip_id"]))
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
                $parking_slip = DB::generateParkingSlip($_GET["lot_id"]);
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "message" => "Request successful",
                    "data" => $parking_slip
                ]);
                break;
            case "exit":
                $times = DB::vehicleExit($_GET["slip_id"]);
                if (!$times) {
                    error_log("BAD CHECKOUT FOR " . $_GET["slip_id"]);
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
if (isset($_GET["lot_id"]) && !isset($_GET["action"])) {
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