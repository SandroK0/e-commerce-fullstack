<?php

namespace App\Models;


class Attribute
{
    private $id;
    private $items = [];
    private $name;
    private $type;

    public function __construct($id, $items, $name, $type)
    {
        $this->id = $id;
        $this->items = $items;
        $this->name = $name;
        $this->type = $type;
    }

    public function toArray()
    {

        $itemsArray = array_map(function ($item) {
            return $item->toArray();
        }, $this->items);

        return [
            'id' => $this->id,
            'items' => $itemsArray,
            'name' => $this->name,
            'type' => $this->type
        ];
    }

    public function __toString()
    {
        return "Id: $this->id, Items: $this->items, Name: $this->name, Type: $this->type";
    }
}
