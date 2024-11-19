import { Component } from "react";
import ImageSlider from "../components/ImageSlider";
import { GET_PRODUCT_BY_ID } from "../graphql/queries";
import { GraphQL } from "../graphql/graphqlClient";
import { withRouter } from "../utils/withRouter.jsx";
import { withCart } from "../utils/withCart.jsx";
import { withCartOverlay } from "../utils/withCartOverlay.jsx";
import parse from "html-react-parser";
import DisplayAttributes from "../components/DisplayAttributes.jsx";
import styles from "../styles/Product.module.css";
import { Navigate } from "react-router";
import Discount from "../components/Discount.jsx";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAttributes: [],
    };
  }

  componentDidMount() {
    if (this.props.params) {
      const { productId } = this.props.params;
      if (productId) {
        this.fetchData(productId);
      }
    } else {
      this.setState({ NoProductId: true });
    }
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

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  addToCart = (item) => {
    const { addItem } = this.props;
    const { selectedAttributes } = this.state;
    const ITEM = {
      id: item.id,
      name: item.name,
      img: item.images[0],
      price: item.discount ? item.discount.new_amount : item.price.amount,
      attributes: item.attributes,
      selectedAttributes,
    };

    addItem(ITEM, 1);
    this.props.setShowCartOverlay(true);
    this.scrollToTop();
  };

  setAttribute = (attribute) => {
    const updatedAttributes = this.state.selectedAttributes.filter(
      (att) => att.name !== attribute.name
    );
    (att) => att.name !== attribute.name;
    this.setState({
      selectedAttributes: [...updatedAttributes, attribute],
    });
  };

  renderLoading() {
    return <p>Loading...</p>;
  }

  renderError() {
    return <p>{this.state.error.message}</p>;
  }

  renderProduct(item) {
    const isAttributesSelected =
      this.state.selectedAttributes.length === item.attributes.length;
    console.log(item);
    return (
      <div className={styles.productPage}>
        <ImageSlider images={item.images} />
        <div className={styles.productInfo}>
          <h1>{item.name}</h1>
          {item.attributes && (
            <DisplayAttributes
              selectedAttributes={this.state.selectedAttributes}
              setAttribute={this.setAttribute}
              attributes={item.attributes}
              inCart={false}
            />
          )}
          <div className={styles.priceCont}>
            <h2>PRICE:</h2>
            <div>
              {item.discount ? (
                <Discount
                  price={item.price}
                  discount={item.discount}
                ></Discount>
              ) : (
                <>
                  {item.price.currency_symbol} {item.price.amount}
                </>
              )}
            </div>
          </div>
          <button
            className={`${styles.addToCartBtn} ${
              isAttributesSelected && item.inStock
                ? styles.addToCartBtnEnabled
                : ""
            }`}
            data-testid="add-to-cart"
            onClick={() => this.addToCart(item)}
            disabled={!isAttributesSelected || !item.inStock}
          >
            ADD TO CART
          </button>
          <div data-testid="product-description">{parse(item.description)}</div>
        </div>
      </div>
    );
  }

  render() {
    const { data, loading, error, NoProductId } = this.state;

    if (NoProductId) return <Navigate to={"/"} replace></Navigate>;
    if (loading) return this.renderLoading();
    if (error) return this.renderError();
    if (data) {
      return this.renderProduct(data.product);
    }
  }
}

export default withRouter(withCart(withCartOverlay(Product)));
