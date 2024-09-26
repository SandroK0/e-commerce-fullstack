<?php

namespace App\Models;

abstract class AbstractPrice
{
    protected float $amount;
    protected string $currencyLabel;
    protected string $currencySymbol;

    public function __construct(float $amount, string $currencyLabel, string $currencySymbol)
    {
        $this->amount = $amount;
        $this->currencyLabel = $currencyLabel;
        $this->currencySymbol = $currencySymbol;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    abstract public function toArray(): array;

    public function __toString(): string
    {
        return "Amount: $this->amount, Currency Label: $this->currencyLabel, Currency Symbol: $this->currencySymbol";
    }
}

class Price extends AbstractPrice
{
    public function toArray(): array
    {
        return [
            'amount' => $this->amount,
            'currency_label' => $this->currencyLabel,
            'currency_symbol' => $this->currencySymbol,
        ];
    }
}
