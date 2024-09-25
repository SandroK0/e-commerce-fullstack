<?php

namespace App\Models;


class Price
{
    private $amount;
    private $currencyLabel;
    private $currencySymbol;

    public function __construct($amount, $currencyLabel, $currencySymbol)
    {
        $this->amount = $amount;
        $this->currencyLabel = $currencyLabel;
        $this->currencySymbol = $currencySymbol;
    }

    public function getAmount()
    {
        return $this->amount;
    }

    public function toArray()
    {
        return [
            'amount' => $this->amount,
            'currency_label' => $this->currencyLabel,
            'currency_symbol' => $this->currencySymbol,
        ];
    }

    public function __toString()
    {
        return "Amount: $this->amount, Currency Label: $this->currencyLabel, Currency Symbol: $this->currencySymbol";
    }
};
