import React from "react";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import ProposalsItem from "./proposalItem";
import firebase from "../../../firebaseSetUp";

export default class ProposalsList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            proposals:null
        }
    }

    componentDidMount(){
        this._mounted =true;
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
        .then(user => {
            let proposals = user.data().proposals?user.data().proposals:[];

            if(this._mounted){
                this.setState({
                    proposals:proposals
                })
            }
        })
        
    }

    componentWillUnmount(){
        this._mounted =false
    }

    render(){
        return (
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                 <div className={`${Classes.DIALOG_BODY}`}>
                     {this.state.proposals === null?<div className="spinner-border mt-3"></div>:this.state.proposals.length > 0?this.state.proposals.map((e,i) => {

                         return(
                         <ProposalsItem key={i} projectID={e.projectId} proposalID={e.proposalId} onClick={this.props.openProposal} addToast={this.props.addToast} />
                         )
                     }):<div className="mt-3">No proposals</div>}
                 </div>
                 </div>
            </Drawer>
        )
    }
}