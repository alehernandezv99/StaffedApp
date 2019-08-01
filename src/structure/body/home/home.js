import React from "react";
import Navbar from "../../navbar";
import JobModule from "./jobModule";
import firebase from "../../../firebaseSetUp";
import HomeLoading from "../../loading/homeLoading";
import LoadingSpinner from "../../loading/loadingSpinner";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, RangeSlider} from "@blueprintjs/core";
import CreateProject from "../createProject";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";
import DrawerJob from "../drawerJob";
import ProposalsViewer from "../proposalViewer";
import logo from "../../../res/Graphics/main_logo.png";
import SelectCountry from "../landingPage/signUpDrawer/selectCountry";

import "./home.css";



export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.updateUser = this.updateUser.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;
        this.reloadProjects = this.reloadProjects.bind(this);
        this.markAsRead = this.markAsRead.bind(this);

        this.state = {
            chat:{
                messageList:[
                    {
                        author: 'them',
                        type: 'text',
                        data: {
                          text: 'some text'
                        }
                      },
                      {
                        author: 'them',
                        type: 'text',
                        data: {
                          text: 'some text'
                        }
                      }                    
                      
                    ],
                    isOpen:false,
                    handleOpen:() => {
                        this.setState(state => {
                            let base = state.chat;
                            base.isOpen = true
                            return {
                                chat:base
                            }
                        })
                    },
                    handleClose:() => {
                        this.setState(state => {
                            let base = state.chat;
                            base.isOpen = false;
                            return {
                                chat:base
                            }
                        })
                    }
            },
            user:null,
            toasts: [ /* IToastProps[] */ ],
            projects:[],
            projectsId:[],
            queryString:"",
            searchBar:false,
            size:null,
            budget:[10,50000],
            country:"",
            proposals:[0,100],
            pageSize:{
                min:6,
                max:12,
                value:6
            },
            inbox:{
                count:0,
                elements:[]
            },
            skills:{
                skillsSelected:{value:[], criteria:{type:"array", min:1, max:5}},
                skillsFetched:[],
                exclusive:false,
            },
            drawerJob:{
                projectID:"",
                action:"",
                isOpen:false,
                handleClose:async() => {
                    if(this._mounted){
                       await this.setState(state => {
                            let base = state.drawerJob;
                            base.isOpen = false;
                            base.projectID = "";
                            return {
                                drawerJob:base
                            }
                        })
                    }
                },
                handleOpen:async(projectID,action) => {
                    if(this._mounted){
                      await  this.setState(state => {
                            let base = state.drawerJob;
                            base.isOpen = true;
                            base.action = action;
                            base.projectID = projectID
                            return {
                                drawerJob:base
                            }
                        })
                    }
                }
            },
            
            pagination:[],
            isLoading:false,
            proposalsViewer:{
                isOpen:false,
                projectID:"",
                proposalID:"",
                handleOpen:async(projectID, proposalID) => {
                    if(this._mounted){
                     await  this.setState(state => {
                            let base = state.proposalsViewer;
                            base.isOpen = true;
                            base.projectID = projectID;
                            base.proposalID = proposalID;
                            
                            let base2 = state.drawerJob;
                            base2.isOpen = false;
                            base2.projectID = "";
                            return {
                                proposalsViewer:base,
                                drawerJob:base2
                            }
                        })
                    }
                },
                handleClose:async(projectID, proposalID) => {
                    if(this._mounted){
                       await this.setState(state => {
                            let base = state.proposalsViewer;
                            base.isOpen = false;
                            base.projectID = projectID;
                            base.proposalID = proposalID
                            return {
                                proposalsViewer:base
                            }
                        })
                    }
                }
            },
            createProject:{
                isOpen:false,
                handleClose:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.createProject;
                        base.isOpen = false;
                        return {createProject:base}
                    })
                }
                },
                handleOpen:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.createProject;
                        base.isOpen = true;
                        return {createProject:base}
                    })
                }
                }
            }
        }

        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
        }
    }

    _onMessageWasSent(message) {
        this.setState(state => {
            let base = state.chat;
            base.messageList = [...this.state.chat.messageList, message]
          
          return {  chat:base }
        })
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

    triggerSearch =() => {
        if(this.state.skills.exclusive === false){
            this.reloadProjectsFixed(this.state.pageSize.value,"skills",this.state.skills.skillsSelected.value)
        }else {
            this.reloadProjects(this.state.pageSize.value, "skillsExclusive",this.state.skills.skillsSelected.value)
        }
    }

    handleInboxEvent = (action) =>{
        if(this._mounted){
        if(action.type === "view contract"){
            this.setState(state =>{
                let base = state.drawerJob;
                base.action = action.type;
                base.projectID = action.id;
                base.isOpen = true;
                return {drawerJob:base}
            })
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
    }

    componentWillUnmount(){
        this._mounted = false;

        $("a").off("click");
    }

    toggleLoading = () => {
        if(this._mounted){
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }
    }

    addToast = (message) => {
        if(this._mounted){
        this.toaster.show({ message: message});
        }
    }

    handleCloseDrawerJob = () => {
        if(this._mounted){
        this.setState({isOpenDrawerJob:false,idProject:"no-set",action:""})
        }
    }

   async clearSkill(index){
       await this.setState(state => {
          let skills = state.skills.skillsSelected.value;
          skills.splice(index,1)
          let base = state.skills;
          let skillsObj = {value:skills, criteria:this.state.skills.skillsSelected.criteria}
          base.skills = skillsObj;
          if(this._mounted){
          return({skills:base, projects:[], projectsId:[]});
          }
        })

        if(this.state.skills.exclusive === false){
            this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
            }else {
                this.reloadProjects(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value);
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
          if(this._mounted){
          return({skills:base, projects:[], projectsId:[]});
          }
          }else {
            this.addToast(this.checkCriteria(skills, criteria, "skills").message);
            if(this._mounted){
            return ({});
            }
          }
        })

        if(this.state.skills.exclusive === false){
        this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
        }else {
            this.reloadProjects(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value);
        }
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

      bindSkillsInput = () => {
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

          firebase.firestore().collection("skills").get()
          .then(async snapshot => {
            let skills = [];
            snapshot.forEach(doc => {
            skills.push(doc.data().name);
    })

          autocomplete(document.getElementById("skills-filter"), skills, this.addSkill);
  })
      }

    componentDidMount(){
        this._mounted = true;
        if(this.state.inbox.count == null){
            $(".inbox").hide();
        }else {
            $(".inbox").show();
        }

        $(document).ready(function(){
            // Add smooth scrolling to all links
            $("a").on('click', function(event) {
              // Make sure this.hash has a value before overriding default behavior
              if (this.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();
          
                // Store hash
                var hash = this.hash;
          
                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                $('html, body').animate({
                  scrollTop: $(hash).offset().top - 80
                }, 800, function(){
          
                  // Add hash (#) to URL when done scrolling (default click behavior)
                  window.location.hash = hash - 80;
                });
              } // End if
            
            });

        
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
              this.props.handleStates(0)
              // ...
            }
          });
        
       
    }

    specificSearch = (string, page) => {
         this.setState({
            projects:[]
        })

        firebase.firestore().collection("projects")
        .where("keywords","array-contains",string.toLowerCase())
        .orderBy("created","desc")
        .get()
        .then(snapshot => {
    
            if(snapshot.empty){
                if(this._mounted){
                    this.setState({
                        projects:[],
                        size:null
                    })
                }
            }
            let size= snapshot.size;
            let lastSeem;
            if(page){
                lastSeem = snapshot.docs[((this.state.pageSize.value)*(page))-1];
            }
            let ref= firebase.firestore().collection("projects")
            if(page){
                  ref= ref.where("keywords","array-contains",string.toLowerCase())
                  .orderBy("created","desc").startAfter(lastSeem).limit(this.state.pageSize.value)
            }else {
                ref = ref.where("keywords","array-contains",string.toLowerCase())
                .orderBy("created","desc").limit(this.state.pageSize.value)
            }

            ref.get()
            .then(snapshot2 => {
                let arr = []
                snapshot2.forEach(project => {
                    arr.push(project.data())
                })

                if(this._mounted){
                    this.setState({
                        projects:arr,
                        size:size
                    })
                }
            })
        })
    }

    reloadProjectsFixed = (limit, field, arr,page,index,sizeAcum,dictionary,projects, ids, acumDeficit) => {
      

        if(acumDeficit === undefined){
             this.setState({
                projects:[]
            })
        }
        let newIndex = index !== undefined?index:0;
        let ref = firebase.firestore().collection("projects");

        
        if(arr.length > 0){
        ref= ref.where("skills","array-contains",arr[newIndex])
        }

        if(this.state.budget[1] < 50000 || this.state.budget[0] > 10){
            ref = ref.orderBy("budget","desc");
            ref= ref.where("budget",">=",Number(this.state.budget[0])).where("budget","<=",Number(this.state.budget[1]))
        }

       
        if((this.state.proposals[0] > 0 || this.state.proposals[1] < 100) && !(this.state.budget[1] < 50000 || this.state.budget[0] > 10)){
           
            ref = ref.orderBy("proposals","desc")
            ref= ref.where("proposals",">=",Number(this.state.proposals[0])).where("proposals","<=",Number(this.state.proposals[1]));
        }

        if(this.state.country !== ""){
            ref= ref.where("country","==",this.state.country)
        }
        if(!(this.state.budget[1] < 50000 || this.state.budget[0] > 10)){

        ref = ref.orderBy("created","desc")
        }
        
        
        ref.get()
        .then(snapshot => {
         
            if(snapshot.empty){
                if(this._mounted){
                  
                    this.setState({
                        projects:[],
                        size:null
                    })
                }
            }
            let currentIds = ids !== undefined?ids:[];
            let currentSize = 0;

            snapshot.forEach(document => {
                if(!(currentIds.includes(document.data().id))){
                    currentSize++;
                    currentIds.push(document.data().id);
                }
            })

            let size = sizeAcum !== undefined?sizeAcum + currentSize:currentSize;
            let lastSeem = {}
            let newDictionary = []
            if(page !== undefined){
            
            if(arr.length > 0){
            lastSeem = snapshot.docs[((Math.ceil(limit/arr.length))*(page))-(page === 0?0:1)];
       
             } else {
                lastSeem = snapshot.docs[(limit*(page))-(page === 0?0:1)];
               
            }
            
             newDictionary = dictionary !== undefined?dictionary:[];
             newDictionary.push(lastSeem);
          
            }

            let ref = firebase.firestore().collection("projects");

            if(arr.length > 0){
            ref= ref.where("skills","array-contains",arr[newIndex])
            }

            if(this.state.budget[1] < 50000 || this.state.budget[0] > 10){
                ref = ref.orderBy("budget","desc");
                ref= ref.where("budget",">=",Number(this.state.budget[0])).where("budget","<=",Number(this.state.budget[1]))
            }

            if((this.state.proposals[0] > 0 || this.state.proposals[1] < 100) && !(this.state.budget[1] < 50000 || this.state.budget[0] > 10)){
            
                ref = ref.orderBy("proposals","desc")
                ref= ref.where("proposals",">=",Number(this.state.proposals[0])).where("proposals","<=",Number(this.state.proposals[1]));
            }
    
            if(this.state.country !== ""){
                ref= ref.where("country","==",this.state.country)
            }

            if(!(this.state.budget[1] < 50000 || this.state.budget[0] > 10)){

            ref = ref.orderBy("created","desc")
            }

            let currentLimit = 0;
            

            if(index !== (arr.length - 1)){

                if(arr.length > 0){
                currentLimit = Math.ceil(limit/arr.length);
                
                }else {
                    currentLimit= 6;
                }
                
                }else {
        
                    currentLimit = (limit - (Math.ceil(limit/arr.length)*(arr.length- 1)-acumDeficit));
                    if(currentLimit < 1 || currentLimit < 0){
                        currentLimit = 1
                    }
                    currentLimit = currentLimit === 0?6:currentLimit;
                    
            }

            if(page !== undefined){
            ref = ref.startAfter(lastSeem).limit(currentLimit);
            }else {
                ref = ref.limit(currentLimit); 
            }
            ref.get()
            .then(snapshot2 => {
           
                if(snapshot2.empty){
                    if(this._mounted){
                
                        this.setState({
                            projects:[],
                            size:null
                        })
                    }
                }
                let newProjects = projects?projects:[];
                let checkSize = 0;
                let deficit = 0;
                snapshot2.forEach(doc => {
                    if(currentIds.includes(doc.data().id)){
                        checkSize++;
                    newProjects.push(doc.data());
                    }else {
                        deficit++
                    }
                })
                
                let newDeficit = acumDeficit !== undefined?acumDeficit + deficit:deficit;


                if(newIndex === (arr.length - 1) || arr.length === 0){
                    if(this._mounted){
                    this.setState({
                        projects:newProjects,
                        size:size === 0?null:size,
                        searchBar:false
                    })
                }
                }else {
                    newIndex++;
                    this.reloadProjectsFixed(limit,field,arr,page,newIndex,size,newDictionary,newProjects,currentIds,newDeficit);
                }
                
            })
        })
    }

   reloadProjects(limit,field, arr, page){
      
        this.setState({
           projects:[]
    
        })
        let ref = firebase.firestore().collection("projects")
        
        if(!(this.state.budget[1] < 50000 || this.state.budget[0] > 10) && !(this.state.proposals[0] > 0 || this.state.proposals[1] < 100)){
        for(let i= 0; i < arr.length; i ++){
            if(arr.length > 0){
            ref = ref.where(`${field}.${arr[i]}`,"==",true)
            }
        }
    }

        if(this.state.budget[1] < 50000 || this.state.budget[0] > 10){
            ref = ref.orderBy("budget","desc")
            ref= ref.where("budget",">=",Number(this.state.budget[0])).where("budget","<=",Number(this.state.budget[1]))
      
        }

        if((this.state.proposals[0] > 0 || this.state.proposals[1] < 100) && !(this.state.budget[1] < 50000 || this.state.budget[0] > 10)){
            ref = ref.orderBy("proposals","desc")
            ref= ref.where("proposals",">=",Number(this.state.proposals[0])).where("proposals","<=",Number(this.state.proposals[1]));
        }

        if(this.state.country !== ""){
            ref= ref.where("country","==",this.state.country)
          
        }

        ref.get()
        .then(snapshot => {
            if(snapshot.empty){
                this.setState({
                    projects:[],
                    size:null
                })
            }
            let lastSeem = snapshot.docs[(this.state.pageSize.value)*(page) -(page === 0?0:1)]
            let ref2 = firebase.firestore().collection("projects")
            //ref2 = ref2.orderBy("created","desc")
            if(!(this.state.budget[1] < 50000 || this.state.budget[0] > 10) && !(this.state.proposals[0] > 0 || this.state.proposals[1] < 100)){
            for(let i= 0; i < arr.length; i ++){
                if(arr.length > 0){
                ref2 = ref2.where(`${field}.${arr[i]}`,"==",true)
                }
            }
        }

            if(this.state.budget[1] < 50000 || this.state.budget[0] > 10){
                ref2 = ref2.orderBy("budget","desc")
                ref2= ref2.where("budget",">=",Number(this.state.budget[0])).where("budget","<=",Number(this.state.budget[1]))
             
                
            }

            if((this.state.proposals[0] > 0 || this.state.proposals[1] < 100) && !(this.state.budget[1] < 50000 || this.state.budget[0] > 10)){
                ref2 = ref2.orderBy("proposals","desc")
                ref2= ref2.where("proposals",">=",Number(this.state.proposals[0])).where("proposals","<=",Number(this.state.proposals[1]));
            }
    
            if(this.state.country !== ""){
                ref2= ref2.where("country","==",this.state.country)
              
            }
            if(page !== undefined){
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

            if(!(this.state.budget[1] < 50000 || this.state.budget[0] > 10)){

            projects.sort(function(a, b) {
                var dateA = new Date(a.created.toDate()), dateB = new Date(b.created.toDate());
                return dateA - dateB;
            });
        
            projects.reverse();
        }
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

            if(this._mounted){
            this.setState({inbox:{
                count:count,
                elements:elements
            }})
        }
           })
           if(this._mounted){
             this.setState(state => {
                let skills = state.skills;
                let skillsUser = doc.data().skills;
                skills.skillsSelected.value = skillsUser;
                let objOfSkills = {};
                if(state.skills.exclusive === false){
                this.reloadProjectsFixed(this.state.pageSize.value,"skills", skillsUser); 
                }else {
                    this.reloadProjects(this.state.pageSize.value,"skillsExclusive", skillsUser); 
                }
                return {
                user:[doc.data()],
                skills:skills,
                }
            })
        }
        })
    }

    render(){
        return(
            <div>
                <div style={{zIndex:"9999999",position:"relative"}}>
      </div>
                {this.state.isLoading === true? <LoadingSpinner />:null }
                <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>
                <Navbar logo={{
                    img:logo,
                    href:"#top"
                }}
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
                            onClick:() => {this.props.handleStates(4)},
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
                            type:"link",
                            text:"Payments",
                            href:"",
                            icon:"payment",
                            onClick:() => {this.props.handleStates(5)},
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
                            onClick:() => {this.state.createProject.handleOpen()},
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
                               return  {href:"",text:element.message,key:(i + Math.random()),onClick:()=>{element.action?this.handleInboxEvent(element.action):(()=>{})()}}
                                 }):[{
                                href:"",
                                text:"No notifications",
                                key:2,
                                onClick:() => {}
                            }]
                        },
                        {
                            type:"dropdown",
                            text:this.state.user === null?"Loading...":this.state.user[0].displayName?this.state.user[0].displayName:this.state.user[0].email,
                            href:"",
                            key:5,
                            onClick:() => {},
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Profile",
                                    key:1,
                                    onClick:() => {this.props.handleStates(3, firebase.auth().currentUser.uid)},
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
                

                <div className="container-fluid padding-2">
                    {this.state.user === null? <HomeLoading />:
                    
                    <div className="row text-center">

                 <div id="portalContainer" className="text-left">
                   {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob handleStates={this.props.handleStates} openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={this.state.drawerJob.handleClose}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                    <CreateProject reloadProjects={() => {
                        if(this.state.searchBar === false){
                            this.state.skills.exclusive === false? this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value):this.reloadProjects(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value)
                        }else {
                            this.specificSearch(this.state.queryString)
                        }
                    }} isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/>
                  </div>

                        <div className="col">
                            <div className="form-group">
                                <div className="text-center mb-3">Page Size</div>
                              
                                <Slider min={this.state.pageSize.min} max={this.state.pageSize.max} value={this.state.pageSize.value}   onChange={(e) => {this.setState(state => {
                                    let pageSize = state.pageSize;
                                    pageSize.value = e;
                                    return ({pageSize:pageSize});

                                });this.state.skills.exclusive === false? this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value):this.reloadProjects(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value)}}  />
        
                            </div>
                            <h4 className="text-center mb-3">Filters</h4>
                            <div className="form-group mb-4">
                            <div className="text-center mb-3">Skills</div>
                            <div className="custom-control custom-switch" onClick={(e) => {
                                 if(this._mounted){
                                     this.setState(state => {
                                         let base = state.skills;
                                         base.exclusive = !base.exclusive; 
                                         if(base.exclusive === false){
                                            this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
                                            }else {
                                                this.reloadProjects(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value);
                                            }
                                         return {
                                             skills:base
                                         }
                                     })
                                 }
                             }}>
                             <input type="checkbox" className="custom-control-input" checked={this.state.skills.exclusive} onChange={()=>{}} />
                             <label className="custom-control-label">Exclusive?</label>
                           </div>
                                <div>
                                {this.state.skills.skillsSelected.value.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 mt-2 mb-2 mr-2 btn-sm">{skill} <i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => {this.clearSkill(index)}}>clear</i></button>
                                })}
                                <div>
                                <div className="autocomplete">
                                <input autoComplete="off" ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" onClick={(e) => {
                                if(!this.setted){
                                    this.bindSkillsInput()
                                    this.setted = true;
                                }
                                }} id="skills-filter" className="form-control" required/>
                                </div>
                                </div>

                                </div>
                              </div>
                              <div  className="form-group mb-4">
                                  <div className="text-center mb-3">Budget <span>($US Dollars)</span></div>
                                  <div className="input-group mb-3 input-group-sm">
                                    <div className="input-group-prepend">
                                       <span className="input-group-text">From</span>
                                   </div>
                                   <input type="text" className="form-control" value={this.state.budget[0]} onChange={async(e) => {e.persist();await this.setState(state => {
                                       if(this._mounted){
                                       
                                       return {
                                       budget:[e.target.value,state.budget[1]],
                                       }
                                    
                                    }
                                   }); this.triggerSearch()}}/>
                                  </div>

                                  <div className="input-group mb-3 input-group-sm">
                                    <div className="input-group-prepend">
                                       <span className="input-group-text">To  </span>
                                   </div>
                                   <input type="text" className="form-control" value={this.state.budget[1]} onChange={async(e) => {e.persist();await this.setState(state => {
                                       if(this._mounted){
                                       
                                       return {
                                       budget:[state.budget[0], e.target.value]
                                       }
                                    
                                    }
                                   }); this.triggerSearch()}}/>
                                  </div>
                              </div>
                              <div className="form-group mb-4">
                                  <div className="text-center mb-3">Country</div>
                                  <SelectCountry value={this.state.country} onChange={async(e) => { await this.setState({
                                      country: e.target.options[e.target.selectedIndex].value
                                  }); this.triggerSearch()}} />
                            </div>

                            <div className="form-group mb-4">
                                <div className="text-center mb-3">Number of Proposals</div>
                                <RangeSlider min={0} max={100} labelStepSize={10} stepSize={1} onChange={async(e) => {
                                  await  this.setState({
                                        proposals:e
                                    }); this.triggerSearch();
                                }} value={this.state.proposals}/>
                            </div>
                        </div>
                        <div className="col-sm-6" id="top">
                        <div className="input-group mb-3 mt-3 mx-auto">
                          <input type="text" className="form-control" onChange={(e) => {this.setState({queryString:e.target.value})}} placeholder="Search" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="submit" onClick={() => {this.specificSearch(this.state.queryString)}}>Search</button> 
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
                                    text:skills[key],
                                    key:i
                                });
                            })


                            let specs = [
                                {
                                    text:project.type,
                                    icon:"gps_fixed",
                                    desc:"Type of contract",
                                    key:1
                                },
                                {
                                    text:project.budget,
                                    icon:"attach_money",
                                    key:2,
                                    desc:"Budget of the project"
                                },
                                {
                                    text:project.applicants?project.applicants.length:0,
                                    icon:"people",
                                    key:3,
                                    desc:"Applicants in this project"
                                },
                                {
                                    text:"Payment Verified",
                                    icon:"check_circle",
                                    key:4,
                                    desc:"This client has verified his payment method"
                                },
                                {
                                    text:project.country,
                                    icon:"place",
                                    key:5,
                                    desc:"Country of the client"
                                },
                                
                            ]
                            let date;
                            
                            try {
                            date = project.created.toDate().toDateString();
                            
                            }catch(e){
                            
                                date = firebase.firestore.Timestamp.fromMillis((project.created.seconds !== undefined ?project.created.seconds:project.created._seconds)*1000).toDate().toDateString()
                            }
                

                            return <JobModule date={date} addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.state.drawerJob.handleOpen(project.id)}} />
                        }):this.state.size !== null?<div className="spinner-border"></div>:<div className="">No projects found</div>}

                           {this.state.projects.length === 0?null:<ul className="pagination text-center mt-2">
                             <li className="page-item ml-auto"><a className="page-link" href="#">Previous</a></li>
                             {
                                 (() => {
                                     let pages = [];
                                     for(let i = 0 ; i<  Math.ceil(this.state.size/this.state.pageSize.value); i++){
                                         pages.push("element")
                                     }
                                     return pages
                                 })().map((data, i) => {
                                     if(this.state.searchBar === false){
                                     return <li key={i} className="page-item"><a className="page-link" onClick={() => {this.state.skills.exclusive === false? this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value, i):this.reloadProjects(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value, i) }} href="#">{i}</a></li>
                                     }else {
                                        return <li key={i} className="page-item"><a className="page-link" onClick={() => {this.specificSearch(this.state.queryString,i)}} href="#">{i}</a></li>
                                     }
                                 })                                                                  }
                             <li className="page-item mr-auto"><a className="page-link" href="#">Next</a></li>
                           </ul>}
                        </div>
                        <div className="col">
                            <div className="card">
                                <div className="card-body text-center">
                                    <div style={{backgroundImage:`url(${this.state.user[0].photoURL?this.state.user[0].photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"150px",
                                    height:"150px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="rounded-circle" ></div>
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
                
            </div>
        )
    }
}