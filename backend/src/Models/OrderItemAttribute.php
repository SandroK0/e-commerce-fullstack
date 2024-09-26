<?php

namespace App\Models;

abstract class AbstractOrderItemAttribute
{
    protected string $type;
    protected string $name;
    protected string $value;

    public function __construct(string $type, string $name, string $value)
    {
        $this->type = $type;
        $this->name = $name;
        $this->value = $value;
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        return "Type: $this->type, Name: $this->name, Value: $this->value";
    }
}

class OrderItemAttribute extends AbstractOrderItemAttribute
{
    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'name' => $this->name,
            'value' => $this->value,
        ];
    }
}
