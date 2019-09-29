import React from "react";
import "./contractModule.css";
import firebase from "../../../../firebaseSetUp";
import UserBox from "../../profile/userBox";
import EditBtn from "../../profile/editBtn";
import EndContractDrawer  from "../endContractDrawer";
import OpenDisputeDrawer from "../openDisputeDrawer";
import FeedbackDrawer from "../feedbackDrawer";
import DailyReport from "../dailyReport";

export default class ContractModule extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            canGiveFeedback:null,
            status:"",
            owner:false,
            dailyReport:{
                isOpen:false,
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.dailyReport;
                            base.isOpen = true;

                            return {
                                dailyReport:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.dailyReport;
                            base.isOpen = false;

                            return {
                                dailyReport:base
                            }
                        })
                    }
                }
            },
            endContract:{
                isOpen:false,
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base =state.endContract;
                            base.isOpen =false
                            return {
                                endContract:base
                            }
                        })
                    }
                },
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.endContract;
                            base.isOpen= true;

                            return {
                                endContract:base
                            }
                        })
                    }
                }
            },
            openDispute:{
                isOpen:false,
                handleClose: () => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.openDispute;
                            base.isOpen = false;

                            return {
                                openDispute:base
                            }
                        })
                    }
                },
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.openDispute;
                            base.isOpen = true

                            return {
                                openDispute:base
                            }
                        })
                    }
                }
            },

            feedbackDrawer:{
                isOpen:false,
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.feedbackDrawer;
                            base.isOpen = true;

                            return {
                                feedbackDrawer:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.feedbackDrawer;
                            base.isOpen = false;

                            return {
                                feedbackDrawer:base
                            }
                        })
                    }
                }
            }
        }
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    componentDidMount(){
        this._mounted = true;

        let targetUser = "";
        if(this.props.client === firebase.auth().currentUser.uid){
            targetUser = this.props.freelancer;
        }else {
            targetUser = this.props.client
        }
    firebase.firestore().collection("users").doc(targetUser).collection("reviews").where("author","==", firebase.auth().currentUser.uid).get()
    .then(snap => {
        if(snap.empty){
            if(this._mounted){
                this.setState({
                    canGiveFeedback:true
                })
            }
        }
    })
    .catch(e => {
        this.props.addToast("Ohoh something went wrong!")
    })

      firebase.firestore().collection("projects").doc(this.props.projectID).onSnapshot(project => {
       firebase.firestore().collection("transactions").where("projectID","==",this.props.projectID).get()
       .then(snapshot => {
           let amount = 0
           snapshot.forEach(doc => {
 
                amount += Number(doc.data().transactions[0].amount.total)
           })

           if(amount === Number(this.props.price)){
               this.setState({
                   status:"billed",
               })
           }
       })
    })

       firebase.firestore().collection("users").doc(this.props.client).get()
       .then((doc) => {
           if(doc.data().uid === firebase.auth().currentUser.uid){
               this.setState({
                   owner:true
               })
           }
       })
    }

    render(){
        return(
            <div className="container-fluid" style={{position:"relative"}}>
               {(this.props.isOpen === false)&&(this.state.canGiveFeedback === true)? <div className="feedback"><i className="material-icons align-middle">star</i> <a href="" onClick={(e) => {e.preventDefault(); this.state.feedbackDrawer.handleOpen()}}>Give Feedback</a></div>:null}
               {((this.props.isOpen) && (this.props.client === firebase.auth().currentUser.uid) &&(this.state.dailyReport.isOpen))?<div className="daily-report"><i className="material-icons align-middle">calendar_today</i> <a href="" onClick={(e) => {e.preventDefault(); this.state.dailyReport.handleOpen()}} href="">Daily Review</a></div>:null}
                <div id="portalContainer2">
                    {this.state.endContract.isOpen && this.props.isOpen? <EndContractDrawer projectID={this.props.projectID} addToast={this.props.addToast} isOpen={this.state.endContract.isOpen} handleClose={this.state.endContract.handleClose} client={this.props.client} freelancer={this.props.freelancer} id={this.props.id}/>:null}
                    {this.state.openDispute.isOpen && (this.props.openDispute === false || this.props.openDispute ===  undefined)? <OpenDisputeDrawer projectID={this.props.projectID} addToast={this.props.addToast}  isOpen={this.state.openDispute.isOpen}  handleClose={this.state.openDispute.handleClose} client={this.props.client} freelancer={this.props.freelancer} id={this.props.id}  />:null}
                    {this.state.feedbackDrawer.isOpen && (this.props.isOpen === false)? <FeedbackDrawer projectID={this.props.projectID} addToast={this.props.addToast}  isOpen={this.state.feedbackDrawer.isOpen}  handleClose={this.state.feedbackDrawer.handleClose} client={this.props.client} freelancer={this.props.freelancer} id={this.props.id} /> : null}
                    {((this.props.isOpen) && (this.props.client === firebase.auth().currentUser.uid) &&(this.state.dailyReport.isOpen))?<DailyReport projectID={this.props.projectID} addToast={this.props.addToast}  isOpen={this.state.feedbackDrawer.isOpen}  handleClose={this.state.feedbackDrawer.handleClose} client={this.props.client} freelancer={this.props.freelancer} id={this.props.id}/>:null}
                </div>
                {(this.props.client === firebase.auth().currentUser.uid)?
                this.props.isOpen?<EditBtn btns={
                    [
                        {
                            text:"Cancel Project",
                            callback:()=> {this.state.endContract.handleOpen()}
                        }
                    ]} />:null
            :this.props.isOpen?null:<EditBtn btns={
                (this.props.openDispute === false || this.props.openDispute === undefined)?[
                    {
                        text:"Open a Dispute",
                        callback:() => {this.state.openDispute.handleOpen();}
                    }
                ]:[]
            } />}
            <div className="form-group">
                <h4>Client</h4>
                <UserBox id={this.props.client} openUser={this.props.openUser} addToast={this.props.addToast} size={"60px"} handleStates={this.props.handleStates} />
            </div>
            <div className="form-group mt-3">
                <h4>Contracter</h4>
               <UserBox id={this.props.freelancer} openUser={this.props.openUser} addToast={this.props.addToast} size={"60px"} handleStates={this.props.handleStates} />
            </div>
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header"><h3>Contract</h3></div>
                    <div className="card-body">
                        <div className="form-group">
                            <h4>Description</h4>
                            <h6>{this.props.description}</h6>
                        </div>
                        <hr />
                        <div className="form-group mt-2">
                            <h4>Price</h4>
                            <h6>{this.props.price}$</h6>
                        </div>
                        <hr/>
                        <div className="form-group mt-2">
                            <h4>Receive</h4>
                            <h6>{String(Number(this.props.price) - (Number(this.props.price)*0.15))}$</h6>
                        </div>
                        <hr />
                        <div className="form-group mt-2">
                            <h4>Deadline</h4>
                            <h6>{this.props.deadline.toDate().toDateString()}</h6>
                        </div>
                    </div>
                    {this.props.status === "In Process" && this.state.status === "" && this.state.owner === true?
                     <form action={`https://staffedapp.appspot.com/pay`} target="_blank" className="m-3" method="POST" >
                         <input type="text" name="freelancer" value={this.props.freelancer} style={{display:"none"}}/>
                         <input type="text" name="client" value={this.props.client} style={{display:"none"}} />
                         <input type="text"  name="projectID" value={this.props.projectID} style={{display:"none"}} />
                         <input type="text"  name="projectName" value={this.props.title} style={{display:"none"}} />
                         <input type="text" name="price" value={this.props.price} style={{display:"none"}} />
                         <input type="submit" className="btn btn-custom-3" value="Pay Freelancer" />
                     </form>
                    :null}
                    {this.state.status === "billed"?<div className="m-3"><i className="material-icons align-middle">done</i> <span>Payment Complete</span></div>:null}
                    <div className="card-footer">
                        <button type="button" className="btn btn-custom-1 mt-1" onClick={this.props.openProposal}>View Bid</button>
                    </div>
                </div>
            </div>
      </div>
        )
    }
}