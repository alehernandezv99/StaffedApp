import React from "react";
import "./contractModule.css";
import firebase from "../../../../firebaseSetUp";

export default class ContractModule extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            user:"",
        }
    }

    componentDidMount(){
        firebase.firestore().collection("users").doc(this.props.user).get()
        .then(doc => {
            this.setState({user:doc.data().displayName?doc.data().displayName:doc.data().email})
        })
    }

    render(){
        return(
            <div className="container-fluid">
            <div className="form-group">
                <h4>Client</h4>
              <h6 className="ml-3">{this.state.client ===""?<div className="spinner-border"></div>:this.state.client}</h6>
            </div>
            <div className="form-group mt-3">
                <h4>Freelancer</h4>
                <h6 className="ml-3">{this.props.freelancer === ""?<div className="spinner-border"></div>:this.state.freelancer}</h6>
            </div>
            <div className="form-group">
                <h6>{this.props.presentation}</h6>
            </div>
      </div>
        )
    }
}