import React from "react";
import Navbar from "../../navbar";
import JobModule from "./jobModule";
import firebase from "../../../firebaseSetUp";
import HomeLoading from "../../loading/homeLoading";
import logo from "../../../logo.svg";
import { Button, Position, Toast, Toaster, Classes, Slider} from "@blueprintjs/core";
import CreateProject from "../createProject";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";
import "./home.css";

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.updateUser = this.updateUser.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;
        this.reloadProjects = this.reloadProjects.bind(this);

        this.state = {
            user:null,
            toasts: [ /* IToastProps[] */ ],
            projects:[],
            projectsId:[],
            size:0,
            pageSize:{
                min:3,
                max:12,
                value:4
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

    addToast = (message) => {
        this.toaster.show({ message: message});
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

        this.reloadProjects(this.state.pageSize.value, this.state.skills.skillsSelected.value);

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

        this.reloadProjects(this.state.pageSize.value, this.state.skills.skillsSelected.value);
      }else {
        this.addToast("You cannot select two repeated skills")
      }
      }

    componentDidMount(){

        $('#skills-filter').keypress((event) => {
            if(event.keyCode == 13){
              if(event.target.value !== ""){
             
    
                firebase.firestore().collection("skills").get()
                .then(snapshot => {
                  let skillsArr = [];
                  snapshot.forEach(doc => {
                    skillsArr.push(doc.data().name);
                  })
                   this.setState(state => {
                let base = state.skills;
                let skills = base.skillsSelected["value"];
      
                if((skills.includes(event.target.value) === false)){
                  if(skillsArr.includes(event.target.value)){
                    skills.push(event.target.value);
                    let skillsObj = {value:skills, criteria:this.state.skills.skillsSelected.criteria}
                     base.skillsSelected = skillsObj;

                    this.skillInput.value = "";
                    return({skills:base})
                    
                  }else {
                    this.addToast(`The skill "${event.target.value}" is not registered`);
                  }
    
                }else {
                  this.addToast("You cannot select two repeated skills")
                  return {}
                }
                })
                
               
              })
            
          }
          }
          });


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

    reloadProjects(limit, arr){
    for(let i = 0; i< arr.length; i++){
      firebase.firestore().collection("projects")
       .where(`skills`,"array-contains",arr[i])
       .limit(limit).get()
        .then(snapshot => {
            this.setState(state => {
                let projects = state.projects
                let ids = state.projectsId;
                let counter = 0
                snapshot.forEach(project => {
                    if(!(ids.includes(project.id))){
                        ids.push(project.id);
                    projects.push(project.data());
                    counter++
                    }
                })
                let size = projects.length + counter;

                return({
                    projects:projects,
                    projectsId:ids,
                    size:size,
                })
            })
            
        })
    }
    }

   async updateUser(id){
        firebase.firestore().collection("users").doc(id).get()
        .then(async doc => {
            await this.setState(state => {
                let skills = state.skills;
                let skillsUser = doc.data().skills;
                skills.skillsSelected.value = skillsUser;
                let objOfSkills = {};
                this.reloadProjects(this.state.pageSize.value, skillsUser); 
                return {
                user:[doc.data()],
                skills:skills
                }
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
                        <div className="col-sm-6">
                        <div className="input-group mb-3 mt-3 mx-auto">
                          <input type="text" className="form-control" placeholder="Search" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="submit">Search</button> 
                         </div>
                        </div>
                        {this.state.projects.length > 0?this.state.projects.map((project, index) => {
                            let title = project.title;
                            let description = project.description;
                            let skills = project.skills;
                            let skillsObj = [];

                            Object.keys(skills).forEach((key, i) =>{
                                skillsObj.push({
                                    text:skills[key],
                                    key:i
                                });
                            })


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

                            return <JobModule key={index} title={title} description={description} skills={skillsObj} specs={specs} />
                        }):<div className="spinner-border"></div>}

                           <ul className="pagination text-center mt-2">
                             <li className="page-item ml-auto"><a className="page-link" href="#">Previous</a></li>
                             <li className="page-item"><a className="page-link" href="#">1</a></li>
                             <li className="page-item"><a className="page-link" href="#">2</a></li>
                             <li className="page-item"><a className="page-link" href="#">3</a></li>
                             <li className="page-item mr-auto"><a className="page-link" href="#">Next</a></li>
                           </ul>
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