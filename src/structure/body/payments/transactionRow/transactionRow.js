import React from "react";
import "./transactionRow.css";
import firebase from "../../../../firebaseSetUp";

export default class TransactionRow extends React.Component{
    constructor(props){
        super(props)

        this.state= {
            type:"",
        }
    }

    componentDidMount(){
        if(this.props.type ==="payment"){
            firebase.firestore().collection("users").doc(this.props.client).get()
            .then(doc => {
                let client = {
                    id:this.props.client,
                    name:doc.data().displayName?doc.data().displayName:doc.data().email
                }
                firebase.firestore().collection("projects").doc(this.props.projectID).get()
                .then(project => {
                    let projectObj ={
                        id:project.id,
                        name:project.data().title
                    }
                    this.setState({
                        type:"payment",
                        project:projectObj,
                        client:client,
                        price:this.props.price
                    })
                })
            })
            .catch(e => {
                this.props.addToast(e.message)
            })
        }else if(this.props.type ==="withdraw") {
            firebase.firestore().collection("users").doc(this.props.freelancer).get()
            .then(user => {
                let freelancer = {
                    paypalAccount:user.data().paypalAccount
                }
                this.setState({
                    type:"withdraw",
                    freelancer:freelancer
                })
            })
        }
    }

    render(){
        return(
            <tr>
                <td>{this.props.date}</td>
                <td>{this.state.type === ""?null:this.state.type ==="payment"?<div>The client {<a href="#" onClick={e =>{ e.preventDefault(); this.props.handleStates(3,this.state.client.id)}} >{this.state.client.name}</a>} has pay you for the project {<a href="" onClick={e => {e.preventDefault(); this.props.openProject(this.state.project.id)}}>{this.state.project.name}</a>}</div>:<div>You make withdraw to your paypal account {this.state.freelancer.paypalAccount}</div>}</td>
                <td>{this.state.price}$</td>
            </tr>
        )
    }
}