<?php

namespace App;

use PDO;

class CategoryResolver
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getCategories()
    {
        $stmt = $this->pdo->query("SELECT * FROM categories");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return  $categories;
    }
}
