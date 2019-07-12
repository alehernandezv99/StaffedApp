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
import DrawerJob from "../drawerJob";
import ProposalsViewer from "../proposalViewer";
import JobModule from "../home/jobModule";

export default class MyProjects extends React.Component {
    constructor(props){
        super(props);

        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;
        this.updateUser = this.updateUser.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
        this.handleInboxEvent = this.handleInboxEvent.bind(this);

        this.state = {
            isLoading:false,
            user:null,
            toasts: [ /* IToastProps[] */ ],
            pageSize:{
                min:6,
                max:12,
                value:6
            },
            inbox:{
                count:null,
                elements:null
            },
            projects:[],
            size:null,
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

    findMyProjects = (arr, field) => {
        let ref = firebase.firestore().collection("projects").where("involved","array-contains",this.state.user[0].email)
        if(arr){
            ref.where(arr,"array-contains",this.state.user[0].email)
        }
        if(field){
            ref.where(field,"==",this.state.user[0].uid)
        }
        ref.get()
        .then(snapshot => {
            let projects = [];
            let size = snapshot.size
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
               
         
                return {
                user:[doc.data()],
                }
            })
           
        })
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

    handleCloseDrawerJob = () => {
        this.setState({isOpenDrawerJob:false,idProject:"no-set",action:""})
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
                
                 <div className=" row text-center">
                   {this.state.idProject === "no-set"?null:
                    <DrawerJob openProposal={(id,id2) => {this.setState({isOpenDrawerJob:false,idProject:"",proposalsViewer:{isOpen:true,projectId:id,proposalId:id2}})}} action={this.state.action} id={this.state.idProject} isOpen={this.state.isOpenDrawerJob} handleClose={this.handleCloseDrawerJob}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectId ===""?null:<ProposalsViewer openProject={(id) => {this.setState({isOpenDrawerJob:true, idProject:id, proposalsViewer:{isOpen:false,proposalId:"",projectId:""}})}} handleClose={this.handleCloseProposalViewer} projectId={this.state.proposalsViewer.projectId} proposalId={this.state.proposalsViewer.proposalId} isOpen={this.state.proposalsViewer.isOpen} />}
                    <div className="col-sm-4">
                    <div className="input-group mb-3 mt-3 mx-auto">
                          <input type="text" className="form-control" placeholder="Search" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="submit">Search</button> 
                         </div>
                        </div>
                    <div className="form-group mx-auto mt-4 " style={{width:"300px"}}>
                                <label>Page Size</label>
                                <Slider min={this.state.pageSize.min} max={this.state.pageSize.max} value={this.state.pageSize.value}  onChange={(e) => {this.setState(state => {
                                    let pageSize = state.pageSize;
                                    pageSize.value = e;
                                    return ({pageSize:pageSize});
                                })}}  />
                            </div>
   
                        </div>

                        <div className="col">
                        <h4 className="mt-3">My Projects</h4>
                        <div className="container-fluid">
                        
                        <ul className="nav nav-tabs mt-3">
                             <li className="nav-item ml-auto">
                               <a className="nav-link" data-toggle="pill" href="#all">All</a>
                            </li>
                            <li clasName="nav-item">
                               <a className="nav-link" data-toggle="pill" href="#inDevelop">In Development</a>
                            </li>
                            <li className="nav-item">
                               <a className="nav-link" data-toggle="pill" href="#finished">Finished</a>
                           </li>
                           <li className="nav-item mr-auto">
                               <a className="nav-link" data-toggle="pill" href="#saved">Saved</a>
                          </li>
                        </ul>


                        <div className="tab-content">
                               <div className="tab-pane container" id="all">

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

                            return <JobModule addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.setState({idProject:project.id ,isOpenDrawerJob:true})}} />
                        }):this.state.size !== null?<div className="spinner-border"></div>:<div className="">No projects found</div>}
                               </div>

                               <div className="tab-pane container fade" id="inDevelopment">

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

                            return <JobModule addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.setState({idProject:project.id ,isOpenDrawerJob:true})}} />
                        }):this.state.size !== null?<div className="spinner-border"></div>:<div className="">No projects found</div>}

                               </div>
                               <div className="tab-pane container fade" id="finished">

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

                            return <JobModule addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.setState({idProject:project.id ,isOpenDrawerJob:true})}} />
                        }):this.state.size !== null?<div className="spinner-border"></div>:<div className="">No projects found</div>}

                               </div>
                               <div className="tab-pane container fade" id="saved">

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

                            return <JobModule addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.setState({idProject:project.id ,isOpenDrawerJob:true})}} />
                        }):this.state.size !== null?<div className="spinner-border"></div>:<div className="">No projects found</div>}

                               </div>
                         </div>
                        </div>
                    </div>
                </div>}
                <CreateProject id={"createProjectPanel"}/>
            </div>
        )
    }
}