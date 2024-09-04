import React, { Component } from "react";
import TextAttribute from "../components/TextAttribute.jsx";
import SwatchAttribute from "../components/SwatchAttribute.jsx";

export default class DisplayAttributes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: props.attributes,
      selectedAttributes: props.selectedAttributes,
      setAttribute: props.setAttribute,
      inCart: props.inCart,
    };
  }

  render() {
    const { attributes, selectedAttributes, setAttribute, inCart } = this.state;

    return (
      <>
        {attributes &&
          attributes.map((attribute) => {
            let selectedAttribute = selectedAttributes.filter((att) => {
              return att.name === attribute.name;
            });

            selectedAttribute = selectedAttribute[0];

            switch (attribute.type) {
              case "text":
                return (
                  <TextAttribute
                    key={attribute.id}
                    attribute={attribute}
                    setAttribute={setAttribute}
                    selectedAttribute={selectedAttribute}
                    inCart={inCart}
                  ></TextAttribute>
                );
              case "swatch":
                return (
                  <SwatchAttribute
                    key={attribute.id}
                    attribute={attribute}
                    setAttribute={setAttribute}
                    selectedAttribute={selectedAttribute}
                    inCart={inCart}
                  ></SwatchAttribute>
                );
              default:
                return <></>;
            }
          })}
      </>
    );
  }
}
