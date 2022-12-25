import React from "react";
import { useState, useRef } from "react";

const Delegate = ({
  onDelegateAllYK,
  onDelegateAllTokensFromAddressYK,
  onDelegateSomeTokensFromAddressYK,
  onDelegateAllVoter,
  onDelegateAllTokensFromAddressVoter,
  onDelegateSomeTokensFromAddressVoter,
}) => {
  const [delegateAllYK, setDelegateAllYK] = useState(false);
  const [delegateAllFromAddressYK, setDelegateAllFromAddressYK] =
    useState(false);
  const [delegateAllVoter, setDelegateAllVoter] = useState(false);
  const [delegateAllFromAddressVoter, setDelegateAllFromAddressVoter] =
    useState(false);
  const info = useRef({
    addressYK: "",
    addressVoter: "",
    amountVoter: 0,
    amountYK: 0,
  });
  return (
    <div className="text-white">
      <span className="title text-white" id="inputGroup-sizing-default">
        Delegate YK Tokens
      </span>
      <br />
      <br />
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          onClick={() => {
            setDelegateAllYK(!delegateAllYK);
          }}
        />
        <label className="form-check-label" for="flexSwitchCheckDefault">
          Delegate From All Possible Addresses
        </label>
      </div>
      {!delegateAllYK && (
        <>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              Wallet address
            </label>
            <input
              disabled={delegateAllYK}
              onChange={(e) => {
                info.current = { ...info.current, addressYK: e.target.value };
              }}
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text text-white">
              Delegate YK Tokens From This Address
            </div>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefaultAmount"
              onClick={() => {
                setDelegateAllFromAddressYK(!delegateAllFromAddressYK);
              }}
            />
            <label className="form-check-label" for="flexSwitchCheckDefaultAmount">
              Delegate All of the Tokens
            </label>
          </div>
          {!delegateAllFromAddressYK && (
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Number of Tokens to Delegate
              </label>
              <input
                disabled={delegateAllFromAddressYK}
                onChange={(e) => {
                  info.current = { ...info.current, amountYK: e.target.value };
                }}
                type="number"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" className="form-text text-white">
                Delegate This Number of Tokens From This Address
              </div>
            </div>
          )}
        </>
      )}
      <br />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          delegateAllYK
            ? onDelegateAllYK()
            : delegateAllFromAddressYK
            ? onDelegateAllTokensFromAddressYK(info.current.addressYK)
            : onDelegateSomeTokensFromAddressYK(
                info.current.addressYK,
                info.current.amountYK
              );
        }}
      >
        Delegate YK Tokens
      </button>
      <br />
      <br />

      <span className="title text-white" id="inputGroup-sizing-default">
        Delegate Voter Tokens
      </span>
      <br />
      <br />
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault2"
          onClick={() => {
            setDelegateAllVoter(!delegateAllVoter);
          }}
        />
        <label className="form-check-label" for="flexSwitchCheckDefault2">
          Delegate From All Possible Addresses
        </label>
      </div>
      {!delegateAllVoter && (
        <>
          <div className="mb-3">
            <label for="exampleInputEmail1" className="form-label">
              Wallet address
            </label>
            <input
              disabled={delegateAllVoter}
              onChange={(e) => {
                info.current = {
                  ...info.current,
                  addressVoter: e.target.value,
                };
              }}
              type="email"
              className="form-control"
              id="exampleInputEmail2"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text text-white">
              Delegate Voter Tokens From This Address
            </div>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefaultAmount2"
              onClick={() => {
                setDelegateAllFromAddressVoter(!delegateAllFromAddressVoter);
              }}
            />
            <label className="form-check-label" for="flexSwitchCheckDefaultAmount2">
              Delegate All of the Tokens
            </label>
          </div>
          {!delegateAllFromAddressVoter && (
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Number of Tokens to Delegate
              </label>
              <input
                disabled={delegateAllFromAddressVoter}
                onChange={(e) => {
                  info.current = {
                    ...info.current,
                    addressVoter: e.target.value,
                  };
                }}
                type="email"
                className="form-control"
                id="exampleInputEmail2"
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" className="form-text text-white">
                Delegate This Number of Tokens From This Address
              </div>
            </div>
          )}
        </>
      )}

      <br />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          delegateAllVoter
            ? onDelegateAllVoter()
            : delegateAllFromAddressVoter
            ? onDelegateAllTokensFromAddressVoter(info.current.addressVoter)
            : onDelegateSomeTokensFromAddressVoter(
                info.current.addressVoter,
                info.current.amountVoter
              );
        }}
      >
        Delegate Voter Tokens
      </button>
      <br />
      <br />
    </div>
  );
};

export default Delegate;
