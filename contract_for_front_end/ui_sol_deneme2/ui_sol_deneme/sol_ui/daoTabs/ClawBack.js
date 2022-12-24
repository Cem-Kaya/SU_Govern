import React from "react";
import { useState, useRef } from "react";

const ClawBack = ({
  onClawBackYKFromAll,
  onClawBackYKFromSingleAddress,
  onClawBackVoterFromAll,
  onClawBackVoterFromSingleAddress,
}) => {
  const [clawBackAllYK, setClawBackAllYK] = useState(false);
  const [clawBackAllVoter, setClawBackAllVoter] = useState(false);
  const info = useRef({ addressYK: "", addressVoter: "" });
  return (
    <div className="text-white">
      <span className="title text-white" id="inputGroup-sizing-default">
        Clawback YK Tokens
      </span>
      <br /><br />
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          onClick={() => {
            setClawBackAllYK(!clawBackAllYK);
          }}
        />
        <label class="form-check-label" for="flexSwitchCheckDefault">
          ClawBack From All Possible Addresses
        </label>
      </div>
      {!clawBackAllYK && (
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Wallet address
          </label>
          <input
            disabled={clawBackAllYK}
            onChange={(e) => {
              info.current = { ...info.current, addressYK: e.target.value };
            }}
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" class="form-text text-white">
            ClawBack YK Tokens From This Address
          </div>
        </div>
      )}
      <br />
      <button
        type="button"
        class="btn btn-primary"
        onClick={() => {
          clawBackAllYK
            ? onClawBackYKFromAll()
            : onClawBackYKFromSingleAddress(info.current.addressYK);
        }}
      >
        ClawBack YK Tokens
      </button>
      <br />
      <br />

      <span className="title text-white" id="inputGroup-sizing-default">
        Clawback Voter Tokens
      </span>
      <br /><br />
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault2"
          onClick={() => {
            setClawBackAllVoter(!clawBackAllVoter);
          }}
        />
        <label class="form-check-label" for="flexSwitchCheckDefault2">
          ClawBack From All Possible Addresses
        </label>
      </div>
      {!clawBackAllVoter && (
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Wallet address
          </label>
          <input
            disabled={clawBackAllVoter}
            onChange={(e) => {
              info.current = { ...info.current, addressVoter: e.target.value };
            }}
            type="email"
            class="form-control"
            id="exampleInputEmail2"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" class="form-text text-white">
            ClawBack Voter Tokens From This Address
          </div>
        </div>
      )}
      <br />
      <button
        type="button"
        class="btn btn-primary"
        onClick={() => {
          clawBackAllVoter
            ? onClawBackVoterFromAll()
            : onClawBackVoterFromSingleAddress(info.current.addressVoter);
        }}
      >
        ClawBack Voter Tokens
      </button>
      <br />
      <br />
    </div>
  );
};

export default ClawBack;
