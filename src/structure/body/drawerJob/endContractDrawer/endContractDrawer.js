import React from "react";
import "./endContractDrawer.css";
import firebase from "../../../../firebaseSetUp";
import checkCriteria from "../../../../utils/checkCriteria";
import LoadingSpinner from "../../../loading/loadingSpinner";

import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider ,Alert, Intent} from "@blueprintjs/core";

export default class EndContractDrawer extends React.Component {
    constructor(props){
        super(props);

        this.state ={
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
            reference:"",
            reason:{value:"Problems With Freelancer", criteria:{type:"text", minLength:1}},
            message:{value:"",}
        }
    }

    componentDidMount(){
        this._mounted = true

        if(this.props.client === firebase.auth().currentUser.uid){
            if(this._mounted){
                this.setState({
                    reference:"Freelancer"
                })
            }
        }else {
            if(this._mounted){
                this.setState({
                    reference:"Client"
                })
            }
        }
    }
    
    componentWillUnmount(){
        this._mounted = false
    }

    submit= () => {
        this.toggleLoading();
        if(checkCriteria(this.state.reason.value, this.state.reason.criteria, "Reason").check){
       
        firebase.firestore().collection("contracts").doc(this.props.id).get()
        .then(doc => {
            if(doc.exists){
                if(doc.data().isOpen === true){

                    let batch = firebase.firestore().batch()

                    let data = {
                        reason:this.state.reason.value,
                        message:this.state.message.value,
                        date:firebase.firestore.Timestamp.now()
                    }

                    batch.update(firebase.firestore().collection("contracts").doc(this.props.id),{
                        isOpen:false,
                        closeDetails:data
                    })

                    batch.update(firebase.firestore().collection("projects").doc(this.props.projectID), {
                        status:"Cancelled"
                    })
                


                batch.commit()
                .then(() => {
                    this.props.addToast("Contract Ended");
                    this.toggleLoading();
                    this.props.handleClose();
                })
                .catch(e => {
                    this.props.addToast("Ohoh something went wrong!");
                    this.toggleLoading();
                })
            }
            }
        })
        .catch(e => {
            this.props.addToast("Ohoh something went wrong");
            this.toggleLoading();
        })
    }else {
        this.toggleLoading()
        let messages = []
  
        for(let i = 0; i < messages.length; i++){
            this.props.addToast(messages[i])
        }

        ;
    }
    }

    handleChangeValue = (field ,value, reference, customMSG) => {
        let check = 0;
        let message = ""

        if(!(checkCriteria(value, this.state[field]["criteria"], field).check)){
            check = 1
            if(customMSG){
                message= customMSG;
            }else {
                message = checkCriteria(value, this.state[field]["criteria"], field).message
            }
        }

        if(check === 1){
            reference.style.display ="block";
            reference.textContent = message
        }else {
            reference.style.display = "none";

        }

        if(this._mounted){
            this.setState(state => {
                let base = state[field];
                base.value = value;

                return {
                    [field]:base
                }
            })
        }

        
    }

    toggleLoading = () => {
        if(this._mounted){
            this.setState(state => ({
                isLoading:!state.isLoading
            }))
        }
    }

    render(){

        return (
        <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
            <div className={`${Classes.DIALOG_BODY}`}>
                {this.state.isLoading?<LoadingSpinner />:null}
            <Alert icon={this.state.alert.icon} intent={this.state.alert.intent} isOpen={this.state.alert.isOpen} onConfirm={() => {this.state.alert.confirm(); this.state.alert.handleClose();}} onCancel={() =>{this.state.alert.handleClose()}} confirmButtonText="Yes" cancelButtonText="No">
                        <p>{this.state.alert.text}</p> 
                    </Alert>
                <div className="form-group">
                    <label>Reason Of Contract Ending</label>
                <select className="custom-select" value={this.state.reason.value}  onChange={(e) => {
                        this.handleChangeValue("reason", e.target.options[e.target.selectedIndex].value, e.target.parentNode.childNodes[2], "The reason is required")
                    }}>

                    <option value="Problems With Freelancer">Problems With Freelancer</option>
                    <option value="Other">Other</option>
             </select>
             <div className="invalid-feedback"></div>
                </div>

                <div className="form-group">
                    <label>Message</label>
                    <textarea className="form-control" value={this.state.message.value} onChange={(e) => {
                        e.persist();
                        this.handleChangeValue("message", e.target.value, e.target.parentNode.childNodes[2], "Message is not required")
                    }}></textarea>
                     <div className="invalid-feedback"></div>
                </div>

            
                <button className="btn btn-custom-1 mt-3 btn-block" onClick={() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.alert;
                            base.isOpen = true;
                            base.text = "Sure you want to cancel this project?";
                            base.icon = "info-sign";
                            base.intent = Intent.WARNING;
                            base.confirm = () => {this.submit()}

                            return {
                                alert:base
                            }

                        })
                    }
                }}>Submit</button>
                
                
            </div>
            </div>
            
        </Drawer>
        )
    }
}