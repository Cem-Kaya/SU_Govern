import React, { useEffect } from 'react'
import { useState } from 'react'

const ViewSubDAOs = ({onGetSubDAOs, onGetParentDAO}) => {
    const [subDAOs, setSubDAOs] = useState([]);
    const [parentDAO, setParentDAO] = useState("");

    useEffect(() => {
        const fetchSubDAOs = async ()=> {
            setSubDAOs(await onGetSubDAOs());
        }
        const fetchParentDAO = async ()=> {
            setParentDAO(await onGetParentDAO());
        }
        fetchSubDAOs();
        fetchParentDAO();

    }, []);

  return (
    <>z
    {
        parentDAO==="0x0000000000000000000000000000000000000000" ?
        <div className='container'>
            <div className='row mt-5'>
                <div className='col-4'></div>
                <div className='col-4'>
                    <label className='text-light'>There is no parent DAO</label>
                </div>
            </div>
        </div>
        :
        <div className='container'>
            <div className='row mt-5'>
                <div className='col-4'></div>
                <div className='col-4'>
                    <label className='text-light'>Parent DAO: {parentDAO}</label>
                </div>
            </div>
        </div>
    }
    {
        subDAOs.length===0 ?
        <div className='container'>
            <div className='row mt-5'>
                <div className='col-4'>
                    <label className='text-light'>There is no sub DAO</label>
                </div>
            </div>
        </div>
        :
        <div className='container'>
            <div className='row mt-5'>
                <div className='col-4'> 
                {subDAOs.map((subDAO) => 
                (
                    <label className='text-light'>Sub DAO: {subDAO}</label>
                ))}
                </div>
            </div>
        </div>
    }
    </>
    
  )
}

export default ViewSubDAOs