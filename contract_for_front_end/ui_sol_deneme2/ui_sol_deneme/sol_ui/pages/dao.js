import 'bulma/css/bulma.css'
import { useState, useEffect, useRef } from 'react'
import React from "react"
import Web3 from 'web3'
import Head from 'next/head'
import styles from '../styles/d_try.module.css'
import { useRouter } from "next/dist/client/router"
import Proposals from '../components/Proposals'
import CreateProposal from '../components/CreateProposal'
import VoteOnProposals from '../components/VoteOnProposals'
import WithdrawTokens from '../components/WithdrawTokens'
import SendVoterToken from '../components/SendVoterToken'
import SendYKToken from '../components/SendYKToken'
import TransferTokens from '../components/TransferTokens'
import ViewSubDAOs from '../components/ViewSubDAOs'
import CreateChildDAO from '../components/CreateChildDAO'
import Popup from '../components/Popup'

export default function Dao(){
    const router = useRouter();
    const address = router.query["address"];
    const [alertMessage,setAlertMessage]=useState({text: "", title: ""})
    const [popupTrigger, setPopupTrigger] = useState(false)
    const [all_props,setall_proposals]=useState([])
    const [selection, setSelection] = useState([])
    const [selectedNavItem, setSelectedNavItem] = useState(10);
    const dataDAO = require('../blockchain1/build/contracts/MyDAO.json');
    const dataToken = require('../blockchain1/build/contracts/SUToken.json');
    const dataFactory = require('../blockchain1/build/contracts/DAOFactory.json');

    let web3js
    let daoContract
    let voterToken
    let ykToken
    let selectedAccount
    let daoFactoryContract
    
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
                setAlertMessage({text: err.message, title: "Error"})
                setPopupTrigger(true)
           }
        }
       else{
            setAlertMessage({text: "Please install Metamask", title: "Error"})
            setPopupTrigger(true)
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
                setAlertMessage({text: `Selected account changed to ${selectedAccount}`, title: "Error"})
                setPopupTrigger(true)
            });
        }
    
        const web3 = new Web3(provider);
    
        const networkId = await web3.eth.net.getId();
    
        // nftContract = new web3.eth.Contract(
        // 	NFTContractBuild.abi,
        // 	NFTContractBuild.networks[networkId].address
        // );
    
        //web3 = new Web3(window.ethereum);
        let daoABI=dataDAO["abi"]
        
        daoContract=new web3.eth.Contract(
            daoABI,
            address
            //'0x6e8f5d2635aAC0B17749395477C8A9502aa03f82'
            //'0x947F417aE44A2e27c16D0b4D774907d470b96C75'
        );

        let daoFactoryABI=dataFactory["abi"]
        
        daoFactoryContract=new web3.eth.Contract(
          daoFactoryABI,
          '0x3053673673a1f5c0447EDC903d9eF1d684Ab2BAd'
        );

        isInitialized = true;
        
        // let ykTokenAddress, voterTokenAddress;
        // await daoContract.methods.voter_token().call().then((result)=>{ voterTokenAddress=result}).catch((err)=>{console.log(err)})
        // await daoContract.methods.yk_token().call().then((result)=>{ ykTokenAddress=result}).catch((err)=>{console.log(err)})
        // console.log(voterTokenAddress)
        // console.log(ykTokenAddress)
        // voterToken = new web3.eth.Contract(
        //     dataToken["abi"],
        //     voterTokenAddress
        // );
        // ykToken = new web3.eth.Contract(
        //     dataToken["abi"],
        //     ykTokenAddress
        // );
    };

    const Create_proposal =async (name, vote, power)=> {
        
        if (!isInitialized) {
            await init();
        }
        
        var initial_votes = []
        for (var i = 0; i < vote.length ; i++) 
        {
            initial_votes.push(0);
        }

        await daoContract.methods.createProposal(name,vote, initial_votes, power, 0).send({from: selectedAccount}).then(() => {setAlertMessage({text: "Successfully created a proposal", title: "Success"}); setPopupTrigger(true)}).catch(() => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        return 0;
    }    

    const to_vote_power = async (id,vote,vote_power) => {
        if (!isInitialized) {
            await init();
        }        
        await daoContract.methods.vote_power(id, vote, vote_power).send({from: selectedAccount}).then(() => {setAlertMessage({text: "Successfully voted on a proposal", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        
        return 0;
    }

    const all_proposals = async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        var proposalNames
        await daoContract.methods.getProposalName().call().then((result) => {proposalNames = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        
        console.log(daoContract.methods)
        var proposals = []
        proposalNames.forEach((name, index) => {
            var proposal = {}
            proposal[index] = [name]
            proposals.push(proposal)
        })
        for (var i = 0; i < proposalNames.length; i++) {
            await daoContract.methods.getProposalVoteNames(i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
            await daoContract.methods.getProposalVoteNumbers(i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
            await daoContract.methods.getProposalPower(i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
            await daoContract.methods.getProposalType(i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
            await daoContract.methods.votes(selectedAccount, i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        }
        
        console.log(proposals)
        setall_proposals(proposals)
        setSelection(selectionArrayInitialize(proposals))
        return 0;
    }    

    const SendVoterTokens = async (address, amount) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.send_voter_tokens_to_address_yk_directly(address, amount).send({from: selectedAccount}).then(() => {setAlertMessage({text: "Successfully send tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const SendYKTokens = async (address, amount) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.send_yk_tokens_to_address_yk_directly(address, amount).send({from: selectedAccount}).then(() => {setAlertMessage({text: "Successfully send tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    // const TransferVoterTokens = async (address, amount) => {
    //     if (!isInitialized) {
    //         await init();
    //     }
    //     await voterToken.methods.transfer(address, amount).send({from: selectedAccount}).then(() => {console.log("successfully made transfer")}).catch((err) => {console.log(err)})
    // }

    const selectionArrayInitialize = (x) => {
        let selectionInitializer = []
        for(var i = 0; i < x.length; i++){
            // if(x[i]["returnValues"]["5"] === "1"){
            //     console.log(selectionInitializer)
            //     selectionInitializer.push([])
            //     selectionInitializer[i].push("")
            // }
            // else{
                selectionInitializer.push([])
                console.log(x[i])
                console.log(x[i][i][1])
                for(var j = 0; j < x[i][i][1].length; j++){
                    selectionInitializer[i].push(0)
                }
            //}
        }
        return selectionInitializer
    }

    const GetSubDAOs = async () => {
        if (!isInitialized) {
            await init();
        }
        let numChildren
        await daoFactoryContract.methods.num_children(address).call().then((result) => {numChildren = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})

        let subDAOs = []
        for (var i = 0; i < numChildren; i++) {
            await daoFactoryContract.methods.parent_child_daos(address, i).call().then((result) => {subDAOs.push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        }
        return subDAOs
    }

    const GetParentDAO = async () => {
        if (!isInitialized) {
            await init();
        }
        let parentDAOAddress
        await daoFactoryContract.methods.child_parent(address).call().then((result) => {parentDAOAddress = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})

        return parentDAOAddress
    }

    const WithdrawYKTokens = async (amount) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.withdraw_yk_tokens(amount).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully withdrawn tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const WithdrawVoterTokens = async (amount) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.withdraw_voter_tokens(amount).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully withdrawn tokens", title: "Error"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const GetYKSharesToBeGiven = async () => {
        if (!isInitialized) {
            await init();
        }
        let shares
        await daoContract.methods.yk_shares_to_be_given(selectedAccount).call().then((result) => {shares = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        return shares
    }

    const GetVoterSharesToBeGiven = async () => {
        if (!isInitialized) {
            await init();
        }
        let shares
        await daoContract.methods.voter_shares_to_be_given(selectedAccount).call().then((result) => {shares = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        return shares
    }

    const CreateChildDAOFunc = async (name, description, ykTokenName, ykTokenSymbol, voterTokenName, voterTokenSymbol) => {
        if (!isInitialized) {
            await init();
        }
        await daoFactoryContract.methods.createChildDAO(address, name, description, ykTokenName, ykTokenSymbol, voterTokenName, voterTokenSymbol).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully created child DAO", title: "Error"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const getHTMLBody = () => {
        return  selectedNavItem === 0 ?
                    <CreateChildDAO onCreateChildDAO={CreateChildDAOFunc}></CreateChildDAO>
                :
                selectedNavItem === 1 ?
                    <SendYKToken onSendTokens={SendYKTokens}></SendYKToken>
                :
                selectedNavItem === 3 ?
                    <SendVoterToken onSendTokens={SendVoterTokens}></SendVoterToken>
                :
                selectedNavItem === 4 ?
                    <CreateProposal onCreateProposal={Create_proposal}></CreateProposal>
                :
                selectedNavItem === 5 ?
                    <></>/*<TransferTokens onTransferTokens={TransferVoterTokens}></TransferTokens>*/
                :
                selectedNavItem === 6 ?
                    <VoteOnProposals to_vote_power={to_vote_power} all_props={all_props} setcurrAmountOfVotes={setSelection} currAmountOfVotes={selection}></VoteOnProposals>
                :
                selectedNavItem === 7 ?
                    <WithdrawTokens onWithdrawVoterTokens={WithdrawVoterTokens} onWithdrawYKTokens={WithdrawYKTokens} onVoterSharesToBeGiven={GetVoterSharesToBeGiven} onYKSharesToBeGiven={GetYKSharesToBeGiven}></WithdrawTokens>
                : 
                selectedNavItem === 8 ?
                    <Proposals all_proposals={all_props}></Proposals>
                :
                selectedNavItem === 9 ?
                    <ViewSubDAOs onGetSubDAOs={GetSubDAOs} onGetParentDAO={GetParentDAO}></ViewSubDAOs>
                :
                <></>
    }

    return(
    <div className={styles.main}>
        <Head>
            <title>DAO APP</title>
            <meta name="description" content="A blockchain dao app" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"></link>
        </Head>
        <div className='bg-black' style={{minHeight:"100vh"}}>
            <div className="row mx-0">
                <div className="col-2">
                    <div className='container-fluid p-2'>
                        <nav className="navbar navbar-expand-lg navbar-dark bg-black">
                            <img className="navbar-brand" width={ "48px"} src="https://previews.123rf.com/images/mingirov/mingirov1609/mingirov160900049/62776269-silver-chinese-calligraphy-translation-meaning-dao-tao-taoism-icon-on-black-background-vector-illust.jpg"/>
                            <span className="align-text-bottom mt-3">
                                <a className="nav-link text-danger" href="/"><u>Go Back</u></a>
                            </span>
                        </nav>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-secondary btn-outline-white rounded-0" type="button">Button</button>
                            </div>
                        </div>
                        <div className="list-group" id="list-tab" role="tablist">
                            <button onClick={ connectWallethandler }  className="list-group-item list-group-item-action bg-transparent border border-white text-white mb-2" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="home">Connect Wallet</button>
                        </div>
                    </div>
                    <ul className="nav flex-column my-2">
                        <li className="nav-item">
                            <h2 className='nav-link text-white'>Administrative</h2>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => { setSelectedNavItem(0)}}>Create a SubDAO</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => { setSelectedNavItem(1)}}>Assign a New YK</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Increase Voter Token Amount (not working)</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => { setSelectedNavItem(3)}}>Send Voter Token</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => { setSelectedNavItem(4)}}>Create New Proposal</a>
                        </li>
                    </ul>
                    <br/><br/>
                    <ul className="nav flex-column my-2">
                        <li className="nav-item">
                            <h2 className='nav-link text-white'>Member Functions</h2>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Check My Tokens (not working)</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => {setSelectedNavItem(5)}}>Transfer Tokens (not working)</a>
                        </li>
                        <li className="nav-item">
                            <a className='nav-link' onClick={async() => {await all_proposals(); setSelectedNavItem(6)}}>Vote on Proposals</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => {setSelectedNavItem(7)}}>Withdraw Tokens</a>
                        </li>
                    </ul>
                    <br/><br/>
                    <ul className="nav flex-column my-2">
                        <li className="nav-item">
                            <h2 className='nav-link text-white'>Non-Member Functions</h2>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={async() => {await all_proposals(); setSelectedNavItem(8)}}>View Proposals</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={() => { setSelectedNavItem(9)}}>View SubDAOs</a>
                        </li>
                    </ul>
                    <br/><br/>
                </div>    
                <div className="col-9">
                <div className="container" style={{padding:"30px"}}>
                    <div className="row">
                        <div className="col-4"></div>
                        <div className="col-4">
                            <div className="card mb-3 border border-dark">
                                <img className="card-img-top rounded-0" src="https://redenom.com/info/wp-content/uploads/2018/10/redenom_cover_fb_1200x630_dao_1-1.png" alt="Card image cap"/>
                                <div className="card-body">
                                    <h4 className="card-title text-center text-black">DAO</h4>
                                    <p className="card-text">This is the DAO page of ...</p>
                                    <p className="card-text"><small className="text-muted">175 members</small></p>
                                    <p className="card-text"><small className="text-muted">45 Proposals Created</small></p>
                                </div>
                            </div>
                        </div>
                        <div className="col-2"></div>
                        <div className="col-2">
                        </div>
                    </div>
                    <div className='row mt-5'>
                        {getHTMLBody()}
                    </div>
                </div>
                </div>
            </div>
        </div>
        <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
            <h2 className='h2 text-black'>{alertMessage.title}</h2>
            <p>{alertMessage.text}</p>
        </Popup>
    </div>
    )
}