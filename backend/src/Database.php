<?php
namespace App;

use PDO;
use PDOException;

class Database
{
    private $pdo;

    public function __construct($host, $dbname, $username, $password)
    {
        try {
            $this->pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // Handle the exception and display a user-friendly message
            die("Error connecting to the database: " . $e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}

