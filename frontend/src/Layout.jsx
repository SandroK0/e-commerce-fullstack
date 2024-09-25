import React, { Component } from "react";
import Header from "./components/Header.jsx";
import "./index.css";
import { Outlet } from "react-router";
import Cart from "./components/Cart.jsx";
import { withCartOverlay } from "./utils/withCartOverlay";

class Layout extends Component {
  render() {
    const { showCartOverlay } = this.props;

    return (
      <div className="Layout">
        <Header />
        {showCartOverlay && <Cart />}
        <Outlet />
      </div>
    );
  }
}

export default withCartOverlay(Layout);
