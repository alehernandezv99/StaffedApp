import React from "react";
import "./withdrawModule.css";
import {Drawer, Classes} from "@blueprintjs/core";
import firebase from "../../../../firebaseSetUp";




export default class WithdrawModule extends React.Component {
    constructor(props){
        super(props);

        this.state ={
            balance:this.balance,
            amount:this.balance,
        }
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    componentDidMount(){
        console.log(firebase.auth().currentUser.uid);
        this._mounted = true;
        console.log(this.props.balance)
        this.setState({
            balance:this.props.balance,
            amount:this.props.balance
        })

    }

    withdraw = ()=> {

        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
        .then(user => {
            if(user.data().paypalAccount){
                let id = firebase.auth().currentUser.uid
                 let amount = this.state.amount
                 let email = user.data().paypalAccount
                 let body = {};

                 var form_data = new URLSearchParams();
                 body.id = id;
                 body.amount = amount;
                 body.email = email
                 Object.keys(body).forEach(key => {
                     form_data.append(key, body[key])
                 })

                 

                 fetch("https://staffed-app.herokuapp.com/withdraw",{
                     method:"POST",
                     body:form_data,
                     headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      }
                 })
                 .then(res => {
                     if(res.status === 200){
                     return res.json()
                     }else {
                         throw new Error()
                     }
                 })
                 .then(result => {
                     console.log(result);
                     this.props.addToast(result.message)
                     this.props.handleClose()
                     this.props.fetchBalance()
                 })
                 .catch(e => {
                    this.props.addToast("Error :(, try later");
                    this.props.handleClose()
                 })
            }
        })
        
    }

    render(){
        return(
            <div>
                 <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={window.innerWidth <= 700?"100%":"50%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                 <div className={`${Classes.DIALOG_BODY}`}>
                     <div className="form-group">
                         <label>Amount</label>
                         <input type="number" className="form-control" value={this.state.amount} onChange={(e) => {
                             if(!Number.isNaN(e.target.value) || e.target.value == ""){
                                 if(this._mounted){
                             this.setState({
                                 amount:e.target.value !== ""?Number(e.target.value):""
                             })
                            }
                            }
                         }}/>
                         <button type="button" className="btn btn-custom-1 mt-3" onClick={() => {this.withdraw()}}><i className="archive align-middle"></i> <span>Complete Withdraw</span></button>
                     </div>
                    </div>
                 </div>
                 </Drawer>
            </div>
        )
    }
}