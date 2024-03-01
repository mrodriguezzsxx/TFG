import "../../assets/css/cursos/rating.css";
import React from "react";

class Rating extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rating = this.props.estrellas; // Valor del rating
    const fullStars = Math.floor(rating); // Estrellas enteras
    const hasHalfStar = rating - fullStars >= 0.5; // Verificar si hay media estrella

    const starElements = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starElements.push(
          <span key={i} className="active">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        starElements.push(
          <span key={i} className="active half">
            ★
          </span>
        );
      } else {
        starElements.push(
          <span key={i}>
            ☆
          </span>
        );
      }
    }

    return (
      <div className="rating">
        <div>
          {starElements}
        </div>
      </div>
    );
  }
}

export default Rating;
