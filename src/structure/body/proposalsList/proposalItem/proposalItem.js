import React from "react";
import firebase from "../../../../firebaseSetUp";

export default class ProposalItem extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            title:null,
            cover:null,
            active:null
        }
    }

    componentDidMount(){
        this._mounted = true;

        firebase.firestore().collection("projects").doc(this.props.projectID).get()
        .then(project => {
            let title = project.data().title
            firebase.firestore().collection("projects").doc(this.props.projectID).collection("proposals").where("status","==","accepted").get()
            .then(snap => {
                if(!snap.empty){
                    snap.forEach(doc => {
                        if(doc.id === this.props.proposalID){
                            if(this._mounted){
                                this.setState({
                                    active:true,
                                })
                            }
                        }
                        firebase.firestore().collection("projects").doc(this.props.projectID).collection("proposals").doc(this.props.proposalID).get()
                        .then(proposal => {
                            let presentation = proposal.data().presentation;
                            if(this._mounted){
                                this.setState({
                                    cover:presentation,
                                    title:title
                                })
                            }
                        })
                        .catch(e => {
                            this.props.addToast("Ohoh something went wrong!");
                        })
                    })
                }else {

                    firebase.firestore().collection("projects").doc(this.props.projectID).collection("proposals").doc(this.props.proposalID).get()
                        .then(proposal => {
                    if(this._mounted){
                        this.setState({
                            active:true,
                            cover:proposal.data().presentation,
                            title:title
                        })
                    }
                })
                .catch(w => {
                    this.props.addToast("Ohoh something went wrong!");
                })
                }
            })
            .catch(e => {
                this.props.addToast("Ohoh something went wrong!");
            })
        })
        
    }

    componentWillUnmount(){
        this._mounted =false;
    }

    render(){
        return (
            <div className="card mt-3 proposal-item" style={{position:"relative"}}>
                {this.state.active === true?<div className="job-status">
                    <div>Active</div>
                </div>:null}
                <div className="card-body" onClick={this.props.openProposal}>
                   {this.state.title === null?<div className="spinner-border m-3"></div>:<h4 className="text-center">{this.state.title}</h4>}
                   {this.state.cover === null?<div className="spinner-border m-3"></div>:<p className="mt-3 text-center">{this.state.cover}</p>}
                </div>
            </div>
        )
    }
}