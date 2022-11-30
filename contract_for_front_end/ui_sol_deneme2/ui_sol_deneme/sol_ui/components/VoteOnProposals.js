import React from 'react'
import styled from "styled-components"

const TextBoxProposal = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    font-size: 1.5em;
`;

const VoteOnProposals = ({all_props, currAmountOfVotes, setcurrAmountOfVotes, to_vote_power}) => {

    const getTotalCount = (slctArray) => {
        let count = 0
        for(var i = 0; i < slctArray.length; i++){
            count += slctArray[i]
        }
        return count
    }

    return (
    <>
        {
            all_props.length===0 ?
            <div className='container'>
                <div className='row mt-5'>
                    <div className='col-4'>
                        <label className='text-light'>There is no proposal</label>
                    </div>
                </div>
            </div>
            :
            [0,1,2].map((i) => (
            <div key={i} className='col-4 text-white'>
                {
                    all_props.map((element, index) => (
                        index % 3 === i ?            
                            <div key={index} className='card bg-black border border-white text-white p-5 my-2'>
                                <TextBoxProposal>{element[index][0]}</TextBoxProposal><br/>
                                <label className='h6' style={{fontStyle:"italic"}}>Voting Power: {element[index][3]}</label><br/>
                                {
                                    element[index][1].map((item,indx2) => (
                                        <div key={indx2} className='row'> 
                                            <div className='col-4'>
                                                <label htmlFor="html">{item}</label>
                                            </div>   
                                            <div className='col-8'>
                                                <div className="input-group mb-3">
                                                    <div className="input-group-append">
                                                        <button type="button" className='btn btn-danger rounded-0' disabled={element[index][5] === true || currAmountOfVotes[index][indx2] === 0} onClick={() => {let selCopy = [...currAmountOfVotes]; selCopy[index][indx2] = selCopy[index][indx2] - 1; setcurrAmountOfVotes(selCopy)}}>-</button>
                                                    </div>
                                                    <input type="number" disabled={element[index][5] === true} className='text-center' style={{width:"50px", color:"black", backgroundColor:"white"}} id="html" name="fav_language" disabled={true} value={currAmountOfVotes[index][indx2]}/>
                                                    <div className="input-group-append">
                                                        <button type="button" className='btn btn-primary rounded-0' disabled={element[index][5] === true || getTotalCount(currAmountOfVotes[index]) == element[index][3]} onClick={() => {let selCopy = [...currAmountOfVotes]; selCopy[index][indx2] = selCopy[index][indx2] + 1; setcurrAmountOfVotes(selCopy)}}>+</button><br/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))    
                                }
                                <br/>
                                {
                                    element[index][5] === true ?
                                        <label className='h6'>You have already voted on this proposal</label>
                                    :
                                        <label className='h6'>Total Votes: {getTotalCount(currAmountOfVotes[index])}</label>
                                }
                                <br/>
                                <button disabled={element[index][5]} type="button" className='btn btn-primary btn-block' onClick={ () => {
                                to_vote_power(index.toString(),element[index][1],currAmountOfVotes[index])}}
                                > Vote </button>
                                <br/>
                            </div>
                        :
                        <></>
                    ))
                }
            </div>
        ))}
    </>
  )
}

export default VoteOnProposals