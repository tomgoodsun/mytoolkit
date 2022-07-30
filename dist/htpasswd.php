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

$_POST += [ 'data' => [] ];

$data = is_array($_POST['data']) ? $_POST['data'] : [];
$result = [];

foreach ($data as $datum) {
    $result[] = $datum['user'] . ':' . password_hash($datum['password'], PASSWORD_BCRYPT);
}

header('Content-type: application/json');
echo json_encode($result);
