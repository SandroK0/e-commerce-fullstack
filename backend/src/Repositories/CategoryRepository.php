<?php

namespace App\Repositories;

use PDO;
use App\Models\Category;


class CategoryRepository
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getCategories()
    {
        $stmt = $this->pdo->query("SELECT * FROM categories");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $categories = [];

        foreach ($results as $row) {
            $categories[] = $this->createCategoryFromRow($row);
        }


        return $categories;
    }

    private function createCategoryFromRow($row)
    {
        return new Category($row['id'], $row['name']);
    }
}
