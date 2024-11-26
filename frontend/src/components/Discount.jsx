import React, { Component } from "react";
import styles from "../styles/Discount.module.css";

export default class Discount extends Component {
  render() {
    const { price, discount, onProductsPage } = this.props;

    const discountedPrice = discount ? discount.new_amount : price.amount;
    const discountPercentage = discount
      ? Math.round(((price.amount - discountedPrice) / price.amount) * 100)
      : 0;

    return (
      <div className={styles.discountContainer}>
        <div className={styles.priceSection}>
          <span className={styles.originalPrice}>
            {discount && (
              <span
                className={
                  onProductsPage
                    ? styles.strikethroughPP
                    : styles.strikethrough
                }
              >
                {price.currencySymbol}
                {price.amount.toFixed(2)}
              </span>
            )}
          </span>
          <span
            className={
              onProductsPage ? styles.discountedPricePP : styles.discountedPrice
            }
          >
            {price.currencySymbol}
            {discountedPrice.toFixed(2)}
          </span>
        </div>
        {discount && (
          <div
            className={
              onProductsPage ? styles.discountBadgePP : styles.discountBadge
            }
          >
            Save {discountPercentage}%!
          </div>
        )}
      </div>
    );
  }
}
