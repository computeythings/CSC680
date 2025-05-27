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
    $valid = JWT::validateToken($token, ["admin","valet"]);
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

// Handle add user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // get json data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    // get json data from request body
    $action = $data["action"];
    if (
        ($action == "park" && !(isset($data["spot_id"]) && isset($data["carwash"]))) || 
        (($action == "exit" || $action == "wash") && !isset($data["slip_id"]))
    ) {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "message" => "Missing parameters"
        ]);
        exit;
    }
    try {
        switch ($action) {
            case "park":
                $parking_slip = DB::generateValetSlip($data["spot_id"], $data["carwash"] === "true");
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "message" => "Request successful",
                    "data" => $parking_slip
                ]);
                break;
            case "wash":
                $washed = DB::washVehicle($data["slip_id"]);
                if (!$washed) {
                    error_log("UNABLE TO WASH " . $data["slip_id"]);
                    http_response_code(500);
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
                    "data" => $washed
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
// Query `?lot_id=<lot_id>`
elseif (isset($_GET["lot_id"])) {
    $lot = $_GET["lot_id"];
    try {
        $payload = DB::getValetSpaces($lot);
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