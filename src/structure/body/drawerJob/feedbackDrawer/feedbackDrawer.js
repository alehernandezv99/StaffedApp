import React from "react";
import "./feedbackDrawer.css";
import LoadingSpinner from "../../../loading/loadingSpinner";
import firebase from "../../../../firebaseSetUp";
import checkCriteria from "../../../../utils/checkCriteria";

import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider ,Alert, Intent} from "@blueprintjs/core";

export default class FeedbackDrawer extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
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
            communication:{value:1},
            skills:{value:"1",},
            availability:{value:"1",},
            message:{value:"",},
        }
    }

    componentWillUnmount(){
        this._mounted = false
    }

    componentDidMount(){
        this._mounted = true;


    }

    toggleLoading = () => {
        if(this._mounted){
            this.setState(state => ({
                isLoading:!state.isLoading
            }))
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

    submitReview = () => {
        this.toggleLoading();

        let targetUser = "";

        if(this.props.client === firebase.auth().currentUser.uid){
            targetUser=  this.props.freelancer;
           
        }else {
            targetUser = this.props.client;
           
        }

        let data = {
            communication:this.state.communication.value,
            availability:this.state.availability.value,
            skills:this.state.skills.value,
            message:this.state.message.value,
            author:firebase.auth().currentUser.uid,
            sent:firebase.firestore.Timestamp.now(),
            projectID:this.props.projectID
        }

        firebase.firestore().collection("users").doc(targetUser).collection("reviews").add(data)
        .then(() => {
            this.toggleLoading();
            this.props.addToast("Feedback Sent!");
            this.props.handleClose();
        })
        .catch(e => {
            this.toggleLoading();
            this.props.addToast("Ohoh something went wrong!");
        })
    }



    render(){
        return (
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={window.innerWidth <= 700?"100%":"50%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
            <div className={`${Classes.DIALOG_BODY}`}>
                {this.state.isLoading?<LoadingSpinner />:null}
            <Alert icon={this.state.alert.icon} intent={this.state.alert.intent} isOpen={this.state.alert.isOpen} onConfirm={() => {this.state.alert.confirm(); this.state.alert.handleClose();}} onCancel={() =>{this.state.alert.handleClose()}} confirmButtonText="Yes" cancelButtonText="No">
                        <p>{this.state.alert.text}</p> 
                    </Alert>
               
          
                <div>
                <h4>Feedback To {this.props.reference}</h4>
                <div className="form-group">
                    <label>Communication</label>
                    <select className="custom-select" value={this.state.communication.value}  onChange={(e) => {
                        this.handleChangeValue("communication", e.target.options[e.target.selectedIndex].value, e.target.parentNode.childNodes[2], "The communication is required")
                    }}>
      
                    <option value="1">1</option> 
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <div className="invalid-feedback"></div>
                </div>

                <div className="form-group">
                    <label>Skills</label>
                    <select className="custom-select" value={this.state.skills.value}  onChange={(e) => {
                        this.handleChangeValue("skills", e.target.options[e.target.selectedIndex].value, e.target.parentNode.childNodes[2], "The skills is required")
                    }}>
   
                    <option value="1">1</option> 
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <div className="invalid-feedback"></div>
                </div>

                <div className="form-group">
                    <label>Availability</label>
                    <select className="custom-select" value={this.state.availability.value} onChange={(e) => {
                        this.handleChangeValue("availability", e.target.options[e.target.selectedIndex].value, e.target.parentNode.childNodes[2], "The availability is required")
                    }}>
          
                    <option value="1">1</option> 
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <div className="invalid-feedback"></div>
                </div>

                <div className="form-group">
                    <label>Additional Message</label>
                    <textarea className="form-control" value={this.state.message.value} onChange={(e) => {
                        this.handleChangeValue("message", e.target.value, e.target.parentNode.childNodes[2], "The message is required")
                    }}></textarea>
                    <div className="invalid-feedback"></div>
                </div>
                </div>
       
                <button className="btn btn-custom-1 mt-3 btn-block" onClick={() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.alert;
                            base.isOpen = true;
                            base.text = "Sure you want to submit this review?";
                            base.icon = "info-sign";
                            base.intent = Intent.WARNING;
                            base.confirm = () => {this.submitReview()}

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