import React, { Component } from "react";
import Styles from "../styles/TextAttribute.module.css";
import StylesInCart from "../styles/TextAttributeInCart.module.css";

export default class TextAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attribute: props.attribute,
      selectedAttribute: props.selectedAttribute
        ? props.selectedAttribute
        : { value: null },
      inCart: props.inCart,
    };
  }

  handleSelect = (item) => {
    this.setState({ selectedAttribute: item });

    this.props.setAttribute({
      type: this.state.attribute.type,
      name: this.state.attribute.name,
      value: item.value,
    });
  };

  render() {
    const { attribute, selectedAttribute, inCart } = this.state;
    const selectedStyle = { color: "white", background: "#1D1F22" };

    const styles = inCart ? StylesInCart : Styles;

    return (
      <div
        className={styles.attCont}
        data-testid={
          inCart
            ? `cart-item-attribute-${attribute.name.toLowerCase()}`
            : `product-attribute-${attribute.name.toLowerCase()}`
        }
      >
        <h2>{attribute.name.toUpperCase()}:</h2>
        <div className={styles.attributes}>
          {attribute.items.map((item) => (
            <div
              data-testid={
                inCart
                  ? item.value === selectedAttribute.value
                    ? `cart-item-attribute-${attribute.name.toLowerCase()}-${
                        item.value
                      }-selected`
                    : `cart-item-attribute-${attribute.name.toLowerCase()}-${
                        item.value
                      }`
                  : item.value === selectedAttribute.value
                  ? `product-attribute-${attribute.name.toLowerCase()}-${
                      item.value
                    }-selected`
                  : `product-attribute-${attribute.name.toLowerCase()}-${
                      item.value
                    }`
              }
              key={item.id}
              className={styles.attributeItem}
              style={{
                ...(item.value === selectedAttribute.value
                  ? selectedStyle
                  : {}),
              }}
              onClick={() => this.handleSelect(item)}
            >
              {item.value}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
