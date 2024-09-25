<?php

namespace App\Models;

class OrderItemAttribute
{
    private $type;
    private $name;
    private $value;


    public function __construct($type, $name, $value)
    {
        $this->type = $type;
        $this->name = $name;
        $this->value = $value;
    }


    public function toArray()
    {
        return [
            'type' => $this->type,
            'name' => $this->name,
            'value' => $this->value,
        ];
    }

    public function  __toString()
    {
        return "Type: $this->type, Name: $this->name, Value: $this->value";
    }
}
