<?php

namespace App\Models;

use App\Models\Discount;
use App\Models\Category;
use App\Models\Price;

abstract class AbstractProduct
{
    protected string $id;
    protected string $name;
    protected string $description;
    protected int $inStock;
    protected Category $category;
    protected string $brand;
    protected Price $price;
    protected Discount|null $discount;
    protected array $images = [];

    public function __construct($id, $name, $description, $inStock, Category $category, $brand, Price $price, Discount|null $discount, array $images)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->inStock = $inStock;
        $this->category = $category;
        $this->brand = $brand;
        $this->price = $price;
        $this->discount = $discount;
        $this->images = $images;
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        $imageList = implode(",\n ", $this->images);

        return "Id: $this->id
, 
        Name: $this->name
, 
        Description: $this->description
, 
        InStock: $this->inStock
, 
        Category: $this->category
, 
        Brand: $this->brand
, 
        Price: $this->price
,
        Discount: $this->discount
, 
        Images: [$imageList]";
    }
}

class Product extends AbstractProduct
{
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'inStock' => $this->inStock,
            'category' => $this->category->toArray(),
            'brand' => $this->brand,
            'price' => $this->price->toArray(),
            'discount' => $this->discount ? $this->discount->toArray() : null,
            'images' => $this->images,
        ];
    }
}
