import React from "react";
import "./myProjects.css";
import Navbar from "../../navbar";
import firebase from "../../../firebaseSetUp";
import logo from "../../../res/Graphics/main_logo.png";
import TODO from "../drawerJob/TO-DO";
import autocomplete from "../../../utils/autocomplete";
import { Button, Position, Toast, Toaster, Classes, Slider} from "@blueprintjs/core";
import MyProjectLoading from "../../loading/myProjectLoading";
import checkCriteria from "../../../utils/checkCriteria";
import CreateProject from "../createProject";
import DrawerJob from "../drawerJob";
import ContractDrawer from "../contractDrawer";
import ProposalsViewer from "../proposalViewer";
import LoadingSpinner from "../../loading/loadingSpinner"
import JobModule from "../home/jobModule";
import Chat from "../chat";
import InboxMessages from "../InboxMessages";
import $ from "jquery";
import ProposalsList from "../proposalsList";
import ProfileViewer from "../profileViewer";
import HelpDrawer from "../helpDrawer";

import InvitationDrawer from "../invitationDrawer";

export default class MyProjects extends React.Component {
    constructor(props){
        super(props);

        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;
        this.updateUser = this.updateUser.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
        
        this.state = {
            contracts:[],
            isLoading:false,
            chat:{
                payload:null
            },
            proposalsUnread:0,
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
            lastSeem:{},
            loadMore:false,
            searchBar:false,
            pending:false,
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
            user:null,
            toasts: [ /* IToastProps[] */ ],
            queryString:"",
            currentFilter: () => { this.findMyProjects("involved",this.state.pageSize.value)},
            pageSize:{
                min:4,
                max:12,
                value:15
            },
            inbox:{
                count:0,
                elements:[]
            },
            projects:[],
            size:null,
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

    specificSearch = (string, page) => {
        if(this._mounted){
            this.setState({
                pending:true,
                searchBar:true
            })
        }
        if(page !== true){
           if(this._mounted){
               this.setState({
                   size:null,
                   projects:[]
               })
           }
        }
        let lastSeem = this.state.lastSeem;
        let ref = firebase.firestore().collection("projects").where("keywords","array-contains",string.toLowerCase()).orderBy("created","desc")
        if(page){
            ref = ref.startAfter(lastSeem).limit(this.state.pageSize.value)
        }else {
            ref = ref.limit(this.state.pageSize.value)
        }

        ref.get()
        .then(snapshot => {
            let projects =[]
            if(!snapshot.empty){
               snapshot.forEach(doc => {
                   if(doc.data().involved.includes(firebase.auth().currentUser.email)){
                   projects.push(doc.data())
                   }
               })

               let size = snapshot.size

               if(this._mounted){
                  
                   this.setState({
                       projects:projects,
                       loadMore:projects.length < this.state.pageSize.value?false:true,
                       pending:false,
                       size:size
                   })
               }
            }else {
                if(this._mounted){
                   
                    this.setState({
                        pending:false,
                        loadMore:false,
                        size:0,
                        projects:[],
                    })
                }
            }
        })
        .catch(e => {
            console.log(e);
            if(this._mounted){
                this.setState({
                    pending:false
                })
            }
        })
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

    findMyProjects = (arr,limit,page, field,element) => {

        if(this._mounted){
            this.setState({
                pending:true,
                searchBar:false
            })
        }

        if(page !== true){
            this.setState({
                projects:[],
                size:null
            })
        }

            let ref2 = firebase.firestore().collection("projects");
            let lastSeem = this.state.lastSeem

            if(arr){
                ref2 =ref2.where(arr,"array-contains",firebase.auth().currentUser.email)
            }
            if(field){
                ref2 =ref2.where(field,"==",element)
            }

            ref2 = ref2.orderBy("created","desc")
            //ref2 = ref2.orderBy("created","desc")
            if(page){
                ref2 = ref2.startAfter(lastSeem).limit(limit).get()
            }else{
                    ref2 = ref2.limit(limit).get()
            }

            ref2.then(snapshot2 => {
        
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
                    loadMore:size < this.state.pageSize.value?false:true,
                    lastSeem:snapshot2.docs[snapshot2.docs.length - 1],
                    pending:false
                })
            }
            }else {
                if(this._mounted){
                    this.setState({
                        pending:false,
                        size:0,
                        loadMore:false
                    })
                }
            }
            
                })
                .catch(e => {
                    console.log(e)
                    if(this._mounted){
                        this.setState({
                            pending:false,
                            loadMore:false
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
           this.inboxListener = firebase.firestore().collection("users").doc(id).collection("inbox").orderBy("sent","desc").onSnapshot(messages => {
               
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
               
         
                return {
                user:[doc.data()],
                }
            })
        }
           
        })
        .catch(e => {
            this.addToast("Ohoh something went wrong :(");
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
    }

    async clearSkill(index){
        if(this._mounted){
        await this.setState(state => {
           let skills = state.skills.skillsSelected.value;
           skills.splice(index,1)
           let base = state.skills;
           let skillsObj = {value:skills, criteria:this.state.skills.skillsSelected.criteria}
           base.skills = skillsObj;
           return({skills:base, projects:[], projectsId:[]});
         })
        }
 
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
           if(this._mounted){
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
        }
 
        // this.reloadProjects(this.state.pageSize.value,"skills", this.state.skills.skillsSelected.value);
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

    componentDidMount(){
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

        this._mounted = true;
        firebase.auth().onAuthStateChanged(async(user) => {
            if (user) {
                this.uid = user.uid
              // User is signed in.
             
             this.updateUser(user.uid)
            this.findMyProjects("involved",this.state.pageSize.value)
              
              // ...
            } else {
              // User is signed out.
             
              this.props.handleStates(0);
              // ...
            }
          });
    }

    toggleLoading =() => {
        if(this._mounted){
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }
    }

    handleCloseDrawerJob = () => {
        if(this._mounted){
        this.setState({isOpenDrawerJob:false,idProject:"no-set",action:""})
        }
    }

    handleCloseProposalViewer = () => {
        if(this._mounted){
        this.setState(state => {
            let base = state.proposalsViewer
            base.isOpen = false;
            base.projectId = "";
            base.proposalId = "";
            return {proposalsViewer:base}
        })
    }
    }
   

    addToast = (message) => {
        if(this._mounted){
        this.toaster.show({ message: message});
        }
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
        this.setState(state => {
            let base = state.chat
            base.payload = id;

            return {
                chat:base
            }
        })
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
                {this.state.isLoading === true?<LoadingSpinner />:null}
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
                            onClick:() => {this.props.handleStates(4)},
                            key:2
                        },
                        {
                            type:"link",
                            text:"Search Projects",
                            icon:"public",
                            href:"",
                            state:"",
                            onClick:() => { this.props.handleStates(1)},
                            key:3
                        },
                        {
                            type:"link",
                            text:"Payments",
                            href:"",
                            state:"",
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
                            state:"",
                            onClick:() => {},
                            key:5,
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Profile",
                                    icon:"power_settings_new",
                                    onClick:() => {this.props.handleStates(3, firebase.auth().currentUser.uid)},
                                    state:"",
                                    key:1
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
                     <div style={{zIndex:"9999999",position:"relative"}}>
                     {this.state.proposalsList.isOpen === true?  <ProposalsList openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} addToast={this.addToast} isOpen={this.state.proposalsList.isOpen} handleClose={this.state.proposalsList.handleClose} />:null}
                    <Chat handleStates={this.props.handleStates} addToast={this.addToast}  payload={this.state.chat.payload} resetPayload={this.resetPayload} addToast={this.addToast} />
                       </div>
                  <div id="portalContainer" className="text-left">

                  <HelpDrawer isOpen={this.state.helpDrawer.isOpen} handleClose={this.state.helpDrawer.handleClose} />
                  {this.state.invitationDrawer.isOpen? <InvitationDrawer addToast={this.addToast} openUser={this.state.profileViewer.handleOpen} id={this.state.invitationDrawer.id} isOpen={this.state.invitationDrawer.isOpen} handleClose={this.state.invitationDrawer.handleClose} />:null}
                  {this.state.profileViewer.isOpen === true? <ProfileViewer openUser={this.state.profileViewer.handleOpen} userId={this.state.profileViewer.userId} isOpen={this.state.profileViewer.isOpen} handleClose={this.state.profileViewer.handleClose} />:null}
                      <ContractDrawer openUser={this.state.profileViewer.handleOpen} openContract={(type, id) => {this.handleInboxEvent({type:type, id:id})}} isOpen={this.state.contractDrawer.isOpen} handleClose={this.state.contractDrawer.handleClose} addToast={this.addToast} handleStates={this.props.handleStates} />
                  <ContractDrawer openContract={(type, id) => {this.handleInboxEvent({type:type, id:id})}} isOpen={this.state.contractDrawer.isOpen} handleClose={this.state.contractDrawer.handleClose} addToast={this.addToast} handleStates={this.props.handleStates} />
                  {this.state.drawerJob.projectID === ""?null:<TODO addToast={this.addToast} isOpen={this.state.TODO.isOpen} projectID={this.state.drawerJob.projectID} handleClose={this.state.TODO.handelClose} />}
                  <InboxMessages handleAction={(e) => {this.handleInboxEvent(e)}} handleClose={this.state.inboxDrawer.handleClose} isOpen={this.state.inboxDrawer.isOpen} />
                   {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob openUser={this.state.profileViewer.handleOpen} editProject={this.editProject} openTODO={() =>{this.state.TODO.handleOpen()}} providePayloadToChat={this.providePayloadToChat} handleStates={this.props.handleStates} openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={() => {this.state.drawerJob.handleClose(); this.state.proposalsList.handleClose();}}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                   {this.state.createProject.isOpen ? <CreateProject id={this.state.createProject.id} mode={this.state.createProject.mode} isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/> : null}
                  </div>
                    
                
   
                        <div className="col-lg-8" id="top">
                        <h4 className="mt-3" style={{fontWeight:700}}>My Projects</h4>

                        <div className="input-group mb-3 mt-3 mx-auto px-3">
                          <input type="text" className="form-control" placeholder="Search" onChange={async(e) => {await this.setState({queryString:e.target.value});}}/>
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="button" onClick={() => {this.specificSearch(this.state.queryString)}}>Search</button> 
                         </div>
                        </div>
                    <div className="form-group mx-auto mt-4 " style={{width:"300px"}} style={{display:"none"}}> 
                                <label>Page Size</label>
                                <Slider min={this.state.pageSize.min} max={this.state.pageSize.max} value={this.state.pageSize.value}  onChange={async(e) => {await this.setState(state => {
                                    let pageSize = state.pageSize;
                                    pageSize.value = e;
                                    return ({pageSize:pageSize});
                                });this.state.currentFilter() }}  />
                            </div>

                        <div className="container-fluid mb-4">
                        
                        <ul className="nav nav-tabs mt-3">
                             <li className="nav-item ml-auto">
                               <a className="nav-link active" data-toggle="pill" onClick={()=> {let callback = () => { this.findMyProjects("involved",this.state.pageSize.value)}; callback(); this.setState({currentFilter:callback})}} href="#all">All</a>
                            </li>
                            <li className="nav-item">
                               <a className="nav-link" data-toggle="pill" onClick={()=> {let callback =() => this.findMyProjects("involved",this.state.pageSize.value,false,"status","hiring"); callback(); this.setState({currentFilter:callback})}} href="#createdByMe">Hiring</a>
                            </li>
                            <li className="nav-item">
                               <a className="nav-link" data-toggle="pill" onClick={()=> {let callback =() =>this.findMyProjects("involved",this.state.pageSize.value,false,"status","In Development"); callback(); this.setState({currentFilter:callback})}} href="#inDevelopment">In Development</a>
                            </li>
                            <li className="nav-item">
                               <a className="nav-link" data-toggle="pill" onClick={()=> {let callback = () =>this.findMyProjects("involved",this.state.pageSize.value,false,"status","Completed"); callback(); this.setState({currentFilter:callback})}} href="#completed">Completed</a>
                            </li>
                            <li className="nav-item">
                               <a className="nav-link" data-toggle="pill" onClick={()=> {let callback =() =>this.findMyProjects("involved",this.state.pageSize.value, false,"status","Cancelled"); callback(); this.setState({currentFilter:callback})}} href="#applied">Cancelled</a>
                           </li>
                           <li className="nav-item mr-auto">
                               <a className="nav-link" data-toggle="pill" onClick={()=> {let callback = () =>this.findMyProjects("references",this.state.pageSize.value); callback(); this.setState({currentFilter:callback})}} href="#archived">Favorites</a>
                          </li>
                        </ul>


                        <div className="tab-content">
                               <div className="tab-pane container active" id="all">

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
                                    key:1
                                },
                                {
                                    text:project.budget,
                                    icon:"attach_money",
                                    key:2
                                },
                                {
                                    text:project.applicants?project.applicants.length:0,
                                    icon:"drafts",
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
                                },
                            ]

                            let date;
                            
                            try {
                            date = project.created.toDate()
                            
                            }catch(e){
                            
                                date = firebase.firestore.Timestamp.fromMillis((project.created.seconds !== undefined ?project.created.seconds:project.created._seconds)*1000).toDate().toDateString()
                            }

                            let dateString = date.getHours() + " : " + date.getMinutes() + " " + date.toDateString();

                            return <JobModule openUser={(id) => {this.state.profileViewer.handleOpen(id)}} status={project.status} author={project.author} handleStates={this.props.handleStates} date={dateString} addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.state.drawerJob.handleOpen(project.id)}} />
                        }):this.state.size === null?<div className="spinner-border mt-3 mb-5"></div>:<div className="mt-3 mb-5">No projects found</div>}

                             {this.state.projects.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                               
                                   this.findMyProjects("involved", this.state.pageSize.value,true)
                               
                            }else {
                                this.specificSearch(this.state.queryString, true)
                            }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                               </div>

                               <div className="tab-pane container fade" id="createdByMe">

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
                                    key:1
                                },
                                {
                                    text:project.budget,
                                    icon:"attach_money",
                                    key:2
                                },
                                {
                                    text:project.applicants?project.applicants.length:0,
                                    icon:"drafts",
                                    key:3
                                },
                                {
                                    text:"Payment Verified",
                                    icon:"check_circle",
                                    key:4
                                },
                                {
                                    text:project.country,
                                    icon:"assistant_photo",
                                    key:5
                                },
                            ]

                            let date;
                            
                            try {
                            date = project.created.toDate()
                            
                            }catch(e){
                            
                                date = firebase.firestore.Timestamp.fromMillis((project.created.seconds !== undefined ?project.created.seconds:project.created._seconds)*1000).toDate().toDateString()
                            }

                            let dateString = date.getHours() + " : " + date.getMinutes() + " " + date.toDateString();

                            return <JobModule openUser={(id) => {this.state.profileViewer.handleOpen(id)}} status={project.status} author={project.author} handleStates={this.props.handleStates} date={dateString} addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.state.drawerJob.handleOpen(project.id)}} />
                        }):this.state.size === null?<div className="spinner-border mt-3 mb-5"></div>:<div className="mt-3 mb-5">No projects found</div>}

                        {this.state.projects.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                                e.preventDefault();
                             await this.setState(state => ({
                               currentPage:(state.currentPage + 1)
                               }))
                             if(this.state.searchBar === false){
                                   this.findMyProjects("involved", this.state.pageSize.value, true, "author",firebase.auth().currentUser.uid)
                             
                             }else {
                           this.specificSearch(this.state.queryString, true)
                           }
    
 }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
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
                                    icon:"attach_money",
                                    key:2
                                },
                                {
                                    text:project.applicants?project.applicants.length:0,
                                    icon:"drafts",
                                    key:3
                                },
                                {
                                    text:"Payment Verified",
                                    icon:"check_circle",
                                    key:4
                                },
                                {
                                    text:project.country,
                                    icon:"assistant_photo",
                                    key:5
                                },
                            ]

                            let date;
                            
                            try {
                            date = project.created.toDate()
                            
                            }catch(e){
                            
                                date = firebase.firestore.Timestamp.fromMillis((project.created.seconds !== undefined ?project.created.seconds:project.created._seconds)*1000).toDate().toDateString()
                            }

                            let dateString = date.getHours() + " : " + date.getMinutes() + " " + date.toDateString();

                            return <JobModule openUser={(id) => {this.state.profileViewer.handleOpen(id)}} status={project.status} author={project.author} handleStates={this.props.handleStates} date={dateString} addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.state.drawerJob.handleOpen(project.id)}} />
                        }):this.state.size === null?<div className="spinner-border mt-3 mb-5"></div>:<div className="mt-3 mb-5">No projects found</div>}
                            

                            {this.state.projects.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                              
                                   this.findMyProjects("involved", this.state.pageSize.value,true, "status","In Development")
                               
                            }else {
                                this.specificSearch(this.state.queryString, true)
                            }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                               </div>
                               <div className="tab-pane container fade" id="completed">

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
                                    key:1
                                },
                                {
                                    text:project.budget,
                                    icon:"attach_money",
                                    key:2
                                },
                                {
                                    text:project.applicants?project.applicants.length:0,
                                    icon:"drafts",
                                    key:3
                                },
                                {
                                    text:"Payment Verified",
                                    icon:"check_circle",
                                    key:4
                                },
                                {
                                    text:project.country,
                                    icon:"assistant_photo",
                                    key:5
                                },
                            ]

                            let date;
                            
                            try {
                            date = project.created.toDate()
                            
                            }catch(e){
                            
                                date = firebase.firestore.Timestamp.fromMillis((project.created.seconds !== undefined ?project.created.seconds:project.created._seconds)*1000).toDate().toDateString()
                            }

                            let dateString = date.getHours() + " : " + date.getMinutes() + " " + date.toDateString();

                            return <JobModule openUser={(id) => {this.state.profileViewer.handleOpen(id)}} status={project.status} author={project.author} handleStates={this.props.handleStates} date={dateString} addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.state.drawerJob.handleOpen(project.id)}} />
                        }):this.state.size === null?<div className="spinner-border mt-3 mb-5"></div>:<div className="mt-3 mb-5">No projects found</div>}

                             {this.state.projects.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                             
                                   this.findMyProjects("involved", this.state.pageSize.value,true, "status","Completed")
                               
                            }else {
                                this.specificSearch(this.state.queryString, true)
                            }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null} 
                               </div>


                               <div className="tab-pane container" id="applied">

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
                                    key:1
                                },
                                {
                                    text:project.budget,
                                    icon:"attach_money",
                                    key:2
                                },
                                {
                                    text:project.applicants?project.applicants.length:0,
                                    icon:"drafts",
                                    key:3
                                },
                                {
                                    text:"Payment Verified",
                                    icon:"check_circle",
                                    key:4
                                },
                                {
                                    text:project.country,
                                    icon:"assistant_photo",
                                    key:5
                                },
                              
                            ]

                            let date;
                            
                            try {
                            date = project.created.toDate()
                            
                            }catch(e){
                            
                                date = firebase.firestore.Timestamp.fromMillis((project.created.seconds !== undefined ?project.created.seconds:project.created._seconds)*1000).toDate().toDateString()
                            }

                            let dateString = date.getHours() + " : " + date.getMinutes() + " " + date.toDateString();

                            return <JobModule openUser={(id) => {this.state.profileViewer.handleOpen(id)}} status={project.status} author={project.author} handleStates={this.props.handleStates} date={dateString} addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.state.drawerJob.handleOpen(project.id)}} />
                        }):this.state.size === null?<div className="spinner-border mt-3 mb-5"></div>:<div className="my-3">No projects found</div>}

                           {this.state.projects.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                            
                                   this.findMyProjects("applicants", this.state.pageSize.value,true)
                               
                            }else {
                                this.specificSearch(this.state.queryString, true)
                            }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                               </div>

                               <div className="tab-pane container" id="archived">

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
                                    key:1
                                },
                                {
                                    text:project.budget,
                                    icon:"attach_money",
                                    key:2
                                },
                                {
                                    text:project.applicants?project.applicants.length:0,
                                    icon:"drafts",
                                    key:3
                                },
                                {
                                    text:"Payment Verified",
                                    icon:"check_circle",
                                    key:4
                                },
                                {
                                    text:project.country,
                                    icon:"assistant_photo",
                                    key:5
                                },
                               
                            ]
                            let date;
                            
                            try {
                            date = project.created.toDate()
                            
                            }catch(e){
                            
                                date = firebase.firestore.Timestamp.fromMillis((project.created.seconds !== undefined ?project.created.seconds:project.created._seconds)*1000).toDate().toDateString()
                            }

                            let dateString = date.getHours() + " : " + date.getMinutes() + " " + date.toDateString();

                            return <JobModule openUser={(id) => {this.state.profileViewer.handleOpen(id)}} status={project.status} author={project.author} handleStates={this.props.handleStates} date={dateString} addToast={this.addToast} id={project.id} isSaved={referencesCheck} toggleLoading={this.toggleLoading} key={index} title={title} description={description} skills={skillsObj} specs={specs} onClick={() => {this.state.drawerJob.handleOpen(project.id)}} />
                        }):this.state.size === null?<div className="spinner-border mt-3 mb-5"></div>:<div className="my-3">No projects found</div>}

                           {this.state.projects.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                             
                                   this.findMyProjects("references", this.state.pageSize.value,true)
                               
                            }else {
                                this.specificSearch(this.state.queryString, true)
                            }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                               </div>
                         </div>
                         
                        </div>
                    </div>
                    <div className="col-lg-4 text-left">

              
                    </div>
                </div>}
           
            </div>
        )
    }
}