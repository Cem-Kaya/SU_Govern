import React from 'react'
import { useRef } from "react";

const TransferTokens = ({onTransferTokens}) => {
    const info = useRef({address: "", amount: 0});
    return (
    <>
        <span className="title text-white" id="inputGroup-sizing-default">Transfer Voter Tokens to Another Address</span>
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text rounded-0" id="inputGroup-sizing-default">Address</span>
            </div>
            <input type="text" onChange={(e) => {info.current = {...info.current, address: e.target.value}}} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
        </div>
        <br/><br/>
        <div className="input-group mb-3">
            <label className='text-white'>Number of Tokens: </label>
            <input type="number" onChange={(e) => {info.current = {...info.current, amount: e.target.value}}}/>
            <button type="button" className='btn btn-primary rounded-0' onClick={() => {onTransferTokens(info.current["address"], parseInt(info.current["amount"]))}}>Send Tokens</button>
        </div>
    </>
    )
}

export default TransferTokens