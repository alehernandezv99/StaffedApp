import React from "react";
import "./jobModule.css";
import firebase from "../../../../firebaseSetUp";

export default class JobModule extends React.Component {
    constructor(props){
        super(props);
        this.performTransaction = this.performTransaction.bind(this);
    }

    addToast = (message) => {
        this.props.addToast(message);
    }

    performTransaction(collection, prop,id, value, type, messageSucess, messageFailure,cb){
        cb();
        firebase.firestore().collection(collection).doc(id).get()
        .then(doc => {
            let data = doc.data()[prop];
            if(type === "array"){
                if(!(data.includes(value))){
                data.push(value);
                }else {
                    this.addToast("The value already exist in the list")
                }
            }
            if(type === "string"){
                data = value;
            }
            if(type === "number"){
                data = value
            }
            let involved = [];
            if(doc.data().involved !== undefined){
                involved = doc.data().involved
            }
            if(involved.includes(firebase.auth().currentUser.email) === false){
                involved.push(firebase.auth().currentUser.email);
            }
            firebase.firestore().collection(collection).doc(this.props.id).update({
                [prop]:data,
                involved:involved,
            })
            .then((result) => {
                this.addToast(messageSucess);
                cb()
            })
            .catch(e => {
                this.addToast(messageFailure);
                cb();
            })
        })
    }

    render(){
        return(
            <div className="job-module text-center mt-3">
                    <h4><a onClick={this.props.onClick}>{this.props.title}</a></h4>
                <div className="job-module-block text-left mt-3">
                    <p>{this.props.description}</p>
                </div>
                <div className="mt-2 row">
                <div className="col-sm-8 text-left">
                {this.props.skills.map(element => {
                    return (<button type="button" key={element.key} className="btn btn-custom-2 btn-sm mr-1 mt-2">{element.text}</button>)
                })}
                </div>
                <div className="col text-right">
                    {this.props.isSaved === true?null:
                    <button className="btn btn-custom-1 mr-2 mt-2 btn-sm" title="Save Project" onClick={() => {this.performTransaction("projects","references",this.props.id,firebase.auth().currentUser.email,"array", "Project Saved","Ups Something is Worng :(", this.props.toggleLoading)}}><i className="material-icons align-middle">save_alt</i></button>
                    }
                </div>
                </div>
                <div className="mt-2 text-left">
                {this.props.specs.map(element => {
                    return (<label key={element.key} title={element.desc} className=" mr-2 mt-2 jobModule-label"><i className="material-icons align-middle jobModule-icon" > {element.icon}</i> <span className="ml-0 align-middle">{element.text}</span></label>)
                })}
                </div>
            </div>
        )
    }
}