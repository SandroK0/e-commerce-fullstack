<?php
namespace App;

use PDO;

class Database
{
    private $pdo;

    public function __construct($host, $dbname, $username, $password)
    {
        $this->pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}
