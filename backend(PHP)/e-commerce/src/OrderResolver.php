<?php

namespace App;

use PDO;
use Exception;

class OrderResolver
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function createOrder($items)
    {

        $this->pdo->beginTransaction();

        try {

            $stmt = $this->pdo->prepare('INSERT INTO orders () VALUES ()');
            $stmt->execute();
            $orderId = $this->pdo->lastInsertId();


            foreach ($items as $item) {
                if (empty($item['product_id']) || empty($item['name']) || empty($item['quantity'])) {
                    throw new Exception("Incorrect Data");
                }

                $stmt = $this->pdo->prepare('INSERT INTO order_items (order_id, product_id, name, quantity) VALUES (:order_id, :product_id, :name, :quantity)');
                $stmt->execute([
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'name' => $item['name'],
                    'quantity' => $item['quantity'],
                ]);
                $itemId = $this->pdo->lastInsertId();

                if (!empty($item['attributes'])) {
                    foreach ($item['attributes'] as $attribute) {
                        $stmt = $this->pdo->prepare('INSERT INTO order_item_attributes (item_id, attribute_name, attribute_value) VALUES (:item_id, :attribute_name, :attribute_value)');
                        $stmt->execute([
                            'item_id' => $itemId,
                            'attribute_name' => $attribute['attribute_name'],
                            'attribute_value' => $attribute['attribute_value'],
                        ]);
                    }
                }
            }

            $this->pdo->commit();

            return [
                'order_id' => $orderId,
                'items' => $items,
                'order_date' => date('Y-m-d H:i:s'),
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return [
                'error' => $e->getMessage()
            ];
        }
    }
}
