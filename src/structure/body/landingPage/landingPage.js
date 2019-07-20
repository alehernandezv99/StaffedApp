import React from 'react';
import "./landingPage.css";
import logo from "../../../res/Graphics/main_logo.png";
import icon from "../../../res/Graphics/pionnering_icon.png";
import imgFeature1 from "../../../res/Graphics/professional_freelancers_icon.svg";
import imgFeature2 from "../../../res/Graphics/payment_protection_icon.svg";
import imgFeature3 from "../../../res/Graphics/technical_support_icon.svg";
import imgSteep1 from "../../../res/Graphics/how_to_use_1.png";
import imgSteep2 from "../../../res/Graphics/how_to_use_2.png";
import imgSteep3 from "../../../res/Graphics/how_to_use_3.png";
import imgSteep4 from "../../../res/Graphics/how_to_use_4.png";
import MainGraphic from ".././../../res/Graphics/landing_page_icon.svg"
import Navbar from "../../navbar";
import LoadingSpinner from "../../loading/loadingSpinner";
import firebase from "../../../firebaseSetUp";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";

//Login adn SignUp Panels 
import LoginDrawer from "./loginDrawer";
import SignUpDrawer from "./signUpDrawer";

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
                country:"",
                remember:false
            },
            isLoading:false,
            toasts: [ /* IToastProps[] */ ],
            skills:{
                skillsSelected:{value:[], criteria:{type:"array", min:1, max:5}},
                skillsFetched:[],
            },
            loginDrawer:{
                isOpen:false,
                handleClose:() => {this.setState(state => {
                    let base = state.loginDrawer;
                    base.isOpen = false
                    return {loginDrawer:base}
                })},
                handleOpen:() => {this.setState(state => {
                    let base = state.loginDrawer;
                    base.isOpen = true
                    return {loginDrawer:base}
                })} 
            },
            signUpDrawer:{
                isOpen:false,
                handleClose:() => {this.setState(state => {
                    let base = state.signUpDrawer;
                    base.isOpen = false
                    return {loginDrawer:base}
                })},
                handleOpen:() => {this.setState(state => {
                    let base = state.signUpDrawer;
                    base.isOpen = true
                    return {loginDrawer:base}
                })} 
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
            this.props.handleStates(1);
            $(".modal-backdrop").hide();
            window.document.body.style.overflowY = "visible";
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
                this.props.handleStates(1);
                $(".modal-backdrop").hide();
                window.document.body.style.overflowY = "visible";
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
                  skills:[],
                  proposals:[],
                  activeCandidancies:[],
                  cards:40,
                  country:this.state.signUpData.country
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
            
                <Navbar logo={logo}
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
                            onClick:this.state.loginDrawer.handleOpen,
                            key:5
                        },
                        {
                            type:"button",
                            text:"Sign Up",
                            dataToggle:"modal",
                            dataTarget:"#signUpPanel",
                            onClick:this.state.signUpDrawer.handleOpen,
                            key:6
                        }
                    ]
                }
                />
            <div className="container-fluid  text-center padding-1"  id="about">
            <img src={MainGraphic} width="450px"/>
                <h1>Welcome to StaffedApp</h1>            
                <h5 style={{fontWeight:"normal"}} className="m-3">The Moderm and Simplest Solution for Managing Your Projects
                 And Hiring Professional Freelancers
                </h5>
                <button type="button" data-toggle="modal" data-target="#signUpPanel" className="btn btn-custom-1 btn-lg m-3">Join Today</button>
            </div>
            <div className="container-fluid text-center bg-gradient-1 padding-2" id="productInfo">
                <h2 className="m-b-3" style={{color:"white"}}>Product Info</h2>
                <div className="row text-center">
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle special-icon">trending_up</i> Professional Freelancers</h4>
                        <h6>Turn On Your Business And Start Making Profit With The Best Freelancers</h6>
                        <img src={imgFeature1} style={{width:"200px"}} alt="feature one"/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle special-icon">security</i> Secure Payment</h4>
                        <h6>Payments Between Clients And Freelancers Made Secure With Scrow System</h6>
                        <img src={imgFeature2} style={{width:"200px"}} alt="feature two"/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3">
                        <h4><i className="material-icons mr-sm-2 align-middle special-icon">contact_support</i> Support</h4>
                        <h6>Support For Clients And Freelancers</h6>
                        <img src={imgFeature3} style={{width:"200px"}} alt="feature three"/>
                    </div>
                </div>
            </div>
            <div className="container-fluid text-center  padding-2" id="howToUse">
                <h2>How To Use</h2>
                <div className="row">
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 1</h4>
                        <p>Register</p>
                        <img src={imgSteep4} alt="steep 1" style={{width:"200px"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 2</h4>
                        <p>Click on Create Project in The Top Right Corner</p>
                        <img src={imgSteep1} alt="steep 1" style={{width:"200px"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 3</h4>
                        <p>Fill Out The Requeriments and Click Next</p>
                        <img src={imgSteep2} alt="steep 1" style={{width:"200px"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow-sm">
                        <h4>Steep 4</h4>
                        <p>Stablish Your Budget And That's It!</p>
                        <img src={imgSteep3} alt="steep 1" style={{width:"200px"}}/>
                    </div>
                </div>
            </div>

            <div className="container-fluid">
                <LoginDrawer handleAuth={this.handleAuth} isOpen={this.state.loginDrawer.isOpen} handleClose={this.state.loginDrawer.handleClose} openPanel={() => {this.state.loginDrawer.handleClose(); this.state.signUpDrawer.handleOpen()}}/>
                <SignUpDrawer handleAuth={this.handleAuth} isOpen={this.state.signUpDrawer.isOpen} handleClose={this.state.signUpDrawer.handleClose} openPanel={() => {this.state.signUpDrawer.handleClose(); this.state.loginDrawer.handleOpen()}}/>

            </div>
            </div>
        )
    }
}