import React, { Component } from "react";
import Styles from "../styles/SwatchAttribute.module.css";
import StylesInCart from "../styles/SwatchAttributeInCart.module.css";

export default class SwatchAttribute extends Component {
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
    const selectedStyle = {
      border: "2px solid #5ECE7B",
      padding: "5px",
    };

    const styles = inCart ? StylesInCart : Styles;

    return (
      <div className={styles.attCont}>
        <h2>{attribute.name.toUpperCase()}:</h2>
        <div className={styles.attributes}>
          {attribute.items.map((item) => (
            <div
              key={item.id}
              className={styles.attributeItem}
              style={{
                background: item.value,
                ...(item.value === selectedAttribute.value
                  ? selectedStyle
                  : {}),
              }}
              onClick={() => this.handleSelect(item)}
            ></div>
          ))}
        </div>
      </div>
    );
  }
}
