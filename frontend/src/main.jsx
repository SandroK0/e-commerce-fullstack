import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./Layout.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { CartProvider } from "react-use-cart";
import { CartOverlayProvider } from "./context/CartOverlayContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Navigate to="/all" replace />} />
      <Route
        path="/all"
        element={<Home />}
        loader={() => {
          return { category: "all" };
        }}
      />
      <Route
        path="/tech"
        loader={() => {
          return { category: "tech" };
        }}
        element={<Home />}
      />
      <Route
        path="/clothes"
        loader={() => {
          return { category: "clothes" };
        }}
        element={<Home />}
      />
      <Route path="/product" element={<Product />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <CartProvider>
    <CategoryProvider>
      <CartOverlayProvider>
        <RouterProvider router={router} />
      </CartOverlayProvider>
    </CategoryProvider>
  </CartProvider>
);
