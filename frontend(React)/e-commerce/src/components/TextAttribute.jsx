import React, { Component } from "react";
import "../styles/TextAttribute.css";

export default class TextAttribute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attribute: props.attribute,
      selectedAttribute: props.selectedAttribute ? props.selectedAttribute : {value:null},
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
    const selectedStyle = { color: "white", background: "#1D1F22" };

    return (
      <div className="size-att">
        <h2>{attribute.name}</h2>
        <div className="sizes">
          {attribute.items.map((item) => (
            <div
              key={item.id}
              className="size"
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
