export const GET_PRODUCTS_QUERY = `
  query {
    products {
        id
        name
        description
        inStock
        category {
            id
            name
        }
        brand
        images
        price {
            amount
            currency_label
            currency_symbol
        }
        discount {
          new_amount
        }
        attributes {
            id
            name
            type
            items {
                id
                value
                displayValue
            }
        }
    }
  }
`;

export const GET_CATEGORIES_QUERY = `
  query Categories {
        categories {
            id
            name
        }
    }
`;

export const GET_PRODUCT_BY_ID = `
  query Product($id : String!) {
    product(id: $id) {
        id
        name
        description
        inStock
        brand
        images
        category {
            id
            name
        }
        price {
            amount
            currency_label
            currency_symbol
        }
        discount {
          new_amount
        }
        attributes {
            id
            name
            type
            items {
                id
                value
                displayValue
            }
        }
    }
  }
`;

export const GET_ORDERS_QUERY = `
  query {
    orders {
      id
      order_date
      total
      }
    }
`;

export const GET_ORDER_BY_ID = `
  query Order($order_id: Int!) {
    order(order_id: $order_id) {
      id
      order_date
      total
      items {
        product_id
        name
        quantity
        attributes {
          type
          name
          value
        }
        price {
          amount
          currency_label
          currency_symbol
        }
        discount {
          new_amount
        }
      }
    }
  }
`;

export const PLACE_ORDER = `
mutation placeOrder($items: [OrderItemInput!]!) {
  placeOrder(items: $items) {
    id
    items {
      product_id
      name
      quantity
      attributes {
        type
        name
        value
      }
    }
    order_date
  }
}`;
