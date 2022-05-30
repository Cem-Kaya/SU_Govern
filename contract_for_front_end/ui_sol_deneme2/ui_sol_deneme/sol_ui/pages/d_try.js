import 'bulma/css/bulma.css'
import { useState } from 'react'
import Web3 from 'web3'
import Head from 'next/head'
import styles from '../styles/d_try.module.css'

export default function dao(){
    const [error,setError]=useState('')
    const [all_props,setall_props]=useState([])
  

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
    let daoAPI=[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"}
    ,{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},
    {"indexed":false,"internalType":"address","name":"author","type":"address"},
    {"indexed":false,"internalType":"string","name":"name","type":"string"},
    {"indexed":false,"internalType":"uint256","name":"votesForYes","type":"uint256"},
    {"indexed":false,"internalType":"uint256","name":"votesForNo","type":"uint256"}],"name":"proposal_info","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},
    {"indexed":false,"internalType":"address","name":"author","type":"address"},
    {"indexed":false,"internalType":"string","name":"name","type":"string"},
    {"indexed":false,"internalType":"string[]","name":"options","type":"string[]"},
    {"indexed":false,"internalType":"uint256[]","name":"num_options","type":"uint256[]"}],"name":"proposal_info2","type":"event"}
    ,{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},
    {"indexed":false,"internalType":"address","name":"author","type":"address"},
    {"indexed":false,"internalType":"string","name":"name","type":"string"}
    ,{"indexed":false,"internalType":"string[]","name":"options","type":"string[]"},
    {"indexed":false,"internalType":"uint256[]","name":"num_options","type":"uint256[]"},
    {"indexed":false,"internalType":"uint256","name":"power","type":"uint256"},
    {"indexed":false,"internalType":"uint256","name":"proposal_info_type","type":"uint256"}],"name":"proposal_info3","type":"event"},
    {"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"createProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"name","type":"string"},
    {"internalType":"string[]","name":"_options","type":"string[]"},
    {"internalType":"uint256[]","name":"_options_num","type":"uint256[]"}],"name":"createProposal2","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"name","type":"string"},
    {"internalType":"string[]","name":"_options","type":"string[]"},
    {"internalType":"uint256[]","name":"_options_num","type":"uint256[]"},
    {"internalType":"uint256","name":"_power","type":"uint256"}],"name":"createProposal3","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit_tokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"iterate_proposals","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"iterate_proposals2","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"iterate_proposals3","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"iterate_proposals_ultimate","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"nextProposalId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"nextProposalId2","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},
    {"internalType":"address","name":"author","type":"address"},
    {"internalType":"string","name":"name","type":"string"},
    {"internalType":"uint256","name":"createdAt","type":"uint256"},
    {"internalType":"uint256","name":"votesForYes","type":"uint256"},
    {"internalType":"uint256","name":"votesForNo","type":"uint256"},
    {"internalType":"enum MyDAO.Status","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals2","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},
    {"internalType":"address","name":"author","type":"address"},
    {"internalType":"string","name":"name","type":"string"},
    {"internalType":"uint256","name":"createdAt","type":"uint256"},
    {"internalType":"enum MyDAO.Status","name":"status","type":"uint8"},
    {"internalType":"uint256","name":"proposal_info_type","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals3","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},
    {"internalType":"address","name":"author","type":"address"},
    {"internalType":"string","name":"name","type":"string"},
    {"internalType":"uint256","name":"createdAt","type":"uint256"},
    {"internalType":"enum MyDAO.Status","name":"status","type":"uint8"},
    {"internalType":"uint256","name":"power","type":"uint256"},
    {"internalType":"uint256","name":"proposal_info_type","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"},
    {"internalType":"enum MyDAO.VotingOptions","name":"_vote","type":"uint8"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"},
    {"internalType":"string","name":"_vote","type":"string"}],"name":"vote2","outputs":[],"stateMutability":"nonpayable","type":"function"}
    ,{"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"},
    {"internalType":"string","name":"_vote","type":"string"}
    ,{"internalType":"uint256","name":"_power","type":"uint256"}],"name":"vote3","outputs":[],"stateMutability":"nonpayable","type":"function"}
    ,{"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"}
    ,{"internalType":"string[]","name":"_vote","type":"string[]"}
    ,{"internalType":"uint256[]","name":"_power","type":"uint256[]"}],"name":"vote3_multiplevotesedition","outputs":[],"stateMutability":"nonpayable","type":"function"}
    ,{"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"}
    ,{"internalType":"enum MyDAO.VotingOptions","name":"_vote","type":"uint8"}],"name":"vote_weighted","outputs":[],"stateMutability":"nonpayable","type":"function"}
    ,{"inputs":[{"internalType":"address","name":"","type":"address"}
    ,{"internalType":"uint256","name":"","type":"uint256"}],"name":"votes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}
    ,{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    
 
    daoContract=new web3.eth.Contract(
        daoAPI,
        '0x8107c31564d9F7943C68fCBbFCFDF747060656B2'
        

    );
};
    const Deposit =async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        
        await daoContract.methods.deposit_tokens(25).send({from: selectedAccount})
        return 0;
        

    }

    const create_proposal =async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        
        await daoContract.methods.createProposal2("Dogs or Cats",["Dogs","Cat"], [0,0]).send({from: selectedAccount})
        return 0;
        

    }

    const create_proposal3 =async (name, vote, power)=> {
        
        if (!isInitialized) {
            await init();
        }

        var initial_votes = new Array(vote.length)
        for (var i = 0; i < initial_votes.length ; i++) 
        {
                initial_votes[i] = 0;
        }
        
        await daoContract.methods.createProposal3(name,vote, initial_votes, power).send({from: selectedAccount})
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
        
        
       
        var x = await daoContract.methods.iterate_proposals2().send({from: selectedAccount})
        
        //console.log(x['events']['proposal_info2'])
        x=x['events']['proposal_info2']
        setall_props(x)
       // console.log(daoContract.methods.proposals(x-1).call())
       console.log(x)
        return 0;
        

    }

    const to_vote =async (id, vote)=> {
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
        
        await daoContract.methods.vote2(id, vote).send({from: selectedAccount})
        
        //console.log(x['events']['proposal_info2'])
       
       // console.log(daoContract.methods.proposals(x-1).call())
        return 0;
        

    }    
    
    const to_vote3_singular =async (id, vote)=> {
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
        
        await daoContract.methods.vote3(id, vote, 1).send({from: selectedAccount})
        
        //console.log(x['events']['proposal_info2'])
       
       // console.log(daoContract.methods.proposals(x-1).call())
        return 0;
        

    }  

    const to_vote3_multiplevotesedition =async (id, vote, power)=> {
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
        
        await daoContract.methods.vote3_multiplevotesedition(id, vote, power).send({from: selectedAccount})
        
        //console.log(x['events']['proposal_info2'])
       
       // console.log(daoContract.methods.proposals(x-1).call())
        return 0;
        

    }      


    const all_proposals2 =async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        
        /**await let x = daoContract.methods.nextProposalId().call()*/
        var x = await daoContract.methods.nextProposalId2().call()

        console.log(x)
        let proposals = []
        for (let i = 0; i < x; i++) {
            let proposal = await daoContract.methods.proposals2(i).call();
            
        }
       // console.log(daoContract.methods.proposals(x-1).call())
        
        return 0;
        

    }

    const all_proposals3 =async ()=> {
        
        if (!isInitialized) {
            await init();
        }
        
        /**await let x = daoContract.methods.nextProposalId().call()
         *         var x = await daoContract.methods.iterate_proposals2().send({from: selectedAccount})
                 var x = await daoContract.methods.proposals2(0).call()
        */
        
        
       
        var x = await daoContract.methods.iterate_proposals3().send({from: selectedAccount})
        
        //console.log(x['events']['proposal_info2'])
        console.log(x)
        x=x['events']['proposal_info3']
        setall_props(x)
       // console.log(daoContract.methods.proposals(x-1).call())
        console.log(x)
        return 0;
        
        

    }    

    let selection = []

    const selectionArrayInitialize = () => {
        for(var i = 0; i < all_props.length; i++){
            selection.push("")
        }
    }

    return(
    <div className={styles.main}>
        <Head>
            <title>DAO APP</title>
            <meta name="description" content="A blockchain dao app" />

        </Head>
        <nav className="Navbar mt-4 mb-4">
            <div className='container'>
                <div className='navbar-brand'>
                    <h1>DAO</h1>
                </div>
                <div className='navbar-end'>
                    <button onClick={
                        connectWallethandler
                    } className='button is-primary'>Connect Wallet</button>
                </div>
            </div>
        </nav>
        <section>
            <div className="container">
                <p>placeholder text</p>
            </div>
        </section>
        <section>
            {/* <div className="text-has-danger">
                <p>error</p>
            </div> */}
        <br></br>
        <div className='container'>
            <button onClick={()=>Deposit()
            } className='button is-primary'>Deposit Tokens</button>
        </div>
        <br/>
        <div className='container'>
            <button onClick={()=>create_proposal()
            
            } className='button is-primary'>Create this proposal</button>
        </div>
        <br/>
    
          <label for="fname">First name:</label>
          <input type="text" id="fname" name="fname"></input><br></br>
          <label for="lname">Last name:</label>
          <input type="text" id="lname" name="lname"></input><br></br>
            <div className='container'>
                <button onClick={()=>all_proposals3()
            
             } className='button is-primary'>All proposals</button>
            </div>
     
        <br/><br/>
        </section>

        {selectionArrayInitialize()}
        {all_props.map((element, index) => (
            element["returnValues"]["5"] !== "1" ?
            <form>
                <p>{element["returnValues"]["2"]}, {element["returnValues"]["5"]}</p>
                {
                element["returnValues"]["3"].map(item => (
                    <>
                      <input type="radio" id="html" name="fav_language" value={item} onClick={() => {selection[index] = event.target.value}}/>
                      <label for="html">{item}</label><br/>
                    </>
                ))
                }
                <button type="button" onClick={ () => {if(selection[index] !== "") 
                    {to_vote3_singular(element["returnValues"]["0"],selection[index])}}}> Vote </button>
                
            </form>
            :
        <form>
            <p>{element["returnValues"]["2"]}</p>
            {
                element["returnValues"]["3"].map(item => (
                    <>
                      <input type="radio" id="html" name="fav_language" value={item} onClick={() => {selection[index] = event.target.value}}/>
                      <label for="html">{item}</label><br/>
                    </>
                ))
            }
            <button type="button" onClick={ () => {if(selection[index] !== "") 
            { to_vote(element["returnValues"]["0"],selection[index])}}}
            > Vote </button>
            
            <br/><br/>
        </form>
        )
        )}
     
    </div>
    )
}
//export default dao;
// to_vote(element["returnValues"]["0"],item)