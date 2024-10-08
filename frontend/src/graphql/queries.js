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
