<?php
$visitorJSON = file_get_contents('php://input');
$visitor = json_decode($visitorJSON, true);
$ip = $visitor['ip'];
$browser = $visitor['browser'];
$visitorData = date('Y-m-d H:i:s') . ' - ' . $ip . ' - ' . $browser . "\n";
file_put_contents('visitors.txt', $visitorData, FILE_APPEND);
?>
