import React, { Component } from "react";
import "../styles/ColorAttribute.css";

export default class SwatchAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attribute: props.attribute,
      selectedAttribute: null,
    };
  }

  handleSelect = (value) => {
    this.setState({ ...this.state, selectedAttribute: value });
  };

  render() {
    const { attribute, selectedAttribute } = this.state;
    const selected = {
      border: "2px solid #5ECE7B",
      padding: "5px",
    };
    return (
      <div className="color-att">
        <h2>Color:</h2>
        <div className="colors">
          {attribute.items.map((item) => (
            <div
              key={item.id}
              className="color"
              style={{
                background: item.value,
                ...(item.value === selectedAttribute ? selected : {}),
              }}
              onClick={() => this.handleSelect(item.value)}
            ></div>
          ))}
        </div>
      </div>
    );
  }
}
