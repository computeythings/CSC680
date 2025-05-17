<?php
require_once "../../utils/jwt.php";
require_once "../../utils/db.php";

header("Content-Type: application/json");

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Method not allowed."
    ]);
    exit;
}

$userip = "";
var_dump($_SERVER);
if (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
    $userip = explode(",", $_SERVER["HTTP_X_FORWARDED_FOR"])[0];
} else {
    $userip =  $_SERVER["REMOTE_ADDR"] ?? "UNKNOWN";
}
error_log("$userip: Login Request");

// Parse request body
$requestData = json_decode(file_get_contents("php://input"), true);
if (!$requestData || 
    !isset($requestData["username"]) || 
    !isset($requestData["password"]) ||
    empty($requestData["username"]) ||
    empty($requestData["password"])) {
    
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields."
    ]);
    exit;
}

$username = $requestData["username"];
$password = $requestData["password"];

try {
    $res = DB::getLoginData($username);

    if ($res && isset($res["user"]) && isset($res["password"])) {
        $storedUser = $res["user"];
        $storedHash = $res["password"];
        if (password_verify($password, $storedHash)) {
            $token = JWT::generateToken([
                "id" => $res["id"],
                "firstName" => $res["firstname"],
                "lastName" => $res["lastname"],
                "username" => $storedUser,
                "exp" => time() + (60 * 60 * 24 * 7)
            ]);

            // Return successful response with token
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "data" => [
                    "token" => $token,
                    "expires_in" => 60 * 60 * 24 * 7
                ]
            ]);
            exit;
        }
    }
    error_log("Failed login to $username");

    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid credentials"
    ]);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error."
    ]);
    error_log("SERVER ERROR: ". $e->getMessage());
}