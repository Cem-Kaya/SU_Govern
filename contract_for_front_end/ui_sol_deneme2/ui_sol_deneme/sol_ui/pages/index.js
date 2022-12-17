import { useState, useEffect } from "react";
import Head from "next/head";
import Web3 from "web3";
import Popup from "../components/Popup";
import Card from "../components/Card";
import Sidebar from "../components/SideBar";
export default function Home() {
  const [alertMessage, setAlertMessage] = useState({ text: "", title: "" });
  const [popupTrigger, setPopupTrigger] = useState(false);
  const [all_daos, setall_daos] = useState([]);
  const [topDAOAddress, setTopDAOAddress] = useState("");
  const dataFactory = require("../blockchain1/build/contracts/DAOFactory.json");
  const dataDAO = require("../blockchain1/build/contracts/MyDAO.json");

  let web3js;
  let daoFactoryContract;
  let selectedAccount;

  useEffect(() => {
    const fetchNextDaoId = async () => {
      if (!isInitialized) {
        await init();
      }
      let nextDaoId;
      await daoFactoryContract.methods
        .next_dao_id()
        .call()
        .then((result) => {
          nextDaoId = result;
        })
        .catch((err) => {
          setAlertMessage({ text: err.message, title: "Error" });
          setPopupTrigger(true);
        });
      return nextDaoId;
    };

    const fetchAllDaos = async () => {
      if (!isInitialized) {
        await init();
      }
      const numOfDaos = await fetchNextDaoId();
      let provider = window.ethereum;
      let daoABI = dataDAO["abi"];
      const web3 = new Web3(provider);
      await daoFactoryContract.methods
        .top_dao()
        .call()
        .then((result) => {
          setTopDAOAddress(result);
        })
        .catch((err) => {
          setAlertMessage({ text: err.message, title: "Error" });
          setPopupTrigger(true);
        });
      let allDaos = [];

      for (let i = 0; i < numOfDaos; i++) {
        let daoAddress, daoName, daoDescription;
        await daoFactoryContract.methods
          .all_daos(i)
          .call()
          .then((result) => {
            daoAddress = result;
          })
          .catch((err) => {
            setAlertMessage({ text: err.message, title: "Error" });
            setPopupTrigger(true);
          });
        let daoContract = new web3.eth.Contract(daoABI, daoAddress);
        await daoContract.methods
          .dao_name()
          .call()
          .then((result) => {
            daoName = result;
          })
          .catch((err) => {
            setAlertMessage({ text: err.message, title: "Error" });
            setPopupTrigger(true);
          });
        await daoContract.methods
          .dao_description()
          .call()
          .then((result) => {
            daoDescription = result;
          })
          .catch((err) => {
            setAlertMessage({ text: err.message, title: "Error" });
            setPopupTrigger(true);
          });
        allDaos.push([daoAddress, daoName, daoDescription]);
      }
      setall_daos(allDaos);
      return 0;
    };
    fetchAllDaos();
  }, []);

  // TODO: OPTIMIZE SEARCH BAR
  const searchChange = async (event) => {
    console.log(event);
  };
  let isInitialized = false;
  const connectWallethandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        window.ethereum.request({ method: "eth_requestAccounts" });
        web3js = new Web3(window.ethereum);
        setAlertMessage({
          text: "Successfully connected to a wallet",
          title: "Success",
        });
        setPopupTrigger(true);
      } catch (err) {
        setAlertMessage({ text: err.message, title: "Error" });
        setPopupTrigger(true);
      }
    } else {
      setAlertMessage({ text: "Please install Metamask", title: "Error" });
      setPopupTrigger(true);
    }
  };

  const init = async () => {
    let provider = window.ethereum;
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          selectedAccount = accounts[0];
        })
        .catch((err) => {
          setAlertMessage({ text: err.message, title: "Error" });
          setPopupTrigger(true);
          return;
        });

      window.ethereum.on("accountsChanged", function (accounts) {
        selectedAccount = accounts[0];
        setAlertMessage({
          text: `Selected account changed to ${selectedAccount}`,
          title: "Warning",
        });
        setPopupTrigger(true);
      });
    }

    const web3 = new Web3(provider);

    let daoFactoryABI = dataFactory["abi"];

    daoFactoryContract = new web3.eth.Contract(
      daoFactoryABI,
      "0x75824759C71Ca4C2F2C2fecCe608F15cfCfF3feB"
    );
    isInitialized = true;
  };

  return (
    <div>
      <Head>
        <title>DAO APP</title>
        <meta name="description" content="A blockchain dao app" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
          crossOrigin="anonymous"
        ></link>
      </Head>
      <div style={{ minHeight: "100vh", backgroundColor: "#394263" }}>
        <div className="row mx-0">
          <Sidebar
            search={searchChange}
            connectWallethandler={connectWallethandler}
          />
          {/* MAIN CONTAINER BEGIN */}
          <div className="col-9">
            <div className="container">
              <nav className="navbar navbar-expand-lg navbar-dark p-2">
                <a className="navbar-brand" href="/">
                  SUDAO
                </a>
                <div
                  className="collapse navbar-collapse"
                  id="navbarNavAltMarkup"
                >
                  <div className="navbar-nav">
                    <a className="nav-item nav-link" href="/docs">
                      Documentation
                    </a>
                  </div>
                </div>
              </nav>
              <div className="row py-3">
                {all_daos.map((dao, index) => {
                  return (
                    <Card
                      index={index}
                      title={String(dao[1]).concat(
                        String(topDAOAddress == dao[0] ? "(top dao)" : "")
                      )}
                      text={dao[2]}
                      address={dao[0]}
                    />
                  );
                })}
              </div>
            </div>
            {/* MAIN CONTAINER END */}
          </div>
        </div>
      </div>
      <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
        <h2 className="h2 text-black">{alertMessage.title}</h2>
        <p>{alertMessage.text}</p>
      </Popup>
    </div>
  );
}
