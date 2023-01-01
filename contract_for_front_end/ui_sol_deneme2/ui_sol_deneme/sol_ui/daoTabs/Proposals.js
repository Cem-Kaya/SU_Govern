import React, { useEffect } from 'react'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import { useState } from 'react'
import Spinner from '../components/Spinner'

const Proposals = ({onGetAllProposals}) => {
    const [all_proposals, setall_proposals]=useState([])
    const [loaded, setLoaded]=useState(false)

    useEffect(() => {
        const get_all_proposals = async () => {
            try {
                const all_props = await onGetAllProposals();
                setall_proposals(all_props);
                setLoaded(true);
            } catch (err) {
                console.error(err.message);
            }
        }
        get_all_proposals();
    }, []);

  return (
    !loaded ?
    <Spinner></Spinner>
    :
    all_proposals.length===0 ?
    <div className='container'>
        <div className='row mt-5'>
            <div className='col-12'>
                <label className='text-light'>There is no proposal</label>
            </div>
        </div>
    </div>
    :
    all_proposals.map((element, index) => (
        <div key={index} className='container border border-white text-white p-5 mt-5'>
            <div className='row'>  
                <div className='col-12'>
                    <label className='h4'>{element[index][0]}</label><br/><br/>
                </div>
            </div>
            <div className='row'>  
                <div className='col-12'>
                    <label>{element[index][6]}</label><br/><br/>
                </div>
                <div className='col-12'>
                    <label>{element[index][4].charAt(0).toUpperCase() + element[index][4].slice(1)} proposal</label><br/><br/>
                </div>
            </div>
            <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12'>
                    <p>Voting Power: {element[index][3]}</p><br/>
                    <p>Options:</p><br/>
                    {
                    element[index][1].map((item,keyIndex) => (
                        <div key={keyIndex}>
                            <label htmlFor="html">{(keyIndex + 1) + ")  " + item + "    (" + element[index][2][keyIndex] + " votes)"}</label>
                            <br/>
                        </div>
                    ))
                    }
                </div>
                <div className='col-xl-2 col-lg-3 col-md-4 col-sm-8 col-xs-8'>
                    <PieChart chartData={{
                        labels: element[index][1],
                        datasets: [
                            {
                            label: "Votes",
                            data: element[index][2],
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
                <div className='col-xl-4 col-lg-3 col-md-6 col-sm-12 col-xs-12'>
                    <BarChart chartData={{
                        labels: element[index][1],
                        datasets: [
                            {
                            label: "Votes",
                            data: element[index][2],
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
  )
}

export default Proposals