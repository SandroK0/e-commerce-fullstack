import React, { Component } from "react";
import { withCart } from "../utils/withCart";
import { withCartOverlay } from "../utils/withCartOverlay";
import CartItem from "./CartItem";
import { GraphQL } from "../graphql/graphqlClient";
import { PLACE_ORDER } from "../graphql/queries";
import styles from "../styles/Cart.module.css";

class Cart extends Component {
  state = {};

  placeOrder = async (items) => {
    let orderItems = items.map((item) => {
      return {
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        attributes: item.selectedAttributes,
      };
    });
    try {
      const data = await GraphQL(PLACE_ORDER, { items: orderItems });
      this.setState({
        data: data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  render() {
    const {
      items,
      emptyCart,
      totalItems,
      isEmpty,
      cartTotal,
      setShowCartOverlay,
    } = this.props;
    const { data } = this.state;
    const grayedOutBtn = { background: "Gray", cursor: "default" };

    return (
      <div
        className={styles.blur}
        onClick={() => {
          setShowCartOverlay(false);
        }}
      >
        <div
          className={styles.cartCont}
          data-testid="cart-overlay"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.myBag}>
            My bag,{" "}
            <span>
              {totalItems} {totalItems > 1 ? "items" : "item"}
            </span>
          </div>
          {!isEmpty ? (
            <div className={styles.items}>
              {items.map((item) => (
                <CartItem item={item} key={item.id}></CartItem>
              ))}
            </div>
          ) : (
            data && (
              <div className={styles.message}>
                Order has been placed. Order #{data.placeOrder.id}
              </div>
            )
          )}
          <div className={styles.total}>
            <div>Total:</div>
            <div data-testid="cart-total">${cartTotal.toFixed(2)} </div>
          </div>
          <button
            className={styles.btn}
            style={{ ...(isEmpty && grayedOutBtn) }}
            onClick={() => {
              this.placeOrder(items);
              emptyCart();
            }}
            disabled={isEmpty}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    );
  }
}

export default withCart(withCartOverlay(Cart));
