import React from "react";
import "./profile.css";

import Navbar from "../../navbar";
import logo from "../../../res/Graphics/main_logo.png";
import firebase from "../../../firebaseSetUp";

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user:null,
            inbox:{
                count:0,
                elements:[]
            }
        }
    }

    componentDidMount(){
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
        .then(doc => {
            this.setState({user:doc.data()});
        })
    }

    render() {
        return(
            <div>
                <Navbar logo={logo}
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
                            onClick:() => {},
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
                            type:"dropdown",
                            text:"Payments",
                            href:"",
                            icon:"payment",
                            onClick:() => {},
                            dropdownItems:[
                                {
                                    href:"#",
                                    key:1,
                                    onClick:() => {},
                                    text:"test"
                                }
                            ],
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
                            dataToggle:"modal",
                            dataTarget:"#createProjectPanel",
                            onClick:() => {},
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
                            text:this.state.user === null?"Loading...":this.state.user.email,
                            href:"",
                            key:5,
                            onClick:() => {},
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Profile",
                                    key:1,
                                    onClick:() => {},
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
                <div className="container-fluid text-center">
                    <div className="container mt-2">
                        <img src="https://www.w3schools.com/bootstrap4/img_avatar1.png" style={{width:"150px"}} className="rounded-circle" />
                    </div>
                        <div className="container">
                            <h6 className="mt-2">{this.state.user !== null?this.state.user.displayName?this.state.user.displayName:this.state.user.email:"Loading..."}</h6>
                            <h5 className="mt-3">{this.state.user !== null?this.state.user.profession?this.state.user.profession:"":"Loading..."}</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                                 nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                                 fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
                                 qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                </div>
                <div className="container-fluid">
                    <div id="accordion">
                    <div className="card mt-3">
                        <div className="card-header">
                           <a className="card-link" data-toggle="collapse" href="#experience"> Experience</a>
                            </div>
                      <div className="collapse show" data-parent="#accordion" id="experience">
                        <div className="card-body">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                                 nostrud exercitation ullamco
                        </div>
                    </div>

                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                           <a className="card-link" data-toggle="collapse" href="#education"> Education</a>
                            </div>
                        
                            <div className="collapse show" id="education">
                        <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                                 nostrud exercitation ullamco
                        </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#portfolio"> Portfolio</a>
                        </div>

                        <div className="collapse show" id="portfolio">
                        <div className="card-body">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                                 nostrud exercitation ullamco
                        </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#skills"> Skills</a>
                        </div>

                        <div className="collapse show"  id="skills">
                        <div className="card-body">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                                 nostrud exercitation ullamco
                        </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>
                        </div>

                        <div className="collapse show"  id="expertise">
                        <div className="card-body">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                                 nostrud exercitation ullamco
                        </div>
                        </div>
                    </div>

                    <div className="card mt-3 mb-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#contact"> Contact</a>
                        </div>

                        <div className="collapse show" id="contact">
                        <div className="card-body">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                                 nostrud exercitation ullamco
                        </div>
                        </div>
                </div>
            </div>
            </div>
            </div>
        )
    }
}