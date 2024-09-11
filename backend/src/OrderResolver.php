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


    public function getOrders()
    {
        $query = "
            SELECT 
                o.id AS order_id, 
                o.order_date, 
                oi.id AS item_id, 
                oi.product_id, 
                oi.name AS item_name, 
                oi.quantity, 
                p.amount AS price_amount, 
                p.currency_label, 
                p.currency_symbol, 
                oia.type AS attribute_type, 
                oia.name AS attribute_name, 
                oia.value AS attribute_value
            FROM 
                orders o
            LEFT JOIN 
                order_items oi ON o.id = oi.order_id
            LEFT JOIN 
                prices p ON oi.product_id = p.product_id
            LEFT JOIN 
                order_item_attributes oia ON oi.id = oia.item_id
        ";

        $stmt = $this->pdo->query($query);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $orders = [];
        $orderItemsByOrderId = [];

        foreach ($results as $row) {
            $orderId = $row['order_id'];
            $itemId = $row['item_id'];
            
            // Initialize order if it doesn't exist in the array
            if (!isset($orders[$orderId])) {
                $orders[$orderId] = [
                    'id' => $orderId,
                    'order_date' => $row['order_date'],
                    'items' => [],
                    'total' => 0,
                ];
            }
      
            // Initialize item if it doesn't exist in the array
            if ($itemId && !isset($orderItemsByOrderId[$orderId][$itemId])) {
                $orderItemsByOrderId[$orderId][$itemId] = [
                    'product_id' => $row['product_id'],
                    'name' => $row['item_name'],
                    'quantity' => $row['quantity'],
                    'price' => [
                        'amount' => $row['price_amount'],
                        'currency_label' => $row['currency_label'],
                        'currency_symbol' => $row['currency_symbol'],
                    ],
                    'attributes' => [],
                ];

                // Add item to the order and update the total
                $orders[$orderId]['items'][] = &$orderItemsByOrderId[$orderId][$itemId];
                $orders[$orderId]['total'] += $row['price_amount'] * $row['quantity'];
            };
            $orders[$orderId]["total"] = sprintf("%.2f", $orders[$orderId]["total"]);
            // Add attribute if it existsd
            if ($row['attribute_type']) {
                $orderItemsByOrderId[$orderId][$itemId]['attributes'][] = [
                    'type' => $row['attribute_type'],
                    'name' => $row['attribute_name'],
                    'value' => $row['attribute_value'],
                ];
            }
        }

    

        // Reindex orders array
        $orders = array_values($orders);

        return $orders;
    }
  
    public function getOrderById($orderId)
    {
        $query = "
            SELECT 
                o.id AS order_id, 
                o.order_date, 
                oi.id AS item_id, 
                oi.product_id, 
                oi.name AS item_name, 
                oi.quantity, 
                p.amount AS price_amount, 
                p.currency_label, 
                p.currency_symbol, 
                oia.type AS attribute_type, 
                oia.name AS attribute_name, 
                oia.value AS attribute_value
            FROM 
                orders o
            LEFT JOIN 
                order_items oi ON o.id = oi.order_id
            LEFT JOIN 
                prices p ON oi.product_id = p.product_id
            LEFT JOIN 
                order_item_attributes oia ON oi.id = oia.item_id
            WHERE 
                o.id = :orderId
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':orderId', $orderId, PDO::PARAM_INT);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($results)) {
            return null; // Return null if no order is found
        }

        $order = [];
        $orderItemsByOrderId = [];

        foreach ($results as $row) {
            $itemId = $row['item_id'];

            // Initialize order array
            if (empty($order)) {
                $order = [
                    'id' => $row['order_id'],
                    'order_date' => $row['order_date'],
                    'items' => [],
                    'total' => 0,
                ];
            }

            // Initialize item if it doesn't exist
            if ($itemId && !isset($orderItemsByOrderId[$itemId])) {
                $orderItemsByOrderId[$itemId] = [
                    'product_id' => $row['product_id'],
                    'name' => $row['item_name'],
                    'quantity' => $row['quantity'],
                    'price' => [
                        'amount' => $row['price_amount'],
                        'currency_label' => $row['currency_label'],
                        'currency_symbol' => $row['currency_symbol'],
                    ],
                    'attributes' => [],
                ];

                // Add item to the order and update the total
                $order['items'][] = &$orderItemsByOrderId[$itemId];
                $order['total'] += $row['price_amount'] * $row['quantity'];
            }

            $order["total"] = sprintf("%.2f", $order["total"]);
            // Add attribute if it exists
            if ($row['attribute_type']) {
                $orderItemsByOrderId[$itemId]['attributes'][] = [
                    'type' => $row['attribute_type'],
                    'name' => $row['attribute_name'],
                    'value' => $row['attribute_value'],
                ];
            }
        }

        return $order;
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
                        $stmt = $this->pdo->prepare('INSERT INTO order_item_attributes (item_id, type, name, value) VALUES (:item_id, :type, :name, :value)');
                        $stmt->execute([
                            'item_id' => $itemId,
                            'type' => $attribute['type'],
                            'name' => $attribute['name'],
                            'value' => $attribute['value'],
                        ]);
                    }
                }
            }

            $this->pdo->commit();

            return [
                'order_id' => $orderId,
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
