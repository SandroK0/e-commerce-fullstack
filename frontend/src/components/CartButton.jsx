import React, { Component } from "react";
import cartIcon from "../assets/empty-cart.svg";
import { withCart } from "../utils/withCart";
import styles from "../styles/CartButton.module.css";

class CartButton extends Component {
  render() {
    const { handleClick, isEmpty, totalItems } = this.props;
    return (
      <button
        className={styles.cartButton}
        onClick={handleClick}
        data-testid="cart-btn"
      >
        {!isEmpty && <div className={styles.totalItems}>{totalItems}</div>}
        <img src={cartIcon}></img>
      </button>
    );
  }
}

export default withCart(CartButton);
