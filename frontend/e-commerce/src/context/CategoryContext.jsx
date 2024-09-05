import React, { createContext, Component } from "react";

const CategoryContext = createContext();

export class CategoryProvider extends Component {
  state = {
    currentCategory: "all",
  };

  setCategory = (newCategory) => {
    this.setState({ currentCategory: newCategory });
  };

  render() {
    return (
      <CategoryContext.Provider
        value={{
          currentCategory: this.state.currentCategory,
          setCategory: this.setCategory,
        }}
      >
        {this.props.children}
      </CategoryContext.Provider>
    );
  }
}

export class CategoryConsumer extends Component {
  render() {
    return (
      <CategoryContext.Consumer>{this.props.children}</CategoryContext.Consumer>
    );
  }
}

export default CategoryContext;
