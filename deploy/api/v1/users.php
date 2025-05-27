<?php
require_once "../../utils/jwt.php";
require_once "../../utils/db.php";

header("Content-Type: application/json");

function generatePassword() {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
    $charLen = strlen($chars);
    $password = '';
    for ($j = 0; $j < 12; $j++) {
        $password .= $chars[random_int(0, $charLen - 1)];
    }
    return $password;
}

function getRandomUsers() {
    $users = [];
    $res = file_get_contents('https://usernameapiv1.vercel.app/api/random-usernames?count=10');
    $data = json_decode($res, true);
    $usernames = $data["usernames"];
    foreach($usernames as $username) {
        array_push($users, [
            // that site likes to add underscores at the end of each username and I don't like that
            "user" => str_replace("_","",$username),
            "passwordstring" => generatePassword()
        ]);
    }
    return $users;
}

// handle loginlist request without token validation
if (isset($_GET["loginlist"])) {
    try {
        $payload = DB::getLoginList();
        // generate entropy
        $payload = array_merge($payload, getRandomUsers());
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
            "message" => "Database error."
        ]);
        error_log("SERVER ERROR: ". $e->getMessage());
    }
    exit;
}

// validate token for all other requests
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
    $valid = JWT::validateToken($token, ["admin"]);
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

// Query `?user=<username>`
if (isset($_GET["user"])) {
    try {
        $payload = DB::getUserData($_GET["user"]);
        if(count($payload) === 0) {
            http_response_code(404);
            echo json_encode([
                "status" => "Not Found",
                "message" => "Unable to find matching username"
            ]);
            exit;
        }
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

// Handle add user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // get json data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // return bad request if any values are missing
    if (
        !isset($data['user']) || empty($data['user']) ||
        !isset($data['password']) || empty($data['password']) ||
        !isset($data['firstname']) || empty($data['firstname']) ||
        !isset($data['lastname']) || empty($data['lastname'])
    ) {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "message" => "Missing user info"
        ]);
        exit;
    }
    
    $updates = [];
    $updates['user'] = trim($data['user']);
    $hash = password_hash(trim($data['password']), PASSWORD_BCRYPT);
    $updates['password'] = $hash;
    $updates['passwordstring'] = trim($data['password']);
    $updates['firstname'] = trim($data['firstname']);
    $updates['lastname'] = trim($data['lastname']);
    $updates['role'] = trim($data['role']);
    
    try {
        DB::insertUser($updates);
        echo json_encode([
            "status" => "success", 
            "message" => "User added"
        ]);
    } catch (PDOException $e) {
        if (str_contains($e->getMessage(), 'Duplicate')) {
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "User already exists"
            ]);
            error_log("SERVER ERROR: ". $e->getMessage());
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Database error"
            ]);
            error_log("SERVER ERROR: ". $e->getMessage());
        }
    }
    exit;
}

// Handle update to users
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    // get json data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    if (!isset($data['id']) || empty($data['id'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "message" => "user id is required"
        ]);
        exit;
    }
    
    $userID = $data['id'];
    $updates = [];
    
    // only include non-empty fields for update
    if (isset($data['user']) && trim($data['user']) !== '') {
        $updates['user'] = trim($data['user']);
    }
    if (isset($data['password']) && trim($data['password']) !== '') {
        $hash = password_hash(trim($data['password']), PASSWORD_BCRYPT);
        $updates['password'] = $hash;
        $updates['passwordstring'] = trim($data['password']);
    }
    if (isset($data['firstname']) && trim($data['firstname']) !== '') {
        $updates['firstname'] = trim($data['firstname']);
    }
    if (isset($data['lastname']) && trim($data['lastname']) !== '') {
        $updates['lastname'] = trim($data['lastname']);
    }
    
    // if no fields to update
    if (empty($updates)) {
        http_response_code(200);
        echo json_encode(["status" => "Success", "message" => "No updates"]);
        exit;
    }
    
    try {
        $res = DB::updateUser($userID, $updates);
        if ($res) {
            $message = "Update complete";
        } else {
            $message = "No updates";
        }
        echo json_encode([
            "status" => "success", 
            "message" => $message
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

// Handle user delete
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // get json data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    if (!isset($data['id']) || empty($data['id'])) {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "message" => "user id is required"
        ]);
        exit;
    }
    
    $userID = $data['id'];
    
    try {
        $res = DB::deleteUser($userID);
        if ($res) {
            $message = "Deleted";
        } else {
            $message = "No such user";
        }
        echo json_encode([
            "status" => "success", 
            "message" => $message
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