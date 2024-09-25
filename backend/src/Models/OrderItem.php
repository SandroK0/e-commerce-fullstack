<?php


namespace App\Models;

use App\Models\Price;


class OrderItem
{
    private $itemId;
    private $productId;
    private $name;
    private $quantity;
    private $price;


    public function __construct($itemId, $productId, $name, $quantity, Price $price)
    {
        $this->itemId = $itemId;
        $this->productId = $productId;
        $this->name = $name;
        $this->quantity = $quantity;
        $this->price = $price;
    }

    public function getPriceAmount()
    {
        return $this->price->getAmount();
    }

    public function toArray()
    {
        return [
            'item_id' => $this->itemId,
            'product_id' => $this->productId,
            'name' => $this->name,
            'quantity' => $this->quantity,
            'price' => $this->price->toArray(),
        ];
    }

    public function __toString()
    {
        return "Id: $this->itemId, Product ID: $this->productId, Name: $this->name, Quantity: $this->quantity, Price: $this->price";
    }
};
