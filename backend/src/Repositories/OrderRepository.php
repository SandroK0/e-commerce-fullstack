<?php

namespace App\Repositories;

use App\Models\Price;
use App\Models\Order;
use App\Models\OrderItem;


use PDO;

use Exception;

interface OrderRepositoryInterface
{
    public function getOrders();
    public function getOrderById($orderId);
    public function placeOrder($items);
}



class OrderRepository implements OrderRepositoryInterface
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
                *
            FROM 
                orders
        ";

        $stmt = $this->pdo->query($query);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($results)) {
            return [];
        }

        $orders = [];

        $orderItemsByOrderId = $this->getOrderItems();

        foreach ($results as $row) {
            $order = $this->createOrderFromRow($row, $orderItemsByOrderId[$row['id']]);
            $orders[] = $order;
        }

        return $orders;
    }

    public function getOrderById($orderId)
    {
        $query = "
            SELECT 
                *
            FROM
                orders
            WHERE 
                id = :orderId
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(':orderId', $orderId, PDO::PARAM_INT);
        $stmt->execute();
        $results = $stmt->fetch(PDO::FETCH_ASSOC);

        if (empty($results)) {
            return null;
        }
        $orderItemsByOrderId = $this->getOrderItems($orderId);


        return  $this->createOrderFromRow($results, $orderItemsByOrderId[$results['id']]);;
    }


    public function placeOrder($items)
    {

        $this->pdo->beginTransaction();

        try {
            $stmt = $this->pdo->prepare('INSERT INTO orders (order_date) VALUES (NOW())');
            $stmt->execute();
            $orderId = $this->pdo->lastInsertId();

            $orderItems = [];
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

                $priceStmt = $this->pdo->prepare('SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = :product_id');
                $priceStmt->execute(['product_id' => $item['product_id']]);
                $priceData = $priceStmt->fetch(PDO::FETCH_ASSOC);

                $price = new Price($priceData['amount'], $priceData['currency_label'], $priceData['currency_symbol']);
                $orderItem = new OrderItem($itemId, $item['product_id'], $item['name'], $item['quantity'], $price);
                $orderItems[] = $orderItem;

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

            $order = new Order($orderId, $orderItems, date('Y-m-d H:i:s'));

            return $order->toArray();
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    private function createOrderFromRow($row, $items)
    {

        $order  = new Order($row['id'], $items, $row['order_date']);
        return $order;
    }

    private function getOrderItems($orderId = null)
    {
        $query = "
            SELECT 
                oi.*,
                p.amount AS price_amount,
                p.currency_label,
                p.currency_symbol
            FROM order_items oi
            LEFT JOIN prices p ON oi.product_id = p.product_id
        ";

        $params = [];

        if ($orderId !== null) {
            $query .= " WHERE oi.order_id = :orderId";
            $params[':orderId'] = $orderId;
        }


        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $orderItemsByOrderId = [];
        foreach ($results as $row) {
            $orderId = $row['order_id'];
            $itemPrice = new Price($row["price_amount"], $row["currency_label"], $row["currency_symbol"]);
            $orderItem = new OrderItem($row['id'], $row['product_id'], $row['name'], $row['quantity'], $itemPrice);


            $orderItemsByOrderId[$orderId][] = $orderItem;
        }
        return $orderItemsByOrderId;
    }
}
