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


    componentDidMount(){
        this._mounted = true;
        this.loadCv();

    }

    componentWillUnmount(){
        this._mounted = false;
    }

    render() {
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
                />{this.state.editPanel.id !== ""?
                <EditProposalModule index={this.state.editPanel.index} title={this.state.editPanel.title} content={this.state.editPanel.content} section={this.state.editPanel.prop} callBack={() => {this.loadCv()}} isOpen={this.state.editPanel.isOpen} handleClose={this.state.editPanel.handleClose} id={this.state.editPanel.id} prop={this.state.editPanel.prop} type={this.state.editPanel.type} addToast={this.addToast}/>
                :null}
                {this.state.CV.editable === true?<UploadImg callback={() => {this.loadCv()}} isOpen={this.state.uploadImg.isOpen} handleClose={this.state.uploadImg.handleClose} />:null}
                <div>
                    {this.state.user === null? <ProfileLoading />:
                    <div>
                <div className="container-fluid text-center">
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
                    <div className="card mt-3">
                        <div className="card-header">
                           <a className="card-link" data-toggle="collapse" href="#experience"> Experience</a>
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

                    <div className="card mt-3">
                        <div className="card-header">
                           <a className="card-link" data-toggle="collapse" href="#education"> Education</a>
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

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#portfolio"> Portfolio</a>
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

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#skills"> Skills</a>
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

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>
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

                    <div className="card mt-3 mb-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#contact"> Contact</a>
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
                </div>
            </div>
            </div>
            }
            </div>
                
            <CreateProject isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/>
            </div>
        )
    }
}