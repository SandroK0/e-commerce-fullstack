<?php
require "../vendor/autoload.php";


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}


switch ($_SERVER["REQUEST_URI"]) {
    case "/graphql":
        require '../src/Graphql.php';
        break;

    default:
        echo "nothing found for this url";
        break;
}
