<?php

namespace App\Repositories;

use App\Models\Attribute;
use App\Models\AttributeItem;
use App\Models\OrderItemAttribute;
use PDO;

interface AttributeRepositoryInterface
{
    public function getProductAttributes(string $productId): array;
    public function getOrderItemAttributes(int $itemId): array;
}

class AttributeRepository implements AttributeRepositoryInterface
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getProductAttributes(string $productId): array
    {
        $attributeStmt = $this->pdo->prepare(
            "SELECT * FROM product_attributes WHERE product_id = :id"
        );
        $attributeStmt->execute([":id" => $productId]);
        $results = $attributeStmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$results) {
            return [];
        }

        $attributeItemStmt = $this->pdo->prepare(
            "SELECT * FROM attribute_items WHERE product_id = :id"
        );
        $attributeItemStmt->execute([":id" => $productId]);
        $attributeItems = $attributeItemStmt->fetchAll(PDO::FETCH_ASSOC);

        $row["items"] = [];
        foreach ($results as &$row) {
            $row["items"] = array_values(array_filter(array_map(
                fn($item) => $item["name"] === $row["name"]
                    ? new AttributeItem($item["id"], $item["value"], $item["displayValue"])
                    : null,
                $attributeItems
            )));
        }

        $attributes = [];
        foreach ($results as &$row) {
            $attribute = $this->createAttributeFromRow($row);
            $attributes[] = $attribute;
        }
        return $attributes;
    }

    public function getOrderItemAttributes(int $itemId): array
    {


        $query = "SELECT * FROM order_item_attributes WHERE item_id = :itemId";

        $stmt = $this->pdo->prepare($query);
        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":itemId", $itemId, PDO::PARAM_STR);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $attributes = [];
        foreach ($results as $row) {
            $attributes[] = $this->createOrderItemAttributeFromRow($row);
        }

        return $attributes;
    }

    private function createAttributeFromRow($row)
    {
        return new Attribute(
            $row["id"],
            $row["items"],
            $row["name"],
            $row["type"]
        );;
    }

    private function createOrderItemAttributeFromRow($row)
    {
        return new OrderItemAttribute($row['type'], $row['name'], $row['value']);
    }
}
