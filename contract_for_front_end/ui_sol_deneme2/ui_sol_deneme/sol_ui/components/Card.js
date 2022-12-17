import React, { Component, useState } from "react";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,
      title: this.props.title,
      text: this.props.text,
      address: this.props.address,
    };
  }
  render() {
    return (
      <div key={this.state.index} className="col-3 my-2">
        <a href={`/dao?address=${this.state.address}`}>
          <div
            className="card text-white"
            style={{ backgroundColor: "#4D5674" }}
          >
            <div className="card-header">
              <div className="container p-3">
                <img
                  className="card-img-top rounded-circle"
                  src="https://picsum.photos/200/200"
                  alt="Card image cap"
                />
              </div>
            </div>
            <div className="card-body">
              <h5 className="card-title">{this.state.title}</h5>
              <p className="card-text">{this.state.text}</p>
            </div>
          </div>
        </a>
      </div>
    );
  }
}
export default Card;
