import React, { Component } from "react";
import { useCart } from "react-use-cart";

export const withCart = (WrappedComponent) => {
  return (props) => {
    const {
      isEmpty,
      totalItems,
      items,
      addItem,
      removeItem,
      emptyCart,
      updateItemQuantity,
      cartTotal,
      updateItem,
    } = useCart();

    return (
      <WrappedComponent
        {...props}
        isEmpty={isEmpty}
        totalItems={totalItems}
        items={items}
        addItem={addItem}
        removeItem={removeItem}
        updateItemQuantity={updateItemQuantity}
        emptyCart={emptyCart}
        cartTotal={cartTotal}
        updateItem={updateItem}
      />
    );
  };
};
