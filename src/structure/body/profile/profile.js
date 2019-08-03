import React from "react";
import "./profile.css";

import Navbar from "../../navbar";
import logo from "../../../res/Graphics/main_logo.png";
import firebase from "../../../firebaseSetUp";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider} from "@blueprintjs/core";
import TextCollapse from "./textCollapse";
import EditProposalModule from "./editProposalModule";
import CVcontent from "./CVcontent";
import UploadImg from "./uploadImg";
import CreateProject from "../createProject";
import ProfileLoading from "../../loading/profileLoading";
import DrawerJob from "../drawerJob";
import ProposalsViewer from "../proposalViewer";
import $ from "jquery"
import Chat from "../chat";

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user:null,
            toasts: [ /* IToastProps[] */ ],
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

            firebase.firestore().collection("CVs").where("uid","==",this.props.userId).get()
        .then(snapshot => {
            if(snapshot.empty){
                if(this.props.userId === firebase.auth().currentUser.uid){
                    let id = firebase.firestore().collection("CVs").doc().id
                firebase.firestore().collection("CVs").doc(id).set({
                    id:id,
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
                    order:[1,2,3,4,5,6]
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
              this.loadCv();
              this.loadInbox(user.uid);

              
              // ...
            } else {
              // User is signed out.
              this.props.handleStates(0)
              // ...
            }
          });

    }

    componentWillUnmount(){
        this._mounted = false;

        $("a").off("click");
    }

    render() {
        return(
            
            <div>
                
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
                   {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={this.state.drawerJob.handleClose}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                    <CreateProject isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/>
                  </div>

                {this.state.editPanel.id !== ""?
                <EditProposalModule index={this.state.editPanel.index} title={this.state.editPanel.title} content={this.state.editPanel.content} section={this.state.editPanel.prop} callBack={() => {this.loadCv()}} isOpen={this.state.editPanel.isOpen} handleClose={this.state.editPanel.handleClose} id={this.state.editPanel.id} prop={this.state.editPanel.prop} type={this.state.editPanel.type} addToast={this.addToast}/>
                :null}
                {this.state.CV.editable === true?<UploadImg callback={() => {this.loadCv()}} isOpen={this.state.uploadImg.isOpen} handleClose={this.state.uploadImg.handleClose} />:null}
                <div>
                    {this.state.user === null? <ProfileLoading />:
                    <div>
                        <div style={{zIndex:"9999999",position:"relative"}}>
                    <Chat />
                       </div>
                <div className="container-fluid text-center" id="top">
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
                              <button type="button" className="dropdown-toggle" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
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
                              <button type="button" className="dropdown-toggle" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
                                <div className="dropdown-menu dropdown-menu-right">
                                <button className="dropdown-item" onClick={() => {this.openEditPanel("update",this.state.CV.id,"description",0,this.title.textContent,this.text.textContent)}}>Edit</button>
                                <button className="dropdown-item" onClick={() => {this.deleteContent("description",0); }}>Delete</button>
                              </div>
                             </div>:null}
                            </div>
                            :this.state.CV.editable === true?<button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"description")}}>Add Description</button>:<p>No description</p>}
                        
                </div>
                <div className="container-fluid">
                    <div id="accordion">
                        {this.state.CV.order.map((element,index) => {
                            if(element === 1){
                                return (
                                    <div className="card mt-3" key={element}>
                                    <div className="card-header" style={{position:"relative"}}>
                                       <a className="card-link" data-toggle="collapse" href="#experience"> Experience</a>
                                       <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
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
                           <div className="btn-group btns-change-order">
                                          <button type="button" className="btn btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
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
                                    <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
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
                                       <a className="card-link" data-toggle="collapse" href="#skills"> Skills</a>
                                       <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                     </div>

                                      <div className="collapse show"  id="skills">
                                       {this.state.CV.skills.length > 0?this.state.CV.skills.map((element,i) => {
                                     return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"skills",i,element.title,element.text)}} delete={() => {this.deleteContent("skills",i); }} title={element.title} text={element.text}/>

                       )
                           }):null}
                                   {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"skills");}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                                   </div>
                               </div>
                                )
                            }

                            if(element === 5){
                                return (
                                    <div className="card mt-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
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

                            if(element === 6){
                                return (
                                    <div className="card mt-3 mb-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#contact"> Contact</a>
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
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
            }
            </div>
            
            </div>
        )
    }
}