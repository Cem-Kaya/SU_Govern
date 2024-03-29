import React, { Component, useState } from "react";

 function Card({address,index,title,text}) {  
    return (
      <a href={address}> 
      {/* className="item-card-link"  */}
        <div
          key={index}
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
              <h3 className="card-title">{title}</h3>
              <p className="card-desc">{text}</p>
            </div>
          </div>
        </div>
      </a>
    );
  }
export default Card;
