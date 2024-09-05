<?php
require "../vendor/autoload.php";
require "../src/Database.php";
require "../src/ProductResolver.php";
require "../src/OrderResolver.php";
require "../src/SchemaBuilder.php";
require "../src/CategoryResolver.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

use App\CategoryResolver;
use GraphQL\GraphQL;
use GraphQL\Error\Error;
use App\Database;
use App\ProductResolver;
use App\OrderResolver;
use App\SchemaBuilder;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/../");
$dotenv->load();

$db_host = $_ENV['DB_HOST'];
$db_name = $_ENV['DB_NAME'];
$user = $_ENV['USERNAME'];
$pass = $_ENV['PASSWORD'];

// Set up the database connection
$db = new Database($db_host, $db_name, $user, $pass);
$pdo = $db->getConnection();

// Set up resolvers
$productResolver = new ProductResolver($pdo);
$categoryResolver = new CategoryResolver($pdo);
$orderResolver = new OrderResolver($pdo);

// Set up the schema
$schemaBuilder = new SchemaBuilder($productResolver, $categoryResolver, $orderResolver);
$schema = $schemaBuilder->buildSchema();

// Process the GraphQL request
$rawInput = file_get_contents("php://input");
$input = json_decode($rawInput, true);

$query = $input["query"] ?? "";
$variables = $input["variables"] ?? [];

if (empty($query)) {
    echo json_encode(['errors' => ['No query provided']]);
    exit();
}

try {
    // Execute the query
    $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
    $output = $result->toArray();
} catch (Error $error) {
    // Handle GraphQL specific errors
    $output = ["errors" => [$error->getMessage()]];
} catch (\Exception $error) {
    // Handle general exceptions
    $output = ["errors" => [$error->getMessage()]];
}

// Output the result
header("Content-Type: application/json");
echo json_encode($output);