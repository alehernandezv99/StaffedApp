import React from "react";
import "./profile.css";

import Navbar from "../../navbar";
import logo from "../../../res/Graphics/main_logo_simplified_medium.png";
import firebase from "../../../firebaseSetUp";
import TODO from "../drawerJob/TO-DO";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider ,Alert, Intent} from "@blueprintjs/core";
import TextCollapse from "./textCollapse";
import EditProposalModule from "./editProposalModule";
import CVcontent from "./CVcontent";
import UploadImg from "./uploadImg";
import CreateProject from "../createProject";
import ProfileLoading from "../../loading/profileLoading";
import DrawerJob from "../drawerJob";
import ProposalsViewer from "../proposalViewer";
import InboxMessages from "../InboxMessages";
import AddCardElement from "./addCardElement";
import StaffCreator from "./staffCreator";
import StaffCard from "./staffCard";
import StaffViewer from "./staffViewer";
import LoadingSpinner from "../../loading/loadingSpinner";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";
import EditBtn from "./editBtn";
import ContractDrawer from "../contractDrawer";
import InventoryCreator from "./inventoryCreator";
import InventoryCard from "./inventoryCard";
import ProfileViewer from "../profileViewer";
import HelpDrawer from "../helpDrawer";
import KeywordsGeneration from "../../../utils/keywordsGeneration";

import Chat from "../chat";
import ProposalsList from "../proposalsList";
import UserBox from "./userBox";

import InvitationDrawer from "../invitationDrawer";

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;

        this.state = {
            inputInvitation:"",
            feedback:null,
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
            alert:{
                isOpen:false,
                text:"",
                icon:"",
                intent:Intent.WARNING,
                confirm:()=>{},
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.alert;
                            base.isOpen =false;

                            return {
                                alert:base
                            }
                        })
                    }
                },

                handelOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.alert;
                            base.isOpen =true;

                            return {
                                alert:base
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
            contracts:[],
            user:null,
            chat:{
                payload:null
            },
            inventoryCreator:{
                isOpen:false,
                mode:"create",
                id:"",
                index:"",
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.inventoryCreator;
                            base.isOpen = false

                            return {
                                inventoryCreator:base
                            }
                        })
                    }
                },
                handleOpen: () => {
                    if(this._mounted){
                        this.setState(state => {
                            let base =state.inventoryCreator;
                            base.isOpen = true

                            return {
                                inventoryCreator:base
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
            toasts: [ /* IToastProps[] */ ],
            skills:{
                skillsSelected:{value:[], criteria:{type:"array", min:1, max:5}},
                skillsFetched:[],
                isOpen:false
            },
            CV:{
                description:[],
                experience:[],
                education:[],
                portfolio:[],
                skills:[],
                expertise:[],
                contact:[],
                editable:false,
                order:[1,2,3,4,5,6]
            },
            companyCV:null,
            machines_vehicles:null,
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
            staffEdit:{
                isOpen:false,
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.staffEdit;
                            base.isOpen = true;

                            return {
                                staffEdit:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.staffEdit;
                            base.isOpen = false;

                            return {
                                staffEdit:base
                            }
                        })
                    }
                }
            },
            staffViewer:{
                isOpen:false,
                data:null,
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
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.staffViewer;
                            base.isOpen = false;
                            base.data = null
                            return {
                                staffViewer:base
                            }
                        })
                    }
                }
            },
            staffCreator:{
                isOpen:false,
                update:false,
                index:null,
                handleClose:() =>{
                    this.setState(state => {
                        let base = state.staffCreator;
                        base.isOpen = false;

                        return {
                            staffCreator:base
                        }
                        
                    })
                },

                handleOpen:(check) => {
                    this.setState(state => {
                        let base = state.staffCreator;
                        base.isOpen = true;

                        if(check === false){
                            base.update = false
                        }

                        return {
                            staffCreator:base
                        }
                    })
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
            inbox:{
                count:0,
                elements:[]
            },
            uploadImg:{
                isOpen:false,
                handleClose:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.uploadImg
                        base.isOpen = false;
                        return {uploadImg:base}
                    })
                }
                },
                handleOpen:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.uploadImg
                        base.isOpen = true;
                        return {uploadImg:base}
                    })
                }
                }
            },
            isLoading:false,
            editPanel:{
                isOpen:false,
                id:"",
                prop:"",
                type:"",
                title:"",
                content:"",
                index:0,
                handleClose:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.editPanel;
                        base.isOpen = false;
                        base.id = "";
                        return{editPanel:base}
                    })
                }
                },
                handleOpen:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.editPanel;
                        base.isOpen = true;
                        return {editPanel:base}
                    })
                }
                },
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
          return({skills:base,});
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
      }


      async clearSkill(index){
        await this.setState(state => {
           let skills = state.skills.skillsSelected.value;
           skills.splice(index,1)
           let base = state.skills;
           let skillsObj = {value:skills, criteria:this.state.skills.skillsSelected.criteria}
           base.skills = skillsObj;
           if(this._mounted){
           return({skills:base});
           }
         })
 
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

    toggleLoading = () => {
        if(this._mounted){
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }
    }

     markAsRead = async() =>{

        try {
        let refs = []
        let call = await firebase.firestore().collection("users").doc(this.state.user.uid).collection("inbox").get()
        call.forEach(ref => {
          refs.push(firebase.firestore().collection("users").doc(this.state.user.uid).collection("inbox").doc(ref.id))
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

    openEditPanel = (type,id, prop, index, title, content) => {
        this.setState(state => {
     
            let base = state.editPanel;
            base.type = type;
            base.id= id;
            base.prop = prop;
            if(index){
                base.index =index;
            }
            if(title){
                base.title = title
            }
            if(content){
                base.content= content;
            }
            return{editPanel:base}
        })
        this.state.editPanel.handleOpen()
    }

    deleteContent = (prop,index) => {
        this.toggleLoading();
     
        firebase.firestore().collection("CVs").doc(this.state.CV.id).get()
        .then(doc => {
            let arr = doc.data()[prop];
            arr.splice(index,1)
            firebase.firestore().collection("CVs").doc(this.state.CV.id).update({[prop]:arr})
            .then(() => {
                this.addToast("Element Deleted");
                this.loadCv();
                this.toggleLoading();
            })
            .catch(e => {
                this.addToast(e.message);
                this.toggleLoading();
            })
        })
        .catch(e => {
            this.addToast(e.message);
            this.toggleLoading()
        })
    
    }

    loadInbox = (id)=> {
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
              this.inboxListener =  firebase.firestore().collection("users").doc(id).collection("inbox").orderBy("sent","desc").onSnapshot(messages => {
                   
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
            })
        
    }

    loadCv = () => {
        firebase.firestore().collection("users").doc(this.props.userId).get()
        .then(async doc => {
           await this.setState({user:doc.data()});
           
               this.calculateFeedback();
           
            firebase.firestore().collection("CVs").where("uid","==",this.props.userId).where("type","==","personal").get()
        .then(snapshot => {
            if(snapshot.empty){
                if(this.props.userId === firebase.auth().currentUser.uid){
                    let id = firebase.firestore().collection("CVs").doc().id
                firebase.firestore().collection("CVs").doc(id).set({
                    id:id,
                    type:"personal",
                    uid:this.props.userId,
                    uemail:doc.data().email,
                    username:doc.data().displayName?doc.data().displayName:"",
                    keywords:KeywordsGeneration.generate(doc.data().displayName?doc.data().displayName:"").concat([""]),
                    description:[],
                    experience:[],
                    education:[],
                    portfolio:[],
                    skills:[],
                    expertise:[],
                    contact:[],
                    order:[1,2,3,4,5,6],
                    created:firebase.firestore.Timestamp.now()
                }).then(() => {
                    firebase.firestore().collection("CVs").doc(id).get()
                    .then(data => {
                        let base = data.data()
                        if(this.props.userId === firebase.auth().currentUser.uid){
                            
                            base.editable =true;
                        }
                        if(this._mounted){
                        this.setState({CV:base});
                        }
                    })
                })
            }
            }else {
                snapshot.forEach(data => {
                    let base = data.data()
                        if(this.props.userId === firebase.auth().currentUser.uid){
                            
                            base.editable =true;
                        }
                        if(this._mounted){
                        this.setState({CV:base});
                        }
                })
                this.searchCompanyCV()
                this.searchMachines_n_vehicles();
            }
        })
        })
    }

    switchPosition = (type, index) =>{
        if(type === "up"){
            if((index + 1) <= (this.state.CV.order.length - 1)){
                let helpVar = 0;
                let newArr = this.state.CV.order.slice(0);
                helpVar = newArr[index];
                newArr[index] = newArr[index + 1];
                newArr[index + 1] = helpVar;

               firebase.firestore().collection("CVs").doc(this.state.CV.id).update({order:newArr})
               .then(() => {
                   this.loadCv();
               })
               .catch(e => {
                   console.log(e.message)
               })
            }
        }else if(type === "down"){
            if((index -1) >= 0){
                let helpVar = 0;
                let newArr = this.state.CV.order.slice(0);
                helpVar = newArr[index];
                newArr[index] = newArr[index - 1];
                newArr[index - 1] = helpVar;

                this.setState(state => {
                    let base = state.CV;
                    base.order = newArr;

                    firebase.firestore().collection("CVs").doc(this.state.CV.id).update({order:newArr})
                    .then(() => {
                        this.loadCv()
                    })
                    .catch(e => console.log(e.message));
                })
            }
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

        this._mounted = true;

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

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              if(user.emailVerified === false){
                  this.addToast("Please Verify Your Email", true)
              }
              firebase.firestore().collection("contracts").where("involved","array-contains",user.uid).orderBy("created","desc").limit(6).get()
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
              this.loadCv();
              this.loadInbox(user.uid);
              this.fetchSkills();

              this.uid = user.uid
              // ...
            } else {
              // User is signed out.
              
              this.props.handleStates(0)
              // ...
            }
          });

    }

    updateSkills = () => {
        this.toggleLoading();
        firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).get()
        .then(snap => {
            let batch = firebase.firestore().batch();

            let skillsExclusive = {}
            for(let i = 0; i < this.state.skills.skillsSelected.value; i++){
                skillsExclusive[this.state.skills.skillsSelected.value[i]] = true;
            }

            snap.forEach(doc => {
                batch.update(firebase.firestore().collection("CVs").doc(doc.id), {skills:this.state.skills.skillsSelected.value, skillsExclusive:skillsExclusive})
            })

            batch.commit()
            .then(() => {
                this.addToast("Skills Updated!");
                this.toggleLoading()
                this.fetchSkills();
            })
            .catch(e => {
                this.addToast("ohoh something went wrong :(");
                this.toggleLoading();
            })
        })
        .catch(e => {
            this.addToast("ohoh something went wrong");
            this.toggleLoading();
        })
    }

    fetchSkills = () => {
        firebase.firestore().collection("CVs").where("uid","==",this.props.userId).where("type","==","personal").get()
        .then(snap => {
            let skills = []

            snap.forEach(doc => {
                skills = doc.data().skills;
            })

            if(this._mounted){
            this.setState(state => {
                let base = this.state.skills;
                base.skillsSelected.value = skills;

                return {
                    skills:base
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
        this.setState(state => {
            let base = state.chat
            base.payload = id;

            return {
                chat:base
            }
        })
    }

    componentWillUnmount(){
        this._mounted = false;

        $("a").off("click");
    }

    addMachines_n_vehicles = () => {
        this.toggleLoading();
        if(this.props.userId === firebase.auth().currentUser.uid){
            firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).where("type","==","machines&vehicles").get()
            .then(snapshot => {
                if(snapshot.empty){
                    let id = firebase.firestore().collection("CVs").doc().id;

                    firebase.firestore().collection("CVs").doc(id).set({
                        type:"machines&vehicles",
                        keywords:KeywordsGeneration.generate(firebase.auth().currentUser.email).concat(KeywordsGeneration.generate(this.state.CV.description)).concat([""]),
                        inventory:[],
                        uid:firebase.auth().currentUser.uid,
                        uemail:firebase.auth().currentUser.email,
                        id:id,
                        description:this.state.CV.description,
                        created:firebase.firestore.Timestamp.now(),
                    })
                    .then(() => {
                        this.toggleLoading()
                        this.searchMachines_n_vehicles()
                    })
                    .catch(e => {
                        this.addToast("ohoh something went wrong :(");
                        this.toggleLoading()
                    })
                }else {
                    this.toggleLoading()
                }
            })
            .catch(e => {
                this.addToast("ohoh something went wrong :(");
                        this.toggleLoading()
            })
        }
    }

    addCompanyCV = () => {
        this.toggleLoading();
        if(this.props.userId === firebase.auth().currentUser.uid){
        firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).where("type","==","company").get()
        .then(snap => {
            if(snap.empty){
                let id = firebase.firestore().collection("CVs").doc().id;

                firebase.firestore().collection("CVs").doc(id).set({
                    type:"company",
                    staff:[],
                    uid:firebase.auth().currentUser.uid,
                    keywords:KeywordsGeneration.generate(firebase.auth().currentUser.email).concat(this.state.CV.description).concat([""]),
                    uemail:firebase.auth().currentUser.email,
                    id:id,
                    description:this.state.CV.description,
                    created:firebase.firestore.Timestamp.now(),
                })
                .then(() => {
                    this.toggleLoading()
                    this.searchCompanyCV()
                })
                .catch(e => {
                    this.addToast("ohoh something went wrong :(");
                    this.toggleLoading()
                })
            }else {
                this.toggleLoading()
            }
        })
        .catch(e => {
            this.addToast("ohoh something went wrong :(");
            this.toggleLoading()
        })
    }
    }

    searchCompanyCV = () => {
        firebase.firestore().collection("CVs").where("uid","==",this.props.userId).where("type","==","company").get()
        .then(snapshot => {
            if(!snapshot.empty){
                snapshot.forEach(cv => {
                    this.setState({
                        companyCV:cv.data()
                    })
                })
                this.getCompanyStaff();
            }else {
                this.setState({
                    companyCV:0
                })
            }
        })
        .catch(e => {
            this.addToast("ohoh something went wrong :(");
        })
    }

    searchMachines_n_vehicles = () => {
        firebase.firestore().collection("CVs").where("uid","==",this.props.userId).where("type","==","machines&vehicles").get()
        .then(snapshot => {
            if(!snapshot.empty){
                snapshot.forEach(cv => {
                   
                    this.setState({
                        machines_vehicles:cv.data()
                    })
                })
            }else {
                this.setState({
                    machines_vehicles:0
                })
            }
        })
        .catch(e => {
            this.addToast("ohoh something went wrong :(");
        })
    }

    editStaff = (i) => {
        if(this._mounted){
            this.setState(state => {
                let base = state.staffCreator;
                base.update = true;
                base.index = i
                base.isOpen = true
                return {
                    staffCreator:base
                }
            })
        }
    }

    removeStaff = (i) => {
        this.toggleLoading();
        firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).where("type","==","company").get()
        .then(snap => {
            if(!snap.empty){
                snap.forEach(doc => {
                    let staff = doc.data().staff;
                    staff.splice(i,1);

                    firebase.firestore().collection("CVs").doc(doc.id).update({staff:staff})
                    .then(() => {
                        this.addToast("The item was successfully deleted");
                        this.toggleLoading();
                        this.searchCompanyCV();
                    })
                    .catch(e => {
                        this.addToast("ohoh something went wrong :(");
                        this.toggleLoading();
                    })
                })
            }else {
                this.toggleLoading()
            }
        })
        .catch(e => {
            this.addToast("ohoh something went wrong :(");
            this.toggleLoading()
        })
    }

    openStaff = async(index) => {
        if(this._mounted){
           await this.setState(state => {
                let base = state.staffViewer;
                base.data = this.state.companyCV.staff[index]

                return {
                    staffViewer:base
                }
            })
            this.state.staffViewer.handleOpen();
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

    deleteMachines_n_vehicles = (id, index) => {
        this.toggleLoading();
        
        firebase.firestore().collection("CVs").doc(id).get()
        .then(doc => {
            let data = doc.data();
            let inventory = data.inventory;
            inventory.splice(index,1);

            firebase.firestore().collection("CVs").doc(id).update({inventory:inventory})
            .then(() => {
                this.toggleLoading();
                this.addToast("Element Deleted");
                this.searchMachines_n_vehicles();
            })
            .catch(e => {
                this.addToast("Ohoh something went wrong!");
            })

        })
        .catch(e => {
            this.addToast("Ohoh something went wrong!")
            
        })
    }

    getCompanyStaff = () => {
        firebase.firestore().collection("invitations").where("from","==",firebase.auth().currentUser.uid).where("type","==","Company Staff").onSnapshot(snap => {
            let staff = [];

            snap.forEach(doc => {
                staff.push({
                    user:doc.data().to,
                    status:doc.data().status,
                    id:doc.data().id
                })
            })

            if(this._mounted){
                this.setState(state => {
                    let base = state.companyCV;
                    base.staff = staff;

                    return {
                        companyCV:base
                    }
                })
            }
        })
      
    }

    inviteEmail = () => {
        this.toggleLoading();
        if(this.state.inputInvitation !== firebase.auth().currentUser.email){
        firebase.firestore().collection("users").where("email","==",this.state.inputInvitation).get()
        .then(snap => {
            if(!snap.empty){

                let id = ""

                snap.forEach(doc => {
                    id = doc.id
                })

                firebase.firestore().collection("invitations").where("from","==",firebase.auth().currentUser.uid).where("to","==",id).where("type","==","Company Staff").get()
                .then(snap2 => {

                    if(snap2.empty){
                    snap.forEach(doc => {
                        let batch = firebase.firestore().batch();
                        let invitationID = firebase.firestore().collection("invitations").doc().id
                        batch.set(firebase.firestore().collection("invitations").doc(invitationID), {
                            id:invitationID,
                            from:firebase.auth().currentUser.uid,
                            to:doc.id,
                            created:firebase.firestore.Timestamp.now(),
                            type:"Company Staff",
                            status:"pending"
                        })
                        let inboxID = firebase.firestore().collection("users").doc(doc.id).collection("inbox").doc().id
                        batch.set(firebase.firestore().collection("users").doc(doc.id).collection("inbox").doc(inboxID), {
                            state:"unread",
                            action:{
                                id:invitationID,
                                type:"Invitation"
                            },
                            message:`The user ${firebase.auth().currentUser.email} invited you to become part of his company staff`,
                            sent:firebase.firestore.Timestamp.now(),
                            id:inboxID
                        })
                        let inboxID2 = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("inbox").doc().id
                        batch.set(firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("inbox").doc(inboxID2), {
                            state:"unread",
                            action:{
                                id:invitationID,
                                type:"Invitation"
                            },
                            message:`You invited the user ${doc.data().email} to become part of your company staff`,
                            sent:firebase.firestore.Timestamp.now(),
                            id:inboxID2
                        })
    
                        batch.commit()
                        .then(() => {
                            this.addToast("Invitation Sent!");
                            this.toggleLoading();

                            if(this._mounted){
                                this.setState({
                                    inputInvitation:""
                                })
                            }

                            
                        })
                        .catch(e => {
                            this.addToast("Ohoh something went wrong!");
                            this.toggleLoading();
                        })
                    })
                }else {
                    this.addToast("User already invited to become part of your company staff");
                    this.toggleLoading();
                }
                })
                .catch(e => {
                    this.addToast("Ohoh something went wrong!");
                    this.toggleLoading();
                })

            }else {
                this.addToast("User not exist");
                this.toggleLoading();
            }
        })
        .catch(e => {
            this.addToast("Ohoh something went wrong!");
            this.toggleLoading();
        })
    }else{
        this.addToast("You can't invite you yourself");
        this.toggleLoading()
    }
    }

    cancelInvitation = (id) => {
        this.toggleLoading();
        firebase.firestore().collection("invitations").doc(id).delete()
        .then(() => {
            this.addToast("Invitation Cancelled")
            this.toggleLoading();
        })
        .catch(e => {
            this.addToast("Ohoh something went wrong!");
            this.toggleLoading();
        })
    }

    calculateFeedback = () => {
        this.toggleLoading();

        firebase.firestore().collection("users").doc(this.props.userId).collection("reviews").get()
        .then(reviews => {
            this.toggleLoading();
            if(!reviews.empty){
                let acum1 = 0;
                let j = 0
                reviews.forEach(doc => {
                    j++
                    let review = doc.data()
                    let index = 0
                    let acum = 0
                    Object.keys(review).forEach(key => {
                        if(key === "comunication" || key === "availability" || key === "skills" ){
                            index++;
                            acum += Number(review[key]);
                        }
                    })

                    acum1 += acum/index
                })

                let average = acum1/j

                if(this._mounted){
                    this.setState({
                        feedback:Number(Number((average/5)*100).toFixed(2))
                    })
                }
            }
        })
        .catch(e => {
            this.toggleLoading();
        })
    }

    render() {
        return(
            
            <div>
                {this.state.isLoading?<LoadingSpinner/>:null}
                <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>
                <Alert icon={this.state.alert.icon} intent={this.state.alert.intent} isOpen={this.state.alert.isOpen} onConfirm={() => {this.state.alert.confirm(); this.state.alert.handleClose();}} onCancel={() =>{this.state.alert.handleClose()}} confirmButtonText="Yes" cancelButtonText="No">
                        <p>{this.state.alert.text}</p> 
                    </Alert>
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
                            state:"",
                            onClick:() => {this.props.handleStates(1)},
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
                            dataToggle:"modal",
                            dataTarget:"#createProjectPanel",
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
                            text:this.state.user === null?"Loading...":this.state.user.displayName?this.state.user.displayName:this.state.user.email,
                            href:"",
                            key:5,
                            onClick:() => {},
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Profile",
                                    key:1,
                                    onClick:() => {},
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
               <div id="portalContainer" className="text-left">
               <HelpDrawer isOpen={this.state.helpDrawer.isOpen} handleClose={this.state.helpDrawer.handleClose} />
               {this.state.invitationDrawer.isOpen? <InvitationDrawer addToast={this.addToast} openUser={this.state.profileViewer.handleOpen} id={this.state.invitationDrawer.id} isOpen={this.state.invitationDrawer.isOpen} handleClose={this.state.invitationDrawer.handleClose} />:null}
               {this.state.profileViewer.isOpen === true? <ProfileViewer openUser={this.state.profileViewer.handleOpen} userId={this.state.profileViewer.userId} isOpen={this.state.profileViewer.isOpen} handleClose={this.state.profileViewer.handleClose} />:null}
               {this.state.proposalsList.isOpen === true?  <ProposalsList openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} addToast={this.addToast} isOpen={this.state.proposalsList.isOpen} handleClose={this.state.proposalsList.handleClose} />:null}
                   {this.state.inventoryCreator.isOpen ? <InventoryCreator id={this.state.inventoryCreator.id} index={this.state.inventoryCreator.index} refresh={this.searchMachines_n_vehicles} addToast={this.addToast} isOpen={this.state.inventoryCreator.isOpen} handleClose={this.state.inventoryCreator.handleClose} mode={this.state.inventoryCreator.mode} />:null}
               <ContractDrawer openUser={this.state.profileViewer.handleOpen} openContract={(type, id) => {this.handleInboxEvent({type:type, id:id})}} isOpen={this.state.contractDrawer.isOpen} handleClose={this.state.contractDrawer.handleClose} addToast={this.addToast} handleStates={this.props.handleStates} />
               {this.state.drawerJob.projectID === ""?null:<TODO addToast={this.addToast} isOpen={this.state.TODO.isOpen} projectID={this.state.drawerJob.projectID} handleClose={this.state.TODO.handelClose} />}
                {((this.state.companyCV !== null) &&(this.props.userId === firebase.auth().currentUser.uid) && (this.state.staffCreator.isOpen))?<StaffCreator refresh={this.searchCompanyCV} update={this.state.staffCreator.update} index={this.state.staffCreator.index} addToast={this.addToast} toggleLoading={this.toggleLoading} isOpen={this.state.staffCreator.isOpen} handleClose={this.state.staffCreator.handleClose} />:null}
                {(this.state.companyCV !== null) && (this.state.staffViewer.data !== null)?<StaffViewer isOpen={this.state.staffViewer.isOpen} data={this.state.staffViewer.data} handleClose={this.state.staffViewer.handleClose} addToast={this.addToast} />:null}
               <InboxMessages handleAction={(e) => {this.handleInboxEvent(e)}} handleClose={this.state.inboxDrawer.handleClose} isOpen={this.state.inboxDrawer.isOpen} />
                   {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob openUser={this.state.profileViewer.handleOpen} editProject={this.editProject} openTODO={() =>{this.state.TODO.handleOpen()}} providePayloadToChat={this.providePayloadToChat} openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={() => {this.state.drawerJob.handleClose(); this.state.proposalsList.handleClose();}}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                    {this.state.createProject.isOpen? <CreateProject id={this.state.createProject.id} mode={this.state.createProject.mode} isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/> :null}

                    {this.state.editPanel.id !== ""?
                <EditProposalModule index={this.state.editPanel.index} title={this.state.editPanel.title} content={this.state.editPanel.content} section={this.state.editPanel.prop} callBack={() => {this.loadCv()}} isOpen={this.state.editPanel.isOpen} handleClose={this.state.editPanel.handleClose} id={this.state.editPanel.id} prop={this.state.editPanel.prop} type={this.state.editPanel.type} addToast={this.addToast}/>
                :null}
                {this.state.CV.editable === true?<UploadImg addToast={this.addToast} callback={() => {this.loadCv()}} isOpen={this.state.uploadImg.isOpen} handleClose={this.state.uploadImg.handleClose} />:null}
                  </div>

                
                <div>
                    {this.state.user === null? <ProfileLoading />:
                    <div>
                        <div style={{zIndex:"9999999",position:"relative"}}>
                    <Chat handleStates={this.props.handleStates} addToast={this.addToast} payload={this.state.chat.payload} resetPayload={this.resetPayload} addToast={this.addToast} />
                       </div>
                <div className="container-fluid text-center mt-4" id="top">
                    <div className="container mt-2">
                        <div className="container-fluid" style={{position:"relative"}}>
                   
                                    <div style={{backgroundImage:`url(${this.state.user.photoURL?this.state.user.photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"150px",
                                    height:"150px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="rounded-circle" ></div>

                        
                       {this.state.CV.editable === true? <div className="dropdown right-corner-btn">
                              <button type="button" className="dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
                                <div className="dropdown-menu dropdown-menu-right">
                                <button className="dropdown-item" onClick={() => {this.state.uploadImg.handleOpen()}}>Upload</button>
                              </div>
                             </div>:null}
                        </div>
                    </div>
                   
                            <h6 className="mt-4">{this.state.user !== null?this.state.user.displayName?this.state.user.displayName:this.state.user.email:"Loading..."}</h6>
  
                            {this.state.CV.description.length > 0?
                           <div className="container mt-4" style={{position:"relative"}}>
                            <h5 className="mt-3" ref={ref => {this.title = ref}}>{this.state.user !== null?this.state.CV.description[0].title:"Loading..."}</h5>
                            <p ref={ref => {this.text = ref}}>{this.state.CV.description[0].text}</p>

                            {this.state.CV.editable === true?<div className="dropdown right-corner-btn">
                              <button type="button" className="dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
                                <div className="dropdown-menu dropdown-menu-right">
                                <button className="dropdown-item" onClick={() => {this.openEditPanel("update",this.state.CV.id,"description",0,this.title.textContent,this.text.textContent)}}>Edit</button>
                                <button className="dropdown-item" onClick={() => {
                                    if(this._mounted){
                                        this.setState(state => {
                                            let base = state.alert;
                                            base.isOpen = true;
                                            base.confirm = () => {this.deleteContent("description",0); }
                                            base.text = "Sure you want to delete this item?"
                                            return {
                                                alert:base
                                            }
                                        })
                                    }
                                    
                                    }}>Delete</button>
                              </div>
                             </div>:null}
                            </div>
                            :this.state.CV.editable === true?<button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"description")}}>Add Description</button>:<p>No description</p>}


<div class="custom-control custom-checkbox mt-4 text-center">
    <input type="checkbox" class="custom-control-input" checked={this.state.user.publicFeedback !== null?this.state.user.publicFeedback:true} onChange={(e) => {
        if(this.state.user.publicFeedback === true){
        firebase.firestore().collection("users").doc(this.state.user.uid).update({
        publicFeedback:false
    })
    .then(() => {
        this.loadCv()
    })
}else {
    firebase.firestore().collection("users").doc(this.state.user.uid).update({
        publicFeedback:true
    })
    .then(() => {
        this.loadCv()
    })
}
    }} id="customCheck" name="example1"/>
    <label class="custom-control-label" for="customCheck">Public Feedback?</label>
    
       {this.state.user.publicFeedback !== null?this.state.feedback !== null? <div className="mt-2 text-center" style={{width:"300px", marginLeft:"50%",transform:"translate(-50%,0)"}}>
        <div className="mt-3">
            <h5 className="text-center mb-3">Rating</h5>
        <div className="progress" >
        <div className="progress-bar" style={{width:`${this.state.feedback}%`}}>{this.state.feedback?`${Number(Number(5*((this.state.feedback)/100)).toFixed(2))} / 5`:null}</div>
     </div>
     </div>
       </div>:null:(() => {firebase.firestore().collection("users").doc(this.state.user.uid).update({
           publicFeedback:true,
       });
       
       })()}
  </div>
                </div>

                <ul className="nav nav-tabs mt-3">
                    <li className="nav-item ml-auto ">
                       <a className="nav-link active remove-bottom-rounded" data-toggle="tab" href="#home"><i className="material-icons align-middle">person</i> Personal</a>
                    </li>
                    {this.state.companyCV === 0?
                    this.state.CV.editable === true?
                    <li className="nav-item mr-auto dropdown">
                         <a className="nav-link dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">add</i></a>
                          
                         <div className="dropdown-menu dropdown-menu-right">
                           <a className="dropdown-item" href="#" onClick={() => {this.addCompanyCV()}}>Create Company CV</a>
                         </div>
                         
                    </li>:<li className="nav-item "></li>:
                    ((this.state.companyCV !== 0) && (this.state.companyCV !== null))? 
                      <li className="nav-item ">
                      <a className="nav-link remove-bottom-rounded" data-toggle="tab" href="#menu1"><i className="material-icons align-middle">group</i> Company</a>
                 </li>:<li className="nav-item "></li>}

                 {this.state.machines_vehicles === 0?
                    this.state.CV.editable === true?
                    <li className="nav-item mr-auto dropdown">
                         <a className="nav-link dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">add</i></a>
                          
                         <div className="dropdown-menu dropdown-menu-right">
                           <a className="dropdown-item" href="#" onClick={() => {this.addMachines_n_vehicles()}}>Create Machines & Vehicles CV</a>
                         </div>
                         
                    </li>:<li className="nav-item mr-auto"></li>:
                    ((this.state.machines_vehicles !== 0) && (this.state.machines_vehicles !== null))? 
                      <li className="nav-item mr-auto">
                      <a className="nav-link remove-bottom-rounded" data-toggle="tab" href="#menu2"><i className="material-icons align-middle">build</i> Machines & Vehicles</a>
                 </li>:<li className="nav-item mr-auto"></li>}
                    </ul>

                <div className="tab-content">
                    <div className="tab-pane container cv-container active" id="home">
                    <div className="container-fluid"> 
                    <div className="container text-center" style={{display:"none"}}>
                        <div className="form-group mb-4" style={{position:"relative"}}>
                            <h4 className="text-center mb-2 mt-3">Skills</h4>
                                <div >
                                {this.state.skills.skillsSelected.value.map((skill, index) => {
                                  return <button type="button" key={index} className={`btn btn-custom-2 mt-2 mb-2  btn-sm mr-2`}>{skill} {this.state.skills.isOpen?<i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => { this.clearSkill(index)}}>clear</i>:""}</button>
                                })}
                                <div>

                                <div id="input-skills-profile" style={{display:"none"}}>
                                <div className="autocomplete">
                                <input autoComplete="off" ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" onClick={(e) => {
                                if(!this.setted){
                                    this.bindSkillsInput()
                                    this.setted = true;
                                }
                                }} id="skills-filter" className="form-control mx-auto" style={{width:"300px"}} required/>
                                 
                                 
                                </div>
                                <button type="button" className="btn btn-custom-1 btn-sm m-2" onClick={this.updateSkills}><i className="material-icons align-middle">create</i> Update</button>
                                 <button type="button" className="btn btn-danger btn-sm m-2" onClick={() => {
                                     $("#input-skills-profile").slideUp("fast");
                                     this.setState(state => {
                                         let base = state.skills;
                                         base.isOpen = false;
                                         return {
                                             skills:base
                                         }
                                     })
                                     }}><i className="material-icons align-middle">clear</i> Cancel</button>
                                </div>

                                </div>
 
                                </div>
                                {this.state.CV.editable === true?
                                <EditBtn btns={[{
                                    text:"Add/Remove",
                                    callback:()=> {
                                        $("#input-skills-profile").slideDown("fast");
                                        this.setState(state => {
                                            let base = state.skills;
                                            base.isOpen = true;

                                            return {
                                                skills:base
                                            }
                                        })
                                    }
                                }]} />
                           :null }
                              </div>
                              </div>

                    <div id="accordion">
                        {this.state.CV.order.map((element,index) => {
                            if(element === 1){
                                return (
                                    <div className="card mt-3" key={element}>
                                    <div className="card-header" style={{position:"relative"}}>
                                       <a className="card-link" data-toggle="collapse" href="#experience"> Experience</a>

                                       {this.state.CV.editable === true?
                                       <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                       :null}
                                        </div>
                                  <div className="collapse show" data-parent="#accordion" id="experience">
                                   {this.state.CV.experience.length > 0?this.state.CV.experience.map((element,i) => {
                                       return (
                                           <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"experience",i,element.title,element.text)}} delete={() => { 
                                            if(this._mounted){
                                                this.setState(state => {
                                                    let base = state.alert;
                                                    base.isOpen = true;
                                                    base.confirm = () => {this.deleteContent("experience",i);  }
                                                    base.text = "Sure you want to delete this item?";
                                                    base.icon ="trash";
                                                    base.intent = Intent.DANGER;
                                                    return {
                                                        alert:base
                                                    }
                                                })
                                            }
                                            
                                            }} title={element.title} text={element.text}/>
            
                                   )
                                       }):null}
                                   {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"experience");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                                </div>
            
                                </div> 
                                )
                            }

                            if(element === 2){
                                return (
                                    <div className="card mt-3" key={element}>
                        <div className="card-header" style={{position:"relative"}}>
                           <a className="card-link" data-toggle="collapse" href="#education"> Education</a>

                           {this.state.CV.editable === true?
                           <div className="btn-group btns-change-order">
                                          <button type="button" className="btn btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                        :null}
                            </div>
                        
                            <div className="collapse show" id="education">
                            {this.state.CV.education.length > 0?this.state.CV.education.map((element,i) => {
                           return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"education",i,element.title,element.text)}} delete={() => {
                                if(this._mounted){
                                    this.setState(state => {
                                        let base = state.alert;
                                        base.isOpen = true;
                                        base.confirm = () => {this.deleteContent("education",i);  }
                                        base.text = "Sure you want to delete this item?"
                                        base.icon ="trash";
                                         base.intent = Intent.DANGER;
                                        return {
                                            alert:base
                                        }
                                    })
                                }
                                
                                }} title={element.title} text={element.text}/>

                       )
                           }):null}
                       {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"education");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                        </div>
                    </div>
                                )
                            }

                            if(element === 3){
                              return(  <div className="card mt-3" key={element}>
                                  <div className="card-header" style={{position:"relative"}}>
                                    <a className="card-link" data-toggle="collapse" href="#portfolio"> Portfolio</a>

                                    {this.state.CV.editable === true?
                                    <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                    :null}
                                  </div>

                                <div className="collapse show" id="portfolio">
                                   {this.state.CV.portfolio.length > 0?this.state.CV.portfolio.map((element,i) => {
                                    return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"portfolio",i,element.title,element.text)}} delete={() => {
                                if(this._mounted){
                                    this.setState(state => {
                                        let base = state.alert;
                                        base.isOpen = true;
                                        base.confirm = () => {this.deleteContent("portfolio",i);  }
                                        base.text = "Sure you want to delete this item?";
                                        base.icon ="trash";
                                        base.intent = Intent.DANGER;
                                        return {
                                            alert:base
                                        }
                                    })
                                }
                                
                                 }} title={element.title} text={element.text}/>

                               )
                              }):null}
                               {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"portfolio");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                             </div>
                            </div>
                              )
                            }


                            if(element === 4){
                                return (
                                    <div className="card mt-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>

                                        {this.state.CV.editable === true?
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                        :null}
                                      </div>

                                    <div className="collapse show"  id="expertise">
                                       {this.state.CV.expertise.length > 0?this.state.CV.expertise.map((element,i) => {
                                      return (
                                      <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"expertise",i,element.title,element.text)}} delete={() => {
                                        if(this._mounted){
                                            this.setState(state => {
                                                let base = state.alert;
                                                base.isOpen = true;
                                                base.confirm = () => {this.deleteContent("expertise",i);   }
                                                base.text = "Sure you want to delete this item?"
                                                base.icon ="trash";
                                                base.intent = Intent.DANGER;
                                                return {
                                                    alert:base
                                                }
                                            })
                                        }
                                        
                                        }} title={element.title} text={element.text}/>

                                       )
                                    }):null}
                                   {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"expertise");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                                  </div>
                                 </div>
                                )
                            }

                            if(element === 5){
                                return (
                                    <div className="card mt-3 mb-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#contact"> Contact</a>

                                        {this.state.CV.editable === true?
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                        :null}
                                     </div>

                                    <div className="collapse show" id="contact">
                                       {this.state.CV.contact.length > 0?this.state.CV.contact.map((element,i) => {
                                      return (
                                        <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"contact",i,element.title,element.text)}} delete={() => {
                                            if(this._mounted){
                                                this.setState(state => {
                                                    let base = state.alert;
                                                    base.isOpen = true;
                                                    base.confirm = () => {this.deleteContent("contact",i);    }
                                                    base.text = "Sure you want to delete this item?"
                                                    base.icon ="trash";
                                                    base.intent = Intent.DANGER;
                                                    return {
                                                        alert:base
                                                    }
                                                })
                                            }
                                            
                                        }} title={element.title} text={element.text}/>

                                        )
                                       }):null}
                                        {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"contact");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                                        </div>
                        
                                   </div>
                                )
                            }
                        })}
                    
                </div>
              </div>
                    </div>
                    {(this.state.companyCV !== null) && (this.state.companyCV !== 0)?
                    <div className="tab-pane container cv-container fade" id="menu1">
                        <div className="form-group mt-3">

                        <div className="input-group mb-3 mt-3 mx-auto" style={{width:"600px"}}>
                <input type="text" className="form-control" value={this.state.inputInvitation} onChange={(e) => {
                    this.setState({
                        inputInvitation:e.target.value
                    })
                }} placeholder="Enter Email" />
                  <div className="input-group-append ">
                  <button className="btn btn-custom-1" type="button" onClick={() => {this.inviteEmail()}}><i className="material-icons align-middle" style={{fontSize:"15px"}}>add</i>Send invitation</button> 
               </div>
              </div>
                        </div>
                        <div className="cards-container">
                            {this.state.companyCV.staff.map((e,i) => {
                                
                                    return (
                                       <div >
                                           <div className="p-4" style={{opacity:e.status === "pending"?"0.5":"1", position:"relative"}}>
                                               {e.status === "accepted"?<EditBtn btns={[
                                                   {
                                                       text:"Remove From Staff",
                                                       callback: () => {
                                                        if(this._mounted){
                                                            this.setState(state => {
                                                                let base = state.alert;
                                                                base.isOpen = true;
                                                                base.icon ="info-sign"
                                                                base.intent = Intent.WARNING
                                                                base.text = "Sure you want to cancel this invitation?"
                                                                base.confirm = () => {this.cancelInvitation(e.id)}
         
                                                                return {
                                                                    alert:base
                                                                }
                                                            })
                                                        }
                                                    }
                                                   }
                                               ]} />:null}
                                           {e.status === "pending"? <div className="text-center">Invitation {e.status}</div>:null}
                                       <UserBox margin={"m-2"} key={i} id={e.user} openUser={() => {this.state.profileViewer.handleOpen(e.user)}} size={"50px"} addToast={this.addToast}/>
                                       </div>
                                       {e.status === "pending"?<div className="flex-container text-center p-1">
                                           <button type="button" className="btn btn-danger btn-sm" onClick={() => {
                                               if(this._mounted){
                                                   this.setState(state => {
                                                       let base = state.alert;
                                                       base.isOpen = true;
                                                       base.icon ="info-sign"
                                                       base.intent = Intent.WARNING
                                                       base.text = "Sure you want to cancel this invitation?"
                                                       base.confirm = () => {this.cancelInvitation(e.id)}

                                                       return {
                                                           alert:base
                                                       }
                                                   })
                                               }
                                           }}><i className="material-icons align-middle">clear</i> Cancel Invitation</button>
                                       </div>:null}
                                       </div>
                                    )
                               
                            } )}
                        </div>
                      
                    </div>
                    :null}

                   {(this.state.machines_vehicles!== null) && (this.state.machines_vehicles !== 0)?
                    <div className="tab-pane container cv-container fade" id="menu2">
                        <div className="cards-container">
                            {this.state.machines_vehicles.inventory.map((e,i) => {
                                
                                   
                                    return (
                                       <InventoryCard editable={this.state.CV.editable} edit={() => {
                                           if(this._mounted){
                                               this.setState(state => {
                                                   let base = state.alert;
                                                   base.text  ="Sure you want to edit this item?";
                                                   base.isOpen = true;
                                                   base.icon ="info-sign";
                                                   base.intent = Intent.WARNING
                                                   base.confirm = () => {
                                                       if(this._mounted){
                                                           this.setState(state => {
                                                               let base2 = state.inventoryCreator;
                                                               base2.isOpen = true;
                                                               base2.id = this.state.machines_vehicles.id;
                                                               base2.mode = "update";
                                                               base2.index = i
                                                               return {
                                                                   inventoryCreator:base2
                                                               }
                                                           })
                                                       }
                                                   }
                                                   return {
                                                       alert:base
                                                   }
                                               })
                                           }
                                       }} delete={() => {
                                           if(this._mounted){
                                               this.setState(state => {
                                                   let base = state.alert;
                                                   base.text = "Sure you want to delete this item?";
                                                   base.isOpen = true;
                                                   base.icon = "trash";
                                                   base.intent = Intent.DANGER;
                                                   base.confirm = () => {this.deleteMachines_n_vehicles(this.state.machines_vehicles.id, i)}

                                                   return {
                                                       alert:base
                                                   }
                                               })
                                           }
                                       }} key={i} name={e.name} description={e.description} photoURL={e.photoURL} />
                                    )
                                
                            } )}
                        </div>
                        <div className="container text-center">
                        <AddCardElement text="Add Inventory" onClick={() => {this.state.inventoryCreator.handleOpen(false)}}  />
                        </div>
                    </div>
                    :null}
                </div>

                
            </div>
            }
            </div>
            
            </div>
        )
    }
}