import React from "react";
import "./profileViewer.css";


import firebase from "../../../firebaseSetUp";

import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider ,Alert, Intent} from "@blueprintjs/core";

import CVcontent from "../profile/CVcontent";
import ProfileLoading from "../../loading/profileLoading";

import AddCardElement from "../profile/addCardElement";
import StaffCard from "../profile/staffCard";
import StaffViewer from "../profile/staffViewer";
import LoadingSpinner from "../../loading/loadingSpinner";
import $ from "jquery";

import checkCriteria from "../../../utils/checkCriteria";
import EditBtn from "../profile/editBtn";

import InventoryCard from "../profile/inventoryCard";
import UserBox from "../profile/userBox";


export default class ProfileViewer extends React.Component {
    constructor(props){
        super(props);

        this.checkCriteria = checkCriteria;

        this.state = {
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
           if(doc.data().publicFeedback === true){
            this.calculateFeedback();
           }
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


    componentDidMount(){

        this._mounted = true;
        

       

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.

         
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

    getCompanyStaff = () => {
        firebase.firestore().collection("invitations").where("from","==",this.props.userId).where("type","==","Company Staff").where("status","==","accepted").get().then(snap => {
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
        .catch(e => {
            console.log(e);
        })
        
      
    }

    calculateFeedback = () => {
      
        firebase.firestore().collection("users").doc(this.props.userId).collection("reviews").get()
        .then(reviews => {
      
            if(!reviews.empty){
                let acum1 = 0;
                let j = 0
                reviews.forEach(doc => {
                    j++
                    let review = doc.data()
                    let index = 0
                    let acum = 0
                    Object.keys(review).forEach(key => {
                        if(key !== "message"){
                            index++;
                            acum += review[key];
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
         
        })
    }

    

    render() {
        return(
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={"75%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
            <div className={`${Classes.DIALOG_BODY}`}>
            <div>
                {this.state.isLoading?<LoadingSpinner/>:null}
                <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>
                <Alert icon={this.state.alert.icon} intent={this.state.alert.intent} isOpen={this.state.alert.isOpen} onConfirm={() => {this.state.alert.confirm(); this.state.alert.handleClose();}} onCancel={() =>{this.state.alert.handleClose()}} confirmButtonText="Yes" cancelButtonText="No">
                        <p>{this.state.alert.text}</p> 
                    </Alert>

               <div id="portalContainer" className="text-left">
                {(this.state.companyCV !== null) && (this.state.staffViewer.data !== null)?<StaffViewer isOpen={this.state.staffViewer.isOpen} data={this.state.staffViewer.data} handleClose={this.state.staffViewer.handleClose} addToast={this.addToast} />:null}
           
                  </div>

                
                <div>
                    {this.state.user === null? <ProfileLoading />:
                    <div>
                        <div style={{zIndex:"9999999",position:"relative"}}>
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

                        
                       
                        </div>
                    </div>
                   
                            <h6 className="mt-2">{this.state.user !== null?this.state.user.displayName?this.state.user.displayName:this.state.user.email:"Loading..."}</h6>
  
                            {this.state.CV.description.length > 0?
                           <div className="container" style={{position:"relative"}}>
                            <h5 className="mt-3" ref={ref => {this.title = ref}}>{this.state.user !== null?this.state.CV.description[0].title:"Loading..."}</h5>
                            <p ref={ref => {this.text = ref}}>{this.state.CV.description[0].text}</p>

                          
                            </div>
                            :this.state.CV.editable === "never-this-value"?<button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"description")}}>Add Description</button>:<p>No description</p>}

<div class=" mt-4 text-center">
   
    
       {this.state.user.publicFeedback !== null?this.state.user.publicFeedback === true? <div className="mt-2 text-center" style={{width:"300px", marginLeft:"50%",transform:"translate(-50%,0)"}}>
        <div className="mt-3">
        <h5 className="text-center mb-3">Rating</h5>
        <div className="progress mt-4" >
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
                    this.state.CV.editable === "never-this-value"?
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
                    this.state.CV.editable === "never-this-value"?
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
                                {this.state.CV.editable === "never-this-value"?
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

                                       {this.state.CV.editable === "never-this-value"?
                                       <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                       :null}
                                        </div>
                                  <div className="collapse show" data-parent="#accordion" id="experience">
                                   {this.state.CV.experience.length > 0?this.state.CV.experience.map((element,i) => {
                                       return (
                                           <CVcontent editable={false} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"experience",i,element.title,element.text)}} delete={() => { 
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
                                   {this.state.CV.editable === "never-this-value"? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"experience");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                                </div>
            
                                </div> 
                                )
                            }

                            if(element === 2){
                                return (
                                    <div className="card mt-3" key={element}>
                        <div className="card-header" style={{position:"relative"}}>
                           <a className="card-link" data-toggle="collapse" href="#education"> Education</a>

                           {this.state.CV.editable === "never-this-value"?
                           <div className="btn-group btns-change-order">
                                          <button type="button" className="btn btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                        :null}
                            </div>
                        
                            <div className="collapse show" id="education">
                            {this.state.CV.education.length > 0?this.state.CV.education.map((element,i) => {
                           return (
                               <CVcontent editable={false} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"education",i,element.title,element.text)}} delete={() => {
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
                       {this.state.CV.editable === "never-this-value"? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"education");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                        </div>
                    </div>
                                )
                            }

                            if(element === 3){
                              return(  <div className="card mt-3" key={element}>
                                  <div className="card-header" style={{position:"relative"}}>
                                    <a className="card-link" data-toggle="collapse" href="#portfolio"> Portfolio</a>

                                    {this.state.CV.editable === "never-this-value"?
                                    <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                    :null}
                                  </div>

                                <div className="collapse show" id="portfolio">
                                   {this.state.CV.portfolio.length > 0?this.state.CV.portfolio.map((element,i) => {
                                    return (
                               <CVcontent editable={false} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"portfolio",i,element.title,element.text)}} delete={() => {
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
                               {this.state.CV.editable === "never-this-value"? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"portfolio");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                             </div>
                            </div>
                              )
                            }


                            if(element === 4){
                                return (
                                    <div className="card mt-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>

                                        {this.state.CV.editable === "never-this-value"?
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                        :null}
                                      </div>

                                    <div className="collapse show"  id="expertise">
                                       {this.state.CV.expertise.length > 0?this.state.CV.expertise.map((element,i) => {
                                      return (
                                      <CVcontent editable={false} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"expertise",i,element.title,element.text)}} delete={() => {
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
                                   {this.state.CV.editable === "never-this-value"? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"expertise");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                                  </div>
                                 </div>
                                )
                            }

                            if(element === 5){
                                return (
                                    <div className="card mt-3 mb-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#contact"> Contact</a>

                                        {this.state.CV.editable === "never-this-value"?
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                        :null}
                                     </div>

                                    <div className="collapse show" id="contact">
                                       {this.state.CV.contact.length > 0?this.state.CV.contact.map((element,i) => {
                                      return (
                                        <CVcontent editable={false} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"contact",i,element.title,element.text)}} delete={() => {
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
                                        {this.state.CV.editable === "never-this-value"? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"contact");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
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
                        {this.state.companyCV.staff.map((e,i) => {
                                
                                return (
                                   <div >
                                    <div >
                                      <UserBox margin={"m-2"} key={i} id={e.user} openUser={this.props.openUser} size={"50px"} addToast={this.addToast}/>
                                   </div>
                                   
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
                                       <InventoryCard editable={false} edit={() => {
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
                        
                    </div>
                    :null}
                </div>

                
            </div>
            }
            </div>
            
            </div>
            </div>
            </div>
        </Drawer>
        )
    }
}