<?php

namespace App\Resolvers;

use App\Repositories\ProductRepository;



class ProductResolver
{
    private $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAllProducts()
    {
        $products = $this->productRepository->getAllProducts();
        return $products ? array_map(function ($product) {
            return $product->toArray();
        }, $products) : [];
    }

    public function getProductById(string $id)
    {
        $product = $this->productRepository->getProductById($id);

        return $product ? $product->toArray() : null;
    }
}
