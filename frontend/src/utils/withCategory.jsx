import React from "react";
import CategoryContext from "../context/CategoryContext";

export const withCategory = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <CategoryContext.Consumer>
          {(context) => <WrappedComponent {...this.props} {...context} />}
        </CategoryContext.Consumer>
      );
    }
  };
};

