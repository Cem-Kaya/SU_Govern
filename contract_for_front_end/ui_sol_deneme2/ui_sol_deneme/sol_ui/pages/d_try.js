import 'bulma/css/bulma.css'
import { useState, useEffect } from 'react'
import React from "react"
import Web3 from 'web3'
import Head from 'next/head'
import styles from '../styles/d_try.module.css'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import styled from "styled-components"

const TextBoxProposal = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
`;

export default function Dao(){
    const [error,setError]=useState('')
    const [all_props,setall_props]=useState([])
    const [selection, setSelection] = useState([])
    const [proposal, setProposal] = useState({
        text: "", 
        options: [],
        voting_power: 0
    });
    const [inputList, setInputList] = useState([]);
    const [selectedNavItem, setSelectedNavItem] = useState(0);

    let web3js
    let daoContract
    let selectedAccount
    
    let isInitialized = false;
    const connectWallethandler= async ()=>{
      // const [error,setError]=useState('')
       //const [x,setx]=useState(-1)
       
      
       if(typeof window !=="undefined" && typeof window.ethereum !== "undefined"){
           try {
           window.ethereum.request({method: "eth_requestAccounts"})
           web3js =new Web3(window.ethereum)}

           catch(err){
               setError(err.message)
           }
        }
   

       
       else{
           console.log("please install Metamesk")
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
                    console.log(err);
                    return;
                });
    
            window.ethereum.on('accountsChanged', function (accounts) {
                selectedAccount = accounts[0];
                console.log(`Selected account changed to ${selectedAccount}`);
            });
        }
    
        const web3 = new Web3(provider);
    
        const networkId = await web3.eth.net.getId();
    
        // nftContract = new web3.eth.Contract(
        // 	NFTContractBuild.abi,
        // 	NFTContractBuild.networks[networkId].address
        // );
    
   // web3 = new Web3(window.ethereum);
    let daoAPI=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},
    {"indexed":false,"internalType":"address","name":"author","type":"address"},
    {"indexed":false,"internalType":"string","name":"name","type":"string"},
    {"indexed":false,"internalType":"string[]","name":"options","type":"string[]"},
    {"indexed":false,"internalType":"uint256[]","name":"num_options","type":"uint256[]"},
    {"indexed":false,"internalType":"uint256","name":"power","type":"uint256"},
    {"indexed":false,"internalType":"uint256","name":"proposal_info_type","type":"uint256"}],"name":"proposal_info","type":"event"},
    {"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"}],"name":"accept_proposal","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"name","type":"string"},
    {"internalType":"string[]","name":"_options","type":"string[]"},
    {"internalType":"uint256[]","name":"_options_num","type":"uint256[]"},
    {"internalType":"uint256","name":"_power","type":"uint256"}],"name":"createProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit_voter","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit_voter_tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit_yk","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit_yk_tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"iterate_proposals","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"nextProposalId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"}],"name":"pending_proposal","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},
    {"internalType":"address","name":"author","type":"address"},
    {"internalType":"string","name":"name","type":"string"},
    {"internalType":"uint256","name":"createdAt","type":"uint256"},
    {"internalType":"enum MyDAO.Status","name":"status","type":"uint8"},
    {"internalType":"uint256","name":"power","type":"uint256"},
    {"internalType":"uint256","name":"proposal_info_type","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"}],"name":"reject_proposal","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"},
    {"internalType":"uint256","name":"","type":"uint256"}],"name":"tokens_not_refunded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"total_voter_shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"total_yk_shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"},
    {"internalType":"string[]","name":"_vote","type":"string[]"},
    {"internalType":"uint256[]","name":"_power","type":"uint256[]"}],"name":"vote_power","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voter_shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"voter_token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"},
    {"internalType":"uint256","name":"","type":"uint256"}],"name":"votes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw_voter","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw_voter_tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw_yk","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw_yk_tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"yk_shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"yk_token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
    
 
    daoContract=new web3.eth.Contract(
        daoAPI,
        '0x48ea49BB820AC35FFC0496044a142004e9973DbB'
        

    );
};
    const Deposit_yk_tokens =async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        
        await daoContract.methods.deposit_yk_tokens(25).send({from: selectedAccount})
        return 0;
        

    }

    const Deposit_voter_tokens =async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        
        await daoContract.methods.deposit_voter_tokens(1).send({from: selectedAccount})
        return 0;
        

    }

    const create_proposal =async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        
        await daoContract.methods.createProposal2("Dogs or Cats",["Dogs","Cat"], [0,0]).send({from: selectedAccount})
        return 0;
        

    }

    const Create_proposal =async (name, vote, power)=> {
        
        if (!isInitialized) {
            await init();
        }
        
        var initial_votes = []
        for (var i = 0; i < vote.length ; i++) 
        {
            initial_votes.push(0);
        }
        
        console.log(name)
        console.log(vote)
        console.log(power)
        console.log(initial_votes)
        await daoContract.methods.createProposal(name,vote, initial_votes, power).send({from: selectedAccount})
        return 0;
        

    }    
    

    




    const to_vote_power =async (id,vote,vote_power)=> {
        if (!isInitialized) {
            await init();
        }        
        
        /**await let x = daoContract.methods.nextProposalId().call()
         *         var x = await daoContract.methods.iterate_proposals2().send({from: selectedAccount})
                 var x = await daoContract.methods.proposals2(0).call()
        */
        // var myId = ToUint32(id)
        // var myVote = vote.toString()
        // console.log(id.type)
        // console.log(id)
        // console.log(myId.type)
        // console.log(myId)

        // console.log(vote.type)
        // console.log(vote)   
        // console.log(myVote.type)
        // console.log(myVote)
        //var x = await daoContract.methods.iterate_proposals2().send({from: selectedAccount})
        
        await daoContract.methods.vote_power(id, vote, vote_power).send({from: selectedAccount})
        
        //console.log(x['events']['proposal_info2'])
       
       // console.log(daoContract.methods.proposals(x-1).call())
        return 0;
        

    }    
    
    const to_vote_power_singular =async (id, vote)=> {
        if (!isInitialized) {
            await init();
        }        
        
        /**await let x = daoContract.methods.nextProposalId().call()
         *         var x = await daoContract.methods.iterate_proposals2().send({from: selectedAccount})
                 var x = await daoContract.methods.proposals2(0).call()
        */
        // var myId = ToUint32(id)
        // var myVote = vote.toString()
        // console.log(id.type)
        // console.log(id)
        // console.log(myId.type)
        // console.log(myId)

        // console.log(vote.type)
        // console.log(vote)   
        // console.log(myVote.type)
        // console.log(myVote)
        //var x = await daoContract.methods.iterate_proposals2().send({from: selectedAccount})
        console.log(id)
        console.log(vote)
        await daoContract.methods.vote_power(id, vote, [1]).send({from: selectedAccount})
        
        //console.log(x['events']['proposal_info2'])
       
       // console.log(daoContract.methods.proposals(x-1).call())
        return 0;
        

    }  

    



    const all_proposals =async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        
        /**await let x = daoContract.methods.nextProposalId().call()
         *         var x = await daoContract.methods.iterate_proposals2().send({from: selectedAccount})
                 var x = await daoContract.methods.proposals2(0).call()
        */
        
        
       
        var x = await daoContract.methods.iterate_proposals().send({from: selectedAccount})
        
        //console.log(x['events']['proposal_info2'])
        console.log(x)
        x=x['events']['proposal_info']
        setall_props(x)
        setSelection(selectionArrayInitialize(x))
        console.log(selection)
       // console.log(daoContract.methods.proposals(x-1).call())
        console.log(x)
        return 0;
    }    

    const selectionArrayInitialize = (x) => {
        let selectionInitializer = []
        console.log(x)
        for(var i = 0; i < x.length; i++){
            if(x[i]["returnValues"]["5"] === "1"){
                console.log(selectionInitializer)
                selectionInitializer.push([])
                selectionInitializer[i].push("")
            }
            else{
                console.log(selectionInitializer)
                selectionInitializer.push([])
                for(var j = 0; j < x[i]["returnValues"]["3"].length; j++){
                    console.log(selectionInitializer)
                    selectionInitializer[i].push(0)
                }
            }
        }
        return selectionInitializer
    }

    const getTotalCount = (slctArray) => {
        let count = 0
        for(var i = 0; i < slctArray.length; i++){
            count += slctArray[i]
        }
        return count
    }

    return(
    <div className={styles.main}>
        <Head>
            <title>DAO APP</title>
            <meta name="description" content="A blockchain dao app" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"></link>
        </Head>
        <div className='bg-black' style={{minHeight:"1000px"}}>
            {/* <div style={{backgroundImage: `url("https://bullekon.com/wp-content/uploads/2022/05/image-1.png")`}}> */}
            <div className="container" style={{padding:"40px"}}>
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <div className="card mb-3 border border-dark">
                            <img className="card-img-top rounded-0" src="https://redenom.com/info/wp-content/uploads/2018/10/redenom_cover_fb_1200x630_dao_1-1.png" alt="Card image cap"/>
                            <div className="card-body">
                                <h4 className="card-title text-center text-black">DAO</h4>
                                <p className="card-text">This is the DAO page of ...</p>
                                <p className="card-text"><small className="text-muted">175 members</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-10"></div>
                    <div className="col-2">
                        <button onClick={
                            connectWallethandler} className='btn btn-block btn-primary'>Connect Wallet</button>
                    </div>
                </div>
                <div className="row mt-5">
                    <nav className="nav nav-pills flex-column flex-sm-row">
                        <button type='button' className={selectedNavItem === 1 ? "flex-sm-fill text-sm-center nav-link active rounded-0" : "flex-sm-fill text-sm-center nav-link text-light rounded-0 border"} onClick={async() => {await all_proposals(); setSelectedNavItem(1)}}>Proposals</button>
                        <button type='button' className={selectedNavItem === 2 ? "flex-sm-fill text-sm-center nav-link active rounded-0" : "flex-sm-fill text-sm-center nav-link text-light rounded-0 border"} onClick={() => {setSelectedNavItem(2)}}>Create A Proposal</button>
                        <button type='button' className={selectedNavItem === 3 ? "flex-sm-fill text-sm-center nav-link active rounded-0" : "flex-sm-fill text-sm-center nav-link text-light rounded-0 border"} onClick={async() => {await all_proposals(); setSelectedNavItem(3)}}>Give Vote</button>
                        <button type='button' className={selectedNavItem === 4 ? "flex-sm-fill text-sm-center nav-link active rounded-0" : "flex-sm-fill text-sm-center nav-link text-light rounded-0 border"} onClick={() => {setSelectedNavItem(4)}}>Get Tokens</button>    
                    </nav>
                </div>
                <div className='row mt-5'>
                    {selectedNavItem === 1 ?
                    all_props.map((element, index) => (
                        element["returnValues"]["5"] === "1" ?
                        <div className='container border border-white text-white p-5 mt-5'>
                            <div className='row'>  
                                <div className='col-12'>
                                    <label>{element["returnValues"]["2"]}</label><br/><br/>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6'>
                                    <p>Voting Power: {element["returnValues"]["5"]}</p><br/>
                                    <p>Options:</p><br/>
                                    {
                                    element["returnValues"]["3"].map((item,keyIndex) => (
                                        <div key={keyIndex}>
                                            <label htmlFor="html">{(keyIndex + 1) + ")  " + item + " -> " + element["returnValues"]["4"][keyIndex] + " votes"}</label>
                                            <br/>
                                        </div>
                                    ))
                                    }
                                </div>
                                <div className='col-2'>
                                    <PieChart chartData={{
                                        labels: element["returnValues"]["3"],
                                        datasets: [
                                            {
                                            label: "Votes",
                                            data: element["returnValues"]["4"],
                                            backgroundColor: [
                                                "rgba(75,192,192,1)",
                                                "#ecf0f1",
                                                "#50AF95",
                                                "#f3ba2f",
                                                "#2a71d0",
                                            ],
                                            borderColor: "black",
                                            borderWidth: 1,
                                            },
                                        ],
                                        }}></PieChart>
                                </div>
                                <div className='col-4'>
                                    <BarChart chartData={{
                                        labels: element["returnValues"]["3"],
                                        datasets: [
                                            {
                                            label: "Votes",
                                            data: element["returnValues"]["4"],
                                            backgroundColor: [
                                                "rgba(75,192,192,1)",
                                                "#ecf0f1",
                                                "#50AF95",
                                                "#f3ba2f",
                                                "#2a71d0",
                                            ],
                                            borderColor: "black",
                                            borderWidth: 1,
                                            },
                                        ],
                                        }
                                    }></BarChart>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='container border border-white text-white p-5 mt-5'>
                            <div className='row'>                
                                <div className='col-12'>
                                    <label>{element["returnValues"]["2"]}</label><br/><br/>
                                </div>    
                            </div>
                            <div className='row'>
                                <div className='col-6'>
                                    <p>Voting Power: {element["returnValues"]["5"]}</p><br/>
                                    <p>Options:</p><br/>
                                    {
                                        element["returnValues"]["3"].map((item,indx2) => (
                                            <><label htmlFor="html">{(indx2 + 1) + ")  " + item + " -> " + element["returnValues"]["4"][indx2] + " votes"}</label><br/></>  
                                        ))
                                    }
                                </div>
                                <div className='col-2'>
                                    <PieChart chartData={{
                                        labels: element["returnValues"]["3"],
                                        datasets: [
                                            {
                                            label: "Votes",
                                            data: element["returnValues"]["4"],
                                            backgroundColor: [
                                                "rgba(75,192,192,1)",
                                                "#ecf0f1",
                                                "#50AF95",
                                                "#f3ba2f",
                                                "#2a71d0",
                                            ],
                                            borderColor: "black",
                                            borderWidth: 1,
                                            },
                                        ],
                                        }}></PieChart>
                                </div>
                                <div className='col-4'>
                                    <BarChart chartData={{
                                        labels: element["returnValues"]["3"],
                                        datasets: [
                                            {
                                            label: "Votes",
                                            data: element["returnValues"]["4"],
                                            backgroundColor: [
                                                "rgba(75,192,192,1)",
                                                "#ecf0f1",
                                                "#50AF95",
                                                "#f3ba2f",
                                                "#2a71d0",
                                            ],
                                            borderColor: "black",
                                            borderWidth: 1,
                                            },
                                        ],
                                        }
                                    }></BarChart>
                                </div>
                            </div>
                        </div>
                        
                    ))
                    :
                    selectedNavItem === 2 ?
                    <>
                    <div className='col-2'></div>
                    <div className='col-8 border border-light text-white p-5'>
                        <h2 className='title text-white'>CREATE NEW PROPOSAL</h2>
                        <form>
                            <label>Proposal Text: </label>
                            <br/>
                            <textarea onChange={(e) => {{setProposal({...proposal, text: e.target.value})}}} style={{width:"80%", height:"80px", padding:"5px"}}/>
                            <br/><br/>
                            <button type="button" className='btn btn-secondary rounded-0' onClick={() => {let optionValues = proposal.options; optionValues.push(""); setProposal({...proposal, options: optionValues}); setInputList(inputList.concat(<div key={inputList.length}><br/><label>Option {inputList.length + 1}: </label><input required onChange={(e) => {let optionValues = proposal.options; optionValues[inputList.length] = e.target.value; setProposal({...proposal, options: optionValues})}} /></div>))}}>Add New Option</button>
                            {inputList}
                            <br/>
                            {
                                inputList.length === 0 ?
                                <></>
                                :
                                <button type="button" className='btn btn-danger rounded-0' onClick={() => {let optionValues = proposal.options; optionValues.pop(); setProposal({...proposal, options: optionValues}); var slicedList = inputList.slice(0, inputList.length-1); setInputList(slicedList)}}>Remove Last Option</button>
                            }
                            <br/><br/>
                            <label>Voting Power: </label>
                            <input type="number" onChange={(e) => {setProposal({...proposal, voting_power: e.target.value})}}/>
                            <br/>
                            <br/>
                            <button type="button" className='btn btn-primary rounded-0' onClick={() => {Create_proposal(proposal.text, proposal.options, proposal.voting_power); /*setProposal({text: "", options: [], voting_power: 0})*/}}>Create This Proposal</button>
                            {console.log(proposal)}
                        </form>
                    </div>
                    </>
                :
                selectedNavItem === 3 ?
                    all_props.map((element, index) => (
                        element["returnValues"]["5"] === "1" ?
                            <div className='col-4 mt-5'>
                                <div className='card bg-black border border-white text-white p-5'>
                                    <TextBoxProposal>{element["returnValues"]["2"]}</TextBoxProposal><br/><br/>
                                        {
                                        element["returnValues"]["3"].map((item,keyIndex) => (
                                            <div key={keyIndex}>
                                                <input type="radio" id="html" name="fav_language" value={item} onClick={(e) => {let selCopy = [...selection]; selCopy[index][0] = e.target.value; setSelection(selCopy)}}/>
                                                <label htmlFor="html">{item}</label><br/>
                                            </div>
                                        ))
                                        }
                                        <br/>
                                        <button type="button" className='btn btn-primary btn-block' onClick={ () => 
                                            {
                                                if(selection[index][0] === ""){
                                                    alert("please select an input before submitting")
                                                }
                                                else{
                                                    console.log(element["returnValues"]["0"])
                                                    console.log(selection[index])
                                                    to_vote_power_singular(element["returnValues"]["0"], selection[index]) 
                                                }
                                            }
                                        }> Vote </button>
                                </div>
                        </div>
                        :                        
                            <div className='col-4 mt-5'>
                                <div className='card bg-black border border-white text-white p-5'>
                                        <TextBoxProposal>{element["returnValues"]["2"]}</TextBoxProposal><br/>
                                        <label className='h6'>Voting Power: {element["returnValues"]["5"]}</label><br/>
                                        {
                                            element["returnValues"]["3"].map((item,indx2) => (
                                                <div className='row'> 
                                                    <div className='col-4'>
                                                        <label htmlFor="html">{item}</label>
                                                    </div>   
                                                    <div className='col-8'>
                                                        <div class="input-group mb-3">
                                                            <div class="input-group-append">
                                                                <button type="button" className='btn btn-danger rounded-0' disabled={selection[index][indx2] === 0} onClick={() => {let selCopy = [...selection]; selCopy[index][indx2] = selCopy[index][indx2] - 1; setSelection(selCopy)}}>-</button>
                                                            </div>
                                                            <input type="number" className='text-center' style={{width:"50px", color:"black", backgroundColor:"white"}} id="html" name="fav_language" disabled={true} value={selection[index][indx2]}/>
                                                            <div class="input-group-append">
                                                                <button type="button" className='btn btn-primary rounded-0' disabled={getTotalCount(selection[index]) == element["returnValues"]["5"]} onClick={() => {let selCopy = [...selection]; selCopy[index][indx2] = selCopy[index][indx2] + 1; setSelection(selCopy)}}>+</button><br/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))    
                                        }
                                        <br/>
                                        <button type="button" className='btn btn-primary btn-block' onClick={ () => {
                                        to_vote_power(element["returnValues"]["0"],element["returnValues"]["3"],selection[index])}}
                                        > Vote </button>
                                        <br/>
                                    
                                </div>
                        </div>
                    ))
                    :
                    selectedNavItem === 4 ?
                    <div className='container'>
                        <div className='row mt-5'>
                            <div className='col-4'></div>
                            <div className='col-2'>
                                <button onClick={()=>Deposit_yk_tokens()} className='btn btn-primary'>Deposit YK Tokens</button>
                            </div>
                            <div className='col-2'>
                                {/* <button onClick={()=>Deposit_voter_tokens()} className='button is-primary'>Deposit VK Tokens</button> */}
                                <button onClick={()=>Deposit_voter_tokens()} className='btn btn-primary'>Deposit VK Tokens</button>
                            </div>
                        </div>
                    </div>
                    : 
                    <></>
                    }
                </div>
            </div>
            {/* <div className='container'>
                <button onClick={()=>all_proposals()
            
             } className='button is-primary'>All proposals</button>
            </div> */}
        
        </div>
    </div>
    )
}
//export default dao;
// to_vote(element["returnValues"]["0"],item)