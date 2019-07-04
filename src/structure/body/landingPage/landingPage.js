import React from 'react';
import "./landingPage.css";

export default class LandingPage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
            <div className="container-fluid  text-center padding-1" >
                <h1>Welcome to the Freelancer's Page</h1>
                <button type="button" className="btn btn-0A9FF2 btn-lg">Join Today</button>
            </div>
            <div className="container-fluied text-center">
                <div className="row">
                    <div className="col-sm-4">

                    </div>
                    <div className="col-sm-4">

                    </div>
                    <div className="col-sm-4">
                        
                    </div>
                </div>
            </div>
            </div>
        )
    }
}