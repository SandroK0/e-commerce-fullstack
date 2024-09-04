import React, { Component } from "react";
import { withCart } from "../utils/withCart";
import DisplayAttributes from "./DisplayAttributes";
import styles from "../styles/CartItem.module.css";
import plusBtn from "../assets/plus-square.svg";
import minusBtn from "../assets/minus-square.svg";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      updateItem: props.updateItem,
      updateItemQuantity: props.updateItemQuantity,
    };
  }

  editAttribute = (attribute) => {
    const updatedAttributes = this.state.item.selectedAttributes.filter(
      (att) => att.name !== attribute.name
    );

    this.state.updateItem(this.state.item.id, {
      ...this.state.item,
      selectedAttributes: [...updatedAttributes, attribute],
    });
  };

  render() {
    const { updateItemQuantity } = this.state;
    const { item } = this.props;

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
            onClick={() =>
              updateItemQuantity(item.id, (item.quantity ?? 0) + 1)
            }
          >
            <img src={plusBtn}></img>
          </button>
          <div>{item.quantity}</div>
          <button
            onClick={() =>
              updateItemQuantity(item.id, (item.quantity ?? 0) - 1)
            }
          >
            <img src={minusBtn}></img>
          </button>
        </div>
        <img src={item.img} width={100} className={styles.itemImg}></img>
      </div>
    );
  }
}

export default withCart(CartItem);
