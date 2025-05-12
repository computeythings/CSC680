<?php
// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the username and password from POST data
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $correctUsername = 'admin';
    $correctPassword = 'password123';

    // Authenticate the user
    if ($username === $correctUsername && $password === $correctPassword) {
        echo json_encode(['status' => 'success', 'message' => 'Login successful']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
    }
} else {
    // If the request method is not POST, return an error response
    echo json_encode(['status' => 'error', 'message' => 'Only POST requests are allowed']);
}
