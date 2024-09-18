import React from "react";
import ReactDOM from "react-dom/client";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { CartProvider } from "react-use-cart";
import { CartOverlayProvider } from "./context/CartOverlayContext.jsx";
import AppRouter from "./AppRouter.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <CategoryProvider>
      <CartOverlayProvider>
        <AppRouter></AppRouter>
      </CartOverlayProvider>
    </CategoryProvider>
  </CartProvider>
);
