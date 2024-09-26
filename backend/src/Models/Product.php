<?php

namespace App\Models;

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
    protected array $images = [];

    public function __construct($id, $name, $description, $inStock, Category $category, $brand, Price $price, array $images)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->inStock = $inStock;
        $this->category = $category;
        $this->brand = $brand;
        $this->price = $price;
        $this->images = $images;
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        $imageList = implode(",\n ", $this->images);

        return "Id: $this->id\n, 
        Name: $this->name\n, 
        Description: $this->description\n, 
        InStock: $this->inStock\n, 
        Category: $this->category\n, 
        Brand: $this->brand\n, 
        Price: $this->price\n, 
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
            'images' => $this->images,
        ];
    }
}
