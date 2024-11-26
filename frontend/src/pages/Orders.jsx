import { Component } from "react";
import styles from "../styles/Orders.module.css";
import { GET_ORDERS_QUERY } from "../graphql/queries.js";
import { GraphQL } from "../graphql/graphqlClient.js";
import { MdKeyboardArrowRight } from "react-icons/md";
import { withRouter } from "../utils/withRouter";

class Orders extends Component {
  state = {
    currentPage: 1,
    ordersPerPage: 10,
    data: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage) {
      this.setState({ currentPage: parseInt(savedPage, 10) });
    }
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const data = await GraphQL(GET_ORDERS_QUERY);
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

  getCurrentPageOrders = () => {
    const { data, currentPage, ordersPerPage } = this.state;
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return data.orders.slice(startIndex, endIndex);
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber }, () => {
      sessionStorage.setItem("currentPage", pageNumber);
    });
  };

  navigateToOrder = (orderId) => {
    this.props.navigate(`/orders/${orderId}`);
  };

  render() {

    const { data, loading, error, currentPage, ordersPerPage } = this.state;
    if (loading) {
      return <></>;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    const ordersToDisplay = this.getCurrentPageOrders();
    const totalPages = Math.ceil(data.orders.length / ordersPerPage);

    return (
      <div className={styles.orders}>
        <div className={styles.heading}>ORDERS</div>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>ID</div>
            <div>DATE</div>
            <div>TOTAL</div>
          </div>
          <div className={styles.tableBody}>
            {ordersToDisplay.map((order) => (
              <div
                className={styles.tableRow}
                key={order.id}
                onClick={() => this.navigateToOrder(order.id)}
              >
                <div>#{order.id}</div>
                <div>{order.order_date}</div>
                <div>${order.total}</div>
                <MdKeyboardArrowRight className={styles.icon} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.pagination}>
          <button
            onClick={() => this.handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => this.handlePageChange(index + 1)}
              className={currentPage === index + 1 ? styles.activePage : ""}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => this.handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Orders);
