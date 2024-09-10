import React, { Component } from "react";
import { withCart } from "../utils/withCart";
import DisplayAttributes from "./DisplayAttributes";
import styles from "../styles/CartItem.module.css";
import plusBtn from "../assets/plus-square.svg";
import minusBtn from "../assets/minus-square.svg";

class CartItem extends Component {
  editAttribute = (attribute) => {
    const updatedAttributes = this.props.item.selectedAttributes.filter(
      (att) => att.name !== attribute.name
    );

    this.props.updateItem(this.props.item.id, {
      ...this.props.item,
      selectedAttributes: [...updatedAttributes, attribute],
    });
  };

  render() {
    const { item, updateItemQuantity } = this.props;

    return (
      <div className={styles.itemCont}>
        <div className={styles.item}>
          <div className={styles.itemInfo}>
            <div className={styles.itemName}>{item.name}</div>
            <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
          </div>
          <DisplayAttributes
            selectedAttributes={item.selectedAttributes}
            attributes={item.attributes}
            setAttribute={this.editAttribute}
            inCart={true}
          ></DisplayAttributes>
        </div>
        <div className={styles.itemQuantity}>
          <button
            data-testid="cart-item-amount-increase"
            onClick={() =>
              updateItemQuantity(item.id, (item.quantity ?? 0) + 1)
            }
          >
            <img src={plusBtn}></img>
          </button>
          <div data-testid="cart-item-amount">{item.quantity}</div>
          <button
            data-testid="cart-item-amount-decrease"
            onClick={() =>
              updateItemQuantity(item.id, (item.quantity ?? 0) - 1)
            }
          >
            <img src={minusBtn}></img>
          </button>
        </div>
        <div className={styles.imgCont}>
          <img src={item.img} width={100} className={styles.itemImg}></img>
        </div>
      </div>
    );
  }
}

export default withCart(CartItem);
