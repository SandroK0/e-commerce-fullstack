<?php

namespace App;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;

class SchemaBuilder
{
    private $productResolver;
    private $categoryResolver;
    private $orderResolver;

    public function __construct($productResolver, $categoryResolver, $orderResolver)
    {
        $this->productResolver = $productResolver;
        $this->categoryResolver = $categoryResolver;
        $this->orderResolver = $orderResolver;
    }

    public function buildSchema()
    {
        $priceType = new ObjectType([
            "name" => "Price",
            "fields" => [
                "amount" => ["type" => Type::float()],
                "currency_label" => ["type" => Type::string()],
                "currency_symbol" => ["type" => Type::string()],
            ],
        ]);

        $categoryType = new ObjectType([
            "name" => "Category",
            "fields" => [
                "id" => ["type" => Type::int()],
                "name" => ["type" => Type::string()],
            ],
        ]);

        $attributeItemType = new ObjectType([
            "name" => "AttributeItem",
            "fields" => [
                "id" => ["type" => Type::int()],
                "value" => ["type" => Type::string()],
                "displayValue" => ["type" => Type::string()],
            ],
        ]);

        $attributeType = new ObjectType([
            "name" => "Attribute",
            "fields" => [
                "id" => ["type" => Type::int()],
                "items" => ["type" => Type::listOf($attributeItemType)],
                "name" => ["type" => Type::string()],
                "type" => ["type" => Type::string()],
            ],
        ]);

        $productType = new ObjectType([
            "name" => "Product",
            "fields" => [
                "id" => ["type" => Type::string()],
                "name" => ["type" => Type::string()],
                "description" => ["type" => Type::string()],
                "inStock" => ["type" => Type::int()],
                "category" => ["type" => $categoryType],
                "brand" => ["type" => Type::string()],
                "price" => ["type" => $priceType],
                "attributes" => ["type" => Type::listOf($attributeType)],
                "images" => ["type" => Type::listOf(Type::string())],
            ],
        ]);

        $attributeInputType = new InputObjectType([
            "name" => "AttributeInput",
            "fields" => [
                "type" => ["type" => Type::nonNull(Type::string())],
                "name" => ["type" => Type::nonNull(Type::string())],
                "value" => ["type" => Type::nonNull(Type::string())],
            ],
        ]);


        $attributeOutputType = new ObjectType([
            "name" => "AttributOutput",
            "fields" => [
                "type" => ["type" => Type::nonNull(Type::string())],
                "name" => ["type" => Type::nonNull(Type::string())],
                "value" => ["type" => Type::nonNull(Type::string())],
            ],
        ]);

        $orderItemInputType = new InputObjectType([
            "name" => "OrderItemInput",
            "fields" => [
                "product_id" => ["type" => Type::nonNull(Type::string())],
                "name" => ["type" => Type::nonNull(Type::string())],
                "quantity" => ["type" => Type::nonNull(Type::int())],
                "attributes" => ["type" => Type::listOf($attributeInputType)],
            ],
        ]);

        $orderItemOutputType = new ObjectType([
            "name" => "OrderItemOutput",
            "fields" => [
                "product_id" => ["type" => Type::nonNull(Type::string())],
                "name" => ["type" => Type::nonNull(Type::string())],
                "quantity" => ["type" => Type::nonNull(Type::int())],
                "attributes" => ["type" => Type::listOf($attributeOutputType)],
                "price" => ["type" => $priceType],
            ],
        ]);

        $orderType = new ObjectType([
            "name" => "Order",
            "fields" => [
                "id" => ["type" => Type::nonNull(Type::int())],
                "items" => ["type" => Type::nonNull(Type::listOf($orderItemOutputType))],
                "order_date" => ["type" => Type::string()],
                "total" => ["type" => Type::float()]
            ],
        ]);;


        $queryType = new ObjectType([
            "name" => "Query",
            "fields" => [
                "products" => [
                    "type" => Type::listOf($productType),
                    "resolve" => function ($root, $args) {
                        return $this->productResolver->getAllProducts();
                    },
                ],
                "product" => [
                    "type" => $productType,
                    "args" => [
                        "id" => [
                            "type" => Type::nonNull(Type::string()),
                            "description" => "The ID of the product.",
                        ],
                    ],
                    "resolve" => function ($root, $args) {
                        return $this->productResolver->getProductById($args["id"]);
                    },
                ],
                "categories" => [
                    "type" => Type::listOf($categoryType),
                    "resolve" => function ($root, $args) {
                        return $this->categoryResolver->getCategories();
                    },
                ],
                "orders" => [
                    "type" => Type::listOf($orderType),
                    "resolve" => function ($root, $args) {
                        return $this->orderResolver->getOrders();
                    }
                ]
            ],
        ]);


        $mutationType = new ObjectType([
            "name" => "Mutation",
            "fields" => [
                "createOrder" => [
                    "type" => $orderType,
                    "args" => [
                        "items" => [
                            "type" => Type::nonNull(Type::listOf($orderItemInputType)),
                        ],
                    ],
                    "resolve" => function ($root, $args) {
                        return $this->orderResolver->createOrder($args['items']);
                    },
                ],
            ],
        ]);


        // Create the schema
        return new Schema([
            "query" => $queryType,
            "mutation" => $mutationType,
        ]);
    }
}