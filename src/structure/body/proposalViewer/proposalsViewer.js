import React from "react";
import "./proposalsViewer.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import ProposaslsViewerLoading from "../../loading/proposalsViewerLoading";
import ExtensibleText from "./extendibleText";
import firebase from "../../../firebaseSetUp";

export default class ProposalsViewer extends React.Component { 
    constructor(props){
        super(props);

        this.state = {
            proposal:null,
            project:null,
            user:"",
            author:"",
        }
    }

    componentDidMount(){
        firebase.firestore().collection("projects").doc(this.props.projectId).get()
        .then(doc => {
            let project = doc.data();
            firebase.firestore().collection("projects").doc(doc.id).collection("proposals").doc(this.props.proposalId).get()
            .then(doc2 => {
                let proposal = doc2.data();

                firebase.firestore().collection("users").doc(proposal.user).get()
                .then(user => {
                    
                    firebase.firestore().collection("users").doc(project.author).get()
                    .then(author => {
                    this.setState({project:project, proposal:proposal, user:user.data().displayName?user.data().displayName:user.data().email ,author:author.data().displayName?author.data().displayName:author.data().email});
                })
                })
                .catch(e => {
                    alert(e.message);
                })
                
            })
            .catch(e => {
                alert(e.message);
            })
        })
        .catch(e => {
            alert(e.message)
        })
    }

    render(){
        return(
            <div>
                
                 <Drawer style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"75%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                 <div className={`${Classes.DIALOG_BODY}`}>
                     {this.state.proposal === null?<ProposaslsViewerLoading />:
                     <div className="container-fluid">
                         

                        <div className="card">
                            <div className="card-header">
                                <h3>{this.state.project.title}</h3>
                            </div>

                            <div className="card-body">
                                <div className="form-group">
                                    <h4>Client</h4>
                                    <h6>{this.state.author}</h6>
                                 </div>
                                 <div className="form-group">
                                     <h4>Budget</h4>
                                     <h6>{this.state.project.budget}</h6>
                                </div>
                                <div className="form-group">
                                    <h4>Description</h4>
                                    <ExtensibleText text={this.state.project.description} />
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="button" className="btn btn-custom-1 mt-3">View Project Post</button>
                            </div>
                        </div>


                        <div className="card mt-3" style={{position:"relative"}}>
                            <div className="card-header">
                                <h3>Proposal</h3>
                            </div>
                        <div className="card-body">
                         <div className="form-group">
                             <h4>Freelancer</h4>
                             <h6>{this.state.user}</h6>
                         </div>
                         <div className="form-group">
                             <h4>Price</h4>
                             <h6>{this.state.proposal.price}</h6>
                        </div>
                        <div className="form-group">
                            <h4>Deadline</h4>
                            <h6>{this.state.proposal.deadline}</h6>
                        </div>
                        <div className="form-group mt-4">
                            <h4>Presentation</h4>
                            <h6>{this.state.proposal.presentation}</h6>
                        </div>
                        <div className="hour-posted">{this.state.proposal.created?this.state.proposal.created.toDate().toString():this.state.proposal.created.toDate().toString()}</div>
                        </div>

                        </div>
                     </div>

                     }
                     </div>
                     </div>
                 </Drawer>
                
            </div>
        )
    }
}