import React, { Component } from "react";
import cartIcon from "../assets/empty-cart.svg";
import { withCart } from "../utils/withCart.jsx";
import { withCartOverlay } from "../utils/withCartOverlay.jsx";
import styles from "../styles/CartButton.module.css";

class CartButton extends Component {
  render() {
    const { isEmpty, totalItems, toggleCartOverlay } = this.props;

    return (
      <button
        className={styles.cartButton}
        onClick={() => toggleCartOverlay()}
        data-testid="cart-btn"
      >
        {!isEmpty && <div className={styles.totalItems}>{totalItems}</div>}
        <img src={cartIcon}></img>
      </button>
    );
  }
}

export default withCart(withCartOverlay(CartButton));
