import React from "react";
import "./openDisputeDrawer.css";
import firebase from "../../../../firebaseSetUp";
import checkCriteria from "../../../../utils/checkCriteria";
import LoadingSpinner from "../../../loading/loadingSpinner";

import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider ,Alert, Intent} from "@blueprintjs/core";

export default class OpenDisputeDrawer extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            message:"",
            isLoading:false,
            alert:{
                isOpen:false,
                confirm:() => {},
                text:"Sure you want to submit this proposal",
                intent:Intent.WARNING,
                icon:"info-sign",
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base =state.alert;
                            alert.isOpen =true

                            return {
                                alert:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.alert;
                            base.isOpen = false;

                            return {
                                alert:base
                            }
                        })
                    }
                }
            },
        }
    }

    toggleLoading = (state) => {
        if(this._mounted){
            this.setState({
                isLoading:state
            })
        }
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    componentDidMount(){
        this._mounted = true
    }

    submit = () => {
        this.toggleLoading(true)

        if(this.state.message.trim() !== ""){

        firebase.firestore().collection("disputes").where("projectID","==",this.props.projectID).get()
        .then(snap => {
            if(snap.empty){
                let disputesID = firebase.firestore().collection("disputes").doc().id
        let batch = firebase.firestore().batch()

        batch.set(firebase.firestore().collection("disputes").doc(disputesID), {
            projectID:this.props.projectID,
            client:this.props.client,
            freelancer:this.props.freelancer,
            message:this.state.message,
            created:firebase.firestore.Timestamp.now(),
            sender:firebase.auth().currentUser.uid
        })
        batch.update(firebase.firestore().collection("contracts").doc(this.props.id), {openDispute:true})

        batch.commit()
        .then(() => {
            this.toggleLoading(false);
            this.props.addToast("Dispute submitted")
            this.props.handleClose();
        })
        .catch(e => {
            console.log(e)
            this.toggleLoading(false)
            this.props.addToast("Oh oh something went wrong!")
        })
            }else {
              
                this.props.addToast("You already did a dispute in this project");
                this.toggleLoading(false);
            }
        })
        
    }else {
        this.props.addToast("The message cannot be empty");
        this.toggleLoading(false)
    }
    }

    render(){
        return (
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={window.innerWidth <= 700?"100%":"50%"} isOpen={this.props.isOpen}>
                  <div className={Classes.DRAWER_BODY}>
                      {this.state.isLoading === true?<LoadingSpinner/>:null}
                    <div className={`${Classes.DIALOG_BODY}`}>
                        
                        <div className="form-group text-center mt-4">
                            <label>Message</label>
                            <textarea className="form-control" value={this.state.message} onChange={(e) => {
                                if(this._mounted){
                                    this.setState({
                                        message:e.target.value
                                    })
                                }
                            }}></textarea>
                            <button className="btn btn-custom-1 m-3" onClick={() => {this.submit()}}><i className="material-icons align-middle">send</i> Submit</button>
                        </div>
                   </div>
                  </div>
            </Drawer>
        )
    }
}