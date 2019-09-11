import React from "react";
import "./contractModule.css";
import firebase from "../../../../firebaseSetUp";
import UserBox from "../../profile/userBox";
import EditBtn from "../../profile/editBtn";
import EndContractDrawer  from "../endContractDrawer";


export default class ContractModule extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            status:"",
            owner:false,
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
        }
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    componentDidMount(){
        this._mounted = true;

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
                <div id="portalContainer2">
                    {this.state.endContract.isOpen && this.props.isOpen? <EndContractDrawer projectID={this.props.projectID} addToast={this.props.addToast} isOpen={this.state.endContract.isOpen} handleClose={this.state.endContract.handleClose} client={this.props.client} freelancer={this.props.freelancer} id={this.props.id}/>:null}
                </div>
                <EditBtn btns={this.props.isOpen?
                    [
                        {
                            text:"End Contract",
                            callback:()=> {this.state.endContract.handleOpen()}
                        }
                    ]:[
                        {
                            text:"Open a Dispute",
                            callback:() => {}
                        }
                    ]
                }/>
            <div className="form-group">
                <h4>Client</h4>
                <UserBox id={this.props.client} openUser={this.props.openUser} addToast={this.props.addToast} size={"60px"} handleStates={this.props.handleStates} />
            </div>
            <div className="form-group mt-3">
                <h4>Freelancer</h4>
               <UserBox id={this.props.freelancer} openUser={this.props.openUser} addToast={this.props.addToast} size={"60px"} handleStates={this.props.handleStates} />
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
                        <button type="button" className="btn btn-custom-1 mt-3" onClick={this.props.openProposal}>View Proposal</button>
                    </div>
                </div>
            </div>
      </div>
        )
    }
}