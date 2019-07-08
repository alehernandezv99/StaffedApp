import React from "react";
import Navbar from "../../navbar";
import JobModule from "./jobModule";
import firebase from "../../../firebaseSetUp";
import HomeLoading from "../../loading/homeLoading";
import logo from "../../../logo.svg";
import { Button, Position, Toast, Toaster, Classes, Slider} from "@blueprintjs/core";
import CreateProject from "../createProject";

import "./home.css";

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.updateUser = this.updateUser.bind(this);

        this.state = {
            user:null,
            toasts: [ /* IToastProps[] */ ],
            projects:[],
            pageSize:{
                min:3,
                max:12,
                value:4
            }
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
        
        firebase.firestore().collection("projects").get()
        .then(snapshot => {
            let projects = [];

            snapshot.forEach(doc => {
                projects.push(doc.data());
                
            })

            this.setState({
                projects:projects
            })
        })
    }

   async updateUser(id){
        firebase.firestore().collection("users").doc(id).get()
        .then(doc => {
            console.log(doc.data());
            this.setState({
                user:[doc.data()],
            })
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
                            <div className="form-group">
                               <label>Recently Searches</label>
                               <div className="list-group">
                                {this.state.user[0].recentSearches.map(element => {
                                   return ( <a href='#' key={element} className="list-group-item list-group-item-action">{element}</a>)
                                })}
                            </div>
                            </div>
                            <div className="form-group">
                                <label>Page Size</label>
                                <Slider min={this.state.pageSize.min} max={this.state.pageSize.max} value={this.state.pageSize.value}  onChange={(e) => {this.setState(state => {
                                    let pageSize = state.pageSize;
                                    pageSize.value = e;
                                    return ({pageSize:pageSize});
                                })}}  />
                            </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="input-group mb-3 mt-3 mx-auto">
                          <input type="text" className="form-control" placeholder="Search" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="submit">Search</button> 
                         </div>
                        </div>
                        {this.state.projects.length > 0?this.state.projects.map(project => {
                            let title = project.title;
                            let description = project.description;
                            let skills = project.skills;
                            let skillsObj = [];

                            for(let i = 0; i < skills.length; i++){
                                skillsObj.push({
                                    text:skills[i],
                                    key:i
                                });
                            }

                            console.log(skills);
                            let specs = [
                                {
                                    text:project.type,
                                    icon:"gps_fixed",
                                    key:1
                                },
                                {
                                    text:project.budget,
                                    icon:"payment",
                                    key:2
                                },
                                {
                                    text:20,
                                    icon:"people",
                                    key:3
                                },
                                {
                                    text:"Payment Verified",
                                    icon:"check_circle",
                                    key:4
                                },
                                {
                                    text:project.country,
                                    icon:"place",
                                    key:5
                                }
                            ]

                            return <JobModule title={title} description={description} skills={skillsObj} specs={specs} />
                        }):<div className="spinner-border"></div>}
                        </div>
                        <div className="col">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src="https://www.w3schools.com/bootstrap4/img_avatar1.png" style={{width:"150px"}} className="rounded-circle" />
                                    <div className="text-center mt-2">{firebase.auth().currentUser?firebase.auth().currentUser.displayName?firebase.auth().currentUser.displayName:firebase.auth().currentUser.email:<div className="spinner-loading"></div>}</div>
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