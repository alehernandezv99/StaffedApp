import React from "react";
import "./cvContainer.css";
import TextCollapse from "../../profile/textCollapse";
import firebase from "../../../../firebaseSetUp";

export default class CVContainer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            user:null
        }
    }

    componentDidMount(){
        firebase.firestore().collection("users").doc(this.props.id).get()
        .then((snapshot) => {
            this.setState({
                user:[snapshot.data()]
            })
        })
    }

    render(){
        return(<div className="mt-3 CV-container" onClick={this.props.openCV}>
            <div className="media border p-3">
                {this.state.user === null?<div className="spinner-border mx-3"></div>:<img src={this.state.user[0].photoURL?this.state.user[0].photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"} alt="John Doe" className="mr-3 mt-3 rounded-circle" style={{width:"60px"}} />}
                <div className="media-body">
                <h4>{this.state.user === null?<div className="spinner-border mx-3" style={{fontWeight:"light"}}></div>:this.props.name}{" - "}{this.props.description !== undefined?this.props.description.title:""}</h4>
                <TextCollapse text={this.props.description !== undefined?this.props.description.text:""} maxWidth={200} />
                </div>
            </div>
            <div className="email-bottom-right">{this.props.email}</div>
        </div>)
    }
}