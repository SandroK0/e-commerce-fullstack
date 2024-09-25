<?php

namespace App\Resolvers;

use App\Repositories\AttributeRepository;

class AttributeResolver
{
    private $attributeRepository;

    public function __construct(AttributeRepository $attributeRepository)
    {
        $this->attributeRepository = $attributeRepository;
    }

    public function getProductAttributes($productId)
    {
        $attributes = $this->attributeRepository->getProductAttributes($productId);
        return $attributes ? array_map(function ($attribute) {
            return $attribute->toArray();
        }, $attributes) : [];
    }

    public function getOrderItemAttributes($itemId)
    {
        $attributes = $this->attributeRepository->getOrderItemAttributes($itemId);
        return $attributes ? array_map(function ($attribute) {
            return $attribute->toArray();
        }, $attributes) : [];
    }
}