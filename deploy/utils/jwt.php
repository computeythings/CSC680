<?php
class JWT {
    private static $secretKey;

    public static function init() {
        self::$secretKey = getenv("TOKEN_KEY");
    }
    
    public static function generateToken($payload) {
        if (!isset(self::$secret)) { 
            self::init(); 
        }
        $header = json_encode([
            "typ" => "JWT",
            "alg" => "HS256"
        ]);
        
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac(
            "sha256", 
            "$base64UrlHeader.$base64UrlPayload", 
            self::$secretKey, 
            true
        );
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return "$base64UrlHeader.$base64UrlPayload.$base64UrlSignature";
    }
    
    // Check if the token is valid and signed by this server
    public static function validateToken($token) {
        if (!isset(self::$secret)) { 
            self::init(); 
        }
        $tokenParts = explode(".", $token);
        if (count($tokenParts) != 3) {
            throw new Exception("Invalid token format");
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $tokenParts;
        
        // decode header and payload
        $header = json_decode(self::base64UrlDecode($base64UrlHeader), true);
        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        
        // verify signature
        $signature = self::base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac(
            "sha256", 
            "$base64UrlHeader.$base64UrlPayload", 
            self::$secretKey, 
            true
        );
        
        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception("Invalid token signature");
        }
        
        // check if token has expired
        if (isset($payload["exp"]) && $payload["exp"] < time()) {
            throw new Exception("Token has expired");
        }
        
        return $payload;
    }

    private static function base64UrlEncode($data) {
        $base64 = base64_encode($data);
        $base64Url = strtr($base64, "+/", "-_");
        return rtrim($base64Url, "=");
    }
    
    private static function base64UrlDecode($data) {
        $base64 = strtr($data, "-_", "+/");
        // base64 padding
        switch (strlen($base64) % 4) {
            case 0:
                break;
            case 2:
                $base64 .= "==";
                break;
            case 3:
                $base64 .= "=";
                break;
            default:
                throw new Exception("Invalid base64url string");
        }
        
        return base64_decode($base64);
    }
    
    // Pull Bearer token from GET requests
    public static function getTokenFromHeader($authHeader) {
        if (!empty($authHeader) && preg_match("/Bearer\s(\S+)/", $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }
}