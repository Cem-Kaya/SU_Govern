import { redirect } from "next/dist/server/api-utils";
import React, { Component, useState } from "react";
import Button from "./Button";
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
          <div
            className="col-2"
            style={{ borderRight: "2px solid #4D5674", minHeight: "100vh" }}
          >
            <div className="container-fluid p-2">
              <nav className="navbar navbar-expand-lg navbar-dark p-2">
                <img
                  className="navbar-brand"
                  width={"100%"}
                  src="https://www.sabanciuniv.edu/sites/default/files/logo_sabancicmyk.jpg"
                />
              </nav>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  onChange={this.props.search}
                  style={{ borderRadius: "36px" }}
                  placeholder="Search"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
                {/* <div className="input-group-append">
                      <button className="btn btn-secondary btn-outline-white rounded-0" type="button">Button</button>
                    </div> */}
              </div>
              <div className="list-group" id="list-tab" role="tablist">
                <button
                  onClick={this.props.connectWallethandler}
                  className="list-group-item list-group-item-action rounded-0 active mb-2"
                  id="list-home-list"
                  data-bs-toggle="list"
                  href="#list-home"
                  role="tab"
                  aria-controls="home"
                >
                  Connect Wallet
                </button>
                {/* <button className="list-group-item list-group-item-action rounded-0 mb-2" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="profile">Profile</button> */}
                <Button svg={'./doc.svg'} alt={'Doc'} name={'Documentation'}/>
                <Button svg={'./feedback.svg'} alt={'Feed'} name={'Feedback'}/>
              </div>
            </div>
          </div>
    );
  }
}
export default Sidebar;
