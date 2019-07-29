import React from "react";
import "./payments.css";
import Navbar from "../../navbar";
import logo from "../../../res/Graphics/main_logo.png";
import PaymentsLoading from "../../loading/paymentsLoading";
import UserBox from "../profile/userBox";
import firebase from "../../../firebaseSetUp";
import LoadingSpinner from "../../loading/loadingSpinner";
import {Toast, Toaster, Classes,Position, Divider} from "@blueprintjs/core";

export default class Payments extends React.Component {
    constructor(props){
        super(props)

        this.state ={
            user:null,
            toasts: [ /* IToastProps[] */ ],
            paypalAccount:"",
            transactions:[],
            isLoading:false,
            pageSize:{
                min:6,
                max:12,
                value:6
            },
            inbox:{
                count:0,
                elements:[]
            }
        }

        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
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
                    user:[doc.data()]
                })
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

    componentWillUnmount(){
        this._mounted = false;
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


              
              // ...
            } else {
              // User is signed out.
              this.props.handleStates(0)
              // ...
            }
          });
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
                            onClick:() => {},
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
                               return  {href:"",text:element.message,key:(i + Math.random()),onClick:()=>{this.handleInboxEvent(element.action)}}
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
                    <div className="row">
                        <div className="col-sm-4">
                            <UserBox size={"80px"} handleStates={this.props.handleStates} id={this.state.user[0].uid} />
                        </div>
                        <div className="col text-center">
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
                                <input type="email" className="form-control" value={this.state.user[0].paypalAccount} disabled={true}/> 
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