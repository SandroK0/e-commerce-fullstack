<?php

namespace App\Models;

class Discount
{
    protected float $new_amount;

    public function __construct(float $new_amount)
    {
        $this->new_amount = $new_amount;
    }

    public function getNewAmount()
    {
        return $this->new_amount;
    }

    public function __toString()
    {
        return "New Amount: $this->new_amount";
    }

    public function toArray()
    {
        return ['new_amount' => $this->new_amount];
    }
}
