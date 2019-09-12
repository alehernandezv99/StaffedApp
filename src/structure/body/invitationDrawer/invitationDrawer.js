import React from "react";
import "./invitationDrawer.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import firebase from "../../../firebaseSetUp";
import UserBox from "../profile/userBox";
import LoadingSpinner from "../../loading/loadingSpinner";



export default class InvitationDrawer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            invitation:null,
            isLoading:false
        }
    }

    toggleLoading = () => {
        if(this._mounted){
            this.setState(state => ({
                isLoading:!state.isLoading
            }))
        }
    }

    getInvitation = () => {
        firebase.firestore().collection("invitations").doc(this.props.id).get()
        .then(doc => {
            if(doc.exists){
            if(this._mounted){
                this.setState({
                    invitation:doc.data()
                })
            }
        }else {
            if(this._mounted){
                this.setState({
                    invitation:false
                })
            }
        }
        })
        .catch(e => {
            this.props.addToast("Ohoh something went wrong!");
        })
    }

    componentDidMount(){
        this._mounted = true;

        this.getInvitation();
    }

    componentWillUnmount() {
        this._mounted = false
    }

    accept = () => {
        this.toggleLoading();
        if(this.state.invitation.from !== firebase.auth().currentUser.uid){
        firebase.firestore().collection("invitations").where("status","==","pending").where("id","==",this.props.id).get()
        .then(snap => {
          
            if(!snap.empty){

            let batch = firebase.firestore().batch();
            batch.update(firebase.firestore().collection("invitations").doc(this.props.id),{
                status:"accepted"
            })

            snap.forEach(doc => {
                let inboxID = firebase.firestore().collection("users").doc(doc.data().from).collection("inbox").doc().id
                batch.set(firebase.firestore().collection("users").doc(doc.data().from).collection("inbox").doc(inboxID), {
                    id:inboxID,
                    message:`The user ${firebase.auth().currentUser.uid} accepted to be part of your company staff`,
                    action:{
                        id:doc.data().id,
                        type:"Invitation"
                    },
                    sent:firebase.firestore.Timestamp.now(),
                    state:"unread"
                })
            })

            batch.commit()
            .then(() => {
                this.props.addToast("Invitation Accepted");
                this.props.handleClose();
                this.toggleLoading();
            })
            .catch(e => {
                this.props.addToast("Ohoh something went wrong!");
                this.toggleLoading();
            })
        }
        })
        .catch(e => {
            this.props.addToast("Ohoh something went wrong!");
            this.toggleLoading();
        })

        
        }
    }

    decline = () => {
        this.toggleLoading();
        if(this.state.invitation.from !== firebase.auth().currentUser.uid){

            firebase.firestore().collection("invitations").where("status","==","pending").where("id","==",this.props.id).get()
        .then(snap => {
            if(!snap.empty){
            firebase.firestore().collection("invitations").doc(this.props.id).update({
                status:"decline"
            })
            .then(() => {
                this.props.addToast("Invitation Declined");
                this.props.handleClose();
                this.toggleLoading();
            })
            .catch(e => {
                this.props.addToast("Ohoh something went wrong!");
                this.toggleLoading();
            })
        }
    })
    .catch(e => {
        this.props.addToast("Ohoh something went wrong!");
        this.toggleLoading();
    })
            }
    }

    render(){
        return (
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                 <div className={`${Classes.DIALOG_BODY}`}>
                     {this.state.isLoading ? <LoadingSpinner />:null}
                     <div className="card">
                         <div className="card-header text-center">
                             <h3>Invitation</h3>
                         </div>
                         <div className="card-body">
                             {this.state.invitation !== null && this.state.invitation !==false?
                             <div>
                             <div className="mt-2">
                             <h4>From</h4>
                             <UserBox id={this.state.invitation.from} addToast={this.props.addToast} openUser={this.props.openUser} size={"50px"} />
                             </div>
                             <hr/>
                             <div className="mt-2">
                                 <h4>To</h4>
                                 <UserBox id={this.state.invitation.to} addToast={this.props.addToast} openUser={this.props.openUser} size={"50px"} />
                             </div>
                             <hr/>
                             <div className="mt-2 text-center p-2">
                                 <h5>Invitation to become part of company staff</h5>
                             </div>
                             <hr/>
                             <div className="mt-2">
                                 {this.state.invitation.status === "pending" && this.state.invitation.from !== firebase.auth().currentUser.uid?<div className ="form-group mt-2 text-center flex-container">
                                     <button type="button" className="btn btn-custom-1 m-2" onClick={this.accept}>Accept</button> 
                                     <button type="button" className="btn btn-custom-1 m-2" onClick={this.decline}>Decline</button>
                                </div>:<div className="mt-2 text-center">The invitation is {this.state.invitation.status}</div>}
                             </div>
                             </div>
                             :this.state.invitation === false?<div className="text-center">Invitation Cancelled</div>:<div className="m-3 spinner-border"></div>}
                         </div>
                     </div>
                </div> 
                </div>
            </Drawer>
        )
    }
}