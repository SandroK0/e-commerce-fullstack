<?php

namespace App\Models;


class Order
{
    private $id;
    private $items = [];
    private $orderDate;
    private $total;

    public function __construct($id, $items, $orderDate)
    {

        $this->id = $id;
        $this->items = $items;
        $this->orderDate = $orderDate;
        $this->total = $this->calculateTotal();
    }

    private function calculateTotal()
    {
        $total = 0;

        foreach ($this->items as $item) {
            $total += $item->getPriceAmount();
        }

        return $total;
    }

    public function toArray()
    {

        $itemsArray = array_map(function ($item) {
            return $item->toArray();
        }, $this->items);

        return [
            'id' => $this->id,
            'items' => $itemsArray,
            'order_date' => $this->orderDate,
            'total' => $this->total,
        ];
    }

    public function __toString()
    {
        return "Id : $this->id, Items: $this->items, Order Date: $this->orderDate, Total: $this->total";
    }
};
