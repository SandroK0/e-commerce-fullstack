<?php

namespace App;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;

class SchemaBuilder
{
    private $productResolver;
    private $categoryResolver;
    private $orderResolver;
    private $attributeResolver;

    public function __construct($productResolver, $categoryResolver, $orderResolver, $attributeResolver)
    {
        $this->productResolver = $productResolver;
        $this->categoryResolver = $categoryResolver;
        $this->orderResolver = $orderResolver;
        $this->attributeResolver = $attributeResolver;
    }

    public function buildSchema()
    {
        $priceType = new ObjectType([
            'name' => 'Price',
            'fields' => [
                'amount' => ['type' => Type::float()],
                'currency_label' => ['type' => Type::string()],
                'currency_symbol' => ['type' => Type::string()],
            ],
        ]);

        $discountType = new ObjectType([
            'name' => 'Discount',
            'fields' => [
                'new_amount' => ['type' => Type::float()],
            ]
        ]);

        $categoryType = new ObjectType([
            'name' => 'Category',
            'fields' => [
                'id' => ['type' => Type::int()],
                'name' => ['type' => Type::string()],
            ],
        ]);

        $attributeItemType = new ObjectType([
            'name' => 'AttributeItem',
            'fields' => [
                'id' => ['type' => Type::int()],
                'value' => ['type' => Type::string()],
                'displayValue' => ['type' => Type::string()],
            ],
        ]);

        $attributeType = new ObjectType([
            'name' => 'Attribute',
            'fields' => [
                'id' => ['type' => Type::int()],
                'items' => ['type' => Type::listOf($attributeItemType)],
                'name' => ['type' => Type::string()],
                'type' => ['type' => Type::string()],
            ],
        ]);

        $productType = new ObjectType([
            'name' => 'Product',
            'fields' => [
                'id' => ['type' => Type::string()],
                'name' => ['type' => Type::string()],
                'description' => ['type' => Type::string()],
                'inStock' => ['type' => Type::int()],
                'category' => ['type' => $categoryType],
                'brand' => ['type' => Type::string()],
                'price' => ['type' => $priceType],
                'discount' => ['type' => $discountType],
                'attributes' => [
                    'type' => Type::listOf($attributeType),
                    'resolve' => function ($product, $root, $args) {
                        return $this->attributeResolver->getProductAttributes($product['id']);
                    },
                ],
                'images' => ['type' => Type::listOf(Type::string())],
            ],
        ]);

        $orderItemAttributeInputType = new InputObjectType([
            'name' => 'OrderItemAttributeInput',
            'fields' => [
                'type' => ['type' => Type::nonNull(Type::string())],
                'name' => ['type' => Type::nonNull(Type::string())],
                'value' => ['type' => Type::nonNull(Type::string())],
            ],
        ]);

        $orderItemAttributeOutputType = new ObjectType([
            'name' => 'OrderItemAttributOutput',
            'fields' => [
                'type' => ['type' => Type::nonNull(Type::string())],
                'name' => ['type' => Type::nonNull(Type::string())],
                'value' => ['type' => Type::nonNull(Type::string())],
            ],
        ]);

        $orderItemInputType = new InputObjectType([
            'name' => 'OrderItemInput',
            'fields' => [
                'product_id' => ['type' => Type::nonNull(Type::string())],
                'name' => ['type' => Type::nonNull(Type::string())],
                'quantity' => ['type' => Type::nonNull(Type::int())],
                'attributes' => ['type' => Type::listOf($orderItemAttributeInputType)],
            ],
        ]);

        $orderItemOutputType = new ObjectType([
            'name' => 'OrderItemOutput',
            'fields' => [
                'item_id' => ['type' => Type::nonNull(Type::int())],
                'product_id' => ['type' => Type::nonNull(Type::string())],
                'name' => ['type' => Type::nonNull(Type::string())],
                'quantity' => ['type' => Type::nonNull(Type::int())],
                'attributes' => [
                    'type' => Type::listOf($orderItemAttributeOutputType),
                    'resolve' => function ($item, $root, $args) {
                        return $this->attributeResolver->getOrderItemAttributes($item['item_id']);
                    }
                ],
                'price' => ['type' => $priceType],
                'discount' => ['type' => $discountType],
            ],
        ]);

        $orderType = new ObjectType([
            'name' => 'Order',
            'fields' => [
                'id' => ['type' => Type::nonNull(Type::int())],
                'items' => ['type' => Type::nonNull(Type::listOf($orderItemOutputType))],
                'order_date' => ['type' => Type::string()],
                'total' => ['type' => Type::float()]
            ],
        ]);;

        $queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'products' => [
                    'type' => Type::listOf($productType),
                    'resolve' => function ($root, $args) {
                        return $this->productResolver->getAllProducts();
                    },
                ],
                'product' => [
                    'type' => $productType,
                    'args' => [
                        'id' => [
                            'type' => Type::nonNull(Type::string()),
                            'description' => 'The ID of the product.',
                        ],
                    ],
                    'resolve' => function ($root, $args) {
                        return $this->productResolver->getProductById($args['id']);
                    },
                ],
                'categories' => [
                    'type' => Type::listOf($categoryType),
                    'resolve' => function ($root, $args) {
                        return $this->categoryResolver->getCategories();
                    },
                ],
                'orders' => [
                    'type' => Type::listOf($orderType),
                    'resolve' => function ($root, $args) {
                        return $this->orderResolver->getOrders();
                    }
                ],
                'order' => [
                    'type' => $orderType,
                    'args' => ['order_id' => ['type' => Type::nonNull(Type::int())]],
                    'resolve' => function ($root, $args) {
                        return $this->orderResolver->getOrderById($args['order_id']);
                    }
                ],
            ],
        ]);

        $mutationType = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'placeOrder' => [
                    'type' => $orderType,
                    'args' => [
                        'items' => [
                            'type' => Type::nonNull(Type::listOf($orderItemInputType)),
                        ],
                    ],
                    'resolve' => function ($root, $args) {
                        return $this->orderResolver->placeOrder($args['items']);
                    },
                ],
            ],
        ]);

        // Create the schema
        return new Schema([
            'query' => $queryType,
            'mutation' => $mutationType,
        ]);
    }
}
