import React, { Component } from "react";
import "../styles/Cart.css";
import { withCart } from "../utils/withCart";
import CartItem from "./CartItem";
import { GraphQL } from "../graphql/graphqlClient";
import { CREATE_ORDER } from "../graphql/queries";

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

    return (
      <div className="blur">
        <div className="cart-cont">
          <div className="my-bag">
            My bag,{" "}
            <span>
              {totalItems} {totalItems > 1 ? "items" : "item"}
            </span>
          </div>
          <div className="items">
            {items.map((item) => (
              <CartItem item={item} key={item.id}></CartItem>
            ))}
          </div>
          <div className="total">
            <div>Total:</div>
            <div>${cartTotal.toFixed(2)}</div>
          </div>
          <button
            className="btn"
            onClick={() => {
              // this.placeOrder(items);
              emptyCart();
              toggleCart();
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
