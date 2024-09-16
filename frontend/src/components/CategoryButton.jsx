import React, { Component } from "react";
import { withRouter } from "../utils/withRouter";
import styles from "../styles/CategoryButton.module.css";
import { NavLink } from "react-router-dom";

class CategoryButton extends Component {
  isActive() {
    if (this.props.category === this.props.currentCategory) {
      return true;
    } else return false;
  }

  render() {
    return (
      <div className={styles.categoryButton}>
        <NavLink
          className={styles.categoryText}
          data-testid={
            this.isActive() ? "active-category-link" : "category-link"
          }
          to={`/${this.props.category}`}
          onClick={() => {
            this.props.setCategory(this.props.category);
            this.props.navigate(`/${this.props.category}`);
            this.props.setShowCartOverlay(false);
          }}
          style={this.isActive() ? { color: "#5ECE7B", fontWeight: 600 } : {}}
        >
          {this.props.category.toUpperCase()}
        </NavLink>
        {this.isActive() && <div className={styles.activeUnderline}></div>}
      </div>
    );
  }
}

export default withRouter(CategoryButton);
