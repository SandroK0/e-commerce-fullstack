<?php

namespace App\Models;

use App\Models\AttributeItem;

abstract class AbstractAttribute
{
    protected int $id;
    protected array $items = [];
    protected string $name;
    protected string $type;

    public function __construct(int $id, array $items, string $name, string $type)
    {
        $this->id = $id;
        $this->items = $items;
        $this->name = $name;
        $this->type = $type;
    }

    public function addItem(AttributeItem $item): void
    {
        $this->items[] = $item;
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        return "Id: $this->id, Items: " . implode(", ", $this->items) . ", Name: $this->name, Type: $this->type";
    }
}

class Attribute extends AbstractAttribute
{
    public function toArray(): array
    {
        $itemsArray = array_map(function ($item) {
            return $item->toArray();
        }, $this->items);

        return [
            'id' => $this->id,
            'items' => $itemsArray,
            'name' => $this->name,
            'type' => $this->type,
        ];
    }
}
