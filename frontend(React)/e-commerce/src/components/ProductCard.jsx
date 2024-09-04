import React, { Component } from "react";
import cartBtn from "../assets/circle-icon.svg";
import { withRouter } from "../utils/withRouter";
import { withCart } from "../utils/withCart";
import styles from "../styles/ProductCard.module.css"

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
  };

  render() {
    const { isHovered, product } = this.state;

    const cardStyle = {
      boxShadow: isHovered ? "0px 4px 35px 0px #A8ACB030" : "none",
      transition: "box-shadow 0.3s ease",
    };

    const navigateToProduct = () => {
      this.props.navigate("/product", { state: { productId: product.id } });
    };

    return (
      <div
        className={styles.productCard}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={navigateToProduct}
        style={cardStyle}
      >
        <div className={styles.imgCont}>
          <img className={styles.productImg} src={product.images[0]} alt="Product" />
          {!product.inStock && (
            <div className={styles.outOfStockOverlay}>OUT OF STOCK</div>
          )}
          {this.state.isHovered && product.inStock ? (
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
          <div>{product.name}</div>
          <div>
            {product.price.currency_symbol} {product.price.amount}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withCart(ProductCard));
