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
        $stmt = $this->pdo->query("SELECT * FROM products");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $priceStmt = $this->pdo->query("SELECT * FROM prices");
        $prices = $priceStmt->fetchAll(PDO::FETCH_ASSOC);

        $imageStmt = $this->pdo->query("SELECT * FROM product_images");
        $images = $imageStmt->fetchAll(PDO::FETCH_ASSOC);

        $categoryStmt = $this->pdo->query("SELECT * FROM categories");
        $categories = $categoryStmt->fetchAll(PDO::FETCH_ASSOC);

        $imagesByProductId = [];
        foreach ($images as $image) {
            $productId = $image["product_id"];
            $imageUrl = $image["image_url"];

            if (!isset($imagesByProductId[$productId])) {
                $imagesByProductId[$productId] = [];
            }

            $imagesByProductId[$productId][] = $imageUrl;
        }

        $pricesByProductId = [];
        foreach ($prices as $price) {
            $pricesByProductId[$price["product_id"]] = $price;
        }

        $categoriesById = [];
        foreach ($categories as $category) {
            $categoriesById[$category["id"]] = $category;
        }

        foreach ($products as &$product) {
            $product_id = $product["id"];

            $product["price"] = $pricesByProductId[$product_id] ?? null;
            $product["images"] = $imagesByProductId[$product_id] ?? null;
            $product["category"] =
                $categoriesById[$product["category_id"]] ?? null;
        }

        return $products;
    }

    public function getProductById($id)
    {
        $id = (string) $id;

        $stmt = $this->pdo->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([":id" => $id]);

        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($product) {
            $priceStmt = $this->pdo->prepare(
                "SELECT * FROM prices WHERE product_id = :id"
            );
            $priceStmt->execute([":id" => $id]);
            $product["price"] = $priceStmt->fetch(PDO::FETCH_ASSOC);

            $imageStmt = $this->pdo->prepare(
                "SELECT * FROM product_images WHERE product_id = :id"
            );
            $imageStmt->execute([":id" => $id]);
            $product["images"] = $imageStmt->fetchAll(PDO::FETCH_COLUMN, 2);

            $categoryStmt = $this->pdo->prepare(
                "SELECT * FROM categories WHERE id = (SELECT category_id FROM products WHERE id = :id)"
            );
            $categoryStmt->execute([":id" => $id]);
            $product["category"] = $categoryStmt->fetch(PDO::FETCH_ASSOC);
        }
        return $product;
    }
}
