<?php
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
    exit;
}

//$remoteHost = empty($_SERVER['HTTP_REMOTE_HOST']) ? null : $_SERVER['HTTP_REMOTE_HOST'];
//if (!preg_match('/tom\-gs\.com$/', $remoteHost)) {
//    header('HTTP/1.1 403 Forbidden');
//    echo '403 Forbidden';
//    exit;
//}

/**
 * Generate Apache APR1-MD5 password hash
 * This is the most compatible format for .htpasswd files
 * Format: $apr1$salt$hash
 *
 * @param string $password Plain text password
 * @return string APR1-MD5 hashed password
 */
function apr1_md5($password)
{
    // Generate cryptographically secure random salt
    $salt = generateSalt(8);
    $len = strlen($password);
    $context = $password . '$apr1$' . $salt;
    $binary = pack('H32', md5($password . $salt . $password));

    for ($i = $len; $i > 0; $i -= 16) {
        $context .= substr($binary, 0, ($i > 16 ? 16 : $i));
    }

    for ($i = $len; $i > 0; $i >>= 1) {
        $context .= ($i & 1) ? chr(0) : $password[0];
    }

    $binary = pack('H32', md5($context));

    for ($i = 0; $i < 1000; $i++) {
        $new = ($i & 1) ? $password : substr($binary, 0, 16);
        if ($i % 3) {
            $new .= $salt;
        }
        if ($i % 7) {
            $new .= $password;
        }
        $new .= ($i & 1) ? substr($binary, 0, 16) : $password;
        $binary = pack('H32', md5($new));
    }

    $hash = '';
    $hash .= to64((ord($binary[0]) << 16) | (ord($binary[6]) << 8) | ord($binary[12]), 4);
    $hash .= to64((ord($binary[1]) << 16) | (ord($binary[7]) << 8) | ord($binary[13]), 4);
    $hash .= to64((ord($binary[2]) << 16) | (ord($binary[8]) << 8) | ord($binary[14]), 4);
    $hash .= to64((ord($binary[3]) << 16) | (ord($binary[9]) << 8) | ord($binary[15]), 4);
    $hash .= to64((ord($binary[4]) << 16) | (ord($binary[10]) << 8) | ord($binary[5]), 4);
    $hash .= to64(ord($binary[11]), 2);

    return '$apr1$' . $salt . '$' . $hash;
}

/**
 * Generate cryptographically secure random salt
 *
 * @param int $length Length of salt to generate
 * @return string Random salt string
 */
function generateSalt($length)
{
    $chars = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    $salt = '';
    $charsLength = strlen($chars);

    for ($i = 0; $i < $length; $i++) {
        if (function_exists('random_int')) {
            $salt .= $chars[random_int(0, $charsLength - 1)];
        } else {
            $salt .= $chars[mt_rand(0, $charsLength - 1)];
        }
    }

    return $salt;
}

/**
 * Base64 encoding for APR1-MD5
 * Uses Apache's custom base64 alphabet
 *
 * @param int $value Value to encode
 * @param int $count Number of characters to generate
 * @return string Encoded string
 */
function to64($value, $count)
{
    $itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    $output = '';

    while (--$count >= 0) {
        $output .= $itoa64[$value & 0x3f];
        $value >>= 6;
    }

    return $output;
}

$_POST += ['data' => []];

$data = is_array($_POST['data']) ? $_POST['data'] : [];
$result = [];

foreach ($data as $datum) {
    if (isset($datum['user']) && isset($datum['password'])) {
        // Generate Apache-compatible APR1-MD5 hash
        $result[] = $datum['user'] . ':' . apr1_md5($datum['password']);
    }
}

header('Content-type: application/json');
echo json_encode($result);
