<?php

namespace App\Models;

abstract class AbstractCategory
{
    protected int $id;
    protected string $name;

    public function __construct(int $id, string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        return "Id: $this->id, Name: $this->name";
    }
}

class Category extends AbstractCategory
{
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
