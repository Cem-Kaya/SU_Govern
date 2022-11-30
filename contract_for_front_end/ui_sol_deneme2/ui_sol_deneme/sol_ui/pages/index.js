import { useState, useEffect } from 'react';
import Head from 'next/head';
import Web3 from 'web3';
import Popup from '../components/Popup';

export default function Home() {

  const [alertMessage,setAlertMessage]=useState({text: "", title: ""})
  const [popupTrigger, setPopupTrigger] = useState(false)
  const [all_daos,setall_daos]=useState([])
  const [topDAOAddress,setTopDAOAddress]=useState("")
  const dataFactory = require('../blockchain1/build/contracts/DAOFactory.json');
  const dataDAO = require('../blockchain1/build/contracts/MyDAO.json');

  let web3js
  let daoFactoryContract
  let selectedAccount

  useEffect(() => {
    const fetchNextDaoId = async ()=> {
      if (!isInitialized) {
          await init();
      }
      console.log(daoFactoryContract.methods)
      let nextDaoId
      await daoFactoryContract.methods.next_dao_id().call().then((result) => {nextDaoId = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
      console.log(nextDaoId)
      return nextDaoId;
    }
  
    const fetchAllDaos = async ()=> {
      if (!isInitialized) {
          await init();
      }
      const numOfDaos = await fetchNextDaoId();
      let provider = window.ethereum;
      let daoABI = dataDAO["abi"]
      const web3 = new Web3(provider);
      await daoFactoryContract.methods.top_dao().call().then((result) => {console.log(result); setTopDAOAddress(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
      let allDaos = []
      
      for(let i = 0; i < numOfDaos; i++) {
        let daoAddress, daoName, daoDescription
        await daoFactoryContract.methods.all_daos(i).call().then((result) => {daoAddress = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        console.log(daoAddress)
        let daoContract = new web3.eth.Contract(daoABI, daoAddress)
        await daoContract.methods.dao_name().call().then((result) => {daoName = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        await daoContract.methods.dao_description().call().then((result) => {daoDescription = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        allDaos.push([daoAddress, daoName, daoDescription])
      }
      setall_daos(allDaos)
      return 0;
    }
    fetchAllDaos();
  }, []);
  
  let isInitialized = false;
  const connectWallethandler= async ()=>{
     if(typeof window !=="undefined" && typeof window.ethereum !== "undefined"){
        try {
          window.ethereum.request({method: "eth_requestAccounts"})
          web3js =new Web3(window.ethereum)
          setAlertMessage({text: "Successfully connected to a wallet", title: "Success"});
          setPopupTrigger(true);
        }
        catch(err){
          setAlertMessage({text: err.message, title: "Error"});
          setPopupTrigger(true);
        }
      }
     else{
      setAlertMessage({text: "Please install Metamask", title: "Error"});
      setPopupTrigger(true);
     }
  }
  
  const init = async () => {
      let provider = window.ethereum;  
      if (typeof provider !== 'undefined') {
          provider
              .request({ method: 'eth_requestAccounts' })
              .then((accounts) => {
                  selectedAccount = accounts[0];
                  console.log(`Selected account is ${selectedAccount}`);
              })
              .catch((err) => {
                  setAlertMessage({text: err.message, title: "Error"});
                  setPopupTrigger(true);
                  return;
              });
  
          window.ethereum.on('accountsChanged', function (accounts) {
              selectedAccount = accounts[0];
              console.log(`Selected account changed to ${selectedAccount}`);
          });
      }
  
      const web3 = new Web3(provider);
  
      let daoFactoryABI=dataFactory["abi"]
      console.log(daoFactoryABI)
      
      daoFactoryContract=new web3.eth.Contract(
        daoFactoryABI,
        '0x3053673673a1f5c0447EDC903d9eF1d684Ab2BAd'
      );
      isInitialized = true;
  };

  console.log(all_daos)

  return (
    <div>
      <Head>
        <title>DAO APP</title>
        <meta name="description" content="A blockchain dao app" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"></link>
      </Head>
      <div className='bg-black' style={{minHeight:"100vh"}}>
          <div className="row mx-0">
            <div className="col-2">
              <div className='container-fluid p-2'>
                <nav className="navbar navbar-expand-lg navbar-dark bg-black p-2">
                  <img className="navbar-brand" width={ "48px"} src="https://previews.123rf.com/images/mingirov/mingirov1609/mingirov160900049/62776269-silver-chinese-calligraphy-translation-meaning-dao-tao-taoism-icon-on-black-background-vector-illust.jpg"/>
                </nav>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                  <div className="input-group-append">
                    <button className="btn btn-secondary btn-outline-white rounded-0" type="button">Button</button>
                  </div>
                </div>
                <div className="list-group" id="list-tab" role="tablist">
                  <button onClick={ connectWallethandler} className="list-group-item list-group-item-action rounded-0 active mb-2" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="home">Connect Wallet</button>
                  {/* <button className="list-group-item list-group-item-action rounded-0 mb-2" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="profile">Profile</button> */}
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="container">
              <nav className="navbar navbar-expand-lg navbar-dark bg-black p-2">
                <a className="navbar-brand" href="/">SUDAO</a>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                      <a className="nav-item nav-link" href="/docs">Documentation</a>
                    </div>
                </div>
                <img src="https://www.sabanciuniv.edu/sites/default/files/logo_sabancicmyk.jpg" style={{width:"120px", marginBottom:"0px"}}/>
              </nav>
              <div className="row py-3">
                {
                  all_daos.map((dao, index) => {
                    return (
                      <div key={index} className="col-3 my-2">
                          <div className="card text-white bg-dark border border-white">
                            <div className="card-header">
                              <div className='container p-3'>
                                <img className="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                              </div>
                            </div>
                            <div className="card-body">
                            <h5 className="card-title">{dao[1]}{console.log(topDAOAddress)}{topDAOAddress == dao[0] ? " (top dao)" : ""}</h5>
                            <p className="card-text">{dao[2]}</p>
                            <a href={`/dao?address=${dao[0]}`} className="btn btn-light">Go to the DAO Page</a>
                            </div>
                        </div>
                      </div>
                    )
                })}              
              </div>
            </div>
            </div>
        </div>
      </div>
      <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
            <h2 className='h2 text-black'>{alertMessage.title}</h2>
            <p>{alertMessage.text}</p>
        </Popup>
      <div className="bg-dark">
        <div className="container p-2">
          <div className='row'>
            <div className='col-12'>
              <h3 className='text-center text-white'>Footer</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
