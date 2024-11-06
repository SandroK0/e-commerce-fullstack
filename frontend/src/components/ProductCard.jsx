import React, { Component } from "react";
import cartBtn from "../assets/circle-icon.svg";
import { withRouter } from "../utils/withRouter";
import { withCart } from "../utils/withCart";
import { withCartOverlay } from "../utils/withCartOverlay";
import styles from "../styles/ProductCard.module.css";

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.product,
    };
  }

  state = {
    isHovered: false,
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  handleCartClick = (event, item) => {
    event.stopPropagation();
    const { addItem } = this.props;
    let selectedAttributes;
    if (item.attributes) {
      selectedAttributes = item.attributes.map((attribute) => {
        return {
          type: attribute.type,
          name: attribute.name,
          value: attribute.items[0].value,
        };
      });
    }

    let ITEM = {
      id: item.id,
      name: item.name,
      img: item.images[0],
      price: item.price.amount,
      attributes: item.attributes,
      selectedAttributes,
    };

    addItem(ITEM, 1);
    this.props.setShowCartOverlay(true);
    this.scrollToTop();
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  render() {
    const { isHovered, product } = this.state;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const cardStyle = {
      boxShadow:
        isHovered && !isTouchDevice ? "0px 4px 35px 0px #A8ACB060" : "none",
      transition: "box-shadow 0.3s ease",
    };

    const navigateToProduct = () => {
      this.props.navigate(`/product/${product.id}`);
    };

    return (
      <div
        className={styles.productCard}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={navigateToProduct}
        style={cardStyle}
        data-testid={`product-${product.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <div className={styles.imgCont}>
          <img
            className={styles.productImg}
            src={product.images[0]}
            alt="Product"
          />
          {!product.inStock && (
            <div className={styles.outOfStockOverlay}>OUT OF STOCK</div>
          )}
          {(isTouchDevice ? true : this.state.isHovered && product.inStock) ? (
            <button
              className={styles.cartBtn}
              onClick={(e) => {
                this.handleCartClick(e, product);
              }}
            >
              <img src={cartBtn} alt="Cart Button" />
            </button>
          ) : undefined}
        </div>
        <div>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.price}>
            {product.price.currency_symbol} {product.price.amount}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withCart(withCartOverlay(ProductCard)));
