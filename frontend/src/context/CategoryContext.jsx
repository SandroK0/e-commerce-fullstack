import React, { createContext, Component } from "react";

const CategoryContext = createContext();

export class CategoryProvider extends Component {
  constructor(props) {
    super(props);

    const savedCategory = localStorage.getItem("currentCategory") || "all";

    this.state = {
      currentCategory: savedCategory,
    };
  }

  setCategory = (newCategory) => {
    localStorage.setItem("currentCategory", newCategory);
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

export default CategoryContext;
