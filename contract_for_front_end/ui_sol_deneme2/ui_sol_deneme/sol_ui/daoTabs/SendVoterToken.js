import React from 'react';
import { useRef } from "react";

const SendVoterToken = ({onSendTokens}) => {
    const info = useRef({address: "", amount: 0});
    return (
    <>
        <span className="title text-black" id="inputGroup-sizing-default">Send Tokens to Address</span>
        <div className="form-group col-md-8">
            <label for="addressBox" className='text-black'>Address</label>
            <input type="text" onChange={(e) => {info.current = {...info.current, address: e.target.value}}} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
        </div>
        <br/><br/>
        <div className="form-group col-md-4">
            <label className='text-black'>Number of Tokens: </label>
            <input type="number" className="form-control" onChange={(e) => {info.current = {...info.current, amount: e.target.value}}}/>
        </div>
        <br/><br/><br/><br/>
        <button type="button" className='btn btn-primary rounded-0' onClick={() => {onSendTokens(info.current["address"], parseInt(info.current["amount"]))}}>Send Tokens</button>
    </>
  )
}

export default SendVoterToken