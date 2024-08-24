import React, { Component, useState } from "react";
import ImageSlider from "../components/ImageSlider";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";
import { GraphQL } from "../graphql/graphqlClient";
import TextAttribute from "../components/TextAttribute.jsx";
import { withRouter } from "../utils/withRouter.jsx";
import { withCart } from "../utils/withCart.jsx";
import "../styles/Product.css";
import SwatchAttribute from "../components/SwatchAttribute.jsx";
import parse from "html-react-parser";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationState: props.location.state,
      attributes: [],
    };
  }

  navigateToHome = () => {
    this.props.navigate("/");
  };

  componentDidMount() {
    if (this.state.locationState) {
      const productId = this.state.locationState.productId;
      this.fetchData(productId);
    } else this.navigateToHome();
  }

  fetchData = async (id) => {
    try {
      const data = await GraphQL(GET_PRODUCT_BY_ID, { id });
      this.setState({
        data,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  addToCart = (item) => {
    const { addItem } = this.props;

    let ITEM = {
      id: item.id,
      name: item.name,
      img: item.images[0],
      price: item.price,
      attributes,
    };

    addItem(ITEM, 1);
  };

  setAttribute = (attribute) => {
    this.setState({
      ...this.state,
      attributes: [
        ...this.state.attributes,
        { attribute_name: attribute.name, attribute_value: attribute.value },
      ],
    });
  };

  render() {
    const { data, loading, error } = this.state;

    console.log(this.state.attributes);

    if (loading) return <p>Loading...</p>;
    if (error) return <>{error.message}</>;
    if (data) {
      const item = data.product;
      return (
        <div>
          <div className="product-page">
            {<ImageSlider images={item.images}></ImageSlider>}
            <div className="product-info">
              <h1>{item.name}</h1>
              {item.attributes.map((attribute) => {
                switch (attribute.type) {
                  case "text":
                    return (
                      <TextAttribute
                        key={attribute.id}
                        attribute={attribute}
                        setAttribute={this.setAttribute}
                      ></TextAttribute>
                    );
                    break;
                  case "swatch":
                    return (
                      <SwatchAttribute
                        key={attribute.id}
                        attribute={attribute}
                        setAttribute={this.setAttribute}
                      ></SwatchAttribute>
                    );
                    break;
                  default:
                    return <></>;
                    break;
                }
              })}

              <div className="price-cont">
                <h2>Price:</h2>
                <div>
                  {item.price.currency_symbol} {item.price.amount}
                </div>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => this.addToCart(item)}
              >
                ADD TO CART
              </button>
              <div>{parse(item.description)}</div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(withCart(Product));
