import React from "react";
import Navbar from "../../navbar";
import TODO from "../drawerJob/TO-DO";
import JobModule from "./jobModule";
import firebase from "../../../firebaseSetUp";
import HomeLoading from "../../loading/homeLoading";
import LoadingSpinner from "../../loading/loadingSpinner";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, RangeSlider, IToastOptions} from "@blueprintjs/core";
import CreateProject from "../createProject";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";
import DrawerJob from "../drawerJob";
import ContractDrawer from "../contractDrawer";
import ProposalsViewer from "../proposalViewer";
import logo from "../../../res/Graphics/main_logo.png";
import SelectCountry from "../landingPage/signUpDrawer/selectCountry";
import InboxMessages from "../InboxMessages";
import ProposalsList from "../proposalsList";
import ProfileViewer from "../profileViewer";
import HelpDrawer from "../helpDrawer";

import InvitationDrawer from "../invitationDrawer";

//Chat 
import Chat from "../chat";

import "./home.css";







export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.updateUser = this.updateUser.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;
        this.markAsRead = this.markAsRead.bind(this);

        this.state = {
            contracts:[],
            chat:{
                payload:null
            },
            proposalsUnread:0,
            loadMore:true,
            searchBar:true,
            lastSeemUnion:[],
            lastSeem:{},
            pending:false,
            user:null,
            toasts: [ /* IToastProps[] */ ],
            currentPage:0,
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
                value:15
            },
            helpDrawer:{
                isOpen:false,
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.helpDrawer;
                            base.isOpen = true;

                            return {
                                helpDrawer:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.helpDrawer;
                            base.isOpen = false;

                            return {
                                helpDrawer:base
                            }
                        })
                    }
                }
            },
            invitationDrawer:{
                isOpen:false,
                id:"",
                handleOpen:(id) => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.invitationDrawer;
                            base.isOpen =true;
                             base.id = id
                            return {
                                invitationDrawer:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.invitationDrawer;
                            base.isOpen = false;

                            return{
                                invitationDrawer:base
                            }
                        })
                    }
                }
            },
            inbox:{
                count:0,
                elements:[],
                currentIndex:0
            },
            skills:{
                skillsSelected:{value:[], criteria:{type:"array", min:1, max:5}},
                skillsFetched:[],
                exclusive:true,
            },
            profileViewer:{
                isOpen:false,
                userId:"",
                handleOpen:(id) => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.profileViewer;
                            base.isOpen = true;
                            base.userId = id

                            return {
                                profileViewer:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.profileViewer;
                            base.isOpen = false;

                            return {
                                profileViewer:base
                            }
                        })
                    }
                }
            },
            proposalsList:{
                isOpen:false,
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.proposalsList;
                            base.isOpen = true;

                            return {
                                proposalsList:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.proposalsList;
                            base.isOpen = false;

                            return {
                                proposalsList:base
                            }
                        })
                    }
                }
            },
            contractDrawer:{
                isOpen:false,
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.contractDrawer;
                            base.isOpen = true;

                            return {
                                contractDrawer:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base =state.contractDrawer;
                            base.isOpen = false;

                            return {
                                contractDrawer:base
                            }
                        })
                    }
                }
            },
            TODO:{
                isOpen:false,
                handelClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.TODO;
                            base.isOpen = false

                            return {
                                TODO:base
                            }
                        })
                    }
                },
              handleOpen:() => {
                  if(this._mounted){
                      this.setState(state => {
                          let base = state.TODO;
                          base.isOpen = true;

                          return {
                              TODO:base
                          }
                      })
                  }
              }
            },
            inboxDrawer:{
                isOpen:false,
                handleOpen:() => {this.setState(state => {
                    let base = state.inboxDrawer
                    base.isOpen = true
                    return {
                        inboxDrawer:base
                    }
                })},
                handleClose:() => {
                    this.setState(state => {
                        let base = state.inboxDrawer;
                        base.isOpen = false
                        return {
                            inboxDrawer:base
                        }
                    })
                }
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
                mode:"create",
                id:"",
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
            this.reloadProjectsExclusive(this.state.pageSize.value, "skillsExclusive",this.state.skills.skillsSelected.value)
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
                base.projectID = action.id;
                base.proposalID = action.id2;

                return ({proposalsViewer:base});
            })
        }else if(action.type === "see more"){
            this.state.inboxDrawer.handleOpen()
        }else if (action.type === "Invitation"){
            this.state.invitationDrawer.handleOpen(action.id)
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

    addToast = (message, action) => {
        if(this._mounted){
            if(action === undefined){
        this.toaster.show({ message: message});
            }else {
                this.toaster.show({ message: message, action:{text:"Resend", onClick:() => {
                    this.toggleLoading();
                    firebase.auth().currentUser.sendEmailVerification()
                    .then(() => {
                        this.toggleLoading();
                        this.addToast("Email Sent");
                    })
                    .catch(e => {
                        this.addToast("Ohoh something went wrong!");
                        this.toggleLoading();
                    })
                }}});
            }
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
                this.reloadProjectsExclusive(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value);
            }
      }

   async addSkill(skill){
        if(!(this.state.skills.skillsSelected["value"].includes(skill))){
          let skills = this.state.skills.skillsSelected["value"].slice();
    
          let criteria = this.state.skills.skillsSelected["criteria"];
        await this.setState(state => {
          let base = state.skills;
          skills.push(skill);
         
          base.skillsSelected.value = skills;
          if(this._mounted){
          return({skills:base, projects:[], projectsId:[]});
          }
        
        })

        if(this.state.skills.exclusive === false){
        this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
        }else {
            this.reloadProjectsExclusive(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value);
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

        if(this.state.proposalsUnread === 0){
            $(".proposals-list").hide();
        }else {
            $(".proposals-list").show();
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
                 
                    skills.push(event.target.value);
                    let skillsObj = {value:skills, criteria:this.state.skills.skillsSelected.criteria}
                     base.skillsSelected = skillsObj;

                    this.skillInput.value = "";
                    return({skills:base})
                    
              
    
                }else {
                  this.addToast("You cannot select two repeated skills")
                  return {}
                }
                })

                if(this.state.skills.exclusive === false){
                    this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
                    }else {
                        this.reloadProjectsExclusive(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value);
                    }
                
               
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
        if(this.state.proposalsUnread === 0){
            $(".proposals-list").hide();
        }else {
            $(".proposals-list").show();
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
                  this.addToast("Please Verify Your Email", true)
              }
              this.updateUser(user.uid)

              this.uid = user.uid
              
              // ...
            } else {
              // User is signed out.
              this.props.handleStates(0)
              this.props.passLastID(this.uid)
              

              // ...
            }
          });
        
       
    }

    specificSearch = (string, page) => {
        this.setState({
            searchBar:true,
            pending:true,
            loadMore:true
        })
        if(page === undefined){
            this.setState({
                currentPage:0,
                projects:[],
                size:null
            })
        }
    
            
           
            let lastSeem;
            if(page === true){
                lastSeem = this.state.lastSeem
            }
            let ref= firebase.firestore().collection("projects")
            if(page === true){
                  ref= ref.where("keywords","array-contains",string.toLowerCase())
                  .orderBy("created","desc").startAfter(lastSeem).limit(Number(this.state.pageSize.value))
            }else {
                ref = ref.where("keywords","array-contains",string.toLowerCase())
                .orderBy("created","desc").limit(Number(this.state.pageSize.value))
            }

            ref.get()
            .then(snapshot2 => {
                let size= snapshot2.size;
                let arr = []
                snapshot2.forEach(project => {
                    arr.push(project.data())
                })
                if(!snapshot2.empty){
                if(this._mounted){
                    this.setState({
                        projects:this.state.projects.concat(arr),
                        size:size,
                        pending:false,
                        lastSeem:snapshot2.docs[snapshot2.docs.length - 1],
                        loadMore:size < this.state.pageSize.value?false:true
                    })
                }
            }else {
                if(this._mounted){
                    this.setState({
                        pending:false,
                        projects:[],
                        size:0,
                        loadMore:false
                    })
                }
            }
                
            })
            .catch(e => {
              if(this._mounted){
                  this.setState({
                      pending:false
                  })
              }
            })

          
        
      
    }

    reloadProjectsFixed = (limit, field, arr,page,index,sizeAcum,dictionary,projects, ids, acumDeficit, newLastSeem, verification) => {
        this.setState({
            pending:true,
            searchBar:false,
            loadMore:true
        })

        if(page === undefined){
            if(this._mounted){
                this.setState({
                    projects:[],
                    size:null
                })
            }
        }
        let newIndex = index !== undefined?index:0;

            let currentIds = ids !== undefined?ids:[];
            let currentSize = 0;
    
            
    
            let size = sizeAcum !== undefined?sizeAcum + currentSize:currentSize;
            let lastSeem = {}
            let newDictionary = []
            if(page !== undefined){
            
            if(arr.length > 0){
            lastSeem = this.state.lastSeemUnion[newIndex];
       
             } else {
                lastSeem = this.state.lastSeemUnion[newIndex];
               
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
                currentLimit = Math.ceil(Number(limit)/arr.length);
                
                }else {
                    currentLimit= 15;
                }
                
                }else {
        
                    currentLimit = (Number(limit) - (Math.ceil(limit/arr.length)*(arr.length- 1)-acumDeficit));
                    if(currentLimit < 1 || currentLimit < 0){
                        currentLimit = 1
                    }
                    currentLimit = currentLimit === 0?15:currentLimit;
                    
            }
    
            if(page === true){
            ref = ref.startAfter(lastSeem).limit(currentLimit);
            }else {
                ref = ref.limit(currentLimit); 
            }
            ref.get()
            .then(snapshot2 => {
                let newVerification = verification === undefined?0:verification;

           

                let arrOfLastSeem = newLastSeem === undefined?[]:newLastSeem
                arrOfLastSeem.push(snapshot2.docs[snapshot2.docs.length - 1])

                let newProjects = projects?projects:[];
                let checkSize = 0;
                let deficit = 0;
                snapshot2.forEach(document => {
                    if(!(currentIds.includes(document.data().id))){
                        currentSize++;
                        currentIds.push(document.data().id);
                        newProjects.push(document.data());
                        deficit++
                    }else {
                        checkSize++;
                    }
                })
               
                
               /* snapshot2.forEach(doc => {
                    if(currentIds.includes(doc.data().id)){
                        checkSize++;
                    newProjects.push(doc.data());
                    }else {
                        deficit++
                    }
                })*/
                
                let newDeficit = acumDeficit !== undefined?acumDeficit + deficit:deficit;
    
    
                if(newIndex === (arr.length - 1) || arr.length === 0){
                
                    if(this._mounted){
                      this.setState({
                        projects:this.state.projects.concat(newProjects),
                        size:size,
                        searchBar:false,
                        lastSeemUnion:arrOfLastSeem,
                        pending:false,
                        loadMore: snapshot2.size < currentLimit?false:true
                    })
                }
                
                }else {
                    newIndex++;
                    this.reloadProjectsFixed(limit,field,arr,page,newIndex,size,newDictionary,newProjects,currentIds,newDeficit ,arrOfLastSeem);
                }
                
            })
            .catch(e => {
              if(this._mounted){
                  this.setState({
                      pending:false
                  })
              }
            })
        
       
    }

    reloadProjectsExclusive = (limit,field, arr, page) =>{
      
        this.setState({
                searchBar:false,
                pending:true,
                loadMore:true
        })

        if(page === undefined){
            this.setState({
                currentPage:0,
                projects:[],
                size:null
            })
        }
       
            let lastSeem = this.state.lastSeem
            let ref2  = firebase.firestore().collection("projects")
            //ref2 = ref2.orderBy("created","desc")
            if(!(Number(this.state.budget[1]) < 50000 || Number(this.state.budget[0]) > 10) && !(Number(this.state.proposals[0]) > 0 || Number(this.state.proposals[1]) < 100)){
           
            for(let i= 0; i < arr.length; i ++){
                if(arr.length > 0){
                ref2 = ref2.where(`${field}.${arr[i]}`,"==",true)
                }
            }
        }

            if(this.state.budget[1] < 50000 || this.state.budget[0] > 10){
        ;
               // ref2 = ref2.orderBy("budget","desc")
                ref2= ref2.where("budget",">=",Number(this.state.budget[0])).where("budget","<=",Number(this.state.budget[1]))
             
                
            }

            if((Number(this.state.proposals[0]) > 0 || Number(this.state.proposals[1]) < 100) && !(Number(this.state.budget[1]) < 50000 || Number(this.state.budget[0]) > 10)){
            
               // ref2 = ref2.orderBy("proposals","desc")
                ref2= ref2.where("proposals",">=",Number(this.state.proposals[0])).where("proposals","<=",Number(this.state.proposals[1]));
            }
    
            if(this.state.country !== ""){
                ref2= ref2.where("country","==",this.state.country)
              
            }

            if(!(Number(this.state.proposals[0]) > 0 || Number(this.state.proposals[1]) < 100) && !(Number(this.state.budget[1]) < 50000 || Number(this.state.budget[0]) > 10)){
            ref2 = ref2.orderBy("created","desc")
            }
            if(page === true){
            
            ref2 = ref2.startAfter(lastSeem).limit(Number(limit)).get()
            }else{
                ref2 = ref2.limit(Number(limit)).get()
            }
            ref2
            .then(snapshot2 => {
             let newLastSeem = snapshot2.docs[snapshot2.docs.length - 1]
        
            let projects = [];
            let size = snapshot2.size;
            if(!(size > 0)){
                size = null
            }
           
            snapshot2.forEach(doc => {
             
                projects.push(doc.data())
            })

        if(!snapshot2.empty){
          if(this._mounted){
            this.setState({
                projects:this.state.projects.concat(projects),
                size:size,
                lastSeem:newLastSeem,
                pending:false,
                loadMore:snapshot2.size < limit?false:true
            })
        }
    }else {
        if(this._mounted){
            this.setState({
                pending:false,
                loadMore:false,
                projects:[],
                size:0
            })
        }
    }
            })
            .catch(e => {
                if(this._mounted){
                  this.setState({
                      pending:false
                  })
                }
                })

      
        
        
    
    }


   async updateUser(id){

    if(this.inboxListener !== undefined){
        this.inboxListener(); //Clear the listener
    }

    if(this.proposalsListener !== undefined){
        this.proposalsListener() //Clear hte listener
    }
       
        firebase.firestore().collection("users").doc(id).get()
        .then(async doc => {
            this.proposalsListener =  firebase.firestore().collection("proposals").where("user","==",firebase.auth().currentUser.uid).where("state","==","unread").orderBy("created","desc").limit(10).onSnapshot(snap => {
                let count = snap.size
           
                if(this._mounted){
                    this.setState({
                        proposalsUnread:count
                    })
                }

               
            })

           this.inboxListener =  firebase.firestore().collection("users").doc(id).collection("inbox").orderBy("sent","desc").limit(6).onSnapshot(messages => {
               
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

           firebase.firestore().collection("contracts").where("involved","array-contains",id).orderBy("created","desc").limit(6).get()
           .then(contracts => {
               let arr = [];

               contracts.forEach(contract => {
                   arr.push(contract.data());
               })
            
               if(this._mounted){
                   this.setState({
                       contracts:arr
                   })
               }
           })
           .catch(e => {
               this.addToast("Ohoh something went wrong :(")
           })

           if(this._mounted){
             this.setState(state => {
             /*   let skills = state.skills;
                let skillsUser = doc.data().skills;
                skills.skillsSelected.value = skillsUser;
                let objOfSkills = {};*/
                if(state.skills.exclusive === false){
                this.reloadProjectsFixed(this.state.pageSize.value,"skills", []); 
                }else {
                    this.reloadProjectsExclusive(this.state.pageSize.value,"skillsExclusive", []); 
                }
                return {
                user:[doc.data()],
                //skills:skills,
                }
            })
        }
        })
    }

    resetPayload = () => {
        if(this._mounted){
            this.setState(state => {
                let base = state.chat;
                base.payload = null;

                return {
                    chat:base
                }
            })
        }
    }

    providePayloadToChat = (id) => {
        if(this._mounted){
        this.setState(state => {
            let base = state.chat
            base.payload = id;

            return {
                chat:base
            }
        })
    }
    }

    toggleFilters = () =>{
        $("#filters").slideToggle("fast");
        $("#toggleFilter").slideToggle("fast")
    }

    editProject = (id) => {
        if(this._mounted){
            this.setState(state => {
                let base = state.createProject;
                base.isOpen = true;
                base.mode ="update"
                base.id = id
                return {
                    createProject:base
                }
            })
        }
    }

    render(){
        return(
            <div>
                
                {this.state.isLoading === true? <LoadingSpinner />:null }
                <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast action={{onClick:() => {}, text:"Resend"}} {...toast} />)}
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
                            type:"link badge",
                            text:"Bids",
                            href:"",
                            onClick:() => {this.state.proposalsList.handleOpen(); firebase.firestore().collection("proposals").where("user","==",firebase.auth().currentUser.uid).where("state","==","unread").orderBy("created","desc").limit(10).get()
                        .then((snap) => {

                            if(!snap.empty){
                            let batch = firebase.firestore().batch();

                            snap.forEach(doc => {
                                batch.update(firebase.firestore().collection("proposals").doc(doc.id), {state:"read"})
                            })

                            batch.commit();
                        }
                        })},
                            icon:"list",
                            count:this.state.proposalsUnread,
                            key:2
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
                            dropdownItems:this.state.inbox.elements.length > 0?this.state.inbox.elements.concat([{message:"See More", action:{type:"see more"}}]).map((element,i) => {
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
                                    text:"Help",
                                    key:3,
                                    onClick:() => {this.state.helpDrawer.handleOpen()}
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
                    <div>

<div className="row">
                            <div className=" form-group" style={{display:"none"}}>
                                <div className="text-center mb-3">Page Size</div>
                                <select value={this.state.pageSize.value} className="custom-select-sm text-center" style={{width:"100%"}} onChange={(e) => {this.setState(state => {
                                    let pageSize = state.pageSize;
                                    pageSize.value = Number(e.currentTarget.options[e.currentTarget.selectedIndex].value);
                                    return ({pageSize:pageSize});

                                });this.state.skills.exclusive === false? this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value):this.reloadProjectsExclusive(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value)}}>
                                    <option value="25" style={{textAlign:"center"}}>25</option>
                                    <option value="50">50</option>
                                    <option value="75">75</option>
                                    <option value="100">100</option>
                                </select>
        
                            </div>
                           
                          

                       
                            <div className="form-group  mb-3" style={{display:"none"}}>

                            <div className="flex-container">
                            <div className="text-center mb-3">Skills</div>
                            <div className="custom-control custom-switch ml-4" onClick={(e) => {
                                 if(this._mounted){
                                     this.setState(state => {
                                         let base = state.skills;
                                         base.exclusive = !base.exclusive; 
                                         if(base.exclusive === false){
                                            this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
                                            }else {
                                                this.reloadProjectsExclusive(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value);
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
                           </div>
                                <div>
                                {this.state.skills.skillsSelected.value.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 btn-custom-skill mt-2 mb-2 mr-2 btn-sm">{skill} <i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => {this.clearSkill(index)}}>clear</i></button>
                                })}
                                <div>
                                <div className="autocomplete">
                                <input autoComplete="off" ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" onChange={(e) => {
                                if(!this.setted){
                                    this.bindSkillsInput()
                                    this.setted = true;
                                }
                                }} id="skills-filter" className="form-control" required/>
                                </div>
                                </div>

                                </div>
                              </div>
                              <div  className="form-group mb-4 col-lg-4">
                                  <div className="text-center mb-2">Budget <span>($US Dollars)</span></div>

                                  <div className="flex-container">
                                  <div className="input-group mb-3 input-group-sm m-2">
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
                              

                                  
                                  <div className="input-group mb-3 input-group-sm m-2">
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
                              </div>
                              <div className="form-group col-lg-4 mb-4 text-center">
                                  <div className="text-center mb-3">Country</div>
                                  <SelectCountry value={this.state.country} onChange={async(e) => { await this.setState({
                                      country: e.target.options[e.target.selectedIndex].value
                                  }); this.triggerSearch()}} />
                            </div>

                            <div  className="form-group mb-4 col-lg-4">
                                  <div className="text-center mb-2">Bids</div>

                                  <div className="flex-container">
                                  <div className="input-group mb-3 input-group-sm m-2">
                                    <div className="input-group-prepend">
                                       <span className="input-group-text">From</span>
                                   </div>
                                   <input type="text" className="form-control" value={this.state.proposals[0]} onChange={async(e) => {e.persist();await this.setState(state => {
                                       if(this._mounted){
                                       
                                       return {
                                       proposals:[e.target.value,state.proposals[1]],
                                       }
                                    
                                    }
                                   }); this.triggerSearch()}}/>
                                  </div>

                                  <div className="input-group mb-3 input-group-sm m-2">
                                    <div className="input-group-prepend">
                                       <span className="input-group-text">To  </span>
                                   </div>
                                   <input type="text" className="form-control" value={this.state.proposals[1]} onChange={async(e) => {e.persist();await this.setState(state => {
                                       if(this._mounted){
                                       
                                       return {
                                       proposals:[state.proposals[0], e.target.value]
                                       }
                                    
                                    }
                                   }); this.triggerSearch()}}/>
                                  </div>
                                  </div>
                              </div>
                        
                     
                        </div>

                    <div className="row text-center">
                        <div style={{zIndex:"9999999",position:"relative"}}>
                    <Chat addToast={this.addToast} payload={this.state.chat.payload} handleStates={this.props.handleStates} resetPayload={this.resetPayload}/>
                       </div>
                 <div id="portalContainer" className="text-left">
                     <HelpDrawer isOpen={this.state.helpDrawer.isOpen} handleClose={this.state.helpDrawer.handleClose} />
                     {this.state.invitationDrawer.isOpen? <InvitationDrawer addToast={this.addToast} openUser={this.state.profileViewer.handleOpen} id={this.state.invitationDrawer.id} isOpen={this.state.invitationDrawer.isOpen} handleClose={this.state.invitationDrawer.handleClose} />:null}
                     {this.state.profileViewer.isOpen === true? <ProfileViewer openUser={this.state.profileViewer.handleOpen} userId={this.state.profileViewer.userId} isOpen={this.state.profileViewer.isOpen} handleClose={this.state.profileViewer.handleClose} />:null}
                  {this.state.proposalsList.isOpen === true?  <ProposalsList openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} addToast={this.addToast} isOpen={this.state.proposalsList.isOpen} handleClose={this.state.proposalsList.handleClose} />:null}
                     <ContractDrawer openUser={this.state.profileViewer.handleOpen} openContract={(type, id) => {this.handleInboxEvent({type:type, id:id})}} isOpen={this.state.contractDrawer.isOpen} handleClose={this.state.contractDrawer.handleClose} addToast={this.addToast} handleStates={this.props.handleStates} />
                     {this.state.drawerJob.projectID === ""?null:<TODO addToast={this.addToast} isOpen={this.state.TODO.isOpen} projectID={this.state.drawerJob.projectID} handleClose={this.state.TODO.handelClose} />}
                     <InboxMessages handleAction={(e) => {this.handleInboxEvent(e)}} handleClose={this.state.inboxDrawer.handleClose} isOpen={this.state.inboxDrawer.isOpen} />
                   {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob openUser={this.state.profileViewer.handleOpen} editProject={this.editProject} openTODO={() =>{this.state.TODO.handleOpen()}} providePayloadToChat={this.providePayloadToChat}  handleStates={this.props.handleStates} openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={() => {this.state.drawerJob.handleClose(); this.state.proposalsList.handleClose();}}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                   {this.state.createProject.isOpen? <CreateProject id={this.state.createProject.id} mode={this.state.createProject.mode} reloadProjects={() => {
                        if(this.state.searchBar === false){
                            this.state.skills.exclusive === false? this.reloadProjectsFixed(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value):this.reloadProjectsExclusive(this.state.pageSize.value,"skillsExclusive", this.state.skills.skillsSelected.value)
                        }else {
                            this.specificSearch(this.state.queryString)
                        }
                    }} isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/>:null}
                  </div>

                        
                        <div className="col-lg-8" id="top">

                    
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
                                    icon:"drafts",
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
                                    icon:"assistant_photo",
                                    key:5,
                                    desc:"Country of the client"
                                },
                                
                            ]
                            let date;
                            
                            try {
                            date = project.created.toDate()
                            
                            }catch(e){
                            
                                date =  firebase.firestore.Timestamp.fromMillis((project.created.seconds !== undefined ?project.created.seconds:project.created._seconds)*1000).toDate()
                            }

                            let dateString = date.getHours() + " : " + date.getMinutes() + " " + date.toDateString();
                

                            return <JobModule status={project.status} author={project.author} handleStates={this.props.handleStates} openUser={(id) => {this.state.profileViewer.handleOpen(id)}} date={dateString} addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.state.drawerJob.handleOpen(project.id)}} />
                        }):this.state.size === null?<div className="spinner-border"></div>:<div className="">No projects found</div>}

                           {this.state.projects.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={(e) => {
                               e.preventDefault();
                             
                               if(this.state.searchBar === false){
                               if(this.state.skills.exclusive === true){
                                   this.reloadProjectsExclusive(this.state.pageSize.value, "skillsExclusive",this.state.skills.skillsSelected.value, true)
                               }else {
                                   this.reloadProjectsFixed(this.state.pageSize.value, "skills",this.state.skills.skillsSelected.value, true)
                               }
                            }else {
                                this.specificSearch(this.state.queryString, true)
                            }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                        </div>
                        <div className="col-lg-4 text-left">
                          
                        </div>
                    </div>
                    </div>
                    }
 
              
                </div>
                
            </div>
        )
    }
}