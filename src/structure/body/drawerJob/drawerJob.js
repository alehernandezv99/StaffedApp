import React from "react";
import "./drawerJob.css";
import { Button, Position, Classes, Slider, Drawer} from "@blueprintjs/core";
import firebase from "../../../firebaseSetUp";
import LoadingSpinner from "../../loading/loadingSpinner";

export default class DrawerJob extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            project:[],
            id:"",
            isOpen:true,
            isLoading:false
        }

        this.performTransaction = this.performTransaction.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
    }

    toggleLoading(){
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }

    performTransaction(collection, prop, value, type, messageSucess, messageFailure){
        this.toggleLoading();
        firebase.firestore().collection(collection).doc(`${this.props.id}`).get()
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
            firebase.firestore().collection(collection).doc(this.props.id).update({
                [prop]:data
            })
            .then((result) => {
                this.addToast(messageSucess);
                this.toggleLoading()
            })
            .catch(e => {
                this.addToast(messageFailure);
                this.toggleLoading();
            })
        })
    }


    addToast = (message) => {
        this.props.toastHandler(message)
    }

    componentDidMount(){
        firebase.firestore().collection("projects").doc(this.props.id).get()
        .then(snapshot => {
            this.setState(state => {
                let project = [];
                project.push(snapshot.data());

                return({project:project, id:this.props.id});
            })
        })
        .catch(e => {
            this.addToast(e.message);
        })

        
    }

    render(){
        return(
            <div>
                {this.state.isLoading === true?<LoadingSpinner />:null}
            <Drawer style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"75%"} isOpen={this.props.isOpen}>
                {this.state.project.length ===0?<div className="spinner-border"></div>:
                <div className={Classes.DRAWER_BODY}>
                <div className={`row ${Classes.DIALOG_BODY}`}>
                    <div className="col-sm-8">
                        <div className="card">
                        <div className="text-center card-header">
                            <h3>{this.state.project[0].title}</h3>
                        </div>
                        <div className="card-body">
                        <div className="container-fluid mt-4">
                        <h4>Description</h4>
                        <h6 className="mt-3">{this.state.project[0].description}</h6>
                        </div>
                        <div className="container-fluid mt-4">
                        <h4>Skills</h4>
                        <div className="skills-btns">
                            {
                                (() => {
                                    let skillsObj = this.state.project[0].skills;
                                    let skillsArr = []
                                    Object.keys(skillsObj).forEach((key,i) => {
                                        skillsArr.push({
                                            text:key,
                                            key:i
                                        })
                                    })
                                    return skillsArr;
                                })().map(element => {
                                    return (<button key={element.key} type="button" className="btn btn-sm btn-custom-2 mr-1 mt-2">{element.text}</button>)
                                })
                            }
                        </div>
                        </div>

                        <div className="container-fluid mt-4">
                            <h4>Specs</h4>
                            <div className="row mt-3">
                                <div className="col-sm-4">
                                    <div><h5><i className="material-icons align-middle">attach_money</i> Budget</h5></div>
                                    <div><h6 className="ml-5">{this.state.project[0].budget}</h6></div>
                                </div>
                                <div className="col-sm-4">
                                <div><h5><i className="material-icons align-middle">show_chart</i> Level</h5></div>
                                <div><h6 className="ml-5">{this.state.project[0].level}</h6></div>
                                </div>
                                <div className="col-sm-4">
                                    <div><h5><i className="material-icons align-middle">library_books</i> Proposals</h5></div>
                                    <div><h6 className="ml-5">{this.state.project[0].proposals.length}</h6></div>
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-custom-1 btn-block"><i className="material-icons align-middle">add</i> Proposal</button>
                        <div className="action-btns text-center">
                    <button onClick={() => {this.performTransaction("projects","references",firebase.auth().currentUser.email,"array","Project Saved","Upps Problem Saving The Project")}} className="btn btn-custom-1 mr-2 mt-2 btn-sm"><i className="material-icons align-middle">save_alt</i> Save</button>
                        </div>
                    </div>
                </div>
                </div>
                }
            </Drawer>
            </div>
        )
    }
}