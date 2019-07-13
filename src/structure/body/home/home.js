import React from "react";
import Navbar from "../../navbar";
import JobModule from "./jobModule";
import firebase from "../../../firebaseSetUp";
import HomeLoading from "../../loading/homeLoading";
import LoadingSpinner from "../../loading/loadingSpinner";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer} from "@blueprintjs/core";
import CreateProject from "../createProject";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";
import DrawerJob from "../drawerJob";
import ProposalsViewer from "../proposalViewer";
import logo from "../../../res/Graphics/main_logo.png";
import "./home.css";

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.updateUser = this.updateUser.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;
        this.reloadProjects = this.reloadProjects.bind(this);
        this.handleInboxEvent = this.handleInboxEvent.bind(this);
        this.markAsRead = this.markAsRead.bind(this);

        this.state = {
            user:null,
            toasts: [ /* IToastProps[] */ ],
            projects:[],
            projectsId:[],
            size:null,
            pageSize:{
                min:6,
                max:12,
                value:6
            },
            inbox:{
                count:null,
                elements:null
            },
            skills:{
                skillsSelected:{value:[], criteria:{type:"array", min:1, max:5}},
                skillsFetched:[],
            },
            idProject:"no-set",
            action:"",
            isOpenDrawerJob:false,
            pagination:[],
            isLoading:false,
            proposalsViewer:{
                isOpen:false,
                projectId:"",
                proposalId:"",
            }
        }

        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
        }
    }

    async markAsRead(){

        try {
        let refs = []
        let call = await firebase.firestore().collection("users").doc(this.state.user[0].uid).collection("inbox").get()
        call.forEach(ref => {
          refs.push(firebase.firestore().collection("users").doc(this.state.user[0].uid).collection("inbox").doc(ref.id))
        })

        let batch = firebase.firestore().batch();

        for(let i = 0; i< refs.length; i++){
            batch.update(refs[i], {state:"read"})
        }
        await batch.commit();

    }catch(e){
        this.addToast(e.message);
    }
    

    }

    handleInboxEvent(action){
        if(action.type === "view contract"){
            this.setState({action:action.type, idProject:action.id ,isOpenDrawerJob:true})
        }else if(action.type === "view proposal"){
            this.setState(state => {
                let base = state.proposalsViewer;
                base.isOpen = true;
                base.projectId = action.id;
                base.proposalId = action.id2;

                return ({proposalsViewer:base});
            })
        }
    }

    toggleLoading = () => {
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }

    addToast = (message) => {
        this.toaster.show({ message: message});
    }

    handleCloseDrawerJob = () => {
        this.setState({isOpenDrawerJob:false,idProject:"no-set",action:""})
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

        this.reloadProjects(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);

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

        this.reloadProjects(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
      }else {
        this.addToast("You cannot select two repeated skills")
      }
      }

      componentDidUpdate(){
        if(this.state.inbox.count == 0){
            $(".inbox").hide();
        }else {
            $(".inbox").show();
        }
      }

    componentDidMount(){
        if(this.state.inbox.count == null){
            $(".inbox").hide();
        }else {
            $(".inbox").show();
        }
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

    handleCloseProposalViewer = () => {
        this.setState(state => {
            let base = state.proposalsViewer
            base.isOpen = false;
            base.projectId = "";
            base.proposalId = "";
            return {proposalsViewer:base}
        })
    }

   reloadProjects(limit,field, arr, page){
        let ref = firebase.firestore().collection("projects")
        
        for(let i= 0; i < arr.length; i ++){
            if(arr.length > 0){
            ref = ref.where(`${field}.${arr[i]}`,"==",true)
            }
        }

        ref.get()
        .then(snapshot => {
            let lastSeem = snapshot.docs[(this.state.pageSize.value)*(page) -1]
            let ref2 = firebase.firestore().collection("projects")
            //ref2 = ref2.orderBy("created","desc")
            for(let i= 0; i < arr.length; i ++){
                if(arr.length > 0){
                ref2 = ref2.where(`${field}.${arr[i]}`,"==",true)
                }
            }
            if(page){
            ref2 = ref2.startAfter(lastSeem).limit(limit).get()
            }else{
                ref2 = ref2.limit(limit).get()
            }
            ref2.then(snapshot2 => {
             
            let projects = [];
            let size = snapshot.size;
            if(!(size > 0)){
                size = null
            }
            
            snapshot2.forEach(doc => {
                projects.push(doc.data())
            })

            projects.sort(function(a, b) {
                var dateA = new Date(a.created.toDate()), dateB = new Date(b.created.toDate());
                return dateA - dateB;
            });
            projects.reverse();
            this.setState({
                projects:projects,
                size:size,
            })
            })
        

        })

    }

   async updateUser(id){
        firebase.firestore().collection("users").doc(id).get()
        .then(async doc => {
           firebase.firestore().collection("users").doc(id).collection("inbox").orderBy("sent","desc").onSnapshot(messages => {
               
            let count = 0
            let elements = [];
            messages.forEach(message => {
                if(elements.length < 5){
                elements.push(message.data());
                }
                if(message.data().state =="unread"){
                    count++
                }
            })
            this.setState({inbox:{
                count:count,
                elements:elements
            }})
           })
           
             this.setState(state => {
                let skills = state.skills;
                let skillsUser = doc.data().skills;
                skills.skillsSelected.value = skillsUser;
                let objOfSkills = {};
                this.reloadProjects(this.state.pageSize.value,"skills", skillsUser); 
                return {
                user:[doc.data()],
                skills:skills,
                }
            })
           
        })
    }

    render(){
        return(
            <div>
                {this.state.isLoading === true? <LoadingSpinner />:null }
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
                            dropdownItems:this.state.inbox.count !== null?this.state.inbox.elements.map((element,i) => {
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
               {this.state.idProject === "no-set"?null:
                    <DrawerJob openProposal={(id,id2) => {this.setState({isOpenDrawerJob:false,idProject:"",proposalsViewer:{isOpen:true,projectId:id,proposalId:id2}})}} action={this.state.action} id={this.state.idProject} isOpen={this.state.isOpenDrawerJob} handleClose={this.handleCloseDrawerJob}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectId ===""?null:<ProposalsViewer openProject={(id) => {this.setState({isOpenDrawerJob:true, idProject:id, proposalsViewer:{isOpen:false,proposalId:"",projectId:""}})}} handleClose={this.handleCloseProposalViewer} projectId={this.state.proposalsViewer.projectId} proposalId={this.state.proposalsViewer.proposalId} isOpen={this.state.proposalsViewer.isOpen} />}
                        <div className="col">
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

                            let referencesCheck = project.references.includes(firebase.auth().currentUser.email);
                            

                            Object.keys(skills).forEach((key, i) =>{
                                skillsObj.push({
                                    text:key,
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
                                    icon:"attach_money",
                                    key:2
                                },
                                {
                                    text:project.applicants?project.applicants.length:0,
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

                            return <JobModule addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.setState({idProject:project.id ,isOpenDrawerJob:true})}} />
                        }):this.state.size !== null?<div className="spinner-border"></div>:<div className="">No projects found</div>}

                           {this.state.size === null?null:<ul className="pagination text-center mt-2">
                             <li className="page-item ml-auto"><a className="page-link" href="#">Previous</a></li>
                             {
                                 (() => {
                                     let pages = [];
                                     for(let i = 0 ; i<  Math.ceil(this.state.size/this.state.pageSize.value); i++){
                                         pages.push("element")
                                     }
                                     return pages
                                 })().map((data, i) => {
                                     return <li key={i} className="page-item"><a className="page-link" onClick={() => {this.reloadProjects(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value, i)}} href="#">{i}</a></li>
                                 })                                                                  }
                             <li className="page-item mr-auto"><a className="page-link" href="#">Next</a></li>
                           </ul>}
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