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

        $productAttributesStmt = $this->pdo->query("SELECT * FROM product_attributes");
        $productAttributes = $productAttributesStmt->fetchAll(PDO::FETCH_ASSOC);

        $attributeItemsStmt = $this->pdo->query("SELECT * FROM attribute_items");
        $attributeItems = $attributeItemsStmt->fetchAll(PDO::FETCH_ASSOC);

        $attributesByProductId = [];
        foreach ($productAttributes as $Attribute) {
            $productId = $Attribute['product_id'];

            if (!isset($attributesByProductId[$productId])) {
                $attributesByProductId[$productId] = [];
            }

            $attributesByProductId[$productId][] = $Attribute;
        }



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
            $product["price"] = $pricesByProductId[$product["id"]] ?? null;
            $product["images"] = $imagesByProductId[$product["id"]] ?? null;
            $product["category"] =
                $categoriesById[$product["category_id"]] ?? null;
            $product["attributes"] = $attributesByProductId[$product["id"]] ?? null;

            if ($product["attributes"]) {
                foreach ($product["attributes"] as &$attribute) {
                    $attribute["items"] = array_filter($attributeItems, function ($item) use ($attribute) {
                        return $item["name"] === $attribute["name"];
                    });
                }
            }
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

            $attributeStmt = $this->pdo->prepare("SELECT * FROM product_attributes WHERE product_id = :id");
            $attributeStmt->execute([":id" => $id]);
            $product["attributes"] = $attributeStmt->fetchAll(PDO::FETCH_ASSOC);

            $attributeItemStmt = $this->pdo->prepare("SELECT * FROM attribute_items WHERE product_id = :id");
            $attributeItemStmt->execute([":id" => $id]);
            $attributeItems = $attributeItemStmt->fetchAll(PDO::FETCH_ASSOC);


            foreach ($product["attributes"] as &$attribute) {
                $attribute["items"] = array_filter($attributeItems, function ($item) use ($attribute) {
                    return $item["name"] === $attribute["name"];
                });
            }
        }
        return $product;
    }
}
