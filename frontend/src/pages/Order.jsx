import { Component } from "react";
import { GET_ORDER_BY_ID } from "../graphql/queries";
import { withRouter } from "../utils/withRouter";
import { GraphQL } from "../graphql/graphqlClient";
import styles from "../styles/Order.module.css";
import { MdKeyboardArrowLeft } from "react-icons/md";

class Order extends Component {
  state = {
    error: null,
    loading: true,
    data: null,
    orderId: null,
  };

  componentDidMount() {
    if (this.props.params) {
      const { orderId } = this.props.params;
      const orderIdInt = parseInt(orderId, 10);
      this.setState({ orderId: orderIdInt });
      this.fetchData(orderIdInt);
    }
  }

  fetchData = async (order_id) => {
    try {
      const data = await GraphQL(GET_ORDER_BY_ID, { order_id });
      this.setState({
        data: data,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.log("Error caught in fetchData:", error.message);
      this.setState({
        error: error.message,
        loading: false,
      });
    }
  };

  goBack = () => {
    this.props.navigate("/orders");
  };

  render() {
    const { orderId, data, loading, error } = this.state;

    if (loading) {
      return <></>;
    }

    if (error) {
      return (
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      );
    }

    if (data) {
      return (
        <div className={styles.order}>
          <div className={styles.heading}>
            <button onClick={this.goBack} className={styles.backButton}>
              <MdKeyboardArrowLeft />
            </button>
            <span className={styles.orderTitle}>ORDER #{orderId}</span>
          </div>

          <div className={styles.items}>
            {data.order.items.map((item) => (
              <div className={styles.item} key={item.product_id}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemQuantityPrice}>
                    <span>Qty: {item.quantity}</span>
                    <span>
                      Price: $
                      {item.discount
                        ? item.discount.new_amount
                        : item.price.amount}
                    </span>
                  </div>
                </div>
                <div className={styles.attributes}>
                  {item.attributes.map((attribute, index) => (
                    <div className={styles.attribute} key={index}>
                      <span className={styles.attributeName}>
                        {attribute.name}:
                      </span>
                      <span className={styles.attributeValue}>
                        {attribute.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.orderSummary}>
            <div>Total Items: {data.order.items.length}</div>
            <div>Total Price: ${data.order.total}</div>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default withRouter(Order);
