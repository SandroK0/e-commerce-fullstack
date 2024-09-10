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

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationState: props.location.state,
      selectedAttributes: [],
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
    const { selectedAttributes } = this.state;
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
  };

  setAttribute = (attribute) => {
    const updatedAttributes = this.state.selectedAttributes.filter(
      (att) => att.name !== attribute.name
    );
    this.setState({
      selectedAttributes: [...updatedAttributes, attribute],
    });
  };

  render() {
    const { data, loading, error, selectedAttributes } = this.state;
    const grayedOutBtn = { background: "Gray", cursor: "default" };

    if (loading) return <p>Loading...</p>;
    if (error) return <>{error.message}</>;
    if (data) {
      const item = data.product;
      const isAttributesSelected =
        this.state.selectedAttributes.length === item.attributes.length;
      return (
        <div>
          <div className={styles.productPage}>
            {<ImageSlider images={item.images}></ImageSlider>}
            <div className={styles.productInfo}>
              <h1>{item.name}</h1>
              <DisplayAttributes
                selectedAttributes={selectedAttributes}
                setAttribute={this.setAttribute}
                attributes={item.attributes}
                inCart={false}
              ></DisplayAttributes>
              <div className={styles.priceCont}>
                <h2>PRICE:</h2>
                <div>
                  {item.price.currency_symbol} {item.price.amount}
                </div>
              </div>
              <button
                className={styles.addToCartBtn}
                style={{
                  ...(!isAttributesSelected || !item.inStock
                    ? grayedOutBtn
                    : {}),
                }}
                data-testid="add-to-cart"
                onClick={() => {
                  this.addToCart(item);
                }}
                disabled={!isAttributesSelected || !item.inStock}
              >
                ADD TO CART
              </button>
              <div data-testid="product-description">
                {parse(item.description)}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(withCart(withCartOverlay(Product)));
