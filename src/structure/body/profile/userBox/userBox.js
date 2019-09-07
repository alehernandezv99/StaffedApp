import React from "react";
import "./userBox.css";
import firebase from "../../../../firebaseSetUp";
import profile1 from "../../../../res/Graphics/img_avatar1.png"

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
            <div className="m-4"  onClick={(e) => {e.preventDefault(); this.props.openUser(this.state.user.uid)}}>
                {this.state.user === null?<div className="spinner-border"></div>:
            <div className="user-box">
                <div style={{
                    backgroundImage:`url(${this.state.user.photoURL?this.state.user.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"})`,
                    backgroundPosition:"center",
                    backgroundRepeat:"no-repeat",
                    backgroundSize:"cover",
                    width:this.props.size,
                    minWidth:this.props.size,
                    maxHeight:this.props.size,
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