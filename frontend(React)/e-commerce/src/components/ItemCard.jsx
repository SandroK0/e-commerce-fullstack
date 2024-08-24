import React, { Component } from "react";
import cartBtn from "../assets/circle-icon.svg";
import { withRouter } from "../utils/withRouter";
import { withCart } from "../utils/withCart";
import "../styles/ItemCard.css";

class ItemCard extends Component {
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
    let attributes;

    if (item.attributes) {
      attributes = item.attributes.map((attribute) => {
        return {
          attribute_name: attribute.name,
          attribute_value: attribute.items[0].value,
        };
      });
    }

    let ITEM = {
      id: item.id,
      name: item.name,
      img: item.images[0],
      price: item.price,
      attributes,
    };

    addItem(ITEM, 1);
  };

  render() {
    const { isHovered } = this.state;
    const { item } = this.props;

    const cardStyle = {
      boxShadow: isHovered ? "0px 4px 35px 0px #A8ACB030" : "none",
      transition: "box-shadow 0.3s ease",
    };

    const navigateToProduct = () => {
      this.props.navigate("/product", { state: { productId: item.id } });
    };

    return (
      <div
        className="item-card"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={navigateToProduct}
        style={cardStyle}
      >
        <div
          className="img-cont"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={item.images[0]} height={330} alt="Product" />
          {!item.inStock && (
            <div className="out-of-stock-overlay">OUT OF STOCK</div>
          )}
        </div>
        <div>
          <div>{item.name}</div>
          <div>
            {item.price.currency_symbol} {item.price.amount}
          </div>
        </div>
        {this.state.isHovered && item.inStock ? (
          <div
            className="cart-btn"
            onClick={(e) => {
              this.handleCartClick(e, item);
            }}
          >
            <img src={cartBtn} alt="Cart Button" />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(withCart(ItemCard));
