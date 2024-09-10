<?php

namespace App;

use PDO;

class AttributeResolver
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getProductAttributes($productId)
    {
        $attributes = [];
        $attributeStmt = $this->pdo->prepare(
            "SELECT * FROM product_attributes WHERE product_id = :id"
        );
        $attributeStmt->execute([":id" => $productId]);
        $attributes  = $attributeStmt->fetchAll(PDO::FETCH_ASSOC);

        $attributeItemStmt = $this->pdo->prepare(
            "SELECT * FROM attribute_items WHERE product_id = :id"
        );
        $attributeItemStmt->execute([":id" => $productId]);
        $attributeItems = $attributeItemStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($attributes as &$attribute) {
            $attribute["items"] = array_filter($attributeItems, function (
                $item
            ) use ($attribute) {
                return $item["name"] === $attribute["name"];
            });
        }
        return $attributes;
    }
}
