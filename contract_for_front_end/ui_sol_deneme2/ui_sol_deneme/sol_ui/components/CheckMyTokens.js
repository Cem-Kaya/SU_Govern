import React from 'react'
import { useState, useEffect } from 'react'

const CheckMyTokens = ({onCheckYKBalance, onCheckVoterBalance}) => {
    const [voterBalance, setVoterBalance] = useState(-1);
    const [ykBalance, setYKBalance] = useState(-1);
  
    useEffect(() => {
        const fetchBalances = async ()=> {
            setVoterBalance(await onCheckVoterBalance());
            setYKBalance(await onCheckYKBalance());
        }
        fetchBalances();
    }, []);

    return (
        <div className='container m-3'>
            <label className='text-white'>Voter Balance: {voterBalance / Math.pow(10, 18)}</label>
            <br/><br/>
            <label className='text-white'>YK Balance: {ykBalance / Math.pow(10, 18)}</label>
        </div>
    )
}

export default CheckMyTokens