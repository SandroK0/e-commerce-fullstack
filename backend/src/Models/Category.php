<?php

namespace App\Models;

class Category
{
    private $id;
    private $name;

    public function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }

    public function __toString()
    {
        return "Id: $this->id, Name: $this->name";
    }
}
