import React from "react";
import "./uploadImg.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import firebase from "../../../../firebaseSetUp";
export default class UploadImg extends React.Component {
    constructor(props){
        super(props);

        this.state ={
          progress:0
        }
    }

    componentDidMount(){
      this._mounted = true;
    }

    componentWillUnmount(){
      this._mounted = false;
    }

    upload= (e) => {
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref()
        var uploadTask = storageRef.child(`users/${firebase.auth().currentUser.uid}/profile/mainPic.jpg`).put(file)
        
        uploadTask.on('state_changed', (snapshot) =>{
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if(this._mounted){
              this.setState({
                progress:progress
              })
            }
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, (error) => {
            // Handle unsuccessful uploads
            this.props.addToast("Ohoh something went wrong!");
          }, ()  =>{

            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({photoURL:downloadURL})
              .then(() => {
                  this.props.addToast("Upload Completed!");
                  this.props.handleClose();
                  this.props.callback();
              })
            });
          });
    }

    render(){
        return(
            <Drawer hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                 <div className={`${Classes.DIALOG_BODY}`}>
                 <form>
                <div className="custom-file">
                  <input type="file" className="custom-file-input" id="customFile" onChange={(e) => {e.persist(); this.upload(e)}}/>
                  <label className="custom-file-label" >Choose file</label>
                 </div>
                 <div className="progress mt-3">
                   <div className="progress-bar" style={{width:`${this.state.progress}%`}}>{this.state.progress >0?this.state.progress === 100?"Complete!":"Uploading...":null}</div>  
                  </div>
                </form>
                 </div>
                 </div>
            </Drawer>
        )
    }
}