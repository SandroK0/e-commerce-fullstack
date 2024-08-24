import React, { Component } from "react";
import cartIcon from "../assets/empty-cart.svg";
import { withCart } from "../utils/withCart";
import "../styles/CartButton.css"

class CartButton extends Component {
  render() {
    const { handleClick, isEmpty, totalItems } = this.props;
    return (
      <div className="cart-button" onClick={handleClick}>
        {!isEmpty && <div className="total-items">{totalItems}</div>}
        <img src={cartIcon}></img>
      </div>
    );
  }
}

export default withCart(CartButton);
