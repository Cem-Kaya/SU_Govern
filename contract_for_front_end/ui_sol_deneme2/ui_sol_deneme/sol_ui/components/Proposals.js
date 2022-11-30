import React from 'react'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'

const Proposals = ({all_proposals}) => {
  return (
    all_proposals.length===0 ?
    <div className='container'>
        <div className='row mt-5'>
            <div className='col-4'>
                <label className='text-light'>There is no proposal</label>
            </div>
        </div>
    </div>
    :
    all_proposals.map((element, index) => (
        <div key={index} className='container border border-white text-white p-5 mt-5'>
            {console.log(element)}
            <div className='row'>  
                <div className='col-12'>
                    <label>{element[index][0]}</label><br/><br/>
                </div>
            </div>
            <div className='row'>
                <div className='col-6'>
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
                <div className='col-2'>
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
                <div className='col-4'>
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