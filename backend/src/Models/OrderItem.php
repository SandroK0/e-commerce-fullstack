<?php

namespace App\Models;

use App\Models\Price;

abstract class AbstractOrderItem
{
    protected int $itemId;
    protected string $productId;
    protected string $name;
    protected int $quantity;
    protected Price $price;

    public function __construct(int $itemId, string $productId, string $name, int $quantity, Price $price)
    {
        $this->itemId = $itemId;
        $this->productId = $productId;
        $this->name = $name;
        $this->quantity = $quantity;
        $this->price = $price;
    }

    public function getPriceAmount(): float
    {
        return $this->price->getAmount();
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        return "Id: $this->itemId, Product ID: $this->productId, Name: $this->name, Quantity: $this->quantity, Price: $this->price";
    }
}

class OrderItem extends AbstractOrderItem
{
    public function toArray(): array
    {
        return [
            'item_id' => $this->itemId,
            'product_id' => $this->productId,
            'name' => $this->name,
            'quantity' => $this->quantity,
            'price' => $this->price->toArray(),
        ];
    }
}
