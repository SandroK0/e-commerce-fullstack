import React from "react";
import CartOverlayContext from "../context/CartOverlayContext";

export const withCartOverlay = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <CartOverlayContext.Consumer>
          {(context) => <WrappedComponent {...this.props} {...context} />}
        </CartOverlayContext.Consumer>
      );
    }
  };
};
