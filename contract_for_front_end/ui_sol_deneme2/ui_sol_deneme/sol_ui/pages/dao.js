import 'bulma/css/bulma.css'
import { useState, useEffect, useRef } from 'react'
import React from "react"
import Web3 from 'web3'
import Head from 'next/head'
import styles from '../styles/d_try.module.css'
import { useRouter } from "next/dist/client/router"
import Proposals from '../daoTabs/Proposals'
import CreateProposal from '../daoTabs/CreateProposal'
import VoteOnProposals from '../daoTabs/VoteOnProposals'
import WithdrawTokens from '../daoTabs/WithdrawTokens'
import SendVoterToken from '../daoTabs/SendVoterToken'
import SendYKToken from '../daoTabs/SendYKToken'
import ViewSubDAOs from '../daoTabs/ViewSubDAOs'
import CreateChildDAO from '../daoTabs/CreateChildDAO'
import Popup from '../components/Popup'
import CheckMyTokens from '../daoTabs/CheckMyTokens'
import Spinner from '../components/Spinner'
import ClawBack from '../daoTabs/ClawBack'
import Delegate from '../daoTabs/Delegate'

export default function Dao(){
    const router = useRouter();
    const address = router.query["address"];
    const [initialized, setInitialized] = useState(true);
    const [alertMessage,setAlertMessage]=useState({text: "", title: ""})
    const [daoInfo, setDaoInfo] = useState({name: "", description: "", total_voter_tokens: 0, total_yk_tokens: 0, total_proposals: 0, total_subdaos: 0})
    const [popupTrigger, setPopupTrigger] = useState(false)
    const [selectedNavItem, setSelectedNavItem] = useState(11);
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

    useEffect(() => {
        const initializer = async () => {
            if (!isInitialized && address !== undefined) {
                await init();
                setInitialized(true);
            }
        }
        initializer();
    }, [router]);
        
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
        console.log(address)
        if (typeof provider !== 'undefined') {
            provider
                .request({ method: 'eth_requestAccounts' })
                .then((accounts) => {
                    selectedAccount = accounts[0];
                })
                .catch((err) => {
                    setAlertMessage({text: err.message, title: "Error"});
                    setPopupTrigger(true);
                    return;
                });
    
            window.ethereum.on('accountsChanged', function (accounts) {
                selectedAccount = accounts[0];
                setAlertMessage({text: `Selected account changed to ${selectedAccount}`, title: "Warning"});
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
        );

        let daoFactoryABI=dataFactory["abi"]
        
        daoFactoryContract=new web3.eth.Contract(
          daoFactoryABI,
          '0x6FDF6349AD62e7eF0E111505B7b1bAe0eEC252d4'
        );

        var daoName, daoDescription, numChildren, proposalNames;
        await daoFactoryContract.methods.num_children(String(address)).call().then((result) => {numChildren = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        await daoContract.methods.dao_name().call().then((result) => {daoName = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        await daoContract.methods.dao_description().call().then((result) => {daoDescription = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)}); 
        await daoContract.methods.getProposalName().call().then((result) => {proposalNames = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        setDaoInfo({name: daoName, description: daoDescription, num_children: numChildren, total_proposals: proposalNames.length});
        
        let ykTokenAddress, voterTokenAddress;
        await daoContract.methods.voter_token().call().then((result)=>{ voterTokenAddress=result}).catch((err)=>{setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        await daoContract.methods.yk_token().call().then((result)=>{ ykTokenAddress=result}).catch((err)=>{setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        voterToken = new web3.eth.Contract(
            dataToken["abi"],
            voterTokenAddress
        );
        ykToken = new web3.eth.Contract(
            dataToken["abi"],
            ykTokenAddress
        );

        isInitialized = true;
    };

    const GetDaoName = async (address_given) => {
        if (!isInitialized) {
            await init();
        }
        let provider = window.ethereum;
        console.log(address)
        const web3 = new Web3(provider);
        let daoABI=dataDAO["abi"]
        
        let tempDaoContract=new web3.eth.Contract(
            daoABI,
            address_given
        );

        let daoName;
        await tempDaoContract.methods.dao_name().call().then((result) => {daoName = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        return daoName;
    }

    const GetDaoDescription = async (address_given) => {
        if (!isInitialized) {
            await init();
        }
        let provider = window.ethereum;
        console.log(address)
        const web3 = new Web3(provider);
        let daoABI=dataDAO["abi"]
        
        let tempDaoContract=new web3.eth.Contract(
            daoABI,
            address_given
        );
        let daoDescription;
        await tempDaoContract.methods.dao_description().call().then((result) => {daoDescription = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        return daoDescription;
    }

    const CreateNewProposal =async (name, description, vote, power)=> {
        
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        var initial_votes = []
        for (var i = 0; i < vote.length ; i++) 
        {
            initial_votes.push(parseInt(0));
        }
        vote.forEach((element) => {
            element = String(element);
        });
        console.log("name: ", String(name), "votes: " , vote, "initial votes: ", initial_votes, "power: ", power)
        await daoContract.methods.createProposal(String(name), String(description),vote, initial_votes, parseInt(power), 0).send({from: selectedAccount}).then(() => {setAlertMessage({text: "Successfully created a proposal", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        return 0;
    }    

    const VoteOnAProposal = async (id,vote,vote_power) => {
        if (!isInitialized) {
            await init();
        }        
        console.log(selectedAccount)
        console.log(address)
        console.log(id, vote, vote_power)
        console.log(daoContract.methods)
        vote.forEach(element => {
            element = String(element)
        });
        vote_power.forEach(element => {
            element = parseInt(element)
        });
        await daoContract.methods.vote_power(parseInt(id), vote, vote_power).send({from: selectedAccount}).then(() => {setAlertMessage({text: "Successfully voted on a proposal", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        
        return 0;
    }

    const GetAllProposals = async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        var proposalNames
        await daoContract.methods.getProposalName().call().then((result) => {proposalNames = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        
        var proposals = []
        proposalNames.forEach((name, index) => {
            var proposal = {}
            proposal[index] = [name]
            proposals.push(proposal)
        })
        for (var i = 0; i < proposalNames.length; i++) {
            i = parseInt(i)
            await daoContract.methods.getProposalVoteNames(i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
            await daoContract.methods.getProposalVoteNumbers(i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
            await daoContract.methods.getProposalPower(i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
            await daoContract.methods.getProposalType(i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
            await daoContract.methods.votes(String(selectedAccount), i).call().then((result) => {proposals[i][i].push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)});
        }
        
        return proposals;
    }    

    const SendVoterTokens = async (address, amount) => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        await daoContract.methods.send_voter_tokens_to_address_yk_directly(String(address), parseInt(amount)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "Successfully sent tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const SendYKTokens = async (address, amount) => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        await daoContract.methods.send_yk_tokens_to_address_yk_directly(String(address), parseInt(amount)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "Successfully sent tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const getVoterBalance = async () => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        let voterBalance
        await voterToken.methods.balanceOf(String(selectedAccount)).call().then((result) => {voterBalance = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        return voterBalance
    }

    const getYKBalance = async () => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        let ykBalance
        await ykToken.methods.balanceOf(String(selectedAccount)).call().then((result) => {ykBalance = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        return ykBalance
    }

    const GetSubDAOs = async () => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        let numChildren
        await daoFactoryContract.methods.num_children(String(address)).call().then((result) => {numChildren = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})

        let subDAOs = []
        for (var i = 0; i < numChildren; i++) {
            await daoFactoryContract.methods.parent_child_daos(String(address), parseInt(i)).call().then((result) => {subDAOs.push(result)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        }
        return subDAOs
    }

    const GetParentDAO = async () => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        let parentDAOAddress
        await daoFactoryContract.methods.child_parent(String(address)).call().then((result) => {parentDAOAddress = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})

        return parentDAOAddress
    }

    const WithdrawYKTokens = async (amount) => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        await daoContract.methods.withdraw_yk_tokens(parseInt(amount)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully withdrawn tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const WithdrawVoterTokens = async (amount) => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        await daoContract.methods.withdraw_voter_tokens(parseInt(amount)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully withdrawn tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const GetYKSharesToBeGiven = async () => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        let shares
        await daoContract.methods.yk_shares_to_be_given(String(selectedAccount)).call().then((result) => {shares = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        return shares
    }

    const GetVoterSharesToBeGiven = async () => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        let shares
        await daoContract.methods.voter_shares_to_be_given(String(selectedAccount)).call().then((result) => {shares = result}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
        return shares
    }

    const CreateChildDAOFunc = async (name, description, ykTokenName, ykTokenSymbol, voterTokenName, voterTokenSymbol) => {
        if (!isInitialized) {
            await init();
        }
        console.log(address)
        await daoFactoryContract.methods.createChildDAO(address, String(name), String(description), String(ykTokenName), String(ykTokenSymbol), String(voterTokenName), String(voterTokenSymbol)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully created child DAO", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const DelegateAllYK = async () => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_delagation_multiple_getback_all_yk().send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully delegated all YK tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const DelegateAllVoter = async () => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_delagation_multiple_getback_all_voter().send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully delegated all voter tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const DelegateAllFromAddressYK = async (address_wallet) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methodsdao_delegation_single_getback_all_yk(String(address_wallet)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully delegated all YK tokens from address", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const DelegateAllFromAddressVoter = async (address_wallet) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_delegation_single_getback_all_voter(String(address_wallet)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully delegated all voter tokens from address", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const DelegateSomeFromAddressYK = async (address_wallet, amount_token) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_delegation_single_getback_amount_yk(String(address_wallet), parseInt(amount_token)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully delegated some YK tokens from address", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const DelegateSomeFromAddressVoter = async (address_wallet, amount_token) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_delegation_single_getback_amount_voter(String(address_wallet), parseInt(amount_token)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully delegated some voter tokens from address", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const ClawBackYKFromAll = async () => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_clawback_all_yk().send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully clawed back all YK tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const ClawBackVoterFromAll = async () => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_clawback_all_voter().send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully clawed back all voter tokens", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const ClawBackYKFromSingleAddress = async (address_wallet) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_clawback_single_yk(String(address_wallet)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully clawed back YK tokens from address", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }
    const ClawBackVoterFromSingleAddress = async (address_wallet) => {
        if (!isInitialized) {
            await init();
        }
        await daoContract.methods.dao_clawback_single_voter(String(address_wallet)).send({from: selectedAccount}).then(() => {setAlertMessage({text: "successfully clawed back voter tokens from address", title: "Success"}); setPopupTrigger(true)}).catch((err) => {setAlertMessage({text: err.message, title: "Error"}); setPopupTrigger(true)})
    }

    const getHTMLBody = () => {
        return  selectedNavItem === 0 ?
                    <CreateChildDAO onCreateChildDAO={CreateChildDAOFunc}></CreateChildDAO>
                :
                selectedNavItem === 1 ?
                    <SendYKToken onSendTokens={SendYKTokens}></SendYKToken>
                :
                selectedNavItem === 2 ?
                <ClawBack  onClawBackYKFromAll={ClawBackYKFromAll}
                    onClawBackYKFromSingleAddress={ClawBackYKFromSingleAddress}
                    onClawBackVoterFromAll={ClawBackVoterFromAll}
                    onClawBackVoterFromSingleAddress={ClawBackVoterFromSingleAddress}></ClawBack>
                :
                selectedNavItem === 3 ?
                    <SendVoterToken onSendTokens={SendVoterTokens}></SendVoterToken>
                :
                selectedNavItem === 4 ?
                    <CreateProposal onCreateProposal={CreateNewProposal}></CreateProposal>
                :
                selectedNavItem === 5 ?
                    <CheckMyTokens onCheckYKBalance={getYKBalance} onCheckVoterBalance={getVoterBalance}></CheckMyTokens>
                :
                selectedNavItem === 6 ?
                    <VoteOnProposals onVoteOnProposals={VoteOnAProposal} onGetAllProposals={GetAllProposals}></VoteOnProposals>
                :
                selectedNavItem === 7 ?
                    <WithdrawTokens onWithdrawVoterTokens={WithdrawVoterTokens} onWithdrawYKTokens={WithdrawYKTokens} onVoterSharesToBeGiven={GetVoterSharesToBeGiven} onYKSharesToBeGiven={GetYKSharesToBeGiven}></WithdrawTokens>
                : 
                selectedNavItem === 8 ?
                    <Delegate   onDelegateAllYK={DelegateAllYK}
                        onDelegateAllTokensFromAddressYK={DelegateAllFromAddressYK}
                        onDelegateSomeTokensFromAddressYK={DelegateSomeFromAddressYK}
                        onDelegateAllVoter={DelegateAllVoter}
                        onDelegateAllTokensFromAddressVoter={DelegateAllFromAddressVoter}
                        onDelegateSomeTokensFromAddressVoter={DelegateSomeFromAddressVoter}></Delegate>
                : 
                selectedNavItem === 9 ?
                    <Proposals onGetAllProposals={GetAllProposals}></Proposals>
                :
                selectedNavItem === 10 ?
                    <ViewSubDAOs onGetDAODescription={GetDaoDescription} onGetDAOName={GetDaoName} onGetSubDAOs={GetSubDAOs} onGetParentDAO={GetParentDAO}></ViewSubDAOs>
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
            {
                !initialized?
                <Spinner></Spinner>
                :
                <div className="row mx-0">
                    <div className="col-xl-2 col-lg-3 col-md-3 col-sm-4 col-xs-6">
                        <div className='container p-2'>
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
                            <div className="input-group-append" id="list-tab" role="tablist">
                                <button onClick={ connectWallethandler }  className="btn bg-transparent border border-white text-white mb-2" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="home">Connect Wallet</button>
                            </div>
                        </div>
                        <ul className="nav flex-column my-2">
                            <li className="nav-item">
                                <h2 className='nav-link text-white'>Administrative</h2>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => { setSelectedNavItem(0)}}>Create a SubDAO</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => { setSelectedNavItem(1)}}>Assign a New YK</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => { setSelectedNavItem(2)}}>ClawBack Tokens</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => { setSelectedNavItem(3)}}>Send Voter Token</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => { setSelectedNavItem(4)}}>Create New Proposal</p>
                            </li>
                        </ul>
                        <br/><br/>
                        <ul className="nav flex-column my-2">
                            <li className="nav-item">
                                <h2 className='nav-link text-white'>YK and Member Functions</h2>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => {setSelectedNavItem(5)}}>Check My Tokens</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => {setSelectedNavItem(7)}}>Withdraw Tokens</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => {setSelectedNavItem(8)}}>Delegate Tokens</p>
                            </li>
                        </ul>
                        <br/><br/>
                        <ul className="nav flex-column my-2">
                            <li className="nav-item">
                                <h2 className='nav-link text-white'>Member Functions</h2>
                            </li>
                            <li className="nav-item">
                                <p className='nav-link' style={{cursor:"pointer"}} onClick={() => {setSelectedNavItem(6)}}>Vote on Proposals</p>
                            </li>
                        </ul>
                        <br/><br/>
                        <ul className="nav flex-column my-2">
                            <li className="nav-item">
                                <h2 className='nav-link text-white'>Non-Member Functions</h2>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => {setSelectedNavItem(9)}}>View Proposals</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link" style={{cursor:"pointer"}} onClick={() => {setSelectedNavItem(10)}}>View SubDAOs</p>
                            </li>
                        </ul>
                        <br/><br/>
                    </div>    
                    <div className="col-xl-10 col-lg-9 col-md-9 col-sm-8 col-xs-6">
                        <div className="container" style={{padding:"30px"}}>
                                <div className="row">
                                    <div className="col-xl-4 col-lg-3 col-md-2 col-sm-1 col-xs-1"></div>
                                    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 col-xs-10">
                                        <div className="card mb-3">
                                            <img className="card-img-top rounded-0" src="https://redenom.com/info/wp-content/uploads/2018/10/redenom_cover_fb_1200x630_dao_1-1.png" alt="Card image cap"/>
                                            <div className="card-body">
                                                <h4 className="h4 card-title text-center text-black">{daoInfo.name}</h4>
                                                <br/>
                                                <p className="card-text"><small className="text-dark">Welcome!</small></p>
                                                <p className="card-text"><small className="text-dark">{daoInfo.description}</small></p>
                                                <p className="card-text"><small className="text-muted">{daoInfo.num_children} subDAOs</small></p>
                                                <p className="card-text"><small className="text-muted">{daoInfo.total_proposals} proposals created</small></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-3 col-md-2 col-sm-1 col-xs-1"></div>
                                </div>
                                <div className='row mt-5'>
                                    {getHTMLBody()}
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
        <Popup trigger={popupTrigger} setTrigger={setPopupTrigger}>
            <h2 className='h2 text-black'>{alertMessage.title}</h2>
            <p>{alertMessage.text}</p>
        </Popup>
    </div>
    )
}