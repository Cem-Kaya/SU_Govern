import { redirect } from "next/dist/server/api-utils";
import React, { Component, useState } from "react";
import Button from "./Button";
function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="nav flex-column my-2">
        <li className="nav-item">
          <h2 className="nav-link text-black">Administrative</h2>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(0);
            }}
          >
            Create a SubDAO
          </p>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(1);
            }}
          >
            Assign a New YK
          </p>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(2);
            }}
          >
            ClawBack Tokens
          </p>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(3);
            }}
          >
            Send Voter Token
          </p>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(4);
            }}
          >
            Create New Proposal
          </p>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(5);
            }}
          >
            Delete DAO
          </p>
        </li>
      </ul>
      <br />
      <br />
      <ul className="nav flex-column my-2">
        <li className="nav-item">
          <h2 className="nav-link text-black">YK and Member Functions</h2>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(6);
            }}
          >
            Check My Tokens
          </p>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(7);
            }}
          >
            Withdraw Tokens
          </p>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(8);
            }}
          >
            Delegate Tokens
          </p>
        </li>
      </ul>
      <br />
      <br />
      <ul className="nav flex-column my-2">
        <li className="nav-item">
          <h2 className="nav-link text-black">Member Functions</h2>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(9);
            }}
          >
            Vote on Proposals
          </p>
        </li>
      </ul>
      <br />
      <br />
      <ul className="nav flex-column my-2">
        <li className="nav-item">
          <h2 className="nav-link text-black">Non-Member Functions</h2>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(10);
            }}
          >
            View Proposals
          </p>
        </li>
        <li className="nav-item">
          <p
            className="nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedNavItem(11);
            }}
          >
            View SubDAOs
          </p>
        </li>
      </ul>
      <br />
      <br />
    </div>
  );
}
export default Sidebar;
