import React, { Component } from "react";
import { withCart } from "../utils/withCart";
import CartItem from "./CartItem";
import { GraphQL } from "../graphql/graphqlClient";
import { CREATE_ORDER } from "../graphql/queries";
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
    console.log(orderItems);
    try {
      const data = await GraphQL(CREATE_ORDER, { items: orderItems });
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
    const { items, emptyCart, totalItems, toggleCart, isEmpty, cartTotal } =
      this.props;

    const grayedOutBtn = { background: "Gray", cursor: "default" };

    return (
      <div className={styles.blur}>
        <div className={styles.cartCont}>
          <div className={styles.myBag}>
            My bag,{" "}
            <span>
              {totalItems} {totalItems > 1 ? "items" : "item"}
            </span>
          </div>
          <div className={styles.items}>
            {!isEmpty &&
              items.map((item) => (
                <CartItem item={item} key={item.id}></CartItem>
              ))}
          </div>
          <div className={styles.total}>
            <div>Total:</div>
            <div>${cartTotal.toFixed(2)}</div>
          </div>
          <button
            className={styles.btn}
            style={{ ...(isEmpty && grayedOutBtn) }}
            onClick={() => {
              if (!isEmpty) {
                this.placeOrder(items);
                toggleCart();
                emptyCart();
              }
            }}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    );
  }
}

export default withCart(Cart);
