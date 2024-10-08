import React, { Component } from "react";
import styles from "../styles/ImageSlider.module.css";

class ImageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.images,
      currentIndex: 0,
    };
  }

  prevSlide = () => {
    const { currentIndex, images } = this.state;
    const lastIndex = images.length - 1;
    const shouldResetIndex = currentIndex === 0;
    const index = shouldResetIndex ? lastIndex : currentIndex - 1;

    this.setState({
      currentIndex: index,
    });
  };

  nextSlide = () => {
    const { currentIndex, images } = this.state;
    const lastIndex = images.length - 1;
    const shouldResetIndex = currentIndex === lastIndex;
    const index = shouldResetIndex ? 0 : currentIndex + 1;

    this.setState({
      currentIndex: index,
    });
  };

  switchToImage = (index) => {
    this.setState({
      currentIndex: index,
    });
  };

  render() {
    const { images, currentIndex } = this.state;
    const activeThumbnailStyle = { opacity: 1 };

    return (
      <div className={styles.imageSlider} data-testid="product-gallery">
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              onClick={() => this.switchToImage(index)}
              style={{
                ...(index === currentIndex ? activeThumbnailStyle : {}),
              }}
            />
          ))}
        </div>
        <div className={styles.mainImage}>
          <button onClick={this.prevSlide}>{"<"}</button>
          <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
          <button onClick={this.nextSlide}>{">"}</button>
        </div>
      </div>
    );
  }
}

export default ImageSlider;
