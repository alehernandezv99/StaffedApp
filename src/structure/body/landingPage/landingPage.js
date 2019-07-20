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
                                 <label>Country</label> 
                                 <div>
                                 <select value={this.state.signUpData.country} className="custom-select-sm" onChange={(e) => {e.persist(); this.setState(state => {
                                     let base = state.signUpData
                                     base.country = e.target.options[e.target.selectedIndex].value
                                     return {
                                         signUpData:base
                                     }
                                 })}} >
     <option value="">Select Your Country</option>
   <option value="Afganistan">Afghanistan</option>
   <option value="Albania">Albania</option>
   <option value="Algeria">Algeria</option>
   <option value="American Samoa">American Samoa</option>
   <option value="Andorra">Andorra</option>
   <option value="Angola">Angola</option>
   <option value="Anguilla">Anguilla</option>
   <option value="Antigua & Barbuda">Antigua & Barbuda</option>
   <option value="Argentina">Argentina</option>
   <option value="Armenia">Armenia</option>
   <option value="Aruba">Aruba</option>
   <option value="Australia">Australia</option>
   <option value="Austria">Austria</option>
   <option value="Azerbaijan">Azerbaijan</option>
   <option value="Bahamas">Bahamas</option>
   <option value="Bahrain">Bahrain</option>
   <option value="Bangladesh">Bangladesh</option>
   <option value="Barbados">Barbados</option>
   <option value="Belarus">Belarus</option>
   <option value="Belgium">Belgium</option>
   <option value="Belize">Belize</option>
   <option value="Benin">Benin</option>
   <option value="Bermuda">Bermuda</option>
   <option value="Bhutan">Bhutan</option>
   <option value="Bolivia">Bolivia</option>
   <option value="Bonaire">Bonaire</option>
   <option value="Bosnia & Herzegovina">Bosnia & Herzegovina</option>
   <option value="Botswana">Botswana</option>
   <option value="Brazil">Brazil</option>
   <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
   <option value="Brunei">Brunei</option>
   <option value="Bulgaria">Bulgaria</option>
   <option value="Burkina Faso">Burkina Faso</option>
   <option value="Burundi">Burundi</option>
   <option value="Cambodia">Cambodia</option>
   <option value="Cameroon">Cameroon</option>
   <option value="Canada">Canada</option>
   <option value="Canary Islands">Canary Islands</option>
   <option value="Cape Verde">Cape Verde</option>
   <option value="Cayman Islands">Cayman Islands</option>
   <option value="Central African Republic">Central African Republic</option>
   <option value="Chad">Chad</option>
   <option value="Channel Islands">Channel Islands</option>
   <option value="Chile">Chile</option>
   <option value="China">China</option>
   <option value="Christmas Island">Christmas Island</option>
   <option value="Cocos Island">Cocos Island</option>
   <option value="Colombia">Colombia</option>
   <option value="Comoros">Comoros</option>
   <option value="Congo">Congo</option>
   <option value="Cook Islands">Cook Islands</option>
   <option value="Costa Rica">Costa Rica</option>
   <option value="Cote DIvoire">Cote DIvoire</option>
   <option value="Croatia">Croatia</option>
   <option value="Cuba">Cuba</option>
   <option value="Curaco">Curacao</option>
   <option value="Cyprus">Cyprus</option>
   <option value="Czech Republic">Czech Republic</option>
   <option value="Denmark">Denmark</option>
   <option value="Djibouti">Djibouti</option>
   <option value="Dominica">Dominica</option>
   <option value="Dominican Republic">Dominican Republic</option>
   <option value="East Timor">East Timor</option>
   <option value="Ecuador">Ecuador</option>
   <option value="Egypt">Egypt</option>
   <option value="El Salvador">El Salvador</option>
   <option value="Equatorial Guinea">Equatorial Guinea</option>
   <option value="Eritrea">Eritrea</option>
   <option value="Estonia">Estonia</option>
   <option value="Ethiopia">Ethiopia</option>
   <option value="Falkland Islands">Falkland Islands</option>
   <option value="Faroe Islands">Faroe Islands</option>
   <option value="Fiji">Fiji</option>
   <option value="Finland">Finland</option>
   <option value="France">France</option>
   <option value="French Guiana">French Guiana</option>
   <option value="French Polynesia">French Polynesia</option>
   <option value="French Southern Ter">French Southern Ter</option>
   <option value="Gabon">Gabon</option>
   <option value="Gambia">Gambia</option>
   <option value="Georgia">Georgia</option>
   <option value="Germany">Germany</option>
   <option value="Ghana">Ghana</option>
   <option value="Gibraltar">Gibraltar</option>
   <option value="Great Britain">Great Britain</option>
   <option value="Greece">Greece</option>
   <option value="Greenland">Greenland</option>
   <option value="Grenada">Grenada</option>
   <option value="Guadeloupe">Guadeloupe</option>
   <option value="Guam">Guam</option>
   <option value="Guatemala">Guatemala</option>
   <option value="Guinea">Guinea</option>
   <option value="Guyana">Guyana</option>
   <option value="Haiti">Haiti</option>
   <option value="Hawaii">Hawaii</option>
   <option value="Honduras">Honduras</option>
   <option value="Hong Kong">Hong Kong</option>
   <option value="Hungary">Hungary</option>
   <option value="Iceland">Iceland</option>
   <option value="Indonesia">Indonesia</option>
   <option value="India">India</option>
   <option value="Iran">Iran</option>
   <option value="Iraq">Iraq</option>
   <option value="Ireland">Ireland</option>
   <option value="Isle of Man">Isle of Man</option>
   <option value="Israel">Israel</option>
   <option value="Italy">Italy</option>
   <option value="Jamaica">Jamaica</option>
   <option value="Japan">Japan</option>
   <option value="Jordan">Jordan</option>
   <option value="Kazakhstan">Kazakhstan</option>
   <option value="Kenya">Kenya</option>
   <option value="Kiribati">Kiribati</option>
   <option value="Korea North">Korea North</option>
   <option value="Korea Sout">Korea South</option>
   <option value="Kuwait">Kuwait</option>
   <option value="Kyrgyzstan">Kyrgyzstan</option>
   <option value="Laos">Laos</option>
   <option value="Latvia">Latvia</option>
   <option value="Lebanon">Lebanon</option>
   <option value="Lesotho">Lesotho</option>
   <option value="Liberia">Liberia</option>
   <option value="Libya">Libya</option>
   <option value="Liechtenstein">Liechtenstein</option>
   <option value="Lithuania">Lithuania</option>
   <option value="Luxembourg">Luxembourg</option>
   <option value="Macau">Macau</option>
   <option value="Macedonia">Macedonia</option>
   <option value="Madagascar">Madagascar</option>
   <option value="Malaysia">Malaysia</option>
   <option value="Malawi">Malawi</option>
   <option value="Maldives">Maldives</option>
   <option value="Mali">Mali</option>
   <option value="Malta">Malta</option>
   <option value="Marshall Islands">Marshall Islands</option>
   <option value="Martinique">Martinique</option>
   <option value="Mauritania">Mauritania</option>
   <option value="Mauritius">Mauritius</option>
   <option value="Mayotte">Mayotte</option>
   <option value="Mexico">Mexico</option>
   <option value="Midway Islands">Midway Islands</option>
   <option value="Moldova">Moldova</option>
   <option value="Monaco">Monaco</option>
   <option value="Mongolia">Mongolia</option>
   <option value="Montserrat">Montserrat</option>
   <option value="Morocco">Morocco</option>
   <option value="Mozambique">Mozambique</option>
   <option value="Myanmar">Myanmar</option>
   <option value="Nambia">Nambia</option>
   <option value="Nauru">Nauru</option>
   <option value="Nepal">Nepal</option>
   <option value="Netherland Antilles">Netherland Antilles</option>
   <option value="Netherlands">Netherlands (Holland, Europe)</option>
   <option value="Nevis">Nevis</option>
   <option value="New Caledonia">New Caledonia</option>
   <option value="New Zealand">New Zealand</option>
   <option value="Nicaragua">Nicaragua</option>
   <option value="Niger">Niger</option>
   <option value="Nigeria">Nigeria</option>
   <option value="Niue">Niue</option>
   <option value="Norfolk Island">Norfolk Island</option>
   <option value="Norway">Norway</option>
   <option value="Oman">Oman</option>
   <option value="Pakistan">Pakistan</option>
   <option value="Palau Island">Palau Island</option>
   <option value="Palestine">Palestine</option>
   <option value="Panama">Panama</option>
   <option value="Papua New Guinea">Papua New Guinea</option>
   <option value="Paraguay">Paraguay</option>
   <option value="Peru">Peru</option>
   <option value="Phillipines">Philippines</option>
   <option value="Pitcairn Island">Pitcairn Island</option>
   <option value="Poland">Poland</option>
   <option value="Portugal">Portugal</option>
   <option value="Puerto Rico">Puerto Rico</option>
   <option value="Qatar">Qatar</option>
   <option value="Republic of Montenegro">Republic of Montenegro</option>
   <option value="Republic of Serbia">Republic of Serbia</option>
   <option value="Reunion">Reunion</option>
   <option value="Romania">Romania</option>
   <option value="Russia">Russia</option>
   <option value="Rwanda">Rwanda</option>
   <option value="St Barthelemy">St Barthelemy</option>
   <option value="St Eustatius">St Eustatius</option>
   <option value="St Helena">St Helena</option>
   <option value="St Kitts-Nevis">St Kitts-Nevis</option>
   <option value="St Lucia">St Lucia</option>
   <option value="St Maarten">St Maarten</option>
   <option value="St Pierre & Miquelon">St Pierre & Miquelon</option>
   <option value="St Vincent & Grenadines">St Vincent & Grenadines</option>
   <option value="Saipan">Saipan</option>
   <option value="Samoa">Samoa</option>
   <option value="Samoa American">Samoa American</option>
   <option value="San Marino">San Marino</option>
   <option value="Sao Tome & Principe">Sao Tome & Principe</option>
   <option value="Saudi Arabia">Saudi Arabia</option>
   <option value="Senegal">Senegal</option>
   <option value="Seychelles">Seychelles</option>
   <option value="Sierra Leone">Sierra Leone</option>
   <option value="Singapore">Singapore</option>
   <option value="Slovakia">Slovakia</option>
   <option value="Slovenia">Slovenia</option>
   <option value="Solomon Islands">Solomon Islands</option>
   <option value="Somalia">Somalia</option>
   <option value="South Africa">South Africa</option>
   <option value="Spain">Spain</option>
   <option value="Sri Lanka">Sri Lanka</option>
   <option value="Sudan">Sudan</option>
   <option value="Suriname">Suriname</option>
   <option value="Swaziland">Swaziland</option>
   <option value="Sweden">Sweden</option>
   <option value="Switzerland">Switzerland</option>
   <option value="Syria">Syria</option>
   <option value="Tahiti">Tahiti</option>
   <option value="Taiwan">Taiwan</option>
   <option value="Tajikistan">Tajikistan</option>
   <option value="Tanzania">Tanzania</option>
   <option value="Thailand">Thailand</option>
   <option value="Togo">Togo</option>
   <option value="Tokelau">Tokelau</option>
   <option value="Tonga">Tonga</option>
   <option value="Trinidad & Tobago">Trinidad & Tobago</option>
   <option value="Tunisia">Tunisia</option>
   <option value="Turkey">Turkey</option>
   <option value="Turkmenistan">Turkmenistan</option>
   <option value="Turks & Caicos Is">Turks & Caicos Is</option>
   <option value="Tuvalu">Tuvalu</option>
   <option value="Uganda">Uganda</option>
   <option value="United Kingdom">United Kingdom</option>
   <option value="Ukraine">Ukraine</option>
   <option value="United Arab Erimates">United Arab Emirates</option>
   <option value="United States of America">United States of America</option>
   <option value="Uraguay">Uruguay</option>
   <option value="Uzbekistan">Uzbekistan</option>
   <option value="Vanuatu">Vanuatu</option>
   <option value="Vatican City State">Vatican City State</option>
   <option value="Venezuela">Venezuela</option>
   <option value="Vietnam">Vietnam</option>
   <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
   <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
   <option value="Wake Island">Wake Island</option>
   <option value="Wallis & Futana Is">Wallis & Futana Is</option>
   <option value="Yemen">Yemen</option>
   <option value="Zaire">Zaire</option>
   <option value="Zambia">Zambia</option>
   <option value="Zimbabwe">Zimbabwe</option>
</select>
                                 </div>
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