import React from "react";
import "./userBox.css";
import firebase from "../../../../firebaseSetUp";

export default class UserBox extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            user:null
        }
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    componentDidMount(){
        this._mounted = true;
        if(this.props.id !== undefined){
        firebase.firestore().collection("users").doc(this.props.id).get()
        .then(doc => {
            if(doc.exists){
            if(this._mounted){
                this.setState({
                    user:doc.data()
                })
            }
        }else {
            let user = {
                displayName:"User doesn't exist",
            }
            if(this._mounted){
                this.setState({
                    user:user
                })
            }
        }
        })
        .catch(e => {
            this.props.addToast(e.message);
        })
    }else if(this.props.email){

        alert(this.props.email)
        firebase.firestore().collection("users").where("email","==",this.props.email).get()
        .then(snap => {
            if(snap.empty){
                let user = {
                    displayName:"User doesn't exist"
                }
                if(this._mounted){
                    this.setState({
                        user:user
                    })
                }
            }else {
                snap.forEach(data => {
                    if(this._mounted){
                        this.setState({
                            user:data.data()
                        })
                    }
                })
            }
        })
    }
    }

    render(){
        return(
            <div className="m-4"  onClick={(e) => {e.preventDefault(); this.props.handleStates(3,this.state.user.uid)}}>
                {this.state.user === null?<div className="spinner-border"></div>:
            <div className="user-box">
                <div style={{
                    backgroundImage:`url(${this.state.user.photoURL?this.state.user.photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"})`,
                    backgroundPosition:"center",
                    backgroundRepeat:"no-repeat",
                    backgroundSize:"cover",
                    width:this.props.size,
                    height:this.props.size,
                    borderRadius:"50%"
                }}></div>
             
            
                     <div className="user-box-username ml-3">
                    <h6>{this.state.user.displayName?this.state.user.displayName:this.state.user.email}</h6>
                </div>
                </div>
                }
            </div>
        )
    }
}