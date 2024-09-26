<?php

namespace App\Models;

abstract class AbstractAttributeItem
{
    protected int $id;
    protected string $value;
    protected string $displayValue;

    public function __construct(int $id, string $value, string $displayValue)
    {
        $this->id = $id;
        $this->value = $value;
        $this->displayValue = $displayValue;
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        return "Id: $this->id, Value: $this->value, Display Value: $this->displayValue";
    }
}

class AttributeItem extends AbstractAttributeItem
{
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'displayValue' => $this->displayValue,
        ];
    }
}
