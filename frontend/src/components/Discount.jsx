import React, { Component } from "react";
import styles from "../styles/Discount.module.css";

export default class Discount extends Component {
  render() {
    const { price, discount } = this.props;

    const discountedPrice = discount ? discount.new_amount : price.amount;
    const discountPercentage = discount
      ? Math.round(((price.amount - discountedPrice) / price.amount) * 100)
      : 0;

    return (
      <div className={styles.discountContainer}>
        <div className={styles.priceSection}>
          <span className={styles.originalPrice}>
            {discount && (
              <span className={styles.strikethrough}>
                {price.currencySymbol}
                {price.amount.toFixed(2)}
              </span>
            )}
          </span>
          <span className={styles.discountedPrice}>
            {price.currencySymbol}
            {discountedPrice.toFixed(2)}
          </span>
        </div>
        {discount && (
          <div className={styles.discountBadge}>
            Save {discountPercentage}%!
          </div>
        )}
      </div>
    );
  }
}
