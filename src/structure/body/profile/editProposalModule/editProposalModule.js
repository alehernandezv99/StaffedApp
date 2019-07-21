import React from "react";
import "./editProposalModule.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import firebase from "../../../../firebaseSetUp";
import checkCriteria from "../../../../utils/checkCriteria";

export default class EditProposalModule extends React.Component {
    constructor(props){
        super(props);
        this.state = {
           title:{value:"", criteria:{type:"text",minLength:4, maxLength:200}},
           content:{value:"", criteria:{type:"text", minLength:4,}},
        }
    }

    updateCV = (type,element, index) => {
        element.disabled = true;
        let check = 0;
        let messages = [];
        Object.keys(this.state).forEach(key => {
            let criteria = checkCriteria(this.state[key]["value"], this.state[key]["criteria"], key);
            if(!(criteria.check)){
                check = 1;
                messages.push(criteria.message);
            }
        })

        if(check === 0){
        firebase.firestore().collection("CVs").doc(this.props.id).get()
        .then(doc => {
            let arr = doc.data()[this.props.prop];
            let newObj = {
                title:this.state.title.value,
                text:this.state.content.value
            }
            if(type === "update"){
                arr[index] = newObj
            }else if(type ==="add"){
            arr.push(newObj);
            }

            firebase.firestore().collection("CVs").doc(this.props.id).update({[this.props.prop]:arr})
            .then(() => {
                this.props.addToast(`Successfully ${type}${type.includes("e")?"d":"ed"}`);
                this.props.handleClose();
                this.props.callBack();
            })
            .catch(e => {
                this.props.addToast(e.message);
                element.disabled = false;
            })
        })
        .catch(e => {
            this.props.addToast(e.message);
            element.disabled = false;
        })
    }else {
        for(let i = 0; i < messages.length; i++){
            this.props.addToast(messages[i]);
        }
    }
    
    }

    componentDidMount(){
        if(this.props.type === "update"){
            this.setState(state =>{
                let base1 = state.title;
                let base2 = state.content;
                base1.value= this.props.title;
                base2.value = this.props.content

                return {
                    title:base1,
                    content:base2
                }
            })
        }
    }

    changeValue = (value, obj)  => {
        this.setState(state => {
            let base = state[obj];
            base["value"] = value;
            return {[obj]:base}
        })
    }

    render(){
        return(
            <Drawer hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"75%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                 <div className={`${Classes.DIALOG_BODY}`}>
                     <div className="form=group">
                         <label>Title</label>
                         <input type="text" className="form-control" value={this.state.title["value"]} onChange={(e) => {this.changeValue(e.target.value, "title")}}/>
                     </div>
                     <div className="form-group mt-2">
                         <label>{this.props.section}</label>
                         <textarea className="form-control textarea-custom-1" value={this.state.content["value"]} onChange={(e) => {this.changeValue(e.target.value, "content")}}></textarea>
                        
                     </div>
                     {this.props.type ==="update"?<button type="button" className="btn btn-custom-1"  onClick={(e)=> {this.updateCV("update",e.target,this.props.index)}}><i className="material-icons align-middle">edit</i> Update</button>:null}
                         {this.props.type === "add"?<button type="button" className="btn btn-custom-1" onClick={(e) => {this.updateCV("add",e.target)}}><i className="material-icons align-middle">add</i> Add</button>:null}
                 </div>
                 </div>
            </Drawer>
        )
    }
}