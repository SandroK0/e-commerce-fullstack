<?php

namespace App\Models;

use App\Models\OrderItem;

abstract class AbstractOrder
{
    protected int $id;
    protected array $items = [];
    protected string $orderDate;
    protected float $total;

    public function __construct(int $id, array $items, string $orderDate)
    {
        $this->id = $id;
        $this->items = $items;
        $this->orderDate = $orderDate;
        $this->total = $this->calculateTotal();
    }

    protected function calculateTotal(): float
    {
        $total = 0;
        foreach ($this->items as $item) {
            $total += $item->getPriceAmount();
        }
        return $total;
    }

    public function addOrderItem(OrderItem $item): void
    {
        $this->items[] = $item;
        $this->total = $this->calculateTotal();
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        return "Id: $this->id, Items: " . implode(", ", $this->items) . ", Order Date: $this->orderDate, Total: $this->total";
    }
}

class Order extends AbstractOrder
{
    public function toArray(): array
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
}
