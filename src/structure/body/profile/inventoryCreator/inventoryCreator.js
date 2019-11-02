import React from "react";
import "./inventoryCreator.css";
import firebase from "../../../../firebaseSetUp";
import LoadingSpinner from "../../../loading/loadingSpinner";
import checkCriteria from "../../../../utils/checkCriteria";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import KeywordsGeneration from "../../../../utils/keywordsGeneration";
import ImagePlaceholder from "../../../../res/Graphics/image_placeholder.png";
import $ from "jquery";


export default class InventoryCreator extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            isLoading:false,
            progress:0,
            submitted:false,
            upload:false,
            CV:{
                id:"",
                photoURL:null,
                name:{value:"", criteria:{type:"text", minLength:5, maxLength:400}},
                description:{value:"", criteria:{type:"text", minLength:5 , maxLength: 10000}},
            }
        }
    }

    upload= (e) => {
        this.setState({
            progress:0
        })
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref()
        var uploadTask = storageRef.child(`users/${firebase.auth().currentUser.uid}/CV/machines_vehicles/${this.state.CV.id}/mainPic.jpg`).put(file)
        
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
           
          }, ()  =>{
              this.setState({
                  progress:0,
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
        var uploadTask = storageRef.child(`users/${firebase.auth().currentUser.uid}/CV/machines_vehicles/${this.state.CV.id}/mainPic.jpg`)
        uploadTask.delete()
        .then(() => {

        })
        .catch(e => {
            this.props.addToast("Ohoh something went wrong")
        })
    }
    }

    componentDidMount(){
        this._mounted = true;
        let id= "";

        if(this.props.mode === "create"){
        id = firebase.firestore().collection("CVs").doc().id;

        }else if(this.props.mode === "update"){
         

            firebase.firestore().collection("CVs").doc(this.props.id).get()
            .then(doc => {
               
                let inventory = doc.data().inventory;
                if(this._mounted){
                    this.setState(state => {
                        let base = state.CV;
                        base.id = inventory[this.props.index].id
                        base.name.value = inventory[this.props.index].name;
                        base.photoURL = inventory[this.props.index].photoURL;
                        base.description.value = inventory[this.props.index].description

                        return {
                            CV:base
                        }

                    })
                }
            })
            .catch(e => {
                this.props.addToast(e.message);
                this.props.addToast("Ohoh something went wrong!");
            })
        }

        if(this._mounted){
        this.setState(state => {
            let base = state.CV;
            base.id = id;
            return {
                CV:base
            }
        }
        )
        }
    }

    componentWillUnmount(){
        this._mounted = false
    }

    updateInventory = () => {
        this.toggleLoading();
        let check = 0;
        let messages = [];


        Object.keys(this.state.CV).forEach(key => {
            if(key !== "photoURL" && key !== "id"){
                if(!(checkCriteria(this.state.CV[key].value, this.state.CV[key].criteria,key).check)){
                    check = 1
                    messages.push(checkCriteria(this.state.CV[key].value, this.state.CV[key].criteria,key).message)
                }
            }
        })

        if(this.state.CV.photoURL === "" || this.state.CV.photoURL === null){
            check = 1
            messages.push("You need to add a photo");
        }

        if(check === 0){
        firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).where("type","==","machines&vehicles").get()
        .then(snap => {
            if(!snap.empty){
                snap.forEach(doc => {
                    
                    let id = doc.id;
                    let inventory = doc.data().inventory;
                    let newInventory = {
                        id:this.state.CV.id,
                        name:this.state.CV.name.value,
                        description:this.state.CV.description.value,
                        photoURL:this.state.CV.photoURL
                    }
                    inventory[this.props.index] = newInventory;
                    firebase.firestore().collection("CVs").doc(id).update({inventory:inventory})
                    .then(() => {
                        this.props.addToast("Inventory Added");
                        this.props.handleClose();
                        this.props.refresh();
                        this.toggleLoading();
                    })
                    .catch(e => {
                        this.props.addToast("Ohoh something went wrong!");
                        this.toggleLoading();
                    })

                })
            }
        })
        .catch(e => {
            this.props.addToast("Ohoh something went wrong!");
            this.toggleLoading();
        })

    }else {
    
        for(let i =0; i<messages.length; i++){
            this.props.addToast(messages[i]);
        }

        this.toggleLoading();
    }
    }

    addInventory = () => {
        this.toggleLoading();
        let check = 0;
        let messages = [];


        Object.keys(this.state.CV).forEach(key => {
            if(key !== "photoURL" && key !== "id"){
                if(!(checkCriteria(this.state.CV[key].value, this.state.CV[key].criteria,key).check)){
                    check = 1
                    messages.push(checkCriteria(this.state.CV[key].value, this.state.CV[key].criteria,key).message)
                }
            }
        })

        if(this.state.CV.photoURL === "" || this.state.CV.photoURL === null){
            check = 1
            messages.push("You need to add a photo");
        }

        if(check === 0){
        firebase.firestore().collection("CVs").where("uid","==",firebase.auth().currentUser.uid).where("type","==","machines&vehicles").get()
        .then(snap => {
            if(!snap.empty){
                snap.forEach(doc => {
                    
                    let id = doc.id;
                    let inventory = doc.data().inventory;
                    let newInventory = {
                        id:this.state.CV.id,
                        name:this.state.CV.name.value,
                        description:this.state.CV.description.value,
                        photoURL:this.state.CV.photoURL
                    }
                    inventory.push(newInventory);
                    firebase.firestore().collection("CVs").doc(id).update({inventory:inventory})
                    .then(() => {
                        this.props.addToast("Inventory Added");
                        this.props.handleClose();
                        this.props.refresh();
                        this.toggleLoading();
                    })
                    .catch(e => {
                        this.props.addToast("Ohoh something went wrong!");
                        this.toggleLoading();
                    })

                })
            }
        })
        .catch(e => {
            this.props.addToast("Ohoh something went wrong!");
            this.toggleLoading();
        })

    }else {
    
        for(let i =0; i<messages.length; i++){
            this.props.addToast(messages[i]);
        }

        this.toggleLoading();
    }
    }

    toggleLoading = () => {
        if(this._mounted){
            this.setState(state => ({
                isLoading:!state.isLoading
            }))
        }
    }

    render(){
        return (
            <Drawer hasBackdrop={true} style={{zIndex:999}} portalContainer={document.getElementById("portalContainer")} onClose={() => {this.state.saved?(()=> {})():this.deleteReference(); this.props.handleClose()}} title={""} size={window.innerWidth <= 700?"100%":"50%"} isOpen={this.props.isOpen}>
                {this.state.isLoading?<LoadingSpinner/>:null}
              <div className={Classes.DRAWER_BODY}>
                <div className={`${Classes.DIALOG_BODY}`}>

                <div className="container mt-2 text-center">
                        <div className="container-fluid" style={{position:"relative"}}>
                   
                                    <div style={{backgroundImage:`url(${this.state.CV.photoURL?this.state.CV.photoURL:ImagePlaceholder})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"contain",
                                    backgroundRepeat:"no-repeat",
                                    height:"150px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="" ></div>

                                <div className="container mt-2" style={{width:"400px", display:"none"}}  id="upload-img-machines-vehicles">
                                    <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile" onChange={e => {e.persist(); this.upload(e)}}/>
                                    <label className="custom-file-label" >Choose file</label>
                                </div>
                              
                             <div className="progress mt-3 mx-2">
                               <div className="progress-bar" style={{width:`${this.state.progress}%`}}>{this.state.progress >0?this.state.progress === 100?"Complete!":"Uploading...":null}</div>
                            </div>

                            </div>
                            {this.state.upload === false?
                             <button type="button" className="btn btn-custom-1 btn-sm mt-3" onClick={() => {
                                 if(this._mounted){
                                     this.setState(state => ({
                                         upload:!state.upload
                                     }))
                                 }
                                 $("#upload-img-machines-vehicles").slideToggle("fast")
                             }}><i className="material-icons align-middle">cloud_upload</i> Upload Img</button>
                            :<button type="button" className="btn btn-danger btn-sm mt-3" onClick={() => {
                                this.setState(state => ({
                                    upload:!state.upload
                                }))
                                $("#upload-img-machines-vehicles").slideToggle("fast")
                            }}><i className="material-icons align-middle">clear</i> Cancel</button>}
                            
                        </div>
                        
                    </div>

                    <div className="form-group mt-3">
                        <label>Name</label>
                        <input className="form-control" value={this.state.CV.name.value} onChange={(e) => {
                            e.persist();
                            if(this._mounted){
                                this.setState(state => {
                                    let base = state.CV;
                                    base.name.value = e.target.value

                                    return {
                                        CV:base
                                    }
                                })
                            }
                        }}/>
                    </div>

                    <div className="form-group mt-3">
                        <label>Description</label>
                        <textarea className="form-control" value={this.state.CV.description.value} onChange={(e) => {
                            e.persist();
                            if(this._mounted){
                                this.setState(state => {
                                    let base = state.CV;
                                    
                                    base.description.value = e.target.value;

                                    return {
                                        CV:base
                                    }
                                })
                            }
                        }}></textarea>

                      {this.props.mode === "create"?  <button type="button" onClick={() => {this.addInventory();}} className="btn btn-custom-1 mt-3"><i className="material-icons align-middle">add</i> Add Inventory</button>:null}
                      {this.props.mode === "update"?  <button type="button" onClick={() => {this.updateInventory();}} className="btn btn-custom-1 mt-3"><i className="material-icons align-middle">add</i> Update Inventory</button>:null}
                    </div>
              </div>
              </div>
            </Drawer>
        )
    }
}