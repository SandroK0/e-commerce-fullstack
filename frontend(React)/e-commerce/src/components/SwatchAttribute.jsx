import React, { Component } from "react";
import "../styles/SwatchAttribute.css";

export default class SwatchAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attribute: props.attribute,
      selectedAttribute: props.selectedAttribute ? props.selectedAttribute : {value: null},
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
    const { attribute, selectedAttribute } = this.state;
    const selectedStyle = {
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
