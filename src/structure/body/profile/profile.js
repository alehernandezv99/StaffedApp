import React from "react";
import "./profile.css";

import Navbar from "../../navbar";
import logo from "../../../res/Graphics/main_logo.png";
import firebase from "../../../firebaseSetUp";
import TODO from "../drawerJob/TO-DO";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider} from "@blueprintjs/core";
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

import Chat from "../chat";

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.addSkill = this.addSkill.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.checkCriteria = checkCriteria;

        this.state = {
            contracts:[],
            user:null,
            chat:{
                payload:null
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

    addToast = (message) => {
        this.toaster.show({ message: message});
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
        
        if(window.confirm("Sure you want to delete this item?")){
        firebase.firestore().collection("CVs").doc(this.state.CV.id).get()
        .then(doc => {
            let arr = doc.data()[prop];
            arr.splice(index,1)
            firebase.firestore().collection("CVs").doc(this.state.CV.id).update({[prop]:arr})
            .then(() => {
                this.addToast("Element Deleted");
                this.loadCv();
            })
            .catch(e => {
                this.addToast(e.message);
            })
        })
        .catch(e => {
            this.addToast(e.message);
        })
    }
    }

    loadInbox = (id)=> {
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
            })
        
    }

    loadCv = () => {
        firebase.firestore().collection("users").doc(this.props.userId).get()
        .then(async doc => {
           await this.setState({user:doc.data()});

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


    componentDidMount(){

        this._mounted = true;
        

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
              firebase.firestore().collection("contracts").where("involved","array-contains",user.uid).limit(6).get()
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

    render() {
        return(
            
            <div>
                {this.state.isLoading?<LoadingSpinner/>:null}
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
                            text:"contracts",
                            icon:"assignment",
                            key:3,
                            href:"",
                            dropdownItems:this.state.contracts.length > 0? this.state.contracts.concat({
                                href:"",
                                title:"See More",
                                key:8,
                                onClick:() => {}
                            }).map((e,i) => {
                              
                                return {
                                    href:"",
                                    text:e.title,
                                    key:i,
                                    onClick:() => {e.projectID !== undefined? this.handleInboxEvent({
                                        type:"view contract",
                                        id:e.projectID
                                    }): this.state.contractDrawer.handleOpen()}
                                }
                            }):[{
                                href:"",
                                text:"No Contracts",
                                key:1,
                                onClick:() => {}
                            }] ,
                            onClick:() => {}
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
               <ContractDrawer openContract={(type, id) => {this.handleInboxEvent({type:type, id:id})}} isOpen={this.state.contractDrawer.isOpen} handleClose={this.state.contractDrawer.handleClose} addToast={this.addToast} handleStates={this.props.handleStates} />
               {this.state.drawerJob.projectID === ""?null:<TODO addToast={this.addToast} isOpen={this.state.TODO.isOpen} projectID={this.state.drawerJob.projectID} handleClose={this.state.TODO.handelClose} />}
                {((this.state.companyCV !== null) &&(this.props.userId === firebase.auth().currentUser.uid) && (this.state.staffCreator.isOpen))?<StaffCreator refresh={this.searchCompanyCV} update={this.state.staffCreator.update} index={this.state.staffCreator.index} addToast={this.addToast} toggleLoading={this.toggleLoading} isOpen={this.state.staffCreator.isOpen} handleClose={this.state.staffCreator.handleClose} />:null}
                {(this.state.companyCV !== null) && (this.state.staffViewer.data !== null)?<StaffViewer isOpen={this.state.staffViewer.isOpen} data={this.state.staffViewer.data} handleClose={this.state.staffViewer.handleClose} addToast={this.addToast} />:null}
               <InboxMessages handleAction={(e) => {this.handleInboxEvent(e)}} handleClose={this.state.inboxDrawer.handleClose} isOpen={this.state.inboxDrawer.isOpen} />
                   {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob openTODO={() =>{this.state.TODO.handleOpen()}} providePayloadToChat={this.providePayloadToChat} openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={this.state.drawerJob.handleClose}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                    <CreateProject isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/>

                    {this.state.editPanel.id !== ""?
                <EditProposalModule index={this.state.editPanel.index} title={this.state.editPanel.title} content={this.state.editPanel.content} section={this.state.editPanel.prop} callBack={() => {this.loadCv()}} isOpen={this.state.editPanel.isOpen} handleClose={this.state.editPanel.handleClose} id={this.state.editPanel.id} prop={this.state.editPanel.prop} type={this.state.editPanel.type} addToast={this.addToast}/>
                :null}
                {this.state.CV.editable === true?<UploadImg callback={() => {this.loadCv()}} isOpen={this.state.uploadImg.isOpen} handleClose={this.state.uploadImg.handleClose} />:null}
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
                   
                            <h6 className="mt-2">{this.state.user !== null?this.state.user.displayName?this.state.user.displayName:this.state.user.email:"Loading..."}</h6>
  
                            {this.state.CV.description.length > 0?
                           <div className="container" style={{position:"relative"}}>
                            <h5 className="mt-3" ref={ref => {this.title = ref}}>{this.state.user !== null?this.state.CV.description[0].title:"Loading..."}</h5>
                            <p ref={ref => {this.text = ref}}>{this.state.CV.description[0].text}</p>

                            {this.state.CV.editable === true?<div className="dropdown right-corner-btn">
                              <button type="button" className="dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
                                <div className="dropdown-menu dropdown-menu-right">
                                <button className="dropdown-item" onClick={() => {this.openEditPanel("update",this.state.CV.id,"description",0,this.title.textContent,this.text.textContent)}}>Edit</button>
                                <button className="dropdown-item" onClick={() => {this.deleteContent("description",0); }}>Delete</button>
                              </div>
                             </div>:null}
                            </div>
                            :this.state.CV.editable === true?<button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"description")}}>Add Description</button>:<p>No description</p>}


                            
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
                         
                    </li>:<li className="nav-item mr-auto"></li>:
                    ((this.state.companyCV !== 0) && (this.state.companyCV !== null))? 
                      <li className="nav-item mr-auto">
                      <a className="nav-link remove-bottom-rounded" data-toggle="tab" href="#menu1"><i className="material-icons align-middle">group</i> Company</a>
                 </li>:<li className="nav-item mr-auto"></li>}
                    </ul>

                <div className="tab-content">
                    <div className="tab-pane container cv-container active" id="home">
                    <div className="container-fluid"> 
                    <div className="container text-center">
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
                                           <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"experience",i,element.title,element.text)}} delete={() => {this.deleteContent("experience",i); }} title={element.title} text={element.text}/>
            
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
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"education",i,element.title,element.text)}} delete={() => {this.deleteContent("education",i); }} title={element.title} text={element.text}/>

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
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"portfolio",i,element.title,element.text)}} delete={() => {this.deleteContent("portfolio",i); }} title={element.title} text={element.text}/>

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
                                      <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"expertise",i,element.title,element.text)}} delete={() => {this.deleteContent("expertise",i); }} title={element.title} text={element.text}/>

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
                                        <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"contact",i,element.title,element.text)}} delete={() => {this.deleteContent("contact",i); }} title={element.title} text={element.text}/>

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
                        <div className="cards-container">
                            {this.state.companyCV.staff.concat(<AddCardElement />).map((e,i) => {
                                if( i !== (this.state.companyCV.staff.length)){
                                    return (
                                       <StaffCard key={i} edit={() => {this.editStaff(i)}} skills={e.skills} delete = {() => {this.removeStaff(i)}} photoURL={e.photoURL} editable={this.props.userId === firebase.auth().currentUser.uid} onClick={() => {this.openStaff(i)}} title={e.description[0].title} name={e.name?e.name[0].title:null} description={e.description[0].description} />
                                    )
                                }else {
                                    if(this.state.CV.editable === true){
                                    return (
                                        <AddCardElement onClick={() => {this.state.staffCreator.handleOpen(false)}} key={i} />
                                    )
                                    }else {
                                        return null
                                    }
                                }
                            } )}
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