import { Component } from "react";
import ProductCard from "../components/ProductCard";
import { CategoryConsumer } from "../context/CategoryContext.jsx";
import { GET_PRODUCTS_QUERY } from "../graphql/queries.js";
import { GraphQL } from "../graphql/graphqlClient.js";
import { withCart } from "../utils/withCart.jsx";
import "../styles/Home.css";

class Home extends Component {
  state = {};

  componentDidMount() {
    this.fetchData();
  }

  foo = () => {
    console.log("FOO");
  };

  fetchData = async () => {
    try {
      const data = await GraphQL(GET_PRODUCTS_QUERY);
      this.setState({
        data: data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  render() {
    const { data, loading, error } = this.state;

    return (
      <CategoryConsumer>
        {({ currentCategory }) => (
          <div className="home">
            <div className="category-heading">
              {currentCategory.toUpperCase()}
            </div>
            <div className="item-grid">
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {data &&
                data.products
                  .filter(
                    (product) =>
                      currentCategory === "all" ||
                      product.category.name === currentCategory
                  )
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        )}
      </CategoryConsumer>
    );
  }
}

export default withCart(Home);
