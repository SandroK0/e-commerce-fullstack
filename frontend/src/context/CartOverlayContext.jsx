import React, { createContext, Component } from "react";

const CartOverlayContext = createContext();

export class CartOverlayProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCartOverlay: false,
    };
  }

  setShowCartOverlay = (value) => {
    this.setState({ showCartOverlay: value });
  };

  toggleCartOverlay = () => {
    this.setState((prevState) => ({
      showCartOverlay: !prevState.showCartOverlay,
    }));
  };

  render() {
    return (
      <CartOverlayContext.Provider
        value={{
          showCartOverlay: this.state.showCartOverlay,
          setShowCartOverlay: this.setShowCartOverlay,
          toggleCartOverlay: this.toggleCartOverlay,
        }}
      >
        {this.props.children}
      </CartOverlayContext.Provider>
    );
  }
}

export default CartOverlayContext;
