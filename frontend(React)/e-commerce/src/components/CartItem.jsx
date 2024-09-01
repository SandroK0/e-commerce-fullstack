import React, { Component } from "react";
import "../styles/CartItem.css";
import { withCart } from "../utils/withCart";
import DisplayAttributes from "./DisplayAttributes";

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
      <div className="cont">
        <div>
          <div className="item-info">
            <div>{item.name}</div>
            <div>
              {item.price.currency_symbol} {item.price.amount}
            </div>
            <DisplayAttributes
              selectedAttributes={item.selectedAttributes}
              attributes={item.attributes}
              setAttribute={this.editAttribute}
            ></DisplayAttributes>
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
