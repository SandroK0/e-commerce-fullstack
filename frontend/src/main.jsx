import React from "react";
import ReactDOM from "react-dom/client";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { CartProvider } from "react-use-cart";
import { CartOverlayProvider } from "./context/CartOverlayContext.jsx";
import Router from "./Router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <CategoryProvider>
      <CartOverlayProvider>
        <Router></Router>
      </CartOverlayProvider>
    </CategoryProvider>
  </CartProvider>
);
