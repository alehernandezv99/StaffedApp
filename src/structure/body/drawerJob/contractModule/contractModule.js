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
       // paypal.Buttons().render('#paypal-button-container');
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
                    {this.props.status === "in process"?
                     <form action={`https://staffed-app.herokuapp.com/pay`} target="_blank" className="m-3" method="POST" >
                         <input type="text" disabled={true} name="freelancer" value={this.props.freelancer} style={{display:"none"}}/>
                         <input type="text" disabled={true} name="client" value={this.props.client} style={{display:"none"}} />
                         <input type="text" disabled={true} name="projectID" value={this.props.projectID} style={{display:"none"}} />
                         <input type="text" disabled={true} name="projectName" value={this.props.title} style={{display:"none"}} />
                         <input type="text" disabled={true} name="price" value={this.props.price} style={{display:"none"}} />
                         <input type="submit" className="btn btn-custom-3" value="Pay Freelancer" />
                     </form>
                    :<div>Payment Completed</div>}
                    <div className="card-footer">
                        <button type="button" className="btn btn-custom-1 mt-3" onClick={this.props.openProposal}>View Proposal</button>
                    </div>
                </div>
            </div>
      </div>
        )
    }
}