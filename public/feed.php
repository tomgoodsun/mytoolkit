<?php
header('Access-Control-Allow-Origin: *');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$url = isset($_GET['url']) ? trim($_GET['url']) : '';

if (empty($url) || !preg_match('/^https?:\/\//', $url)) {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Invalid URL';
    exit;
}

if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; FeedTester/1.0)');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $content = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($content === false) {
        header('HTTP/1.1 502 Bad Gateway');
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Failed to fetch: ' . $error;
        exit;
    }
} else {
    $opts = array(
        'http' => array(
            'timeout' => 10,
            'user_agent' => 'Mozilla/5.0 (compatible; FeedTester/1.0)',
            'follow_location' => 1,
            'max_redirects' => 3,
        ),
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
        )
    );
    $context = stream_context_create($opts);
    $content = @file_get_contents($url, false, $context);

    if ($content === false) {
        header('HTTP/1.1 502 Bad Gateway');
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Failed to fetch URL';
        exit;
    }
}

header('Content-Type: application/xml; charset=utf-8');
echo $content;
