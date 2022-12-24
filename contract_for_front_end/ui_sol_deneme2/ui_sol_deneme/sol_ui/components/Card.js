import React, { Component, useState } from "react";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a href={this.props.address}>
        <div
          key={this.props.index}
          style={{ cursor: "pointer" }}
        >
          <div className="item-card">
            <div>
              <img
                src={"https://picsum.photos/200/200"}
                alt=""
                style={{ width: "100%", height: "25vh", objectFit: "fill" }}
              />
            </div>
            <div className="card-text">
              <h3 className="card-title">{this.props.title}</h3>
              <p className="card-desc">{this.props.text}</p>
            </div>
          </div>
        </div>
      </a>
    );
  }
}
export default Card;
