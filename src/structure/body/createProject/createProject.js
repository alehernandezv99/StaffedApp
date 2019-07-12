import React from "react";
import "./createProject.css";
import $ from "jquery";
import { Button, Position, Toast, Toaster, Classes} from "@blueprintjs/core";
import firebase from "../../../firebaseSetUp";
import LoadingSpinner from "../../loading/loadingSpinner";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";


export default class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          formA:{
            title:{value:"", criteria:{type:"text",minLength:3, maxLength:50, pattern:/^[a-zA-Z0-9\s]+$/}},
            description:{value:"", criteria:{type:"text",minLength:3, maxLength:500, pattern:/^[a-zA-Z0-9\s]+$/,}},
            skills:{value:[], criteria:{type:"array", min:1, max:5}},
            category:{value:"", criteria:{type:"text", minLength:2}},
            subCategory:{value:"", criteria:{type:"text", minLength:2}},
          },
          formB:{
            type:{value:"Fixed Price", criteria:{type:"text", minLength:2}},
            budget:{value:0, criteria:{type:"number", min:10, max:50000}},
            level:{value:"Intermediate", criteria:{type:"text", minLength:2}},
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
        this.addSkill = this.addSkill.bind(this);
        this.checkCriteria = checkCriteria;
    }

    addToast = (message) => {
      this.toaster.show({ message: message});
  }

  

  addSkill(skill){
    if(!(this.state.formA.skills["value"].includes(skill))){
      let skills = this.state.formA.skills["value"].slice();

      let criteria = this.state.formA.skills["criteria"];
    this.setState(state => {
      let formA = state.formA;
      skills.push(skill);
      if(this.checkCriteria(skills, criteria).check){
      formA.skills.value = skills;
      return({formA:formA});
      }else {
        this.addToast(this.checkCriteria(skills, criteria).message);
        return ({});
      }
    })
  }else {
    this.addToast("You cannot select two repeated skills")
  }
  }

  toggleLoading(){
    this.setState(state => ({
        isLoading:!state.isLoading
    }))
}

    componentDidMount(){

      $(".cp-section-2").hide();

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
            let formA = state.formA;
            let skills = formA.skills["value"];
  
            if((skills.includes(event.target.value) === false)){
              if(skillsArr.includes(event.target.value)){
                skills.push(event.target.value);
                let skillsObj = {value:skills, criteria:this.state.formA.skills.criteria}
                formA.skills = skillsObj;
                
                this.skillInput.value = "";
                return({formA:formA})
               
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

    gotToNextPage(from, to, checkObj){
      let message = "";
      let pass = 0;
      let messages = [];
      if(checkObj){
      

      Object.keys(checkObj).forEach(key => {
        if(this.checkCriteria(checkObj[key]["value"], checkObj[key]["criteria"]).check === false){
          messages.push(this.checkCriteria(checkObj[key]["value"], checkObj[key]["criteria"], key).message);
          pass = 1;
        }
      })

    }

    if(pass === 0){
      $(from).slideUp();
      $(to).slideDown();
      return {
        status:true,
        messages:messages
      }
    }else {
      for(let i = 0; i< messages.length; i++){
        this.addToast(messages[i]);
      }
      return {
        status:false,
        messages:messages
      }
    }
    }

    clearSkill(index){
      this.setState(state => {
        let skills = state.formA.skills.value;
        skills.splice(index,1)
        let formA = state.formA;
        let skillsObj = {value:skills, criteria:this.state.formA.skills.criteria}
        formA.skills = skillsObj;
        return({formA:formA});
      })
    }


    async setValue(obj, field, value, feedbackElement, element){
      
      if(this.state[obj][field]["criteria"]){
      if(this.checkCriteria(value, this.state[obj][field]["criteria"],field).check){
        if(feedbackElement && element){
        feedbackElement.style.display = "none";
        element.classList.remove("invalid-input-field");
        }
      }else {

        if(feedbackElement && element){
        feedbackElement.innerHTML = this.checkCriteria(value, this.state[obj][field]["criteria"], field).message;
        feedbackElement.style.display = "block";
        element.classList.add("invalid-input-field");
        }

        }
      }else {
      
      }

      this.setState(state => {
        let refObj = state[obj];
        refObj[field]["value"] = value;
        return {[obj]:refObj}
      })
     
   
    }

  
    createProject(){
      this.toggleLoading();
      let check = this.gotToNextPage("","", this.state.formB);
      let messages = check.messages;

      if(check.status){
      let formA = this.state.formA;
      let formB = this.state.formB;

      let skills = formA.skills["value"];
      let skillsObj = {};

      for(let i = 0; i< skills.length; i++){
        skillsObj[skills[i]] = true;
      }
      let data = {
        title:formA.title["value"],
        description:formA.description["value"],
        skills:skillsObj,
        category:formA.category["value"],
        subCategory:formA.subCategory["value"],
        type:formB.type["value"],
        budget:Number(formB.budget["value"]),
        level:formB.level["value"],
        status:"hiring",
        references:[],
        proposals:[],
        created:firebase.firestore.Timestamp.now(),
        cards:2,
        id:firebase.firestore().collection("projects").doc().id
      }

      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
      .then(snapshot => {
        let country = snapshot.data().country;
        let id = snapshot.id;

        data.country = country;
        data.author = id;

        firebase.firestore().collection("projects").doc(data.id).set(data)
      .then(() => {
        this.toggleLoading();
        this.addToast("Project Successfully Created");
      })
      .catch(e => {
        this.toggleLoading();
        this.addToast(e.message);
      })

      })
      .catch(e => {
        this.addToast("Something is Wrong :(");
        this.toggleLoading();
      })

      
    }else {
      
      this.toggleLoading();
    }
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
                                  this.setValue("formA","title",e.target.value,e.target.parentNode.childNodes[2], e.target)}} className="form-control"  required/>
                                  <div className="invalid-feedback">Valid.</div>
                                  <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                              <div className="form-group">
                                 <label>Description</label>
                                <textarea className="form-control"  onChange={(e) => {
                                  this.setValue("formA","description",e.target.value,e.target.parentNode.childNodes[2], e.target)}} placeholder="The description about the project" rows="5" style={{resize:"none"}} required></textarea>
                                <div className="invalid-feedback">Valid.</div>
                                <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                              <div className="form-group">
                                <label>Category</label>
                                <div>
                                  {this.state.categories.length > 0 ?
                                <select onChange={(e) => {this.setValue("formA","category",e.target.options[e.target.selectedIndex].value); this.findSubCategory(e.target.options[e.target.selectedIndex].value)}} className="custom-select-sm mb-1">
                                  <option>Select Category</option>
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
                                {this.state.formA.skills.value.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 mt-2 mb-2 mr-2 btn-sm">{skill} <i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => {this.clearSkill(index)}}>clear</i></button>
                                })}
                                </div>
                                <div className="autocomplete">
                                <input autoComplete="off" ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" id="skills-input" className="form-control" required/>
                                </div>
                              </div>
                              
                              <div>
                              <button type="button" className="btn btn-custom-1 btn-block mt-3" onClick={(e) => {this.gotToNextPage(".cp-section-1", ".cp-section-2", this.state.formA);}}>Next</button>
                              <div className="invalid-feedback"></div>
                              </div>
                            </form>

                            <form className="cp-section-2">
                            <div className="from-group">
                                  <label>Type of Contract</label>
                                  <div>
                                  <select onChange={(e) => {this.setValue("formB","type",e.target.options[e.target.selectedIndex].value)}} className="custom-select-sm mb-1">
                                    <option >Fixed Price</option>
                                 </select>
                                 </div>
                              </div>
                              <div className="form-group">
                                  <label>Budget</label>
                                  <input type="number" className="form-control" onChange={(e) => {this.setValue("formB","budget", e.target.value,e.target.parentNode.childNodes[2], e.target)}} required/>
                                  <div className="invalid-feedback">Valid.</div>
                                <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                             
                              <div className="form-group">
                                <label>Project Level</label>
                                <div>
                                  <select className="custom-select-sm" onChange={(e) => {this.setValue("formB","level", e.target.options[e.target.selectedIndex].value)}}>

                                    <option>Basic</option>
                                    <option selected value="Intermediate">Intermediate</option>
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
