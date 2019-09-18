import React from "react";
import "./createProject.css";
import $ from "jquery";
import { Button, Position, Classes, Slider, Drawer, DateInput, Toaster, Toast} from "@blueprintjs/core";
import firebase from "../../../firebaseSetUp";
import LoadingSpinner from "../../loading/loadingSpinner";
import autocomplete from "../../../utils/autocomplete";
import checkCriteria from "../../../utils/checkCriteria";
import KeywordsGeneration from "../../../utils/keywordsGeneration";



export default class CreateProject extends React.Component{
    constructor(props){
        super(props);

        this.state = {
          formA:{
            title:{value:"", criteria:{type:"text",minLength:3, maxLength:50}},
            description:{value:"", criteria:{type:"text",minLength:3, maxLength:1500}},
            skills:{value:[], criteria:{type:"array", min:1, max:5}},
            category:{value:"", criteria:{type:"text", minLength:2}},
            subCategory:{value:"", criteria:{type:"text", minLength:2}},
          },
          formB:{
            type:{value:"Fixed Price", criteria:{type:"text", minLength:2}},
            budget:{value:0, criteria:{type:"number", min:10, max:50000}},
            level:{value:"Intermediate", criteria:{type:"text", minLength:2}},
          },
          mode:"",
          categories:[],
          subCategories:[],
          skills:[],
          toasts: [ /* IToastProps[] */ ],
          isLoading:false,
          back:false
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
      if(this._mounted){
    this.setState(state => {
      let formA = state.formA;
      skills.push(skill);
   
      formA.skills.value = skills;
      return({formA:formA});
      
    })
  }
  }else {
    this.addToast("You cannot select two repeated skills")
  }
  }

  toggleLoading(){
    if(this._mounted){
    this.setState(state => ({
        isLoading:!state.isLoading
    }))
  }
}
  
bindSkillInput = () => {
  $('#skills-input-1').keypress((event) => {
    if(event.keyCode == 13){
      if(event.target.value !== ""){
     

        firebase.firestore().collection("skills").get()
        .then(snapshot => {
          let skillsArr = [];
          snapshot.forEach(doc => {
            skillsArr.push(doc.data().name);
          })

          if(this._mounted){
           this.setState(state => {
        let formA = state.formA;
        let skills = formA.skills["value"];

        if((skills.includes(event.target.value) === false)){
         
            skills.push(event.target.value);
            let skillsObj = {value:skills, criteria:this.state.formA.skills.criteria}
            formA.skills = skillsObj;
            
            this.skillInput.value = "";
            return({formA:formA})
           
         

        }else {
          this.addToast("You cannot select two repeated skills")
          return {}
        }
        })
      }
        
       
      })
    
  }
  }
  });
}

fetchProjectData =() => {
  firebase.firestore().collection("projects").doc(this.props.id).get()
  .then(doc => {
    let data = doc.data();
    if(this._mounted){
      this.setState(state => {
        let base = state.formA;
        base.title.value = data.title
        base.description.value = data.description;
        base.skills.value = data.skills;
        base.category.value = data.category;
        base.subCategory.value = data.subCategory; 

        let base2 = state.formB;
        base2.type.value = data.type;
        base2.budget.value = data.budget;
        base2.level.value = data.level

        return {
          formA:base,
          formB:base2
        }
      })
    }
  })
  .catch(e => {
    this.addToast("Ohoh something went wrong!")
  })
}
  
componentWillUnmount(){
  this._mounted = false;
}

    componentDidMount(){

      this._mounted = true;
      $(".cp-section-2").hide();

     
      if(this.props.mode === "create"){
        if(this._mounted){
          this.setState({
            mode:"create"
          })
        }
      }else if(this.props.mode === "update"){
        this.fetchProjectData();
        if(this._mounted){
          this.setState({
            mode:"update"
          })
        }
      }

      firebase.firestore().collection("categories").get()
      .then(snapshot => {
        let categories = [];
        snapshot.forEach(doc => {
          categories.push(doc.data().name);
        })
        this.setState({categories:categories})
      })

      this.findSubCategory()

    
    }

    findSubCategory(){
      firebase.firestore().collection("subCategories").get()
      .then(snapshot => {
        let subCategories = [];
        snapshot.forEach(doc => {
              subCategories.push(doc.data().name);
            })

            this.setState({subCategories:subCategories});
      })
      .catch(e => {
        this.addToast(e.message);
      })
    }

    gotToNextPage(from, to, checkObj){
      let message = "";
      let pass = 0;
      let messages = [];
      if(checkObj){
      

      Object.keys(checkObj).forEach(key => {
        if(this.checkCriteria(checkObj[key]["value"], checkObj[key]["criteria"]).check === false){
          if(key !== "category" && key !== "subCategory"){
          messages.push(this.checkCriteria(checkObj[key]["value"], checkObj[key]["criteria"], key).message);
          }else if(key === "category"){
            messages.push("Category Not Selected");
          }else if(key === "subCategory"){
            messages.push("Sub Category Not Selected")
          }
          pass = 1;
        }
      })

    }

    if(pass === 0){
      $(from).slideUp();
      $(to).slideDown();
      this.setState({
        back:true
      })
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

    updateProject = () => {
      this.toggleLoading();
      let check = this.gotToNextPage("","", this.state.formB);
      let messages = check.messages;

      if(check.status){
      let formA = this.state.formA;
      let formB = this.state.formB;

      let skills = formA.skills["value"];

      let skillsExclusive = {}
      for(let i =0; i < skills.length; i++){
        skillsExclusive[skills[i]]  =  true;
      }
      
      let data = {
        title:formA.title["value"],
        skillsExclusive:skillsExclusive,
        keywords:KeywordsGeneration.generateKeywords(formA.title["value"]).concat([""]),
        description:formA.description["value"],
        skills:skills,
        category:formA.category["value"],
        subCategory:formA.subCategory["value"],
        type:formB.type["value"],
        budget:Number(formB.budget["value"]),
        level:formB.level["value"],
        updated:firebase.firestore.Timestamp.now(),
        cards:2,
      }

      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
      .then(snapshot => {
        let country = snapshot.data().country;
        let id = snapshot.id;

        data.country = country;
        data.author = id;
        data.involved = [snapshot.data().email]

        firebase.firestore().collection("projects").doc(this.props.id).update(data)
      .then(async () => {
        this.toggleLoading();
          console.log("Project Updated");
          this.addToast("Project Updated");
          this.props.handleClose();
         // this.props.reloadProjects?this.props.reloadProjects():(()=>{})()
      })
      .catch(e => {
        this.toggleLoading();
        this.addToast(e.message);
        this.setted = undefined;
      })

      })
      .catch(e => {
        this.addToast(e.message);
        this.toggleLoading();
        this.setted = undefined;
      })

      
    }else {
      
      this.toggleLoading();
    }
    }
  
    createProject(){
      this.toggleLoading();
      let check = this.gotToNextPage("","", this.state.formB);
      let messages = check.messages;

      if(check.status){
      let formA = this.state.formA;
      let formB = this.state.formB;

      let skills = formA.skills["value"];

      let skillsExclusive = {}
      for(let i =0; i < skills.length; i++){
        skillsExclusive[skills[i]]  =  true;
      }

      
      
      let data = {
        title:formA.title["value"],
        skillsExclusive:skillsExclusive,
        keywords:KeywordsGeneration.generateKeywords(formA.title["value"]).concat([""]).concat.apply([],skills.map((e => KeywordsGeneration.generateKeywords(e)))).concat(KeywordsGeneration.generateKeywords(formA.category["value"])).concat(KeywordsGeneration.generateKeywords(formA.subCategory["value"])).concat(KeywordsGeneration.generateKeywords(formB.level["value"])).concat([""]).concat(KeywordsGeneration.generateKeywords(formA.title["value"])),
        description:formA.description["value"],
        skills:skills,
        category:formA.category["value"],
        subCategory:formA.subCategory["value"],
        type:formB.type["value"],
        budget:Number(formB.budget["value"]),
        level:formB.level["value"],
        status:"hiring",
        references:[],
        applicants:[],
        invitations:[],
        TODO:[],
        created:firebase.firestore.Timestamp.now(),
        updated:firebase.firestore.Timestamp.now(),
        cards:2,
        id:firebase.firestore().collection("projects").doc().id
      }

      firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
      .then(snapshot => {
        let country = snapshot.data().country;
        let id = snapshot.id;

        data.country = country;
        data.author = id;
        data.involved = [snapshot.data().email]

        firebase.firestore().collection("projects").doc(data.id).set(data)
      .then(async () => {
        this.toggleLoading();
          console.log("Project Created");
          this.addToast("Project Created");
          this.props.handleClose();
          this.props.reloadProjects?this.props.reloadProjects():(()=>{})()
      })
      .catch(e => {
        this.toggleLoading();
        this.addToast(e.message);
        this.setted = undefined;
      })

      })
      .catch(e => {
        this.addToast(e.message);
        this.toggleLoading();
        this.setted = undefined;
      })

      
    }else {
      
      this.toggleLoading();
    }
    }

    handleClose = async() => {
     await this.setState(state => {
        let base = state.formA;
        base.skills.value = [];
        base.title.value = "";
        base.description.value = "";
        base.category.value = "";
        base.subCategory.value = "";

        let base2 = state.formB;
        base2.type.value = "Fixed Price";
        base2.budget.value = 0;
        base2.level.value = "Intermediate";

        return {
          formA:base,
          formB:base2
        }
        
      })

      this.props.handleClose();
      this.setted = undefined
    }

    render(){
    return(
      <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} style={{zIndex:999}} onClose={this.handleClose} title={""} size={"75%"} isOpen={this.props.isOpen}>
        <div className={Classes.DRAWER_BODY}>
       <div className={`${Classes.DIALOG_BODY}`}>
      
          {this.state.isLoading === true? <LoadingSpinner />:null}
          <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
           {/* "Toasted!" will appear here after clicking button. */}
            {this.state.toasts.map(toast => <Toast {...toast} />)}
         </Toaster>
                        <div className="card">
                            <div className="card-header">
                            
                                <h4 className="card-title text-center">{this.state.mode === "create"?"Create Project":this.state.mode ==="update"?"Edit Project":null}</h4>
                              
                            </div>
                            <div className="card-body">
                            <form className="cp-section-1" >
                              <div className="form-group mt-2">
                                <label>* Title</label>
                                <input type="text" placeholder="Title of the project" value={this.state.formA.title.value} onChange={(e) => {
                                  this.setValue("formA","title",e.target.value,e.target.parentNode.childNodes[2], e.target)}} className="form-control"  required/>
                                  <div className="invalid-feedback">Valid.</div>
                                  <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                              <div className="form-group">
                                 <label>* Description</label>
                                <textarea className="form-control" value={this.state.formA.description.value}  onChange={(e) => {
                                  this.setValue("formA","description",e.target.value,e.target.parentNode.childNodes[2], e.target)}} placeholder="The description about the project" rows="5" style={{resize:"none"}} required></textarea>
                                <div className="invalid-feedback">Valid.</div>
                                <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                              <div className="form-group mt-2">
                                <label>* Category</label>
                                <div>
                                  {this.state.categories.length > 0 ?
                                <select value={this.state.formA.category.value} onChange={(e) => {this.setValue("formA","category",e.target.options[e.target.selectedIndex].value);}} className="custom-select-sm mb-1">
                                  <option>Select Category</option>
                                  {this.state.categories.map((category ,i) => {
                                    return (<option key={i}>{category}</option>)
                                  })}
                                  <option value="Other">Other</option>
                                </select>
                                :<div className="spinner-border"></div>
                                  }
                                </div>
                              </div>

                              <div className="form-group mt-2">
                                <label>* Sub Category</label>
                                <div>
                                  {this.state.subCategories.length > 0 ?
                                <select value={this.state.formA.subCategory.value} onChange={(e) => {this.setValue("formA","subCategory",e.target.options[e.target.selectedIndex].value)}} className="custom-select-sm mb-1">
                                  <option>Select Category </option>
                                  
                                  {this.state.subCategories.map((category,i) => {
                                    return (<option key={i}>{category}</option>)
                                  })}
                                  <option value="Other">Other</option>
                                </select>
                                :<div className="spinnder-border"></div>
                                  }
                                </div>
                              </div>

                              <div className="form-group mt-2" ref={el => this.skills = el} id="skills">
                                <label >* Skills</label>
                                <div>
                                {this.state.formA.skills.value.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 mt-2 mb-2 mr-2 btn-sm">{skill} <i  className="material-icons ml-1 align-middle skill-close" onClick={(e) => {this.clearSkill(index)}}>clear</i></button>
                                })}
                                </div>
                                <div className="autocomplete">
                                <input autoComplete="off" ref={ref => this.skillInput = ref} type="text" placeholder="Choose your skill and press enter" id="skills-input-1" className="form-control" onChange={e => {
                                  if(this.setted === undefined){
                                    this.setted = true;
                                    this.bindSkillInput();
                                    firebase.firestore().collection("skills").get()
                                .then(async snapshot => {
                                  let skills = [];
                                  snapshot.forEach(doc => {
                                    skills.push(doc.data().name);
                                  })
                            
                                  
                                  autocomplete(document.getElementById("skills-input-1"), skills, this.addSkill);
                                })
                                  }
                                }} required/>
                                </div>
                                
                              </div>
                              
                              <div>
                              <button type="button" className="btn btn-custom-1 btn-block mt-3" onClick={(e) => {this.gotToNextPage(".cp-section-1", ".cp-section-2", this.state.formA);}}>Next</button>
                              <div className="invalid-feedback"></div>
                              </div>
                            </form>

                            <form className="cp-section-2" style={{display:"none"}}>
                            <div className="from-group">
                                  <label>Type of Contract</label>
                                  <div>
                                  <select onChange={(e) => {this.setValue("formB","type",e.target.options[e.target.selectedIndex].value)}} className="custom-select-sm mb-1">
                                    <option >Fixed Price</option>
                                 </select>
                                 </div>
                              </div>
                              <div className="form-group mt-2">
                                  <label>Budget <span className="light-text">($US Dollars)</span></label>
                                  <input value={this.state.formB.budget.value} type="number" className="form-control" onChange={(e) => {this.setValue("formB","budget", e.target.value,e.target.parentNode.childNodes[2], e.target)}} required/>
                                  <div className="invalid-feedback">Valid.</div>
                                <div className="valid-feedback">Please fill out this field.</div>
                              </div>
                             
                              <div className="form-group mt-2">
                                <label>Project Level</label>
                                <div>
                                  <select value={this.state.formB.level.value} className="custom-select-sm" onChange={(e) => {this.setValue("formB","level", e.target.options[e.target.selectedIndex].value)}}>

                                    <option>Basic</option>
                                    <option selected value="Intermediate">Intermediate</option>
                                    <option>Advanced</option>
                                  </select>
                                </div>
                              </div>
                             {this.state.mode === "create"?<button type="button" className="btn btn-custom-1 btn-block mt-3" onClick={(e) => {this.createProject()}}>Create Project</button>:null}
                             {this.state.mode === "update"?<button type="button" className="btn btn-custom-1 btn-block mt-3" onClick={(e) => {this.updateProject()}}>Update Project</button>:null}
                            </form>

                            </div>
                            <div className="card-footer">
                              <button style={{display:this.state.back=== true?"inline":"none"}} type="button" className="btn btn-custom-1" onClick={() => {this.gotToNextPage(".cp-section-2",".cp-section-1"); this.setState({back:false})}}>Back</button>
                                <button type="button" className="btn btn-danger ml-3" onClick={() => {this.props.handleClose()}}>Cancel</button>
                            </div>
                            
                        </div>
                    
                
                </div>
                </div>
                </Drawer>
    )
}
}
