import React from "react";
import "./contractModule.css";
import firebase from "../../../../firebaseSetUp";
import UserBox from "../../profile/userBox";

export default class ContractModule extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            freelancer:"",
        }
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    componentDidMount(){
        this._mounted = true;
  

    }

    render(){
        return(
            <div className="container-fluid">
            <div className="form-group">
                <h4>Client</h4>
                <UserBox id={this.props.client} addToast={this.props.addToast} size={"60px"} handleStates={this.props.handleStates} />
            </div>
            <div className="form-group mt-3">
                <h4>Freelancer</h4>
               <UserBox id={this.props.freelancer} addToast={this.props.addToast} size={"60px"} handleStates={this.props.handleStates} />
            </div>
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">Terms</div>
                    <div className="card-body">
                        <div className="form-group">
                            <h4>Description</h4>
                            <h6>{this.props.description}</h6>
                        </div>
                        <div className="form-group">
                            <h4>Price</h4>
                            <h6>{this.props.price}$</h6>
                        </div>
                        <div className="form-group">
                            <h4>Deadline</h4>
                            <h6>{this.props.deadline.toDate().toDateString()}</h6>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="button" className="btn btn-custom-1 mt-3" onClick={this.props.openProposal}>View Proposal</button>
                    </div>
                </div>
            </div>
      </div>
        )
    }
}