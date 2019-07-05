import React from 'react';
import "./landingPage.css";
import logo from "../../../logo.svg"

export default class LandingPage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
            <div className="container-fluid  text-center padding-1" >
                <h1 className="m-b-3">Welcome to the Freelancer's Page</h1>
                <h5 style={{fontWeight:"normal"}} className="m-3">The freelancer's pages is lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem 
                    ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                </h5>
                <button type="button" data-toggle="modal" data-target="#signUpPanel" className="btn btn-custom-1 btn-lg m-3">Join Today</button>
            </div>
            <div className="container-fluid text-center bg-gradient-1 padding-2">
                <h2 className="m-b-3" style={{color:"white"}}>Product Info</h2>
                <div className="row text-center">
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle">link</i> Feature one</h4>
                        <p>description about the description provides, very simplify</p>
                        <img src={logo} style={{width:"70%"}} alt="feature one"/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle">link</i> Feature Two</h4>
                        <p>description about the description provides, very simplify, it sometimes can a bit longer than others</p>
                        <img src={logo} style={{width:"70%"}} alt="feature two"/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle">link</i> Feature Three</h4>
                        <p>description about the description provides, very simplify, sometimes not</p>
                        <img src={logo} style={{width:"70%"}} alt="feature three"/>
                    </div>
                </div>
            </div>
            <div className="container-fluid text-center  padding-2">
                <h2>How To Use</h2>
                <div className="row">
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 1</h4>
                        <p>Exaplain the steep 1</p>
                        <img src={logo} alt="steep 1" style={{width:"70%"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 2</h4>
                        <p>Exaplain the steep 2</p>
                        <img src={logo} alt="steep 1" style={{width:"70%"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 3</h4>
                        <p>Exaplain the steep 3</p>
                        <img src={logo} alt="steep 1" style={{width:"70%"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 4</h4>
                        <p>Exaplain the steep 4</p>
                        <img src={logo} alt="steep 1" style={{width:"70%"}}/>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="modal fade" id="loginPanel">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h4 className="modal-title text-center">Login</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div className="modal-body">
                            <form action="/action_page.php">
                              <div class="form-group">
                                <label for="email">Email address:</label>
                                <input type="email" class="form-control" id="email" />
                              </div>
                              <div class="form-group">
                                <label for="pwd">Password:</label>
                                <input type="password" class="form-control" id="pwd"/>
                              </div>
                              <div class="form-group form-check">
                                <label class="form-check-label">
                                <input class="form-check-input" type="checkbox" /> Remember me
                              </label>
                              </div>
                              <button type="submit" class="btn btn-custom-1 btn-block">Enter</button>
                              <p className="text-center mt-3">You dont have an account? <a href="#" data-toggle="modal" data-target="#signUpPanel">Sign Up</a></p>
                            </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="signUpPanel">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title text-center">Sign Up</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                            <form action="/action_page.php">
                              <div class="form-group">
                                <label for="email">Email address:</label>
                                <input type="email" class="form-control" id="email" />
                              </div>
                              <div class="form-group">
                                <label for="pwd">Password:</label>
                                <input type="password" class="form-control" id="pwd"/>
                              </div>
                              <div class="form-group">
                                <label for="pwd">Confirm Password:</label>
                                <input type="password" class="form-control" id="pwd"/>
                              </div>
                              <div class="form-group form-check">
                                <label class="form-check-label">
                                <input class="form-check-input" type="checkbox" /> Remember me
                              </label>
                              </div>
                              <button type="submit" class="btn btn-custom-1 btn-block">Sign Up</button>
                              <p className="text-center mt-3">Already have an account? <a href="#" data-toggle="modal" data-target="#signUpPanel">Login</a></p>
                            </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}