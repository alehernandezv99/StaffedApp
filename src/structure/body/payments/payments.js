import React from "react";
import "./payments.css";
import Navbar from "../../navbar";
import logo from "../../../res/Graphics/main_logo.png";
import PaymentsLoading from "../../loading/paymentsLoading";
import UserBox from "../profile/userBox";
import firebase from "../../../firebaseSetUp";
import LoadingSpinner from "../../loading/loadingSpinner";
import WithdrawModule from "./withdrawModule";
import {Toast, Toaster, Classes,Position, Divider} from "@blueprintjs/core";
import DrawerJob from "../drawerJob";
import ProposalsViewer from "../proposalViewer";
import CreateProject from "../createProject";
import TransactionRow from "./transactionRow";
import Chat from "../chat";

export default class Payments extends React.Component {
    constructor(props){
        super(props)

        this.state ={
            user:null,
            chat:{
                payload:null
            },
            toasts: [ /* IToastProps[] */ ],
            paypalAccount:"",
            transactions:[],
            isLoading:false,
            balance:null,
            pageSize:{
                min:6,
                max:12,
                value:6
            },
            disabled:true,
            withdraw:{
                isOpen:false,
                handleOpen:() => {
                    this.setState(state => {
                        let base = state.withdraw;
                        base.isOpen = true;

                        return {
                            withdraw:base
                        }
                    })
                },
                handleClose:()=> {
                    this.setState(state => {
                        let base = state.withdraw;
                        base.isOpen = false;

                        return {
                            withdraw:base
                        }
                    })
                }
            },
            inbox:{
                count:0,
                elements:[]
            },
            drawerJob:{
                projectID:"",
                action:"",
                isOpen:false,
                handleClose:async() => {
                    if(this._mounted){
                       await this.setState(state => {
                            let base = state.drawerJob;
                            base.isOpen = false;
                            base.projectID = "";
                            return {
                                drawerJob:base
                            }
                        })
                    }
                },
                handleOpen:async(projectID,action) => {
                    if(this._mounted){
                      await  this.setState(state => {
                            let base = state.drawerJob;
                            base.isOpen = true;
                            base.action = action;
                            base.projectID = projectID
                            return {
                                drawerJob:base
                            }
                        })
                    }
                }
            },
            proposalsViewer:{
                isOpen:false,
                projectID:"",
                proposalID:"",
                handleOpen:async(projectID, proposalID) => {
                    if(this._mounted){
                     await  this.setState(state => {
                            let base = state.proposalsViewer;
                            base.isOpen = true;
                            base.projectID = projectID;
                            base.proposalID = proposalID;
                            
                            let base2 = state.drawerJob;
                            base2.isOpen = false;
                            base2.projectID = "";
                            return {
                                proposalsViewer:base,
                                drawerJob:base2
                            }
                        })
                    }
                },
                handleClose:async(projectID, proposalID) => {
                    if(this._mounted){
                       await this.setState(state => {
                            let base = state.proposalsViewer;
                            base.isOpen = false;
                            base.projectID = projectID;
                            base.proposalID = proposalID
                            return {
                                proposalsViewer:base
                            }
                        })
                    }
                }
            },
            createProject:{
                isOpen:false,
                handleClose:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.createProject;
                        base.isOpen = false;
                        return {createProject:base}
                    })
                }
                },
                handleOpen:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.createProject;
                        base.isOpen = true;
                        return {createProject:base}
                    })
                }
                }
            }
        }

        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
        }
    }


     markAsRead = async () =>{

        try {
        let refs = []
        let call = await firebase.firestore().collection("users").doc(this.state.user[0].uid).collection("inbox").get()
        call.forEach(ref => {
          refs.push(firebase.firestore().collection("users").doc(this.state.user[0].uid).collection("inbox").doc(ref.id))
        })

        let batch = firebase.firestore().batch();

        for(let i = 0; i< refs.length; i++){
            batch.update(refs[i], {state:"read"})
        }
        await batch.commit();

    }catch(e){
        this.addToast(e.message);
    }
    

    }

    addToast = (message) => {
        if(this._mounted){
        this.toaster.show({ message: message});
        }
    }

    toggleLoading = () => {
        this.setState(state =>({
            isLoading:!state.isLoading
        }))
    }

    

    fetchUser = (id) => {
        firebase.firestore().collection("users").doc(id).get()
        .then(doc => {
            if(this._mounted){
                this.setState({
                    user:[doc.data()],
                    paypalAccount:doc.data().paypalAccount?doc.data().paypalAccount:undefined,
                    disabled:true
                })
            }
        })
        firebase.firestore().collection("users").doc(id).collection("inbox").orderBy("sent","desc").onSnapshot(messages => {
               
            let count = 0
            let elements = [];
            messages.forEach(message => {
                if(elements.length < 5){
                elements.push(message.data());
                }
                if(message.data().state =="unread"){
                    count++
                }
            })

            if(this._mounted){
            this.setState({inbox:{
                count:count,
                elements:elements
            }})
        }
    })
}

    bindAccount = (email) => {
        this.toggleLoading()
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
            paypalAccount:email
        })
        .then(() => {
            this.addToast("Paypal Account Binded");
            this.toggleLoading()
            this.fetchUser(firebase.auth().currentUser.uid)
        })
        .catch(e => {
            this.addToast(e.message)
            this.toggleLoading()
        })
    }

    handleInboxEvent = (action) =>{
        if(this._mounted){
        if(action.type === "view contract"){
            this.setState(state =>{
                let base = state.drawerJob;
                base.action = action.type;
                base.projectID = action.id;
                base.isOpen = true;
                return {drawerJob:base}
            })
        }else if(action.type === "view proposal"){
            this.setState(state => {
                let base = state.proposalsViewer;
                base.isOpen = true;
                base.projectId = action.id;
                base.proposalId = action.id2;

                return ({proposalsViewer:base});
            })
        }
    }
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    fetchBalance =() => {
        fetch(`https://staffed-app.herokuapp.com/balance?id=${firebase.auth().currentUser.uid}`)
                .then(res => {
                    return res.json()
                })
                .then(result => {
                    console.log(result)
                    this.setState({
                        balance:Number(result.balance)
                    })
                })
    }

    componentDidMount(){
        this._mounted = true;

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              if(user.emailVerified === false){
                  this.addToast("Please Verify Your Email")
              }
                this.fetchUser(user.uid)
            this.fetchBalance(user)

              
              // ...
            } else {
              // User is signed out.
              this.props.handleStates(0)
              // ...
            }
          });
    }

    resetPayload = () => {
        if(this._mounted){
            this.setState(state => {
                let base = state.chat;
                base.payload = null;

                return {
                    chat:base
                }
            })
        }
    }

    providePayloadToChat = (id) => {
        this.setState(state => {
            let base = state.chat
            base.payload = id;

            return {
                chat:base
            }
        })
    }

    render(){
        return(<div>
            {this.state.isLoading?<LoadingSpinner />:null}
            <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
            </Toaster>
            <Navbar logo={{
                    img:logo,
                    href:"#top"
                }}
                leftElements={
                    [
                        {
                            type:"link",
                            text:"My Projects",
                            href:"/myprojects",
                            icon:"work_outline",
                            onClick:() => {this.props.handleStates(2)},
                            key:1
                        },
                        {
                            type:"link",
                            text:"Search Staff",
                            href:"",
                            onClick:() => {this.props.handleStates(4)},
                            icon:"search",
                            key:2
                        },
                        {
                            type:"link",
                            text:"Search Projects",
                            href:"",
                            state:"",
                            onClick:() => {this.props.handleStates(1)},
                            icon:"public",
                            key:3
                        },
                        
                        {
                            type:"link",
                            text:"Payments",
                            href:"",
                            state:"active",
                            icon:"payment",
                            onClick:() => {},
                            key:4
                        }
                    ]
                }

                rightElements={
                    [
                        {
                            type:"button",
                            text:"Create Project",
                            href:"",
                            icon:"add",
                            onClick:() => {this.state.createProject.handleOpen()},
                            key:6
                        },
                        {
                            type:"dropdown badge",
                            text:"Inbox",
                            icon:"inbox",
                            count:this.state.inbox.count,
                            href:"",
                            key:7,
                            onClick:()=> { 
                                if(this.state.user !== null){
                                this.markAsRead()
                                }
                            },
                            dropdownItems:this.state.inbox.elements.length > 0?this.state.inbox.elements.map((element,i) => {
                               return  {href:"",text:element.message,key:(i + Math.random()),onClick:()=>{element.action?this.handleInboxEvent(element.action):(()=>{})()}}
                                 }):[{
                                href:"",
                                text:"No notifications",
                                key:2,
                                onClick:() => {}
                            }]
                        },
                        {
                            type:"dropdown",
                            text:this.state.user === null?"Loading...":this.state.user[0].displayName?this.state.user[0].displayName:this.state.user[0].email,
                            href:"",
                            key:5,
                            onClick:() => {},
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Profile",
                                    key:1,
                                    onClick:() => {this.props.handleStates(3, firebase.auth().currentUser.uid)},
                                },
                                {
                                    href:"",
                                    text:"Logout",
                                    onClick:()=> {firebase.auth().signOut()},
                                    key:2
                                }
                            ]
                        }
                    ]
                }
                />
                {this.state.user === null?<PaymentsLoading />:
                <div className="container-fluid p-5">
                    <div style={{zIndex:"9999999",position:"relative"}}>
                    <Chat payload={this.state.chat.payload} resetPayload={this.resetPayload} addToast={this.addToast} />
                       </div>
                    <div id="portalContainer">
                       {this.state.balance !== null? <WithdrawModule fetchBalance={this.fetchBalance} addToast={this.addToast} balance={this.state.balance} isOpen={this.state.withdraw.isOpen} handleClose={this.state.withdraw.handleClose}/>:null}
                       {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob providePayloadToChat={this.providePayloadToChat} handleStates={this.props.handleStates} openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={this.state.drawerJob.handleClose}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                    <CreateProject isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <UserBox size={"80px"} handleStates={this.props.handleStates} id={this.state.user[0].uid} />
                        </div>
                        <div className="col text-center">
                        <div className="card text-center my-3 mx-4">
                                    <div className="card-body">
                                        <h4>BALANCE:</h4>
                                        <h5>{this.state.balance !== null?this.state.balance + "$":"Loading..."}</h5>
                                    </div>
                                </div>
                            {this.state.user[0].paypalAccount === undefined?
                            <div>
                                
                            <h4>Please Link Your Paypal Account</h4>
                            <div className="form-group px-5">
                                <label>Email</label>
                                <input type="email" className="form-control" placeholder="ex: example@gmail.com" value={this.state.paypalAccount} onChange={e => {this.setState({
                                    paypalAccount:e.target.value
                                })}}/>
                                <button type="button" className="btn btn-custom-1 btn-sm mt-3" onClick={(e)=> {this.bindAccount(this.state.paypalAccount)}}>Bind Account</button>
                            </div>
                            </div>
                            :<div>
                                <h4>Paypal Account</h4>
                                <input type="email"  onChange={e => {
                                    if(this.state.user[0].paypalAccount){
                                        if(e.target.value.toLowerCase() !== this.state.user[0].paypalAccount.toLowerCase()){
                                            this.setState({
                                                paypalAccount:e.target.value,
                                                disabled:false
                                            })
                                        }else {
                                            this.setState({
                                                paypalAccount:e.target.value,
                                                disabled:true
                                            })
                                        }
                                    }else{
                                    this.setState({
                                    paypalAccount:e.target.value,
                                    disabled:false
                                })} }} className="form-control" value={this.state.paypalAccount}/> {this.state.disabled === false?<button className="btn btn-custom-1 m-3" onClick={e => {
                                    this.bindAccount(this.state.paypalAccount)
                                }}>Update</button>:null}
                               {this.state.balance !== null?this.state.balance > 0 ?<button className="btn btn-custom-1 m-3" onClick={(e) => {this.state.withdraw.handleOpen()}}><i className="material-icons align-middle">archive</i> <span>Withdraw Funds</span></button>:null:null}
                            </div>}
                        </div>
                    </div>
                    <Divider />
                    <h4 className="m-4">Transaction History</h4>
                    <table className="table table-striped text-center">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Ammount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.transactions.length ===0?<tr><td colSpan={3}>No Transactions</td></tr>:null}
                        </tbody>
                    </table>
                </div>
                }
        </div>)
    }
}