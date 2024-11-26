import React, { Component } from "react";
import logo from "../assets/a-logo-blue.svg";
import CartButton from "./CartButton";
import CategoryButton from "./CategoryButton";
import { withRouter } from "../utils/withRouter.jsx";
import { withCart } from "../utils/withCart.jsx";
import styles from "../styles/Header.module.css";
import { withCategory } from "../utils/withCategory.jsx";
import { withCartOverlay } from "../utils/withCartOverlay.jsx";
import { NavLink } from "react-router-dom";

class Header extends Component {
  state = {};

  navigateToHome = () => {
    this.props.navigate("/");
  };

  render() {
    const { setCategory, currentCategory, setShowCartOverlay } = this.props;

    const Categories = ["all", "clothes", "tech"];
    return (
      <div className={styles.header}>
        <div className={styles.categories}>
          {Categories.map((category, i) => (
            <CategoryButton
              key={i}
              category={category}
              currentCategory={currentCategory}
              setCategory={setCategory}
              setShowCartOverlay={setShowCartOverlay}
            ></CategoryButton>
          ))}
        </div>
        <div
          className={styles.logoCont}
          onClick={() => {
            this.navigateToHome();
            setShowCartOverlay(false);
          }}
        >
          <img src={logo}></img>
        </div>
        <div className={styles.rightButtons}>
          <NavLink
            to="/orders"
            className={styles.ordersNavLink}
            onClick={() => setShowCartOverlay(false)}
          >
            ORDERS
          </NavLink>
          <CartButton></CartButton>
        </div>
      </div>
    );
  }
}

export default withRouter(withCart(withCategory(withCartOverlay(Header))));
