import React from 'react'
import { useRef } from "react";

const SendYKToken = ({onSendTokens}) => {
    const info = useRef({address: "", amount: 0});
    return (
    <>
        <span className="title text-black" id="inputGroup-sizing-default">Send YK Tokens to Address</span>
        <div className="form-group col-md-8">
            <label for="addressBox" className='text-black'>Address</label>
            <input type="text" id="addressBox" className="form-control" onChange={(e) => {info.current = {...info.current, address: e.target.value}}} aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
        </div>
        <br/><br/>
        <div className="form-group col-md-4">
            <label for="tokenBox" className='text-black'>Number of Tokens: </label>
            <input type="number" id="tokenBox" className="form-control" onChange={(e) => {info.current = {...info.current, amount: e.target.value}}}/>
        </div>
        <br/><br/><br/><br/>
        <button type="button" className='btn btn-primary rounded-0' onClick={() => {onSendTokens(info.current["address"], parseInt(info.current["amount"]))}}>Send Tokens</button>
    </>
    )
}

export default SendYKToken