import React from "react";
import "./staffCreator.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import CVcontent from "../CVcontent";
import firebase from "../../../../firebaseSetUp";
import checkCriteria from "../../../../utils/checkCriteria";
import $ from "jquery";

export default class StaffCreator extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            saved:false,
            progress:null,
            submitted:false,
            CV:{
                id:"",
                description:[],
                experience:[],
                education:[],
                portfolio:[],
                skills:[],
                expertise:[],
                contact:[],
                editable:true,
                order:[1,2,3,4,5,6],
                photoURL:null
            },
            inputs:{
                description:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                experience:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                education:{
                    title:"",
                    description:"",
                    isOpen:false                
                },
                portfolio:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                skills:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                expertise:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                contact:{
                    title:"",
                    description:"",
                    isOpen:false
                },

            },

            inputsEdit:{
                description:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                experience:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                education:{
                    title:"",
                    description:"",
                    isOpen:false                
                },
                portfolio:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                skills:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                expertise:{
                    title:"",
                    description:"",
                    isOpen:false
                },
                contact:{
                    title:"",
                    description:"",
                    isOpen:false
                },

            },
        }
    }

    toggleAddContent = (id,type,field) => {
        if(type === "up"){
        $(id).slideUp("fast")

        if(this._mounted){
            this.setState(state => {
                let base = state.inputs;
                base[field].isOpen = false;

                return {
                    inputs:base
                }
            })
        }
    }else if(type === "down"){
        $(id).slideDown("fast")

        if(this._mounted){
            this.setState(state => {
                let base =state.inputs;
                base[field].isOpen = true;

                return {
                    inputs:base
                }
            })
        }
    }
    }

    addElement = (field, obj,) => {
        let check = 0;
        let messages = [];

        Object.keys(obj).forEach(key => {
            let message = checkCriteria(obj[key],{minLength:3, type:"text"},key).message;
            if(!checkCriteria(obj[key],{minLength:3, type:"text"},key).check){
                check = 1;
                messages.push(message)
            }
        })

        if(check === 0){
        if(this._mounted){
        this.setState(state => {
            //CV
            let base = state.CV;
            let base2 = base[field];
            base2.push(obj);
            base[field] = base2;

            //Input
            let inputs = state.inputs;
            let inputs1 = inputs[field];
            let base3 = inputs1["title"];
            base3 = ""
            let base4 = inputs1["description"];
            base4 = "";
            inputs1["title"] = base3;
            inputs1["description"] = base4;
            inputs[field] = inputs1
            return {
                CV:base,
                inputs:inputs
            }
        })
      }
    }else {
        for(let i = 0; i< messages.length; i++){
            this.props.addToast(messages[i])
        }
    }
    }

    changeInputValue = (field, type, value, errMessage, element) => {
        if(this._mounted){
            this.setState(state => {
                let base = state.inputs;
                let base2 = base[field];
                let base3 = base2[type]
                base3 = value
                base2[type] = base3;
                base[field] = base2;
            
               
                   let message = checkCriteria(value,{minLength:3},type).message
                   if(!checkCriteria(value,{minLength:3, type:"text"},"type").check){
                   
                       errMessage.style.display = "block";
                       errMessage.textContent = message;
                       element.classList.add("invalid-input-field")

                   }else {
                       errMessage.style.display = "none";
                       element.classList.remove("invalid-input-field");
                     
                   }
               

                return {
                    inputs:base
                }
            })
        }
    }

    changeInputEditValue = (field, type, value, errMessage, element) => {
        if(this._mounted){
            this.setState(state => {
                let base = state.inputsEdit;
                let base2 = base[field];
                let base3 = base2[type]
                base3 = value
                base2[type] = base3;
                base[field] = base2;
            
               
                   let message = checkCriteria(value,{minLength:3},type).message
                   if(!checkCriteria(value,{minLength:3, type:"text"},"type").check){
                   
                       errMessage.style.display = "block";
                       errMessage.textContent = message;
                       element.classList.add("invalid-input-field")

                   }else {
                       errMessage.style.display = "none";
                       element.classList.remove("invalid-input-field");
                     
                   }
               

                return {
                    inputsEdit:base
                }
            })
        }
    }

    upload= (e) => {
        this.setState({
            progress:0
        })
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref()
        var uploadTask = storageRef.child(`users/${firebase.auth().currentUser.uid}/CV/company/${this.state.CV.id}/mainPic.jpg`).put(file)
        
        uploadTask.on('state_changed', (snapshot) =>{
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         
            this.setState({
                progress:progress
            })
        
          }, (error) => {
            // Handle unsuccessful uploads
            if(error){
            this.setState({
                progress:null
            })
        }
            alert("The operation cannot be completed");
          }, ()  =>{
              this.setState({
                  progress:null,
                  submitted:true
              })
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.setState(state => {
                  let base = state.CV;
                  base.photoURL = downloadURL;
                  return {
                      CV:base
                  }
              })
            });
          });
    }

    deleteReference =() => {
        if(this.state.submitted === true){
        let storageRef = firebase.storage().ref()
        var uploadTask = storageRef.child(`users/${firebase.auth().currentUser.uid}/CV/company/${this.state.CV.id}/mainPic.jpg`)
        uploadTask.delete()
        .then(() => {

        })
        .catch(e => {
            this.props.addToast("Ohoh something went wrong")
        })
    }
    }

    componentDidMount() {

        this._mounted = true;

        if(this.props.update === false){
        let id = firebase.firestore().collection("CVs").doc().id;
        this.setState(state => {
            let base = state.CV;
            base.id = id;

            return {
                CV:base
            }
        })
    }else {
        firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).where("type","==","company").get()
        .then(snap => {
            snap.forEach(doc => {
                let CV = doc.data().staff[this.props.index];

                if(this._mounted){
                    this.setState(state => {
                        let base = state.inputs;
                        base.description.title = doc.data().staff[this.props.index].description[0].title;
                        base.description.description = doc.data().staff[this.props.index].description[0].description;

                        return {
                            CV:CV,
                            inputs:base
                        }
                    })
                }
            })
        })
    }
    }

    deleteContent = (field, index) => {
        if(this._mounted){
            this.setState(state => {
                let base = state.CV;
                let arr = base[field]
                arr.splice(index,1);
                base[field] = arr;
                return {
                    CV:base
                }
            })
        }
    }

    applyEditItem =async (field, index,id) => {
        if(this._mounted){
           await this.setState(state => {
                let obj = {
                    title:state.inputsEdit[field].title,
                    text:state.inputsEdit[field].description
                }

                let base = state.CV;
                base[field][index] = obj;

                return {
                    CV:base
                }
            })

            $(id).slideUp("fast")
        }
    }

    editContent = async(field, index,id) => {
        if(this._mounted){
           await this.setState(state => {
                let base = state.CV;
                let obj = base[field][index]
                let newObj = {
                    title:obj.title,
                    description:obj.text,
                    index:index
                }

                let base2 = state.inputsEdit;
                base2[field] = newObj

                return {
                    CV:base,
                    inputsEdit:base2
                }
            })

            $(id).slideDown("fast")
        }
    }

    closeEditForm = (id) => {
        $(id).slideUp("fast")
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    createStaff = () => {
        let check = 0;
        let messages = []
       
        if(!checkCriteria(this.state.inputs.description.title, {minLength:3, type:"text"},"title")){
            check = 1
            messages.push(checkCriteria(this.state.inputs.description.title, {minLength:4, type:"text"},"title").message)
        }
        if(!checkCriteria(this.state.inputs.description.description, {minLength:3, text:"text",},"description").check){
            check = 1;
            messages.push(checkCriteria(this.state.inputs.description.description, {minLength:3, text:"text",},"description").message)
        }

        if(check === 0){
            this.setState(state => {
                let base = state.CV;
                let base2 = base.description;
                base2.push(this.state.inputs.description) 
            })
            this.props.toggleLoading();
            firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).where("type","==","company").get()
            .then(snapshot => {
                if(!snapshot.empty){
                    let id = "";
                    let staff = []
                    snapshot.forEach(doc => {
                        id= doc.id
                        console.log(doc.data())
                        staff = doc.data().staff;
                    })
                    staff.push(this.state.CV)
                    firebase.firestore().collection("CVs").doc(id).update({staff:staff})
                    .then(() => {
                        this.props.addToast("Staff Added");
                        this.props.toggleLoading();
                        this.props.handleClose();
                        this.props.refresh();
                    })
                    .catch(e => {
                        this.props.addToast("ohoh something went wrong :(");
                        this.props.toggleLoading();
                    })
                }else {
                    this.props.toggleLoading();
                    alert("Empty men")
                }
            })
            .catch(e => {
                this.props.addToast("ohoh something went wrong :(");
                this.props.toggleLoading();
            })
        }else {
            alert("Something doesnt match")
            for(let i =0; i < messages.length; i++){
                this.props.addToast(messages[i]);
            }
        }
    }


    updateStaff = () => {
        
        let check = 0;
        let messages = []
        alert("Triggered");
        if(!checkCriteria(this.state.inputs.description.title, {minLength:3, type:"text"},"title")){
            check = 1
            messages.push(checkCriteria(this.state.inputs.description.title, {minLength:4, type:"text"},"title").message)
        }
        if(!checkCriteria(this.state.inputs.description.description, {minLength:3, text:"text",},"description").check){
            check = 1;
            messages.push(checkCriteria(this.state.inputs.description.description, {minLength:3, text:"text",},"description").message)
        }

        if(check === 0){
            this.setState(state => {
                let base = state.CV;
                let base2 = base.description;
                base2[0] = (this.state.inputs.description) 

                return {
                    CV:base
                }
            })
            this.props.toggleLoading();
            firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).where("type","==","company").get()
            .then(snapshot => {
                if(!snapshot.empty){
                    let id = "";
                    let staff = []
                    snapshot.forEach(doc => {
                        id= doc.id
                        console.log(doc.data())
                        staff = doc.data().staff;
                    })
                    staff[this.props.index] = this.state.CV
                    firebase.firestore().collection("CVs").doc(id).update({staff:staff})
                    .then(() => {
                        this.props.addToast("Staff Updated");
                        this.props.toggleLoading();
                        this.props.handleClose();
                        this.props.refresh();
                    })
                    .catch(e => {
                        this.props.addToast("ohoh something went wrong :(");
                        this.props.toggleLoading();
                    })
                }else {
                    this.props.toggleLoading();
                    alert("Empty men")
                }
            })
            .catch(e => {
                this.props.addToast("ohoh something went wrong :(");
                this.props.toggleLoading();
            })
        }else {
            alert("Something doesnt match")
            for(let i =0; i < messages.length; i++){
                this.props.addToast(messages[i]);
            }
        }
    }

    render(){
        return (
            <Drawer hasBackdrop={true} style={{zIndex:999}} onClose={() => {this.state.saved?(()=> {})():this.deleteReference(); this.props.handleClose()}} title={""} size={"75%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
              <div className={`${Classes.DIALOG_BODY}`}>
              <div className="container mt-2">
                        <div className="container-fluid" style={{position:"relative"}}>
                   
                                    <div style={{backgroundImage:`url(${this.state.CV.photoURL?this.state.CV.photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"150px",
                                    height:"150px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="rounded-circle" ></div>

                        
                     <div className="dropdown right-corner-btn">
                              <button type="button" className="dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
                                <div className="dropdown-menu dropdown-menu-right" style={{width:"300px"}}>
                                    <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile" onChange={e => {e.persist(); this.upload(e)}}/>
                                    <label className="custom-file-label" >Choose file</label>
                                </div>
                              </div>
                             </div>

                             {this.state.progress?
                             <div className="progress mt-4">
                               <div className="progress-bar" style={{width:`${this.state.progress}%`}}></div>
                            </div>:null
                             }
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Profession</label>
                        <input type="text" value={this.state.inputs.description.title} className="form-control" onChange={(e) => {this.changeInputValue("description","title",e.target.value, e.target.parentNode.childNodes[2],e.target)}}/>
                        <div className="invalid-feedback" >test</div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" value={this.state.inputs.description.description} onChange={(e) => {this.changeInputValue("description","description",e.target.value, e.target.parentNode.childNodes[2],e.target)}}></textarea>
                        <div className="invalid-feedback">test</div>
                    </div>

                    <div id="accordion">
                        {this.state.CV.order.map((element,index) => {
                            if(element === 1){
                                return (
                                    <div className="card mt-3" key={element}>
                                    <div className="card-header" style={{position:"relative"}}>
                                       <a className="card-link" data-toggle="collapse" href="#experience"> Experience</a>

                                       {this.state.CV.editable === true?
                                       <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                       :null}
                                        </div>
                                  <div className="collapse show" data-parent="#accordion" id="experience">
                                   {this.state.CV.experience.length > 0?this.state.CV.experience.map((element,i) => {
                                       return (
                                           <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.editContent("experience",i, "#experience-form-edit")}} delete={() => {this.deleteContent("experience",i); }} title={element.title} text={element.text}/>
            
                                   )
                                       }):null}
                                   {this.state.CV.editable === true?
                                     <div>

                                         <div className="mt-2 container" id="experience-form-edit" style={{display:"none"}}>
                                          <div className="form-group">
                                              <label>Title</label>
                                              <input className="form-control" onChange={(e)=> {this.changeInputEditValue("experience","title",e.target.value,e.target.parentNode.childNodes[2],e.target)}} type="text" value={this.state.inputsEdit.experience.title} />
                                              <div className="invalid-feedback"></div>
                                        </div>

                                        <div className="form-group">
                                            <label>Experience</label>
                                            <textarea className="form-control" onChange={(e)=> {this.changeInputEditValue("experience","description",e.target.value,e.target.parentNode.childNodes[2],e.target)}} type="text" value={this.state.inputsEdit.experience.description} ></textarea>
                                            <div className="invalid-feedback"></div>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" className="btn btn-custom-1 btn-sm" onClick={() =>{this.applyEditItem("experience", this.state.inputsEdit.experience.index,"#experience-form-edit")}}><i className="material-icons align-middle">create</i> Edit</button>
                                            <button type="button" className="btn btn-danger btn-sm ml-3" onClick={() => {this.closeEditForm("#experience-form-edit")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                        </div>
                                        </div>                                      
                                         
                                     {this.state.inputs.experience.isOpen === false?<button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={(e) => {this.toggleAddContent("#experience-form","down","experience")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>:null}
                                     <div className="container" id="experience-form" style={{display:"none"}}>
                                         <div className="form-group mt-2" >
                                            <label>Title</label> 
                                            <input  type="text" value={this.state.inputs.experience.title} onChange={(e) => {this.changeInputValue("experience","title",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" />
                                            <div className="invalid-feedback"></div>
                                         </div>
                                         <div className="form-group">
                                            <label>Experience</label> 
                                            <textarea value={this.state.inputs.experience.description} onChange={(e) => {this.changeInputValue("experience","description",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" ></textarea>
                                            <div className="invalid-feedback"></div>
                                         </div>
                                         <div className="form-group">
                                             <button type="button" onClick={() => {this.addElement("experience",{title:this.state.inputs.experience.title,text:this.state.inputs.experience.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                             <button type="button" className="btn btn-danger btn-sm ml-3" onClick={(e) => {this.toggleAddContent("#experience-form","up","experience")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                         </div>
                                     </div>
                                     </div>
                                     : null}
                                </div>
            
                                </div> 
                                )
                            }

                            if(element === 2){
                                return (
                                    <div className="card mt-3" key={element}>
                        <div className="card-header" style={{position:"relative"}}>
                           <a className="card-link" data-toggle="collapse" href="#education"> Education</a>

                           {this.state.CV.editable === true?
                           <div className="btn-group btns-change-order">
                                          <button type="button" className="btn btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                        :null}
                            </div>
                        
                            <div className="collapse show" id="education">
                            {this.state.CV.education.length > 0?this.state.CV.education.map((element,i) => {
                           return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.editContent("education",i,"#education-form-edit")}} delete={() => {this.deleteContent("education",i); }} title={element.title} text={element.text}/>

                       )
                           }):null}
                       {this.state.CV.editable === true?
                        <div>

                                      <div className="mt-2 container" id="education-form-edit" style={{display:"none"}}>
                                          <div className="form-group">
                                              <label>Title</label>
                                              <input onChange={(e)=> {this.changeInputEditValue("education","title",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.education.title} />
                                              <div className="invalid-feedback"></div>
                                        </div>

                                        <div className="form-group">
                                            <label>Education</label>
                                            <textarea onChange={(e)=> {this.changeInputEditValue("education","description",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.education.description} ></textarea>
                                            <div className="invalid-feedback"></div>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" className="btn btn-custom-1 btn-sm" onClick={() =>{this.applyEditItem("education", this.state.inputsEdit.education.index,"#education-form-edit")}}><i className="material-icons align-middle">create</i> Edit</button>
                                            <button type="button" className="btn btn-danger btn-sm ml-3" onClick={() => {this.closeEditForm("#education-form-edit")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                        </div>
                                        </div>
                        
                        {this.state.inputs.education.isOpen === false?<button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#education-form","down","education")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>:null}
                        <div className="container" id="education-form" style={{display:"none"}}>
                            <div className="form-group mt-2" >
                               <label>Title</label> 
                               <input type="text" value={this.state.inputs.education.title} onChange={(e) => {this.changeInputValue("education","title",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" />
                               <div className="invalid-feedback"></div>
                            </div>
                            <div className="form-group">
                               <label>Education</label> 
                               <textarea value={this.state.inputs.education.description} onChange={(e) => {this.changeInputValue("education","description",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" ></textarea>
                               <div className="invalid-feedback"></div>
                            </div>
                            <div className="form-group">
                                <button type="button" onClick={() => {this.addElement("education",{title:this.state.inputs.education.title,text:this.state.inputs.education.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                <button type="button" className="btn btn-danger btn-sm ml-3" onClick={(e) => {this.toggleAddContent("#education-form","up","education")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                            </div>
                        </div>
                        </div>
                         : null}
                        </div>
                    </div>
                                )
                            }

                            if(element === 3){
                              return(  <div className="card mt-3" key={element}>
                                  <div className="card-header" style={{position:"relative"}}>
                                    <a className="card-link" data-toggle="collapse" href="#portfolio"> Portfolio</a>

                                    {this.state.CV.editable === true?
                                    <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                    :null}
                                  </div>

                                <div className="collapse show" id="portfolio">
                                   {this.state.CV.portfolio.length > 0?this.state.CV.portfolio.map((element,i) => {
                                    return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.editContent("portfolio",i, "#portfolio-form-edit")}} delete={() => {this.deleteContent("portfolio",i); }} title={element.title} text={element.text}/>

                               )
                              }):null}
                               {this.state.CV.editable === true? 
                               <div> 

                                     <div className="mt-2 container" id="portfolio-form-edit" style={{display:"none"}}>
                                          <div className="form-group">
                                              <label>Title</label>
                                              <input onChange={(e)=> {this.changeInputEditValue("portfolio","title",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.portfolio.title} />
                                              <div className="invalid-feedback"></div>
                                        </div>

                                        <div className="form-group">
                                            <label>Portfolio</label>
                                            <textarea onChange={(e)=> {this.changeInputEditValue("portfolio","description",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.portfolio.description} ></textarea>
                                            <div className="invalid-feedback"></div>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" onClick={() =>{this.applyEditItem("portfolio", this.state.inputsEdit.portfolio.index,"#portfolio-form-edit")}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">create</i> Edit</button>
                                            <button type="button" className="btn btn-danger btn-sm ml-3" onClick={() => {this.closeEditForm("#portfolio-form-edit")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                        </div>
                                        </div>

                               {this.state.inputs.portfolio.isOpen === false? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#portfolio-form","down","portfolio")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>:null}
                               <div className="container" id="portfolio-form" style={{display:"none"}}>
                                   <div className="form-group mt-2" >
                                      <label>Title</label> 
                                      <input type="text" value={this.state.inputs.portfolio.title} onChange={(e) => {this.changeInputValue("portfolio","title",e.target.value,e.target.parentNode.childNodes[2], e.target)}} className="form-control" />
                                      <div className="invalid-feedback"></div>
                                   </div>
                                   <div className="form-group">
                                      <label>Portfolio</label> 
                                      <textarea value={this.state.inputs.portfolio.description} onChange={(e) => {this.changeInputValue("portfolio","description",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" ></textarea>
                                      <div className="invalid-feedback"></div>
                                   </div>
                                   <div className="form-group">
                                       <button type="button" onClick={() => {this.addElement("portfolio",{title:this.state.inputs.portfolio.title,text:this.state.inputs.portfolio.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                       <button type="button" className="btn btn-danger btn-sm ml-3" onClick={(e) => {this.toggleAddContent("#portfolio-form","up","portfolio")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                   </div>
                               </div>
                               </div>
                               : null}
                             </div>
                            </div>
                              )
                            }

                            if(element === 4){
                                return (
                                    <div className="card mt-3" key={element}>
                                     <div className="card-header" style={{position:"relative"}}>
                                       <a className="card-link" data-toggle="collapse" href="#skills"> Skills</a>

                                       {this.state.CV.editable === true?
                                       <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                       :null}
                                     </div>

                                      <div className="collapse show"  id="skills">
                                       {this.state.CV.skills.length > 0?this.state.CV.skills.map((element,i) => {
                                     return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.editContent("skills",i,"#skills-form-edit")}} delete={() => {this.deleteContent("skills",i); }} title={element.title} text={element.text}/>

                       )
                           }):null}
                                   {this.state.CV.editable === true? 
                                   <div>

                                    <div className="mt-2 container" id="skills-form-edit" style={{display:"none"}}>
                                          <div className="form-group">
                                              <label>Title</label>
                                              <input onChange={(e)=> {this.changeInputEditValue("skills","title",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.skills.title} />
                                              <div className="invalid-feedback"></div>
                                        </div>

                                        <div className="form-group">
                                            <label>Skills</label>
                                            <textarea onChange={(e)=> {this.changeInputEditValue("skills","description",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.skills.description} ></textarea>
                                            <div className="invalid-feedback"></div>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" onClick={() =>{this.applyEditItem("skills", this.state.inputsEdit.skills.index,"#skills-form-edit")}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">create</i> Edit</button>
                                            <button type="button" className="btn btn-danger btn-sm ml-3" onClick={() => {this.closeEditForm("#skills-form-edit")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                        </div>
                                        </div>

                                   {this.state.inputs.skills.isOpen === false? <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#skills-form","down","skills")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>:null}
                                   <div className="container" id="skills-form" style={{display:"none"}}>
                                       <div className="form-group mt-2" >
                                          <label>Title</label> 
                                          <input  type="text" value={this.state.inputs.skills.title} onChange={(e) => {this.changeInputValue("skills","title",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" />
                                          <div className="invalid-feedback"></div>
                                       </div>
                                       <div className="form-group">
                                          <label>Skills</label> 
                                          <textarea value={this.state.inputs.skills.description} onChange={(e) => {this.changeInputValue("skills","description",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" ></textarea>
                                          <div className="invalid-feedback"></div>
                                       </div>
                                       <div className="form-group">
                                           <button type="button" onClick={() => {this.addElement("skills",{title:this.state.inputs.skills.title,text:this.state.inputs.skills.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                           <button type="button" className="btn btn-danger btn-sm ml-3" onClick={(e) => {this.toggleAddContent("#skills-form","up","skills")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                       </div>
                                   </div>
                                   </div>
                                   : null}
                                   </div>
                               </div>
                                )
                            }

                            if(element === 5){
                                return (
                                    <div className="card mt-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>

                                        {this.state.CV.editable === true?
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                        :null}
                                      </div>

                                    <div className="collapse show"  id="expertise">
                                       {this.state.CV.expertise.length > 0?this.state.CV.expertise.map((element,i) => {
                                      return (
                                      <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.editContent("expertise",i,"#expertise-form-edit")}} delete={() => {this.deleteContent("expertise",i); }} title={element.title} text={element.text}/>

                                       )
                                    }):null}
                                   {this.state.CV.editable === true?
                                    <div> 

                                       <div className="mt-2 container" id="expertise-form-edit" style={{display:"none"}}>
                                          <div className="form-group">
                                              <label>Title</label>
                                              <input onChange={(e)=> {this.changeInputEditValue("expertise","title",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.expertise.title} />
                                              <div className="invalid-feedback"></div>
                                        </div>

                                        <div className="form-group">
                                            <label>Expertise</label>
                                            <textarea onChange={(e)=> {this.changeInputEditValue("expertise","description",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.expertise.description} ></textarea>
                                            <div className="invalid-feedback"></div>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" onClick={() =>{this.applyEditItem("expertise", this.state.inputsEdit.expertise.index,"#expertise-form-edit")}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">create</i> Edit</button>
                                            <button type="button" className="btn btn-danger btn-sm ml-3" onClick={() => {this.closeEditForm("#expertise-form-edit")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                        </div>
                                        </div>

                                    {this.state.inputs.expertise.isOpen === false?<button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#expertise-form","down","expertise")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>:null}
                                    <div className="container" id="expertise-form" style={{display:"none"}}>
                                        <div className="form-group mt-2" >
                                           <label>Title</label> 
                                           <input type="text" value={this.state.inputs.expertise.title} onChange={(e) => {this.changeInputValue("expertise","title",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" />
                                           <div className="invalid-feedback"></div>
                                        </div>
                                        <div className="form-group">
                                           <label>Expertise</label> 
                                           <textarea value={this.state.inputs.expertise.description} onChange={(e) => {this.changeInputValue("expertise","description",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" ></textarea>
                                           <div className="invalid-feedback"></div>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" onClick={() => {this.addElement("expertise",{title:this.state.inputs.expertise.title,text:this.state.inputs.expertise.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                            <button type="button" className="btn btn-danger btn-sm ml-3" onClick={(e) => {this.toggleAddContent("#expertise-form","up","expertise")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                        </div>
                                    </div>
                                    </div>
                                     : null}
                                  </div>
                                 </div>
                                )
                            }

                            if(element === 6){
                                return (
                                    <div className="card mt-3 mb-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#contact-cv"> Contact</a>

                                        {this.state.CV.editable === true?
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                        :null}
                                     </div>

                                    <div className="collapse show" id="contact-cv" >
                                       {this.state.CV.contact.length > 0?this.state.CV.contact.map((element,i) => {
                                      return (
                                        <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.editContent("contact",i,"#contact-form-edit")}} delete={() => {this.deleteContent("contact",i); }} title={element.title} text={element.text}/>

                                        )
                                       }):null}
                                        {this.state.CV.editable === true? 
                                        <div>
                                            <div className="mt-2 container" id="contact-form-edit" style={{display:"none"}}>
                                          <div className="form-group">
                                              <label>Title</label>
                                              <input onChange={(e)=> {this.changeInputEditValue("contact","title",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.contact.title} />
                                              <div className="invalid-feedback"></div>
                                        </div>

                                        <div className="form-group">
                                            <label>Contact</label>
                                            <textarea onChange={(e)=> {this.changeInputEditValue("contact","description",e.target.value,e.target.parentNode.childNodes[2],e.target)}} className="form-control" type="text" value={this.state.inputsEdit.contact.description} ></textarea>
                                            <div className="invalid-feedback"></div>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" onClick={() =>{this.applyEditItem("contact", this.state.inputsEdit.contact.index,"#contact-form-edit")}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">create</i> Edit</button>
                                            <button type="button" className="btn btn-danger btn-sm ml-3" onClick={() => {this.closeEditForm("#contact-form-edit")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                        </div>
                                        </div>

                                        <div> {this.state.inputs.contact.isOpen === false?<button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#contact-form","down","contact")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>:null}
                                        <div className="container" id="contact-form" style={{display:"none"}}>
                                            <div className="form-group mt-2" >
                                               <label>Title</label> 
                                               <input type="text" value={this.state.inputs.contact.title}  onChange={(e) => {this.changeInputValue("contact","title",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" />
                                               <div className="invalid-feedback"></div>
                                            </div>
                                            <div className="form-group">
                                               <label>Contact</label> 
                                               <textarea value={this.state.inputs.contact.description} onChange={(e) => {this.changeInputValue("contact","description",e.target.value, e.target.parentNode.childNodes[2], e.target)}} className="form-control" ></textarea>
                                               <div className="invalid-feedback"></div>
                                            </div>
                                            <div className="form-group">
                                                <button type="button" onClick={() => {this.addElement("contact",{title:this.state.inputs.contact.title,text:this.state.inputs.contact.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                                <button type="button" className="btn btn-danger btn-sm ml-3" onClick={(e) => {this.toggleAddContent("#contact-form","up","contact")}}><i className="material-icons align-middle">remove</i> Cancel</button>
                                            </div>
                                        </div>
                                        </div>
                                        </div>
                                        : null}
                                        </div>
                        
                                   </div>
                                )
                            }
                        })}
                    
                </div>
                 <div className="form-group">
                     {this.props.update === false?
                     <button type="button" className="btn btn-custom-1 " onClick={this.createStaff}><i className="material-icons align-middle">add</i> Create</button>
                     : <button type="button" className="btn btn-custom-1 " onClick={this.updateStaff}><i className="material-icons align-middle">create</i> Update</button>
                     }
                 </div>
              </div>
            </div>
           </Drawer>
        )
    }
}