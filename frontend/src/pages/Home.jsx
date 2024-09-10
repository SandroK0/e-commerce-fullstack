import { Component, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { GET_PRODUCTS_QUERY } from "../graphql/queries.js";
import { GraphQL } from "../graphql/graphqlClient.js";
import { withCart } from "../utils/withCart.jsx";
import styles from "../styles/Home.module.css";
import { withRouter } from "../utils/withRouter.jsx";
import { withCategory } from "../utils/withCategory.jsx";

class Home extends Component {
  state = {};

  componentDidMount() {
    this.fetchData();
    const currentCategory = this.props.loaderData.category;
    this.props.setCategory(currentCategory);
  }

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
    const { currentCategory } = this.props;

    return (
      <div className={styles.home}>
        <div className={styles.categoryHeading}>
          {currentCategory.toUpperCase()}
        </div>
        <div className={styles.itemGrid}>
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
    );
  }
}

export default withCart(withRouter(withCategory(Home)));
