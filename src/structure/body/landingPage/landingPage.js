import React from 'react';
import "./landingPage.css";
import logo from "../../../logo.svg";
import icon from "../../../res/Graphics/pionnering_icon.png";
import MainGraphic from ".././../../res/Graphics/landing_page_icon.svg"
import Navbar from "../../navbar";
import LoadingSpinner from "../../loading/loadingSpinner";
import firebase from "../../../firebaseSetUp";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";

import { Button, Position, Toast, Toaster, Classes} from "@blueprintjs/core";

export default class LandingPage extends React.Component {
    constructor(props){
        super(props);
        this.changeState = this.changeState.bind(this);
        this.handleAuth = this.handleAuth.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
        this.setData = this.setData.bind(this);
        this.verifyData= this.verifyData.bind(this);
        this.deleteCurrentUser = this.deleteCurrentUser.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.checkCriteria = checkCriteria;
        this.clearSkill = this.clearSkill.bind(this);

        this.state = {
            loginData:{
                email:"",
                password:"",
                remember:false
            },
            signUpData:{
                email:"",
                password:"",
                confirmPassword:"",
                remember:false
            },
            isLoading:false,
            toasts: [ /* IToastProps[] */ ],
            skills:{
                skillsSelected:{value:[], criteria:{type:"array", min:1, max:5}},
                skillsFetched:[],
            }

        }

        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
        }
    }

    addToast = (message) => {
        console.log("Test");
        this.toaster.show({ message: message});
    }

    setData(collection, id, data, cb1, cb2){
        firebase.firestore().collection(collection).doc(id).set(data)
        .then(() => {
            cb1();
            window.location.href = "/home";
        })
        .catch(e => {
            this.addToast(e.message);
            cb2();
        })
    }

    clearSkill(index){
        this.setState(state => {
          let skills = state.skills.skillsSelected.value;
          skills.splice(index,1)
          let base = state.skills;
          let skillsObj = {value:skills, criteria:this.state.skills.skillsSelected.criteria}
          base.skills = skillsObj;
          return({skills:base});
        })
      }

    addSkill(skill){
        if(!(this.state.skills.skillsSelected["value"].includes(skill))){
          let skills = this.state.skills.skillsSelected["value"].slice();
    
          let criteria = this.state.skills.skillsSelected["criteria"];
        this.setState(state => {
          let base = state.skills;
          skills.push(skill);
          if(this.checkCriteria(skills, criteria).check){
          base.skillsSelected.value = skills;
          return({skills:base});
          }else {
            this.addToast(this.checkCriteria(skills, criteria, "skills").message);
            return ({});
          }
        })
      }else {
        this.addToast("You cannot select two repeated skills")
      }
      }

    verifyData(collection, id, data, cb1 , cb2){
        firebase.firestore().collection(collection).doc(id).get()
        .then(doc => {
            if(!doc.exists){
                this.setData(collection, id, data, cb1, cb2)
            }else {
                cb1();
                window.location.href = "/home";
            }
        })
    }

    deleteCurrentUser(){
        if(firebase.auth().currentUser !== null){
            firebase.auth().currentUser.delete()
            .then(() => {
                this.toggleLoading();
            })
            .catch(e => {
                this.deleteCurrentUser();
            })
        }
    }

    componentDidMount(){

        $('#skills-input').keypress((event) => {
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
      
            
            autocomplete(document.getElementById("skills-input"), skills, this.addSkill);
          })

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              var displayName = user.displayName;
              var email = user.email;
              var emailVerified = user.emailVerified;
              var photoURL = user.photoURL;
              var isAnonymous = user.isAnonymous;
              var uid = user.uid;
              var providerData = user.providerData;

              let data = {
                  displayName:displayName,
                  email: email,
                  emailVerified: emailVerified,
                  photoURL: photoURL,
                  isAnonymous: isAnonymous,
                  uid: uid,
                  skills:[]
              }

              this.verifyData("users", user.uid, data, this.toggleLoading, this.deleteCurrentUser);
              
              // ...
            } else {
              // User is signed out.
              // ...
            }
          });
    }

    async changeState(object, field, value){
        await this.setState(state => {
            let objectRef = state[object];
            objectRef[field] = value
            return ({[object]:objectRef});
        })
    }

    handleAuth(type, email, password, cPassword){
        this.toggleLoading();
        if(type === "login"){
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(result => {
                
            })
            .catch(e => {
                this.toggleLoading()
                this.addToast(e.message);
                console.log(e);
            })
        }else if(type === "signUp"){
            if(password === cPassword){
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(result => {

            })
            .catch(e => {
                this.toggleLoading()
                this.addToast(e.message);
                console.log(e);
            })
        }else {
            alert("Passwords are not equal");
        }
        }
    }

    toggleLoading(){
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }

    render(){
        return(
            <div>
                {this.state.isLoading === true? <LoadingSpinner />:null}
                <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>
            
                <Navbar logo={icon}
                leftElements={
                    [
                        {
                            type:"link",
                            text:"About",
                            href:"#about",
                            onClick:() => {},
                            key:1
                        },
                        {
                            type:"link",
                            text:"Product Info",
                            href:"#productInfo",
                            onClick:() => {},
                            key:2
                        },
                        {
                            type:"link",
                            text:"How To Use",
                            href:"#howToUse",
                            onClick:() => {},
                            key:3
                        },
                        {
                            type:"link",
                            text:"Contact",
                            href:"#contact",
                            onClick:() => {},
                            key:4
                        }
                    ]
                } 
                rightElements={
                    [
                        {
                            type:"button",
                            text:"Login",
                            dataToggle:"modal",
                            dataTarget:"#loginPanel",
                            onClick:() => {},
                            key:5
                        },
                        {
                            type:"button",
                            text:"Sign Up",
                            dataToggle:"modal",
                            dataTarget:"#signUpPanel",
                            onClick:() => {},
                            key:6
                        }
                    ]
                }
                />
            <div className="container-fluid  text-center padding-1"  id="about">
            <img src={MainGraphic} width="450px"/>
                <h1>Welcome to Pioneering</h1>            
                <h5 style={{fontWeight:"normal"}} className="m-3">The moderm and Simplest solution for working from 
                home. Enhace your business and your life
                </h5>
                <button type="button" data-toggle="modal" data-target="#signUpPanel" className="btn btn-custom-1 btn-lg m-3">Join Today</button>
            </div>
            <div className="container-fluid text-center bg-gradient-1 padding-2" id="productInfo">
                <h2 className="m-b-3" style={{color:"white"}}>Product Info</h2>
                <div className="row text-center">
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle">link</i> Feature one</h4>
                        <p>description about the description provides, very simplify</p>
                        <img src={logo} style={{width:"70%"}} alt="feature one"/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle">link</i> Feature Two</h4>
                        <p>description about the description provides, very simplify, it sometimes can a bit longer than others</p>
                        <img src={logo} style={{width:"70%"}} alt="feature two"/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle">link</i> Feature Three</h4>
                        <p>description about the description provides, very simplify, sometimes not</p>
                        <img src={logo} style={{width:"70%"}} alt="feature three"/>
                    </div>
                </div>
            </div>
            <div className="container-fluid text-center  padding-2" id="howToUse">
                <h2>How To Use</h2>
                <div className="row">
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 1</h4>
                        <p>Exaplain the steep 1</p>
                        <img src={logo} alt="steep 1" style={{width:"70%"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 2</h4>
                        <p>Exaplain the steep 2</p>
                        <img src={logo} alt="steep 1" style={{width:"70%"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 3</h4>
                        <p>Exaplain the steep 3</p>
                        <img src={logo} alt="steep 1" style={{width:"70%"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 4</h4>
                        <p>Exaplain the steep 4</p>
                        <img src={logo} alt="steep 1" style={{width:"70%"}}/>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <div className="modal fade" id="loginPanel">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h4 className="modal-title text-center">Login</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>

                            <div className="modal-body">
                            <form>
                              <div className="form-group">
                                <label>Email address:</label>
                                <input type="email" className="form-control" id="email" onChange={(e) => {this.changeState("loginData","email",e.target.value)} } />
                              </div>
                              <div className="form-group">
                                <label>Password:</label>
                                <input type="password" className="form-control" id="pwd" onChange={(e) => {this.changeState("loginData","password", e.target.value)}}/>
                              </div>
                              <div className="form-group form-check">
                                <label className="form-check-label">
                                <input className="form-check-input" type="checkbox"  onChange={(e) => {this.changeState("loginData","remember", e.target.checked)}}/> Remember me
                              </label>
                              </div>
                              <button type="button" className="btn btn-custom-1 btn-block" onClick={()=> {this.handleAuth("login",this.state.loginData.email, this.state.loginData.password)}}>Enter</button>
                              <p className="text-center mt-3">You dont have an account? <a href="#" data-toggle="modal" data-target="#signUpPanel">Sign Up</a></p>
                            </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="signUpPanel">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title text-center">Sign Up</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                            <form>
                              <div className="form-group">
                                <label>Email address:</label>
                                <input type="email" className="form-control" id="email" onChange={(e) => {this.changeState("signUpData","email",e.target.value)}} />
                              </div>
                              <div className="form-group">
                                <label>Password:</label>
                                <input type="password" className="form-control" id="pwd" onChange={(e) => {this.changeState("signUpData","password",e.target.value)}}/>
                              </div>
                              <div className="form-group">
                                <label >Confirm Password:</label>
                                <input type="password" className="form-control" id="pwd" onChange={(e) => {this.changeState("signUpData","confirmPassword",e.target.value)}}/>
                              </div>
                              <div className="form-group form-check">
                                <label className="form-check-label">
                                <input className="form-check-input" type="checkbox" onChange={(e) => {this.changeState("signUpData","remember",e.target.checked)}}/> Remember me
                              </label>
                              </div>
                              <div className="form-group">
                                  <label>Your Skills</label>
                                <div>
                                {this.state.skills.skillsSelected.value.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 mt-2 mb-2 mr-2 btn-sm">{skill} <i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => {this.clearSkill(index)}}>clear</i></button>
                                })}
                                <div>
                                <div className="autocomplete">
                                <input autoComplete="off" ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" id="skills-input" className="form-control" required/>
                                </div>
                                </div>

                                </div>
                              </div>

                              <button type="button" className="btn btn-custom-1 btn-block" onClick={() => {this.handleAuth("signUp",this.state.signUpData.email, this.state.signUpData.password, this.state.signUpData.confirmPassword)}}>Sign Up</button>
                              <p className="text-center mt-3">Already have an account? <a href="#" data-toggle="modal" data-target="#signUpPanel">Login</a></p>
                            </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}