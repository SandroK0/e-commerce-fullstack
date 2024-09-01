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
    };
  }

  render() {
    const { attributes, selectedAttributes, setAttribute } = this.state;

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
                  ></TextAttribute>
                );
              case "swatch":
                return (
                  <SwatchAttribute
                    key={attribute.id}
                    attribute={attribute}
                    setAttribute={setAttribute}
                    selectedAttribute={selectedAttribute}
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
