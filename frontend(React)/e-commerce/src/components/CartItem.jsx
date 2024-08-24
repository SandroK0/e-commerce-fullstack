import React, { Component } from "react";

import "../styles/CartItem.css";
import { withCart } from "../utils/withCart";

class CartItem extends Component {
  render() {
    const { item, removeItem, addItem, updateItemQuantity } = this.props;

    return (
      <div className="cont">
        <div>
          <div className="item-info">
            <div>{item.name}</div>
            <div>
              {item.price.currency_symbol} {item.price.amount}
            </div>
          </div>
        </div>
        <div className="buttons">
          <button
            onClick={() =>
              updateItemQuantity(item.id, (item.quantity ?? 0) + 1)
            }
          >
            +
          </button>
          <div>{item.quantity}</div>
          <button
            onClick={() =>
              updateItemQuantity(item.id, (item.quantity ?? 0) - 1)
            }
          >
            -
          </button>
        </div>
        <img src={item.img} width={100}></img>
      </div>
    );
  }
}

export default withCart(CartItem);
