<?php

namespace App\Resolvers;

use App\Repositories\OrderRepository;

class OrderResolver
{
    private $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }


    public function getOrders()
    {

        $orders = $this->orderRepository->getOrders();
        return $orders ? array_map(function ($order) {
            return $order->toArray();
        }, $orders) : [];
    }

    public function getOrderById($orderId)
    {
        $order = $this->orderRepository->getOrderById($orderId);
        return $order ?  $order->toArray() : null;
    }


    public function placeOrder(array $items)
    {
        $response = $this->orderRepository->placeOrder($items);
        return $response;
    }
}
