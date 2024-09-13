<?php

namespace App;

use PDO;

class ProductResolver
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAllProducts()
    {
        $query = "
        SELECT 
            p.id AS id,
            p.name AS name,
            p.description AS description,
            p.inStock AS inStock,
            p.brand AS brand,
            c.id AS category_id,
            c.name AS category_name,
            prc.amount AS price_amount, 
            prc.currency_label, 
            prc.currency_symbol
        FROM
            products p
        LEFT JOIN 
            categories c ON p.category_id = c.id
        LEFT JOIN 
            prices prc ON p.id = prc.product_id
    ";

        $stmt = $this->pdo->query($query);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($results)) {
            return null;
        }

        $imageStmt = $this->pdo->query("SELECT * FROM product_images");
        $images = $imageStmt->fetchAll(PDO::FETCH_ASSOC);

        $products = [];

        $imagesByProductId = [];
        foreach ($images as $image) {
            $productId = $image["product_id"];
            $imageUrl = $image["image_url"];

            if (!isset($imagesByProductId[$productId])) {
                $imagesByProductId[$productId] = [];
            }

            $imagesByProductId[$productId][] = $imageUrl;
        }


        foreach ($results as $row) {

            $product = [
                'id' => $row["id"],
                'name' => $row["name"],
                'description' => $row["description"],
                "inStock" => $row["inStock"],
                "category" => [
                    "id" => $row["category_id"],
                    "name" => $row["category_name"],
                ],
                "brand" => $row["brand"],
                "images" => $imagesByProductId[$row["id"]] ?? [],
                "price" => [
                    "amount" => $row["price_amount"],
                    "currency_label" => $row["currency_label"],
                    "currency_symbol" => $row["currency_symbol"],
                ]

            ];
            $products[] = $product;
        }


        $output = $products;
        return $output;
    }

    public function getProductById($id)
    {
        $id = (string) $id;

        $query = "
            SELECT 
                p.id AS id,
                p.name AS name,
                p.description AS description,
                p.inStock AS inStock,
                c.id AS category_id,
                c.name AS category_name,
                p.brand AS brand,
                prc.amount AS price_amount, 
                prc.currency_label, 
                prc.currency_symbol
            FROM
                products p
            LEFT JOIN 
                categories c ON p.category_id = c.id
            LEFT JOIN 
                prices prc ON p.id = prc.product_id
            WHERE
                p.id = :productId
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':productId', $id, PDO::PARAM_STR);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($results)) {
            return null;
        }


        $imageStmt = $this->pdo->prepare("SELECT * FROM product_images where product_id = :productId");
        $imageStmt->bindParam("productId", $id, PDO::PARAM_STR);
        $imageStmt->execute();
        $images = $imageStmt->fetchAll(PDO::FETCH_ASSOC);


        $imagesByProductId = [];
        foreach ($images as $image) {
            $productId = $image["product_id"];
            $imageUrl = $image["image_url"];

            if (!isset($imagesByProductId[$productId])) {
                $imagesByProductId[$productId] = [];
            }

            $imagesByProductId[$productId][] = $imageUrl;
        }


        foreach ($results as $row) {

            $product = [
                'id' => $row["id"],
                'name' => $row["name"],
                'description' => $row["description"],
                "inStock" => $row["inStock"],
                "category" => [
                    "id" => $row["category_id"],
                    "name" => $row["category_name"],
                ],
                "brand" => $row["brand"],
                "images" => $imagesByProductId[$row["id"]] ?? [],
                "price" => [
                    "amount" => $row["price_amount"],
                    "currency_label" => $row["currency_label"],
                    "currency_symbol" => $row["currency_symbol"],
                ]

            ];
        }


        $output = $product;
        return $output;
    }
}
