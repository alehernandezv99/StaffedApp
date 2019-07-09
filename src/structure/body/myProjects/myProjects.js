import React from "react";
import "./myProjects.css";
import Navbar from "../../navbar";
import firebase from "../../../firebaseSetUp";
import logo from "../../../logo.svg";
import autocomplete from "../../../utils/autocomplete";
import { Button, Position, Toast, Toaster, Classes, Slider} from "@blueprintjs/core";
import MyProjectLoading from "../../loading/myProjectLoading";
import checkCriteria from "../../../utils/checkCriteria";
import CreateProject from "../createProject";

export default class MyProjects extends React.Component {
    constructor(props){
        super(props);
        this.updateUser = this.updateUser.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;

        this.state = {
            isLoading:false,
            user:null,
            toasts: [ /* IToastProps[] */ ],
            pageSize:{
                min:6,
                max:12,
                value:6
            },
            skills:{
                skillsSelected:{value:[], criteria:{type:"array", min:1, max:5}},
                skillsFetched:[],
            }
        }

        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
        }
    }

    async clearSkill(index){
        await this.setState(state => {
           let skills = state.skills.skillsSelected.value;
           skills.splice(index,1)
           let base = state.skills;
           let skillsObj = {value:skills, criteria:this.state.skills.skillsSelected.criteria}
           base.skills = skillsObj;
           return({skills:base, projects:[], projectsId:[]});
         })
 
        // this.reloadProjects(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
 
       }
 
    async addSkill(skill){
         if(!(this.state.skills.skillsSelected["value"].includes(skill))){
           let skills = this.state.skills.skillsSelected["value"].slice();
     
           let criteria = this.state.skills.skillsSelected["criteria"];
         await this.setState(state => {
           let base = state.skills;
           skills.push(skill);
           if(this.checkCriteria(skills, criteria).check){
           base.skillsSelected.value = skills;
           return({skills:base, projects:[], projectsId:[]});
           }else {
             this.addToast(this.checkCriteria(skills, criteria, "skills").message);
             return ({});
           }
         })
 
        // this.reloadProjects(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
       }else {
         this.addToast("You cannot select two repeated skills")
       }
       }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
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

    addToast = (message) => {
        this.toaster.show({ message: message});
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
                            href:"",
                            state:"active",
                            icon:"work_outline",
                            onClick:() => {},
                            key:1
                        },
                        {
                            type:"link",
                            text:"Search Staff",
                            href:"",
                            state:"",
                            icon:"search",
                            onClick:() => {},
                            key:2
                        },
                        {
                            type:"link",
                            text:"Search Projects",
                            icon:"public",
                            href:"",
                            state:"",
                            onClick:() => { window.location.href = "/home"},
                            key:3
                        },
                        {
                            type:"dropdown",
                            text:"Payments",
                            href:"",
                            state:"",
                            icon:"payment",
                            dropdownItems:[
                                {
                                    href:"#",
                                    key:1,
                                    text:"test",
                                    state:"",
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
                            state:"",
                            onClick:() => {},
                            key:5,
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Settings",
                                    icon:"power_settings_new",
                                    onClick:() => {},
                                    state:"",
                                    key:1
                                },
                                {
                                    href:"",
                                    text:"logout",
                                    icon:"power_settings_new",
                                    onClick:()=> {firebase.auth().signOut()},
                                    key:2,
                                    state:"",
                                }
                            ]
                        }
                    ]
                }
                />
                
                {this.state.user === null?<MyProjectLoading />:
                 <div className="row text-center">
                    <div className="col-sm-4 padding-3 border-right-custom-1">
                    <div className="input-group mb-3 mt-3 mx-auto">
                          <input type="text" className="form-control" placeholder="Search Projects" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="button">Search</button> 
                         </div>
                        </div>

                        <div className="form-group">
                        <select name="cars" className="custom-select-sm">
                          <option defaultValue>All</option>
                          <option value="volvo">Active Projects</option>
                          <option value="fiat">Colaboration Projects</option>
                          <option value="audi">Archived Projects</option>
                        </select>
                        </div>

                            <div className="form-group">
                                <label>Page Size</label>
                                <Slider min={this.state.pageSize.min} max={this.state.pageSize.max} value={this.state.pageSize.value}  onChange={(e) => {this.setState(state => {
                                    let pageSize = state.pageSize;
                                    pageSize.value = e;
                                    return ({pageSize:pageSize});
                                })}}  />
                            </div>
                            <div className="form-group">
                                  <label>Filter By Skills</label>
                                <div>
                                {this.state.skills.skillsSelected.value.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 mt-2 mb-2 mr-2 btn-sm">{skill} <i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => {this.clearSkill(index)}}>clear</i></button>
                                })}
                                <div>
                                <div className="autocomplete">
                                <input autoComplete="off" ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" id="skills-filter" className="form-control" required/>
                                {
                                    (() => {
                                        firebase.firestore().collection("skills").get()
                                            .then(async snapshot => {
                                              let skills = [];
                                              snapshot.forEach(doc => {
                                              skills.push(doc.data().name);
                                      })

                                     autocomplete(document.getElementById("skills-filter"), skills, this.addSkill);
                                    })
                                    })()
                                }
                                </div>
                                </div>

                                </div>
                              
                           </div>
                    </div>
                    <div className="col">
                        <h4 className="mt-3">My Projects</h4>
                        <div className="container-fluid">

                        </div>
                    </div>
                </div>}
                <CreateProject id={"createProjectPanel"}/>
            </div>
        )
    }
}