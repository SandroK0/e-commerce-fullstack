import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Product from "./pages/Product";
import Layout from "./Layout";
import Home from "./pages/Home";
import { GraphQL } from "./graphql/graphqlClient";
import { GET_CATEGORIES_QUERY } from "./graphql/queries";

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      router: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const data = await GraphQL(GET_CATEGORIES_QUERY);
      const categories = data.categories;

      const dynamicRoutes = categories.map((category) => (
        <Route key={category.id} path={`/${category.name.toLowerCase()}`} loader={() => {
          return { category: category.name };
        }}
          element={
            <Home />}
        />
      ));

      const routerConfig = createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Navigate to="/all" replace />} />
            {dynamicRoutes}
            <Route path="/product/:productId" element={<Product />} />
          </Route>
        )
      );

      this.setState({ router: routerConfig, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  render() {
    const { router, loading, error } = this.state;

    if (loading) {
      return <div></div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <RouterProvider router={router} />
    )
  }
}

export default Router;
