<?php

namespace App\Models;


class AttributeItem
{
    private $id;
    private $value;
    private $displayValue;


    public function __construct($id, $value, $displayValue)
    {
        $this->id = $id;
        $this->value = $value;
        $this->displayValue = $displayValue;
    }


    public function toArray()
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'displayValue' => $this->displayValue,
        ];
    }

    public function __toString()
    {
        return "Id: $this->id, Value: $this->value, Display Value: $this->displayValue";
    }
}
