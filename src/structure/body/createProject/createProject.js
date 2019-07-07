import React from "react";
import "./createProject.css";
import $ from "jquery";
import { Button, Position, Toast, Toaster, Classes} from "@blueprintjs/core";
import firebase from "../../../firebaseSetUp";
import LoadingSpinner from "../../loading/loadingSpinner";


export default class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          formA:{
            title:"",
            description:"",
            skills:[],
            category:"",
            subCategory:"",
            access:false,
          },
          formB:{
            type:"",
            budget:0,
            country:"",
            level:"",
            access:false,
          },
          categories:[],
          subCategories:[],
          skills:[],
          toasts: [ /* IToastProps[] */ ],
          isLoading:false,
        }
        

        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
        }

        this.gotToNextPage = this.gotToNextPage.bind(this);
        this.clearSkill = this.clearSkill.bind(this);
        this.setValue = this.setValue.bind(this);
        this.findSubCategory = this.findSubCategory.bind(this);
        this.createProject = this.createProject.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
        this.autocomplete  = this.autocomplete.bind(this);
    }

    addToast = (message) => {
      this.toaster.show({ message: message});
  }

  toggleLoading(){
    this.setState(state => ({
        isLoading:!state.isLoading
    }))
}

    componentDidMount(){
      firebase.firestore().collection("skills").get()
    .then(async snapshot => {
      let skills = [];
      snapshot.forEach(doc => {
        skills.push(doc.data().name);
        console.log(doc.data().name);
      })

      console.log(this.state.skills);
      await this.setState({skills:skills})
      this.autocomplete(document.getElementById("skills"), this.state.skills);
    })

      $(".cp-section-2").hide();

      $('#skills').keypress((event) => {
        if(event.keyCode == 13){
         
          if(event.target.value !== ""){
          this.setState(state => {
            let formA = state.formA;
            let skills = formA.skills;
            if((skills.includes(event.target.value) === false) && (skills.length < 5)){
            skills.push(event.target.value);
            formA.skills = skills;
            this.skillInput.value = "";
            return({formA:formA})
            }else {
              return {}
            }
          })
        
      }
      }
      });

      firebase.firestore().collection("categories").get()
      .then(snapshot => {
        let categories = [];
        snapshot.forEach(doc => {
          categories.push(doc.data().name);
        })
        this.setState({categories:categories})
      })

    
    }

    findSubCategory(category){
      firebase.firestore().collection("categories").where("name","==",category).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          firebase.firestore().collection("categories").doc(doc.id).collection("subCategories").get()
          .then(snapshot2 => {
            let subCategories = [];
            snapshot2.forEach(doc2 => {
              subCategories.push(doc2.data().name);
            })

            this.setState({subCategories:subCategories});
          })
        })
      })
    }

    gotToNextPage(from, to, check){
      let message = "";
      let pass = 0;

      if(check){
      if(this.state[check.obj][check.field] === check.value){
    }else {
      message = "There are invalid fields";
      this.addToast(message)
      pass = 1;
    }
   }

    if(pass === 0){
      $(from).slideUp();
      $(to).slideDown();
    }
    }

    clearSkill(index){
      this.setState(state => {
        let skills = state.formA.skills;
        skills.splice(index,1)
        let formA = state.formA;
        formA.skills = skills;
        return({formA:formA});
      })
    }

    async setValue(obj, field, value, criteria, feedbackElement, element){
      let check = 0;
      let message = "";

      if(criteria){
      if(criteria.type === "text"){
        if(!(value.length >= criteria.minLength)){
          check = 1;
          message += ` The ${field} is less than ${criteria.minLength} characters <br>` 
        }
        if(!(value.length <= criteria.maxLength)){
          message += ` The ${field} is greater than ${criteria.maxLength} characters <br>`;
          check = 1;
        }
        if(criteria.pattern.test(value) === false){
          check = 1
          message += ` The ${field} contain invalid characters <br>`
        }
      }

      if(criteria.type === "number"){
        if(!(Number(value) >= criteria.min)){
          check = 1;
          message += ` The ${field} is less than ${criteria.min} dollars <br>` 
        }
        if(!(Number(value) <= criteria.max)){
          message += ` The ${field} is greater than ${criteria.max} dollars <br>`;
          check = 1;
        }
      }
    }
      if(check === 0){
        if(criteria){
        feedbackElement.style.display = "none";
        element.classList.remove("invalid-input-field");
        }

      this.setState(state => {
        let refObj = state[obj];
        refObj[field] = value;
        if(criteria){
        refObj.access = true;
        }
        return {[obj]:refObj}
      })
    }else {
      if(criteria){
      feedbackElement.innerHTML = message;
      feedbackElement.style.display = "block";
      element.classList.add("invalid-input-field");
      }
      this.setState(state => {
        let formA = state.formA;
        formA.access = false;

        return ({formA:formA});
      })
    }
    }

    autocomplete(inp, arr) {
      console.log("Hello there");
      /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
      var currentFocus;
      /*execute a function when someone writes in the text field:*/
      inp.addEventListener("input", function(e) {
          var a, b, i, val = this.value;
          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) { return false;}
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          a = document.createElement("DIV");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);
          /*for each item in the array...*/
          for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
              b.innerHTML += arr[i].substr(val.length);
              /*insert a input field that will hold the current array item's value:*/
              b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
                  /*insert the value for the autocomplete text field:*/
                  inp.value = this.getElementsByTagName("input")[0].value;
                  /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                  closeAllLists();
              });
              a.appendChild(b);
            }
          }
      });
      /*execute a function presses a key on the keyboard:*/
      inp.addEventListener("keydown", function(e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          }
      });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
    }

    createProject(){
      this.toggleLoading();
      let formA = this.state.formA;
      let formB = this.state.formB;
      let data = {
        title:formA.title,
        description:formA.description,
        skills:formA.skills,
        category:formA.category,
        subCategory:formA.subCategory,
        type:formB.type,
        budget:formB.budget,
        country:formB.country,
        level:formB.level,
        created:new Date()
      }

      firebase.firestore().collection("projects").add(data)
      .then(() => {
        this.toggleLoading();
        this.addToast("Project Successfully Created");
      })
      .catch(e => {
        this.toggleLoading();
        this.addToast(e.message);
      })
    }

    render(){
    return(
        <div className="modal fade" id={this.props.id}>
          {this.state.isLoading === true? <LoadingSpinner />:null}
          <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
           {/* "Toasted!" will appear here after clicking button. */}
            {this.state.toasts.map(toast => <Toast {...toast} />)}
         </Toaster>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                            
                                <h4 className="modal-title text-center">Create Project</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                            <form className="cp-section-1" >
                              <div className="form-group">
                                <label>Title</label>
                                <input type="text" placeholder="Title of the project" onChange={(e) => {
                                  this.setValue("formA","title",e.target.value,{type:"text",minLength:3, maxLength:50, pattern:/^[a-zA-Z0-9\s]+$/},e.target.parentNode.childNodes[2], e.target)}} className="form-control"  required/>
                                  <div className="invalid-feedback">Valid.</div>
                                  <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                              <div className="form-group">
                                 <label>Description</label>
                                <textarea className="form-control"  onChange={(e) => {
                                  this.setValue("formA","description",e.target.value,{type:"text",minLength:3, maxLength:200, pattern:/^[a-zA-Z0-9\s]+$/,},e.target.parentNode.childNodes[2], e.target)}} placeholder="The description about the project" rows="5" style={{resize:"none"}} required></textarea>
                                <div className="invalid-feedback">Valid.</div>
                                <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                              <div className="form-group">
                                <label>Category</label>
                                <div>
                                  {this.state.categories.length > 0 ?
                                <select onChange={(e) => {this.setValue("formA","category",e.target.options[e.target.selectedIndex].value); this.findSubCategory(e.target.options[e.target.selectedIndex].value)}} className="custom-select-sm mb-1">
                                  {this.state.categories.map((category ,i) => {
                                    return (<option key={i}>{category}</option>)
                                  })}
                                </select>
                                :<div className="spinner-border"></div>
                                  }
                                </div>
                              </div>

                              <div className="form-group">
                                <label>Sub Category</label>
                                <div>
                                  {this.state.subCategories.length > 0 ?
                                <select onChange={(e) => {this.setValue("formA","subCategory",e.target.options[e.target.selectedIndex].value)}} className="custom-select-sm mb-1">
                                  <option>Select Category </option>
                                  {this.state.subCategories.map((category,i) => {
                                    return (<option key={i}>{category}</option>)
                                  })}
                                </select>
                                :<div>Select a Category First</div>
                                  }
                                </div>
                              </div>

                              <div className="form-group" ref={el => this.skills = el} id="skills">
                                <label >Skills Required</label>
                                <div>
                                {this.state.formA.skills.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 mt-2 mb-2 mr-2 btn-sm">{skill} <i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => {this.clearSkill(index)}}>clear</i></button>
                                })}
                                </div>
                                <div className="autocomplete">
                                <input autoComplete="off" ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" id="skills" className="form-control" required/>
                                </div>
                              </div>
                              
                              <div>
                              <button type="button" className="btn btn-custom-1 btn-block mt-3" onClick={(e) => {this.gotToNextPage(".cp-section-1", ".cp-section-2",{obj:"formA",field:"access",value:true});}}>Next</button>
                              <div className="invalid-feedback"></div>
                              </div>
                            </form>

                            <form className="cp-section-2">
                            <div className="from-group">
                                  <label>Type of Contract</label>
                                  <div>
                                  <select onChange={(e) => {this.setValue("formB","type",e.target.options[e.target.selectedIndex].value)}} className="custom-select-sm mb-1">
                                    <option defaultValue>Fixed Price</option>
                                    <option>Per Hour</option>
                                 </select>
                                 </div>
                              </div>
                              <div className="form-group">
                                  <label>Budget</label>
                                  <input type="number" className="form-control" onChange={(e) => {this.setValue("formB","budget", e.target.value, {type:"number", min:10, max:50000},e.target.parentNode.childNodes[2], e.target)}} required/>
                                  <div className="invalid-feedback">Valid.</div>
                                <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                              <div className="form-group">
                                <label>Country</label>
                                <div>
                                <select id="country" name="country" onChange={(e) => {this.setValue("formB","country",e.target.options[e.target.selectedIndex].value)}}  className="custom-select-sm">
                <option value="Afghanistan">Afghanistan</option>
                <option value="Åland Islands">Åland Islands</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
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
                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Bouvet Island">Bouvet Island</option>
                <option value="Brazil">Brazil</option>
                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                <option value="Brunei Darussalam">Brunei Darussalam</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cote D'ivoire">Cote D'ivoire</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                <option value="Faroe Islands">Faroe Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern Territories">French Southern Territories</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guernsey">Guernsey</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-bissau">Guinea-bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Isle of Man">Isle of Man</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jersey">Jersey</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                <option value="Korea, Republic of">Korea, Republic of</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macao">Macao</option>
                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                <option value="Moldova, Republic of">Moldova, Republic of</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Netherlands Antilles">Netherlands Antilles</option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Pitcairn">Pitcairn</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russian Federation">Russian Federation</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Helena">Saint Helena</option>
                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                <option value="Taiwan, Province of China">Taiwan, Province of China</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-leste">Timor-leste</option>
                <option value="Togo">Togo</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Viet Nam">Viet Nam</option>
                <option value="Virgin Islands, British">Virgin Islands, British</option>
                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                <option value="Wallis and Futuna">Wallis and Futuna</option>
                <option value="Western Sahara">Western Sahara</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
            </select>
                                </div>
                              </div>
                              <div className="form-group">
                                <label>Project Level</label>
                                <div>
                                  <select className="custom-select-sm" onChange={(e) => {this.setValue("formB","level", e.target.options[e.target.selectedIndex].value)}}>
                                    <option>Basic</option>
                                    <option defaultValue>Intermediate</option>
                                    <option>Advanced</option>
                                  </select>
                                </div>
                              </div>
                              <button type="button" className="btn btn-custom-1 btn-block mt-3" onClick={(e) => {this.createProject()}}>Create Project</button>
                            </form>

                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-custom-1" onClick={() => {this.gotToNextPage(".cp-section-2",".cp-section-1")}}>Back</button>
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
    )
}
}
