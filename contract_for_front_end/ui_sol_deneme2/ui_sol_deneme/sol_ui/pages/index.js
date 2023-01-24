import { useState, useEffect } from "react";
import Head from "next/head";
import Web3 from "web3";
import Popup from "../components/Popup";
import Spinner from "../components/Spinner";
import Card from "../components/Card";
import { SimpleGrid } from "@chakra-ui/react";
import Header from "../components/Header";

export default function Home() {
  const [alertMessage, setAlertMessage] = useState({ text: "", title: "" }); //this is used inside Popup component, to pass a message to the inside of the popup when an error occurs, or a transaction is successful, or in a case of warning
  const [popupTrigger, setPopupTrigger] = useState(false);  //this is used inside Popup component, to trigger the popup to show up
  const [initialized, setInitialized] = useState(false); //to check if the page is initialized, i.e. init() function is ran successfully
  const [daoFactoryContract, setDaoFactoryContract] = useState(undefined); //to store the DAOFactory contract instance
  const [walletAddress, setWalletAddress] = useState(undefined); //to store the wallet address of the user
  const [all_daos, setall_daos] = useState([]); //to store all the DAOs created by the DAOFactory contract
  const [topDAOAddress, setTopDAOAddress] = useState(""); //to store the address of the top DAO
  
  //these are the data of the contracts, we will use them in init() function
  //we will take the abi of the contracts from these files, and we will take the address of the contracts from the URL
  const dataFactory = require("../blockchain1/build/contracts/DAOFactory.json");
  const dataDAO = require("../blockchain1/build/contracts/MyDAO.json");

  const [loaded, setLoaded] = useState(false); //to check if the page is loaded, i.e. all the DAOs are fetched from the blockchain

  useEffect(() => {
    
    //fetch the amount of DAOs created by the DAOFactory contract
    const fetchNextDaoId = async () => {
      if (!initialized) {
        await init();
        setInitialized(true);
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
      if (!initialized) {
        await init();
        setInitialized(true);
      }
      const numOfDaos = await fetchNextDaoId();
      let provider = window.ethereum;
      let daoABI = dataDAO["abi"];
      const web3 = new Web3(provider);
      //fetch the address of the top DAO
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
      //fetch all the DAOs created by the DAOFactory contract
      //fetch if the dao is deleted or not, if it is deleted, then we will not show it in the UI
      //fetch the name and description of the DAOs
      //push the DAOs to allDaos array
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

        //check if the DAO is deleted or not, if it is deleted, then we will not show it in the UI
        //dao_exists() function is a function of DAOFactory contract, it checks if the DAO is deleted or not
        //dao_exists() gives out an error if the daoAddress was never used to create a DAO
        let daoExists = false;
        await daoFactoryContract.methods
          .dao_exists(daoAddress)
          .call()
          .then((result) => {
            daoExists = result;
          })
          .catch((err) => {
            setAlertMessage({ text: err.message, title: "Error" });
            setPopupTrigger(true);
          });

        if (daoExists) {
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
      }
      setall_daos(allDaos);
      setLoaded(true);  //all the DAOs are fetched from the blockchain, so we set loaded to true
      return 0;
    };
    
    fetchAllDaos();
  }, []);

  // TODO: OPTIMIZE SEARCH BAR
  const searchChange = async (event) => {
    console.log(event);
  };

  const connectWallethandler= async ()=>{
    if(typeof window !=="undefined" && typeof window.ethereum !== "undefined")  //we have metamask installed
    {
        try {
         window.ethereum.request({method: "eth_requestAccounts"}) //try to connect to the wallet
        }
        catch(err){
             setAlertMessage({text: err.message, title: "Error"}) //connection failed, show the error message
             setPopupTrigger(true)
        }
     }
    else{
         setAlertMessage({text: "Please install Metamask", title: "Error"}) //metamask is not installed, show the error message
         setPopupTrigger(true)
    }

 }

  const init = async () => {
    let provider = window.ethereum;
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" }) //try to take wallet address from metamask if connected, otherwise try to connect to the wallet
        .then((accounts) => {
          setWalletAddress(accounts[0]);  //take wallet address from metamask if connected
        })
        .catch((err) => {
          //could not take wallet address from metamask, for some reason
          setAlertMessage({ text: err.message, title: "Error" });
          setPopupTrigger(true);
        });
        
        //if the wallet address is changed or the user disconnected their wallet, we will take the new address and show it on the screen
        //we will also show a message to the user
        //wallet address is undefined if the user disconnected their wallet
        window.ethereum.on("accountsChanged", function (accounts) {
        setWalletAddress(accounts[0]); //undefined if disconnected
        if(accounts[0]===undefined || accounts[0]===null){
          setAlertMessage({text: "Disconnected from the wallet", title: "Warning"});
        }
        else{
          setAlertMessage({
            text: `Selected account changed to ${accounts[0]}`,
            title: "Success",
          });
        }
        setPopupTrigger(true);
      });
    }

    const web3 = new Web3(provider);

    let daoFactoryABI = dataFactory["abi"];

    //create contract object using the abi and the address of the factory contract
    try {
      daoFactoryContract = new web3.eth.Contract(
        daoFactoryABI,
        "0xb6859a837025d2190a5b69fb1600C30e063bE094"
      );
    } catch (err) {
      setAlertMessage({
        text: "Invalid DAO factory address",
        title: "Error",
      });
      setPopupTrigger(true);
      return;
    }

    //set the contract object in the state
    setDaoFactoryContract(daoFactoryContract);
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
      <Header logged={walletAddress !== undefined && walletAddress !== null} WalletConnect={connectWallethandler}/>
      <div className="index-page">
        {!loaded ? (
          <Spinner></Spinner>
        ) : (
          <SimpleGrid  columns={2} spacing="40px">
            {all_daos.map((dao, index) => {
              return (
                <Card
                  index={index}
                  address={`/dao?address=${dao[0]}`}
                  title={String(dao[1]).concat(
                    topDAOAddress == dao[0] ? " (top dao)" : ""
                  )}
                  text={dao[2]}
                />
              );
            })}
          </SimpleGrid>
        )}
      </div>
      <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
        <h2 className="h2 text-black">{alertMessage.title}</h2>
        <p>{alertMessage.text}</p>
      </Popup>
    </div>
  );
}
