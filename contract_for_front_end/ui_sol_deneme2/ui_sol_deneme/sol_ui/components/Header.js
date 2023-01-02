import React, { useState, useEffect } from "react";
import { IconMenu2, IconX } from "@tabler/icons";

function Header({WalletConnect,logged}) {
  const [hamburger, setHamburger] = useState(false);

  const handleHamburger = () => {
    setHamburger(!hamburger);
  };



  return (
    <>
    <div className="Header-container"></div>
    <div className="Header">
      <div className="Header-web">
        <a href="/" className="Header-logo">
          SUGovern
        </a>
        <div className="Header-links">
          <a href="/projects" className="Header-link">
            Projects
          </a>
          <a className="Header-link" href="/docs">
          Wiki
        </a>
        </div>
        {logged ? (
          <div className="Header-link Wallet">Connected</div> 
          // TODO: Disconnect ekle ve ikonlastir
        ) : (
          <div className="Wallet" onClick={WalletConnect}>Wallet Connect</div>
        )}
      </div>

      {hamburger ? (
        <div className="Header-mobile hamburger-active">
          <div className="Header-mobile-top">
            <a href="/" className="Header-logo">
              SUGovern
            </a>
            <div className="Header-hamburger" onClick={handleHamburger}>
              {hamburger ? (
                <IconX width={32} height={32} />
              ) : (
                <IconMenu2 width={32} height={32} />
              )}
            </div>
          </div>
          <div className="Header-links-mobile">
            <div className="Header-links-mobile-links">
              <a href="/projects" className="Header-link-mobile">
                Projects
              </a>
            </div>
            {logged ? (
              <div className="Wallet">Connected</div>
            ) : (
              <div className="Wallet" onClick={WalletConnect}>Wallet Connect</div>
            )}
          </div>
        </div>
      ) : (
        <div className="Header-mobile">
          <div className="Header-mobile-top">
            <a href="/" className="Header-logo">
              SUGovern
            </a>
            <div className="Header-hamburger" onClick={handleHamburger}>
              {hamburger ? (
                <IconX width={32} height={32} />
              ) : (
                <IconMenu2 width={32} height={32} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Header;
