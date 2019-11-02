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
        this.checkCriteria = checkCriteria;

        this.state = {
            loginData:{
                email:"",
                password:"",
                remember:false
            },
            signUpData:{
                name:"",
                email:"",
                password:"",
                confirmPassword:"",
                country:"",
                remember:false
            },
            isLoading:false,
            toasts: [ /* IToastProps[] */ ],
            
            loginDrawer:{
                isOpen:false,
                handleClose:() => {
                    if(this._mounted){
                    this.setState(state => {
                    let base = state.loginDrawer;
                    base.isOpen = false
                    return {loginDrawer:base}
                })
            }
            },
                handleOpen:() => {
                    if(this._mounted){
                    this.setState(state => {
                    let base = state.loginDrawer;
                    base.isOpen = true
                    return {loginDrawer:base}
                })
            }
            } 
            },
            signUpDrawer:{
                isOpen:false,
                handleClose:() => {
                    if(this._mounted){
                    this.setState(state => {
                    let base = state.signUpDrawer;
                    base.isOpen = false
                    return {signUpDrawer:base}
                })
            }},
                handleOpen:() => {
                    if(this._mounted){
                    this.setState(state => {
                    let base = state.signUpDrawer;
                    base.isOpen = true
                    return {signUpDrawer:base}
                })} 
            }
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
        })
        .catch(e => {
            this.addToast(e.message);
            cb2();
        })
    }

    
    

    verifyData(collection, id, data, cb1 , cb2){
        firebase.firestore().collection(collection).doc(id).get()
        .then(doc => {
            if(!doc.exists){
                if(this._mounted){
                firebase.auth().currentUser.sendEmailVerification()
                .then(() => {
                        this.setData(collection, id, data, cb1, cb2)
                })
                .catch(e => {
                    this.addToast(e.message);
                })
                
                }
            }else {
               
                cb1();
                this.props.handleStates(1);
                
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

    componentWillUnmount(){
        this._mounted = false;

        $("a").off("click");
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
              var displayName = user.displayName;
              var email = user.email;
              var emailVerified = user.emailVerified;
              var photoURL = user.photoURL;
              var isAnonymous = user.isAnonymous;
              var uid = user.uid;
              var providerData = user.providerData;

              let data = {
                  displayName:displayName?displayName:this.state.signUpData.name,
                  email: email,
                  emailVerified: emailVerified,
                  photoURL: photoURL,
                  isAnonymous: isAnonymous,
                  uid: uid,
                  skills:[],
                  proposals:[],
                  activeCandidancies:[],
                  cards:40,
                  country:this.state.signUpData.country,
                  isOnline:true,
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
        if(this._mounted){
        await this.setState(state => {
            let objectRef = state[object];
            objectRef[field] = value
            return ({[object]:objectRef});
        })
    }
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
            this.toggleLoading();
        }
        }
    }

    toggleLoading(){
        if(this._mounted){
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }
    }
    setStates = async(data) => {
        let formObj = {};
        Object.keys(data).forEach(key => {
            
            if(key !== "skills"){
                formObj[key] = data[key]["value"];
            }
        })
        if(this._mounted){
      await  this.setState({
            signUpData:formObj
        })
    }

        this.handleAuth("signUp",this.state.signUpData.email, this.state.signUpData.password, this.state.signUpData.confirmPassword)
    }

    render(){
        return(
            <div>
                
                {this.state.isLoading === true? <LoadingSpinner />:null}
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
                            text:"Product Info",
                            href:"#productInfo",
                            onClick:() => {},
                            key:2,
                        },
                        {
                            type:"link",
                            text:"How To Use",
                            href:"#howToUse",
                            onClick:() => {},
                            key:3,
                        },
                        {
                            type:"link",
                            text:"Contact",
                            href:"#contact",
                            onClick:() => {},
                            key:4,
                        }
                    ]
                } 
                rightElements={
                    [
                        {
                            type:"button",
                            text:"Sign In",
                            dataToggle:"modal",
                            dataTarget:"#loginPanel",
                            onClick:this.state.loginDrawer.handleOpen,
                            key:5,
                            icon:"forward"
                        },
                        {
                            type:"button",
                            text:"Sign Up",
                            dataToggle:"modal",
                            dataTarget:"#signUpPanel",
                            onClick:this.state.signUpDrawer.handleOpen,
                            key:6,
                            icon:"exit_to_app",
                        }
                    ]
                }
                />
            <div className="container-fluid  text-center bg-top"  id="top" style={{paddingTop:"4em", paddingBottom:"10em", paddingRight:"4em", paddingLeft:"5em"}}>
            <img src={MainGraphic} width="420px"/>
                <h1 style={{fontSize:"50px", color:"rgb(80,80,80)", fontWeight:700}}>Welcome to StaffedApp</h1>            
                <h4 style={{fontWeight:"normal", color:"rgb(100,100,100)", fontSize:"20px", fontWeight:600}} className="m-3">The Moderm and Simplest Solution for Managing Your Projects
                 And Hiring Professional Freelancers
                </h4>
                <button type="button" onClick={this.state.signUpDrawer.handleOpen} className="btn btn-custom-1 btn-lg m-3" style={{fontSize:"24px"}}>Join Today</button>
            </div>
            <div className="container-fluid text-center bg-gradient-1 padding-3" >
                <h2 className="m-b-3" style={{color:"white", fontSize:"40px", fontWeight:700}} id="productInfo">Product Info</h2>
                <div className="row text-center mt-5">
                    <div className="col bg-color-white rounded m-3 px-4 py-5 shadow ">
                        <h4 style={{fontWeight:700,color:"rgb(80,80,80)"}}><i className="material-icons mr-sm-2 align-middle " style={{fontSize:"40px"}}>trending_up</i> Professional Freelancers</h4>
                        <h5 className="mt-3" style={{fontWeight:500, color:"rgb(100,100,100)"}}>Turn On Your Business And Start Making Profit With The Best Freelancers</h5>
                        <img  className="mt-4" src={imgFeature1} style={{width:"200px"}} alt="feature one"/>
                    </div>
                    <div className="col bg-color-white rounded m-3 px-4 py-5 shadow">
                        <h4 style={{fontWeight:700,color:"rgb(80,80,80)"}}><i className="material-icons mr-sm-2 align-middle" style={{fontSize:"40px"}}>security</i> Secure Payment</h4>
                        <h5 className="mt-3"  style={{fontWeight:500,color:"rgb(100,100,100)"}}>Payments Between Clients And Freelancers Made Secure With Scrow System</h5>
                        <img className="mt-4" src={imgFeature2} style={{width:"200px"}} alt="feature two"/>
                    </div>
                    <div className="col bg-color-white rounded m-3 px-4 py-5 shadow">
                        <h4 style={{fontWeight:700,color:"rgb(80,80,80)"}}><i className="material-icons mr-sm-2 align-middle" style={{fontSize:"40px"}}>contact_support</i> Support</h4>
                        <h5 className="mt-3"  style={{fontWeight:500,color:"rgb(100,100,100)"}}>Support For Clients And Freelancers. Any doubt or issue, we'll be there for you</h5>
                        <img className="mt-4" src={imgFeature3} style={{width:"200px"}} alt="feature three"/>
                    </div>
                </div>
            </div>
            <div className="container-fluid text-center bg-bottom "  style={{paddingTop:"14em", paddingLeft:"4em", paddingRight:"4em", paddingBottom:"8em"}}>
                <h2 style={{color:"rgb(80,80,80)", fontSize:"40px" ,fontWeight:700}} id="howToUse">How To Use</h2>
                <div className="row mt-5">
                    <div className="col bg-color-white rounded m-3 p-3 shadow">
                        <h4 style={{fontWeight:700,color:"rgb(80,80,80)"}}>Steep 1</h4>
                        <p style={{fontWeight:500, color:"rgb(100,100,100)"}}>Register</p>
                        <img src={imgSteep4} alt="steep 1" style={{width:"200px"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow">
                        <h4 style={{fontWeight:700,color:"rgb(80,80,80)"}}>Steep 2</h4>
                        <p style={{fontWeight:500, color:"rgb(100,100,100)"}}>Click on Create Project in The Top Right Corner</p>
                        <img src={imgSteep1} alt="steep 1" style={{width:"200px"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow">
                        <h4 style={{fontWeight:700,color:"rgb(80,80,80)"}}>Steep 3</h4>
                        <p style={{fontWeight:500, color:"rgb(100,100,100)"}}>Fill Out The Requeriments and Click Next</p>
                        <img src={imgSteep2} alt="steep 1" style={{width:"200px"}}/>
                    </div>
                    <div className="col bg-color-white rounded m-3 p-3 shadow">
                        <h4 style={{fontWeight:700,color:"rgb(80,80,80)"}}>Steep 4</h4>
                        <p style={{fontWeight:500, color:"rgb(100,100,100)"}}>Stablish Your Budget And That's It!</p>
                        <img src={imgSteep3} alt="steep 1" style={{width:"200px"}}/>
                    </div>
                </div>
            </div>

            <div className="container-fluid" id="portalContainer" >
                <LoginDrawer isLoading={this.state.isLoading} handleAuth={this.handleAuth} isOpen={this.state.loginDrawer.isOpen} handleClose={this.state.loginDrawer.handleClose} openPanel={() => {this.state.loginDrawer.handleClose(); this.state.signUpDrawer.handleOpen()}}/>
                <SignUpDrawer isLoading={this.state.isLoading} addToast={this.addToast} skills={this.state.skills} setStates={this.setStates} isOpen={this.state.signUpDrawer.isOpen} handleClose={this.state.signUpDrawer.handleClose} openPanel={() => {this.state.signUpDrawer.handleClose(); this.state.loginDrawer.handleOpen()}}/>

            </div>
            </div>
        )
    }
}