import React from "react";
import "./searchStaff.css";
import SearchStaffLoading from "../../loading/searchStaffLoading";
import firebase from "../../../firebaseSetUp";
import LoadingSpinner from "../../loading/loadingSpinner";
import Navbar from "../../navbar";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer} from "@blueprintjs/core";
import CreateProject from "../createProject";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import logo from "../../../res/Graphics/main_logo.png";
import CVContainer from "./CVContainer";
import ProposalsViewer from "../proposalViewer";
import DrawerJob from "../drawerJob";
import InboxMessages from "../InboxMessages";
import Chat from "../chat";
import checkCriteria from "../../../utils/checkCriteria";
import StaffViewer from "../profile/staffViewer";
import TODO from "../drawerJob/TO-DO";
import ContractDrawer from "../contractDrawer";
import MVviewer from "./m_n_v_viewer";
import ProposalsList from "../proposalsList";
import ProfileViewer from "../profileViewer";
import HelpDrawer from "../helpDrawer";
import InvitationDrawer from "../invitationDrawer";




export default class SearchStaff extends React.Component {
    constructor(props){
        super(props);
        this.checkCriteria = checkCriteria;
        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);

        this.state = {
            contracts:[],
            user:null,
            pending:false,
            lastSeemUnion:[],
            loadMore:true,
            lastSeem:{},
            chat:{
                payload:null
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
            MVviewer:{
                isOpen:false,
                data:"",
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.MVviewer;
                            base.isOpen = false;

                            return {
                                MVviewer:base
                            }
                        })
                    }
                },
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.MVviewer;
                            base.isOpen = true;

                            return {
                                MVviewer:base
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
            size:null,
            toasts: [ /* IToastProps[] */ ],
            CVs:[],
            type:"",
            queryString:"",
            inbox:{
                count:0,
                elements:[]
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
            staffViewer:{
                isOpen:false,
                data:null,
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.staffViewer;
                            base.isOpen = false;
                            return {
                                staffViewer:base
                            }
                        })
                    }
                },
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.staffViewer;
                            base.isOpen = true;

                            return {
                                staffViewer:base
                            }
                        })
                    }
                }
            },
            searchBar:false,
            skills:{
                skillsSelected:{value:[], criteria:{type:"array", min:1, max:5}},
                skillsFetched:[],
                exclusive:false,
                currentPage:0
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
            size:null,
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
            },
            pageSize:{
                min:6,
                max:12,
                value:15
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
        }else if(action.type === "see more"){
            this.state.inboxDrawer.handleOpen()
        }else if (action.type === "Invitation"){
            this.state.invitationDrawer.handleOpen(action.id)
        }
    }
    }

    updateUser = async(id) =>{
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

                
                return {
                user:[doc.data()],
                
            }
            })
        }
           
        })
        .catch(e => {
            this.addToast("Ohoh something went wrong :(")
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

      }else {
        this.addToast("You cannot select two repeated skills")
      }

      this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,this.state.type,this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,this.state.type,this.state.skills.skillsSelected.value)
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

         this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,this.state.type,this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,this.state.type,this.state.skills.skillsSelected.value)
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
                this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,this.state.type,this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,this.state.type,this.state.skills.skillsSelected.value)
                
               
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

      fetchCVsUnion = (limit, type, arr,page,index,sizeAcum,dictionary,projects, ids, acumDeficit, newLastSeem) => {
         
        this.setState({
            pending:true,
            searchBar:false,
            loadMore:true
        })

        if(page === undefined){
            if(this._mounted){
                this.setState({
                    CVs:[],
                    size:null
                })
            }
        }
        let newIndex = index !== undefined?index:0;

            let currentIds = ids !== undefined?ids:[];
            
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
    
            let ref = firebase.firestore().collection("CVs");
    
            if(arr.length > 0){
            ref= ref.where("skills","array-contains",arr[newIndex])
            }
    
            if(type === "personal"){
                ref= ref.where("type","==","personal")
              }else if(type === "company"){
                ref = ref.where("type","==","company")
              }else if(type === "machines&vehicles"){
                ref = ref.where("type","==","machines&vehicles")
            }
    
    
            let currentLimit = 0;
            
    
            if(index !== (arr.length - 1)){
    
                if(arr.length > 0){
                currentLimit = Math.ceil(Number(limit)/arr.length);
                
                }else {
                    currentLimit= 6;
                }
                
                }else {
        
                    currentLimit = (Number(limit) - (Math.ceil(limit/arr.length)*(arr.length- 1)-acumDeficit));
                    if(currentLimit < 1 || currentLimit < 0){
                        currentLimit = 1
                    }
                    currentLimit = currentLimit === 0?6:currentLimit;
                    
            }
    
            if(page === true){
            ref = ref.startAfter(lastSeem).limit(currentLimit);
            }else {
                ref = ref.limit(currentLimit); 
            }
            ref.get()
            .then(snapshot2 => {

                let currentSize = snapshot2.size;
    
             let size = sizeAcum !== undefined?sizeAcum + currentSize:currentSize;
             let arrOfLastSeem = newLastSeem === undefined?[]:newLastSeem
                arrOfLastSeem.push(snapshot2.docs[snapshot2.docs.length - 1])
                snapshot2.forEach(document => {
                    if(!(currentIds.includes(document.data().id))){
                        currentSize++;
                        currentIds.push(document.data().id);
                    }
                })
               
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
                        CVs:this.state.CVs.concat(newProjects),
                        size:size === 0?null:size,
                        searchBar:false,
                        lastSeemUnion:arrOfLastSeem,
                        pending:false,
                        loadMore:size < this.state.pageSize.value?false:true
                    })
                }
                
                }else {
                    newIndex++;
                    this.fetchCVsUnion(limit,type,arr,page,newIndex,size,newDictionary,newProjects,currentIds,newDeficit ,arrOfLastSeem);
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
    
      fetchCVsExclusive = (limit,type,arr,page) => {
          if(this._mounted){
              this.setState({
                  searchBar:false,
                  pending:true
              })
          }
        if(page === undefined){
          if(this._mounted){
              this.setState({
                  CVs:[],
                  size:null
              })
          }
        }
      
     
            let lastSeem = this.state.lastSeem
            let ref2  = firebase.firestore().collection("CVs")
            //ref2 = ref2.orderBy("created","desc")
            
           
            for(let i= 0; i < arr.length; i ++){
                if(arr.length > 0){
                ref2 = ref2.where(`${"skillsExclusive"}.${arr[i]}`,"==",true)
                }
            }

            if(type === "personal"){
              ref2= ref2.where("type","==","personal")
            }else if(type === "company"){
              ref2 = ref2.where("type","==","company")
            }else if(type === "machines&vehicles"){
                ref2 = ref2.where("type","==","machines&vehicles")
            }
        

    
            if(page !== undefined && page !== "undefined"){
            ref2 = ref2.startAfter(lastSeem).limit(Number(limit)).get()
            }else{
                ref2 = ref2.limit(Number(limit)).get()
            }
            ref2.then(snapshot2 => {
             let size = snapshot2.size
            let projects = [];
            
            if(!(size > 0)){
                size = null
            }
           
            snapshot2.forEach(doc => {
             
                projects.push(doc.data())
            })

            if(!snapshot2.empty){
        if(this._mounted){
            
            this.setState({
                CVs:this.state.CVs.concat(projects),
                size:size,
                loadMore:size < this.state.pageSize.value?false:true,
                lastSeem:snapshot2.docs[snapshot2.docs.length - 1],
                pending:false,
                loadMore:size < this.state.pageSize.value?false:true
            })
        }
        }else {
            if(this._mounted){
                this.setState({
                    pending:false,
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

    componentWillUnmount(){
        this._mounted = false;

        $("a").off("click");
    }

    componentDidMount(){

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
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              this.updateUser(user.uid)
              if(this.state.skills.exclusive){
                  this.fetchCVsExclusive(this.state.pageSize.value,"",this.state.skills.skillsSelected.value )
              }else {
                this.fetchCVsUnion(this.state.pageSize.value,"",this.state.skills.skillsSelected.value )
              }
              this.uid = user.uid
              // ...
            } else {
              // User is signed out.
              
              this.props.handleStates(0)

              
              // ...
            }
          });

          
    
    }

    markAsRead = async() =>{

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

    specificSearchFixed= (string, page,type) => {
        if(this._mounted){
            this.setState({
                pending:true,
                searchBar:true
            })
        }
        if(page === undefined){
            if(this._mounted){
                this.setState({
                    CVs:[],
                    size:null
                })
            }
        }

        
        
            let lastSeem;
            lastSeem = this.state.lastSeem
            let ref2 = firebase.firestore().collection("CVs").where("keywords","array-contains",string.toLowerCase())

            if(type){
                if(type ==="personal"){
                    ref2 = ref2.where("type","==","personal");
                }else if(type === "company"){
                    ref2 = ref2.where("type","==","company")
                }else if(type === "machines&vehicles"){
                    ref2 = ref2.where("type","==","machines&vehicles")
                }
            }
            if(page === true){
                ref2 = ref2.startAfter(lastSeem).limit(Number(this.state.pageSize.value));
            }else {
                ref2 =ref2.limit(Number(this.state.pageSize.value));
            }
            ref2.get()
            .then(snap2 => {
                let arr = []
                snap2.forEach(doc => {
                    arr.push(doc.data())
                })
                let size = snap2.size

            
              if(this._mounted){
                    this.setState({
                        CVs:this.state.CVs.concat(arr),
                        size:size,
                        pending:false,
                        loadMore:size < this.state.pageSize.value?false:true,
                        lastSeem:snap2.docs[snap2.docs.length - 1]
                    })
                }
                
            })
            .catch(e => {
                if(this._mounted){
              this.setState({
                CVs:[],
                size:0,
                pending:false
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
        this.setState(state => {
            let base = state.chat
            base.payload = id;

            return {
                chat:base
            }
        })
    }

    seeStaff= (data) => {
        if(this._mounted){
            this.setState(state => {
                let base = state.staffViewer;
                base.isOpen = true;
                base.data= data;

                return {
                    staffViewer:base
                }
            })
        }
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
                            state:"active",
                            onClick:() => {},
                            icon:"search",
                            key:2
                        },
                        {
                            type:"link",
                            text:"Search Projects",
                            href:"",
                            state:"",
                            onClick:() => { this.props.handleStates(1)},
                            icon:"public",
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
                            type:"link",
                            text:"Proposals",
                            href:"",
                            onClick:() => {this.state.proposalsList.handleOpen()},
                            icon:"list",
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
                }/>
                {this.state.user === null?<SearchStaffLoading/>:
                
                <div className="container-fluid pt-4 pb-4" id="top">
                    <div style={{zIndex:"9999999",position:"relative"}}>
                    {this.state.proposalsList.isOpen === true?  <ProposalsList openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} addToast={this.addToast} isOpen={this.state.proposalsList.isOpen} handleClose={this.state.proposalsList.handleClose} />:null}
                    <Chat handleStates={this.props.handleStates} addToast={this.addToast} payload={this.state.chat.payload} resetPayload={this.resetPayload} addToast={this.addToast} />
                       </div>
                   <div id="portalContainer" className="text-left">
                   <HelpDrawer isOpen={this.state.helpDrawer.isOpen} handleClose={this.state.helpDrawer.handleClose} />
                   {this.state.invitationDrawer.isOpen? <InvitationDrawer addToast={this.addToast} openUser={this.state.profileViewer.handleOpen} id={this.state.invitationDrawer.id} isOpen={this.state.invitationDrawer.isOpen} handleClose={this.state.invitationDrawer.handleClose} />:null}
                   {this.state.profileViewer.isOpen === true? <ProfileViewer openUser={this.state.profileViewer.handleOpen} userId={this.state.profileViewer.userId} isOpen={this.state.profileViewer.isOpen} handleClose={this.state.profileViewer.handleClose} />:null}
                   {this.state.MVviewer.isOpen === true? <MVviewer isOpen={this.state.MVviewer.isOpen} handleClose={this.state.MVviewer.handleClose} name={this.state.MVviewer.data.name} description={this.state.MVviewer.data.description} photoURL={this.state.MVviewer.data.photoURL} />:null}
                   <ContractDrawer openUser={this.state.profileViewer.handleOpen} openContract={(type, id) => {this.handleInboxEvent({type:type, id:id})}} isOpen={this.state.contractDrawer.isOpen} handleClose={this.state.contractDrawer.handleClose} addToast={this.addToast} handleStates={this.props.handleStates} />
                   {this.state.drawerJob.projectID === ""?null:<TODO addToast={this.addToast} isOpen={this.state.TODO.isOpen} projectID={this.state.drawerJob.projectID} handleClose={this.state.TODO.handelClose} />}
                       {this.state.staffViewer.data !== null?<StaffViewer isOpen={this.state.staffViewer.isOpen} handleClose={this.state.staffViewer.handleClose} data={this.state.staffViewer.data}/>:null}
                   <InboxMessages handleAction={(e) => {this.handleInboxEvent(e)}} handleClose={this.state.inboxDrawer.handleClose} isOpen={this.state.inboxDrawer.isOpen} />
                   {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob openUser={this.state.profileViewer.handleOpen} editProject={this.editProject} openTODO={() =>{this.state.TODO.handleOpen()}} providePayloadToChat={this.providePayloadToChat} openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={this.state.drawerJob.handleClose}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                   {this.state.createProject.isOpen? <CreateProject id={this.state.createProject.id} mode={this.state.createProject.mode} isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/> :null}
                  </div>
                  <div className="container-fluid">
                        <div className="form-group" style={{display:"none"}}>
                        <Slider min={this.state.pageSize.min} max={this.state.pageSize.max} value={this.state.pageSize.value}  onChange={async(e) => {
                            await this.setState(state => {
                                    let pageSize = state.pageSize;
                                    pageSize.value = e;
                                    return ({pageSize:pageSize});
                                });
                                this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,this.state.type,this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,this.state.type,this.state.skills.skillsSelected.value)}}  />
                        </div>
                        <div className="form-group mt-2 text-left">
                        <div className="text-left">Skills</div>
                            <div className="custom-control custom-switch mt-2" onClick={(e) => {
                                 if(this._mounted){
                                     this.setState(state => {
                                         let base = state.skills;
                                         base.exclusive = !base.exclusive; 
                                         this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,"none",this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,"none",this.state.skills.skillsSelected.value)
                                         return {
                                             skills:base
                                         }
                                     })
                                 }
                             }}>
                             <input type="checkbox" className="custom-control-input" checked={this.state.skills.exclusive} onChange={()=>{}} />
                             <label className="custom-control-label">Exclusive?</label>
                             </div>

                                {this.state.skills.skillsSelected.value.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 mb-2 mr-2 btn-sm">{skill} <i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => {this.clearSkill(index)}}>clear</i></button>
                                })}
                                <div>
                                <div className="autocomplete">
                                <input autoComplete="off" style={{width:"300px"}}  ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" onChange={(e) => {
                                if(!this.setted){
                                    this.bindSkillsInput()
                                    this.setted = true;
                                }
                                }} id="skills-filter" className="form-control " required/>
                                </div>
                                </div>

                                </div>
                        </div>
                    <div className="row">
                        

                        <div className="col-sm-8">
                        
                            <div className="container">
                            <div className="form-group mx-5">
                            <div className="input-group mb-3 mt-3 mx-auto " >
                          <input type="text" className="form-control" onChange={(e) => {this.setState({queryString:e.target.value})}} placeholder="Search" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="button" onClick={() => {
                                this.setState({
                                    searchBar:true
                                })
                                this.specificSearchFixed(this.state.queryString)}}>Search</button> 
                         </div>
                        </div>
                        
                        </div> 
                        <ul className="nav nav-tabs">
                          <li className="nav-item ml-auto">

                             <a className="nav-link active bottom-rounded" data-toggle="tab" href="#home" onClick={() => {
                                 this.setState({
                                     type:"none"
                                 })
                                 this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,"none",this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,"none",this.state.skills.skillsSelected.value)}}><i className="material-icons align-middle">all_inclusive</i> All</a>
                         </li>
                         <li className="nav-item">
                           <a className="nav-link bottom-rounded" data-toggle="tab" href="#menu1" onClick={() => {
                               this.setState({
                                   type:"personal"
                               })
                               this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,"personal",this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,"personal",this.state.skills.skillsSelected.value)}}><i className="material-icons align-middle">person</i> Personal</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link bottom-rounded" data-toggle="tab" href="#menu2" onClick={() => {
                                this.setState({
                                    type:"company"
                                })
                                this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,"company",this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,"company",this.state.skills.skillsSelected.value)}}><i className="material-icons align-middle">group</i> Company</a>
                        </li>

                        <li className="nav-item mr-auto">
                            <a className="nav-link bottom-rounded" data-toggle="tab" href="#menu3" onClick={() => {
                                this.setState({
                                    type:"machines&vehicles"
                                })
                                this.state.skills.exclusive?this.fetchCVsExclusive(this.state.pageSize.value,"machines&vehicles",this.state.skills.skillsSelected.value):this.fetchCVsUnion(this.state.pageSize.value,"machines&vehicles",this.state.skills.skillsSelected.value)}}><i className="material-icons align-middle">build</i> Machines & Vehicles</a>
                        </li>
                       </ul>


                         <div className="tab-content">
                            <div className="tab-pane container active container-staff" id="home">
                            {this.state.CVs.length > 0?this.state.CVs.map((element,i) => {
                        
                            return <CVContainer openUser={() => {this.state.profileViewer.handleOpen(element.uid)}} inventory={element.inventory?element.inventory:null}  seeStaff={this.seeStaff} staff={element.staff?element.staff:null} skills={element.skills?element.skills:null} type={element.type} email={element.uemail?element.uemail:""} openCV={()=> {this.props.handleStates(3,element.uid)}} key={i} description={element.description[0]} name={element.username?element.username:""} id={element.uid} />
                        }):this.state.size !== null?<div className="">No Results</div>:<div className="spinner-border mt-3 mb-5"></div>}

                           {this.state.CVs.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                               if(this.state.skills.exclusive === true){
                                   this.fetchCVsExclusive(this.state.pageSize.value, "none",this.state.skills.skillsSelected.value, true)
                               }else {
                                   this.fetchCVsUnion(this.state.pageSize.value, "none",this.state.skills.skillsSelected.value, true)
                               }
                            }else {
                                this.specificSearchFixed(this.state.queryString, true, "none")
                            }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                            </div>
                            <div className="tab-pane container fade container-staff" id="menu1">
                            {this.state.CVs.length > 0?this.state.CVs.map((element,i) => {
                            
                            return <CVContainer openUser={() => {this.state.profileViewer.handleOpen(element.uid)}} inventory={element.inventory?element.inventory:null}  seeStaff={this.seeStaff} staff={element.staff?element.staff:null} skills={element.skills?element.skills:null} type={element.type} email={element.uemail?element.uemail:""} openCV={()=> {this.props.handleStates(3,element.uid)}} key={i} description={element.description[0]} name={element.username?element.username:""} id={element.uid} />
                        }):this.state.size !== null?<div className="">No Results</div>:<div className="spinner-border mt-3 mb-5"></div>}

                          {this.state.CVs.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                                if(this.state.skills.exclusive === true){
                                    this.fetchCVsExclusive(this.state.pageSize.value, "personal",this.state.skills.skillsSelected.value,true)
                                }else {
                                    this.fetchCVsUnion(this.state.pageSize.value, "personal",this.state.skills.skillsSelected.value, true)
                                }
                             }else {
                                 this.specificSearchFixed(this.state.queryString, true, "personal")
                             }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                            </div>
                           <div className="tab-pane container fade container-staff" id="menu2">
                           {this.state.CVs.length > 0?this.state.CVs.map((element,i) => {
                            
                            return <CVContainer openUser={() => {this.state.profileViewer.handleOpen(element.uid)}} inventory={element.inventory?element.inventory:null}  seeStaff={this.seeStaff} staff={element.staff?element.staff:null} skills={element.skills?element.skills:null} type={element.type} email={element.uemail?element.uemail:""} openCV={()=> {this.props.handleStates(3,element.uid)}} key={i} description={element.description[0]} name={element.username?element.username:""} id={element.uid} />
                        }):this.state.size !== null?<div className="">No Results</div>:<div className="spinner-border mt-3 mb-5"></div>}

                            {this.state.CVs.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                                if(this.state.skills.exclusive === true){
                                    this.fetchCVsExclusive(this.state.pageSize.value, "company",this.state.skills.skillsSelected.value, true)
                                }else {
                                    this.fetchCVsUnion(this.state.pageSize.value, "company",this.state.skills.skillsSelected.value, true)
                                }
                             }else {
                                 this.specificSearchFixed(this.state.queryString, true, "company")
                             }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                           </div>

                           <div className="tab-pane container fade container-staff" id="menu3">
                           {this.state.CVs.length > 0?this.state.CVs.map((element,i) => {
                            
                            return <CVContainer openUser={() => {this.state.profileViewer.handleOpen(element.uid)}} seeInventory={(e) => {
                                if(this._mounted){
                                    this.setState(state => {
                                        let base = state.MVviewer;
                                        base.data = e;
                                        base.isOpen = true
                                        return {
                                            MVviewer:base
                                        }
                                    })
                                }
                            }} inventory={element.inventory?element.inventory:null} seeStaff={this.seeStaff} staff={element.staff?element.staff:null} skills={element.skills?element.skills:null} type={element.type} email={element.uemail?element.uemail:""} openCV={()=> {this.props.handleStates(3,element.uid)}} key={i} description={element.description[0]} name={element.username?element.username:""} id={element.uid} />
                        }):this.state.size !== null?<div className="">No Results</div>:<div className="spinner-border mt-3 mb-5"></div>}

                            {this.state.CVs.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                               await this.setState(state => ({
                                   currentPage:(state.currentPage + 1)
                               }))
                               if(this.state.searchBar === false){
                                if(this.state.skills.exclusive === true){
                                    this.fetchCVsExclusive(this.state.pageSize.value, "machines&vehicles",this.state.skills.skillsSelected.value, true)
                                }else {
                                    this.fetchCVsUnion(this.state.pageSize.value, "machines&vehicles",this.state.skills.skillsSelected.value, true)
                                }
                             }else {
                                 this.specificSearchFixed(this.state.queryString, true, "machines&vehicles")
                             }
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                           </div>
                        </div>
                                
                            </div>
                        </div>

                        <div className="col"></div>
                    </div>
                    
                </div>
                }
            </div>
        )
    }
}