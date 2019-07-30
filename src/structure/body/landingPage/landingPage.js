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
            $(".modal-backdrop").hide();
            window.document.body.style.overflowY = "visible";
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
                this.setData(collection, id, data, cb1, cb2)
                }
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
            <div className="container-fluid  text-center padding-1"  id="top">
            <img src={MainGraphic} width="450px"/>
                <h1>Welcome to StaffedApp</h1>            
                <h5 style={{fontWeight:"normal"}} className="m-3">The Moderm and Simplest Solution for Managing Your Projects
                 And Hiring Professional Freelancers
                </h5>
                <button type="button" onClick={this.state.signUpDrawer.handleOpen} className="btn btn-custom-1 btn-lg m-3">Join Today</button>
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

            <div className="container-fluid" id="portalContainer">
                <LoginDrawer isLoading={this.state.isLoading} handleAuth={this.handleAuth} isOpen={this.state.loginDrawer.isOpen} handleClose={this.state.loginDrawer.handleClose} openPanel={() => {this.state.loginDrawer.handleClose(); this.state.signUpDrawer.handleOpen()}}/>
                <SignUpDrawer isLoading={this.state.isLoading} addToast={this.addToast} skills={this.state.skills} setStates={this.setStates} isOpen={this.state.signUpDrawer.isOpen} handleClose={this.state.signUpDrawer.handleClose} openPanel={() => {this.state.signUpDrawer.handleClose(); this.state.loginDrawer.handleOpen()}}/>

            </div>
            </div>
        )
    }
}