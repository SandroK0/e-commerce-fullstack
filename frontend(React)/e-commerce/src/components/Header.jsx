import React, { Component } from "react";
import logo from "../assets/a-logo.svg";
import CartButton from "./CartButton";
import CategoryButton from "./CategoryButton";
import { CategoryConsumer } from "../context/CategoryContext.jsx";
import { GET_CATEGORIES_QUERY } from "../graphql/queries.js";
import { GraphQL } from "../graphql/graphqlClient.js";
import { withRouter } from "../utils/withRouter.jsx";
import { withCart } from "../utils/withCart.jsx";
import styles from "../styles/Header.module.css";

class Header extends Component {
  state = {};

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const data = await GraphQL(GET_CATEGORIES_QUERY);
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

  navigateToHome = () => {
    this.props.navigate("/");
  };

  render() {
    const { data, loading, error } = this.state;
    const { isEmpty } = this.props;
    return (
      <CategoryConsumer>
        {({ currentCategory, setCategory }) => (
          <div className={styles.header}>
            <div className={styles.categories}>
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {data &&
                data.categories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    category={category.name}
                    currentCategory={currentCategory}
                    setCategory={setCategory}
                  ></CategoryButton>
                ))}
            </div>
            <div className={styles.logoCont} onClick={this.navigateToHome}>
              <img src={logo}></img>
            </div>
            <CartButton handleClick={this.props.toggleCart}></CartButton>
          </div>
        )}
      </CategoryConsumer>
    );
  }
}

export default withRouter(withCart(Header));
