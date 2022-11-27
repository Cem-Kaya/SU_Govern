import { useState } from 'react';
import Head from 'next/head';

export default function Home() {

  const [navItemSelected, setNavItemSelected] = useState(0)

  return (
    <div>
      <Head>
        <title>DAO APP</title>
        <meta name="description" content="A blockchain dao app" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"></link>
      </Head>
      <div className='bg-black' style={{minHeight:"100vh"}}>
          <div className="row mx-0">
            <div className="col-2 border-right-0 border-white">
              <div className='container-fluid p-2'>
                <nav className="navbar navbar-expand-lg navbar-dark bg-black p-2">
                  <img className="navbar-brand" width={ "48px"} src="https://previews.123rf.com/images/mingirov/mingirov1609/mingirov160900049/62776269-silver-chinese-calligraphy-translation-meaning-dao-tao-taoism-icon-on-black-background-vector-illust.jpg"/>
                </nav>
                <div class="input-group mb-3">
                  <input type="text" class="form-control" placeholder="Search" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                  <div class="input-group-append">
                    <button class="btn btn-secondary btn-outline-white rounded-0" type="button">Button</button>
                  </div>
                </div>
                <div className="list-group" id="list-tab" role="tablist">
                  <button className="list-group-item list-group-item-action rounded-0 active mb-2" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="home">Connect Wallet</button>
                  <button className="list-group-item list-group-item-action rounded-0 mb-2" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="profile">Profile</button>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="container">
              <nav className="navbar navbar-expand-lg navbar-dark bg-black p-2">
                <a className="navbar-brand" href="/">SUDAO</a>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                      <a className={navItemSelected === 1 ? "nav-item nav-link btn disabled" : "nav-item nav-link"} onClick={() => {setNavItemSelected(0)}} href="/dao?address=0x6e8f5d2635aAC0B17749395477C8A9502aa03f82">Go to DAO Page<span className="sr-only">(currently just default)</span></a>
                      <a className={navItemSelected === 1 ? "nav-item nav-link btn disabled" : "nav-item nav-link"} onClick={() => {setNavItemSelected(1)}} href="/docs">Documentation</a>
                    </div>
                </div>
                <img src="https://www.sabanciuniv.edu/sites/default/files/logo_sabancicmyk.jpg" style={{width:"120px", marginBottom:"0px"}}/>
              </nav>
              <div className="row py-3">
              <div className="col-3">
                  <div class="card text-white bg-dark border border-white">
                    <div class="card-header">
                      <div className='container p-3'>
                        <img class="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                      </div>
                    </div>
                    <div class="card-body">
                    <h5 class="card-title">DAO Page 1</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-light">Go somewhere</a>
                    </div>
                </div>
              </div>
              <div className="col-3">
                                <div class="card text-white bg-dark border border-white">
                    <div class="card-header">
                      <div className='container p-3'>
                        <img class="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                      </div>
                    </div>
                    
                    <div class="card-body">
                    <h5 class="card-title">DAO Page 2</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-light">Go somewhere</a>
                    </div>
                </div>
              </div>
              <div className="col-3">
                                <div class="card text-white bg-dark border border-white">
                    <div class="card-header">
                      <div className='container p-3'>
                        <img class="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                      </div>
                    </div>
                    
                    <div class="card-body">
                    <h5 class="card-title">DAO Page 3</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-light">Go somewhere</a>
                    </div>
                </div>
              </div>
              <div className="col-3">
                                <div class="card text-white bg-dark border border-white">
                    <div class="card-header">
                      <div className='container p-3'>
                        <img class="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                      </div>
                    </div>
                    
                    <div class="card-body">
                    <h5 class="card-title">DAO Page 4</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-light">Go somewhere</a>
                    </div>
                </div>
              </div>
            </div>
            <div className="row py-3">
              <div className="col-3">
                                <div class="card text-white bg-dark border border-white">
                    <div class="card-header">
                      <div className='container p-3'>
                        <img class="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                      </div>
                    </div>
                    <div class="card-body">
                    <h5 class="card-title">DAO Page 5</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-light">Go somewhere</a>
                    </div>
                </div>
              </div>
              <div className="col-3">
                                <div class="card text-white bg-dark border border-white">
                    <div class="card-header">
                      <div className='container p-3'>
                        <img class="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                      </div>
                    </div>
                    <div class="card-body">
                    <h5 class="card-title">DAO Page 6</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-light">Go somewhere</a>
                    </div>
                </div>
              </div>
              <div className="col-3">
                                <div class="card text-white bg-dark border border-white">
                    <div class="card-header">
                      <div className='container p-3'>
                        <img class="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                      </div>
                    </div>
                    <div class="card-body">
                    <h5 class="card-title">DAO Page 7</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-light">Go somewhere</a>
                    </div>
                </div>
              </div>
              <div className="col-3">
                                <div class="card text-white bg-dark border border-white">
                    <div class="card-header">
                      <div className='container p-3'>
                        <img class="card-img-top rounded-circle" src="https://picsum.photos/200/200" alt="Card image cap"/>
                      </div>
                    </div>
                    <div class="card-body">
                    <h5 class="card-title">DAO Page 8</h5>
                    <p class="card-text">Some quick example text.</p>
                    <a href="#" class="btn btn-light">Go somewhere</a>
                    </div>
                </div>
              </div>
            </div>
            </div>
            </div>
        </div>
      </div>
      <div className="bg-dark">
        <div className="container p-2">
          <div className='row'>
            <div className='col-12'>
              <h3 className='text-center text-white'>Footer</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
