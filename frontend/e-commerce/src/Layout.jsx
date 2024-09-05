import { Component } from "react";
import Header from "./components/Header.jsx";
import "./index.css";
import { Outlet } from "react-router";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { CartProvider } from "react-use-cart";
import Cart from "./components/Cart.jsx";
import { withCart } from "./utils/withCart.jsx";

class Layout extends Component {
  state = {
    showCart: false,
  };

  toggleCart = () => {
    this.setState({ ...this.state, showCart: !this.state.showCart });
  };

  render() {
    return (
      <CategoryProvider>
        <CartProvider>
          <div className="Layout">
            {this.state.showCart && <Cart toggleCart={this.toggleCart}></Cart>}
            <Header toggleCart={this.toggleCart} />
            <Outlet />
          </div>
        </CartProvider>
      </CategoryProvider>
    );
  }
}

export default withCart(Layout);
