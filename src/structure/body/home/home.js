import React from "react";
import Navbar from "../../navbar";
import JobModule from "./jobModule";
import firebase from "../../../firebaseSetUp";
import HomeLoading from "../../loading/homeLoading";
import logo from "../../../logo.svg";
import { Button, Position, Toast, Toaster, Classes} from "@blueprintjs/core";
import CreateProject from "../createProject";

import "./home.css";

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.updateUser = this.updateUser.bind(this);

        this.state = {
            user:null,
            toasts: [ /* IToastProps[] */ ]
        }

        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
        }
    }

    addToast = (message) => {
        this.toaster.show({ message: message});
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              if(user.emailVerified === false){
                  this.addToast("Please Verify Your Email")
              }
              this.updateUser(user.uid)
              // ...
            } else {
              // User is signed out.
              window.location.href = "/";
              // ...
            }
          });
    }

   async updateUser(id){
        firebase.firestore().collection("users").doc(id).get()
        .then(doc => {
            console.log(doc.data());
            this.setState({
                user:[doc.data()],
            })
            console.log(this.state.user);
        })
    }

    render(){
        return(
            <div>
                <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>
                <Navbar logo={logo}
                leftElements={
                    [
                        {
                            type:"link",
                            text:"My Projects",
                            href:"/myprojects",
                            icon:"work_outline",
                            onClick:() => {window.location.href = "/myprojects"},
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
                            state:"active",
                            onClick:() => {},
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
                            type:"dropdown",
                            text:this.state.user === null?"Loading...":this.state.user[0].email,
                            href:"",
                            key:5,
                            onClick:() => {},
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Settings",
                                    key:1,
                                    onClick:() => {},
                                },
                                {
                                    href:"",
                                    text:"logout",
                                    onClick:()=> {firebase.auth().signOut()},
                                    key:2
                                }
                            ]
                        }
                    ]
                }
                />
                

                <div className="container-fluid padding-2">
                    {this.state.user === null? <HomeLoading />:
                    <div className="row text-center">
                        <div className="col ">
                        <div className="header-custom-1 mb-2">Recently Searches</div>
                            <div className="list-group">
                                {this.state.user[0].recentSearches.map(element => {
                                   return ( <a href='#' key={element} className="list-group-item list-group-item-action">{element}</a>)
                                })}
                            </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="input-group mb-3 mt-3 mx-auto">
                          <input type="text" className="form-control" placeholder="Search" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="submit">Search</button> 
                         </div>
                        </div>
                        <JobModule title={"Andoid developer for platform"} description={`
                        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsmu
                        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                        `}  skills={
                            [
                                {
                                    text:"PHP",
                                    key:1
                                },
                                {
                                    text:"JavaScript",
                                    key:2
                                },
                                {
                                    text:"NodeJs",
                                    key:3
                                }
                            ]
                        }
                        specs={
                            [
                                {
                                    text:"test",
                                    icon:"link",
                                    key:1
                                }
                            ]
                        }/>
                        </div>
                        <div className="col">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src="https://www.w3schools.com/bootstrap4/img_avatar1.png" style={{width:"50%"}} className="rounded-circle" />
                                    <div className="mt-2 text-left"><i className="material-icons">style</i> {this.state.user[0].cards} Cards</div>
                                    <div className="mt-2 text-left"><i className="material-icons">event_note</i> {this.state.user[0].proposals.length} Proposals</div>
                                    <div className="mt-2 text-left"><i className="material-icons">work</i> {this.state.user[0].activeCandidancies.length} Active Candidancies</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </div>
                <CreateProject id={"createProjectPanel"}/>
            </div>
        )
    }
}