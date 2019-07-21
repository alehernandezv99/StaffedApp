import React from "react";
import "./profile.css";

import Navbar from "../../navbar";
import logo from "../../../res/Graphics/main_logo.png";
import firebase from "../../../firebaseSetUp";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider} from "@blueprintjs/core";
import TextCollapse from "./textCollapse";
import EditProposalModule from "./editProposalModule";

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user:null,
            toasts: [ /* IToastProps[] */ ],
            CV:{
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
            isLoading:false,
            editPanel:{
                isOpen:false,
                id:"",
                prop:"",
                type:"",
                index:0,
                handleClose:() => {
                    this.setState(state => {
                        let base = state.editPanel;
                        base.isOpen = false;
                        return{editPanel:base}
                    })
                },
                handleOpen:() => {
                    this.setState(state => {
                        let base = state.editPanel;
                        base.isOpen = true;
                        return {editPanel:base}
                    })
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
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }

    openEditPanel = (type,id, prop, index) => {
        this.setState(state => {
            let base = state.editPanel;
            base.type = type;
            base.id= id;
            base.prop = prop;
            if(index){
                base.index =index;
            }
            return{editPanel:base}
        })
    }

    loadCv = () => {
        firebase.firestore().collection("users").doc(this.props.userId).get()
        .then(doc => {
            this.setState({user:doc.data()});

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
                        this.setState({CV:base});
                    })
                })
            }
            }else {
                snapshot.forEach(data => {
                    let base = data.data()
                        if(this.props.userId === firebase.auth().currentUser.uid){
                            
                            base.editable =true;
                        }
                        this.setState({CV:base});
                })
            }
        })
        })
    }

    componentDidMount(){
        this.loadCv();

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
                            onClick:() => {},
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
                            text:this.state.user === null?"Loading...":this.state.user.email,
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
                <EditProposalModule section={this.state.editPanel.prop} callBack={this.loadCv()} isOpen={this.state.editPanel.isOpen} handleClose={this.state.editPanel.handleClose} id={this.state.editPanel.id} prop={this.state.editPanel.prop} type={this.state.editPanel.type} addToast={this.addToast}/>
                :null}
                <div className="container-fluid text-center">
                    <div className="container mt-2">
                        <img src="https://www.w3schools.com/bootstrap4/img_avatar1.png" style={{width:"150px"}} className="rounded-circle" />
                    </div>
                        <div className="container">
                            <h6 className="mt-2">{this.state.user !== null?this.state.user.displayName?this.state.user.displayName:this.state.user.email:"Loading..."}</h6>
                            <h5 className="mt-3">{this.state.user !== null?this.state.user.profession?this.state.user.profession:"":"Loading..."}</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                 incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                                 nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                                 fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa 
                                 qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                </div>
                <div className="container-fluid">
                    <div id="accordion">
                    <div className="card mt-3">
                        <div className="card-header">
                           <a className="card-link" data-toggle="collapse" href="#experience"> Experience</a>
                            </div>
                      <div className="collapse show" data-parent="#accordion" id="experience">
                       {this.state.CV.experience.length > 0?this.state.CV.experience.map((element,i) => {
                           return (<div className="card-body" key={i}>
                               <div className="card-title">{element.title}</div>
                               <div className="container-fluid">
                                   <TextCollapse key={i} maxWidth={400} text={element.text} />
                                </div>
                                <Divider/>
                               </div>)
                       })
                        :null}
                       {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.openEditPanel("add",this.state.CV.id,"experience"); this.state.editPanel.handleOpen()}}><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                    </div>

                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                           <a className="card-link" data-toggle="collapse" href="#education"> Education</a>
                            </div>
                        
                            <div className="collapse show" id="education">
                        {this.state.CV.education.length > 0?this.state.CV.education.map((element,i) => {
                           return (<div className="card-body" key={i}>
                               <div className="card-title">{element.title}</div>
                               <div className="container-fluid">
                                   <TextCollapse key={i} maxWidth={400} text={element.text} />
                                </div>
                                <Divider/>
                               </div>)
                       })
                        :null}
                        {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2"><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#portfolio"> Portfolio</a>
                        </div>

                        <div className="collapse show" id="portfolio">
                        {this.state.CV.portfolio.length > 0?this.state.CV.portfolio.map((element,i) => {
                           return (<div className="card-body" key={i}>
                               <div className="card-title">{element.title}</div>
                               <div className="container-fluid">
                                   <TextCollapse key={i} maxWidth={400} text={element.text} />
                                </div>
                                <Divider/>
                               </div>)
                       })
                        :null}
                        {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2"><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#skills"> Skills</a>
                        </div>

                        <div className="collapse show"  id="skills">
                        {this.state.CV.skills.length > 0?this.state.CV.skills.map((element,i) => {
                           return (<div className="card-body" key={i}>
                               <div className="card-title">{element.title}</div>
                               <div className="container-fluid">
                                   <TextCollapse key={i} maxWidth={400} text={element.text} />
                                </div>
                                <Divider/>
                               </div>)
                       })
                        :null}
                        {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2"><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>
                        </div>

                        <div className="collapse show"  id="expertise">
                        {this.state.CV.expertise.length > 0?this.state.CV.expertise.map((element,i) => {
                           return (<div className="card-body" key={i}>
                               <div className="card-title">{element.title}</div>
                               <div className="container-fluid">
                                   <TextCollapse key={i} maxWidth={400} text={element.text} />
                                </div>
                                <Divider/>
                               </div>)
                       })
                        :null}
                        {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2"><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                        </div>
                    </div>

                    <div className="card mt-3 mb-3">
                        <div className="card-header">
                        <a className="card-link" data-toggle="collapse" href="#contact"> Contact</a>
                        </div>

                        <div className="collapse show" id="contact">
                        {this.state.CV.contact.length > 0?this.state.CV.contact.map((element,i) => {
                           return (<div className="card-body" key={i}>
                               <div className="card-title">{element.title}</div>
                               <div className="container-fluid">
                                   <TextCollapse key={i} maxWidth={400} text={element.text} />
                                </div>
                                <Divider/>
                               </div>)
                       })
                        :null}
                        {this.state.CV.editable === true? <button type="button" className="btn btn-custom-3 btn-sm m-2"><i className="material-icons align-middle">add</i> <span>Add</span></button>: null}
                        </div>
                </div>
            </div>
            </div>
            </div>
        )
    }
}