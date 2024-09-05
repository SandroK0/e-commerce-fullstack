import React, { Children, Component } from "react";
import { withRouter } from "../utils/withRouter";
import styles from "../styles/CategoryButton.module.css";

class CategoryButton extends Component {
  isActive() {
    if (this.props.category === this.props.currentCategory) {
      return true;
    } else return false;
  }

  navigateToHome = () => {
    this.props.navigate("/");
  };

  render() {
    return (
      <div className={styles.categoryButton}>
        <div
          className={styles.categoryText}
          data-testid={
            this.isActive() ? "active-category-link" : "category-link"
          }
          onClick={() => {
            this.props.setCategory(this.props.category);
            this.navigateToHome();
          }}
          style={this.isActive() ? { color: "#5ECE7B", fontWeight: 600 } : {}}
        >
          {this.props.category.toUpperCase()}
        </div>
        {this.isActive() && <div className={styles.activeUnderline}></div>}
      </div>
    );
  }
}

export default withRouter(CategoryButton);