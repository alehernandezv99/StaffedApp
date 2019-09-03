import React from "react";
import "./TO-DO.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import firebase from "../../../../firebaseSetUp";
import { thisExpression } from "@babel/types";

export default class TODO extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            editable:true,
            input:"",
            TODO:[],
        }
    }

    changeValue = (value) => {
     
        if(this._mounted){
        this.setState({
            input:value
        })
    }

    }

    componentDidMount(){
        this._mounted = true;
        firebase.firestore().collection("projects").doc(this.props.projectID).get()
        .then(doc => {
            let invitations = doc.data().invitations?doc.data().invitations:[];
            let TODO = doc.data().TODO?doc.data().TODO:[];
            if(invitations.includes(firebase.auth().currentUser.email) || doc.data().author === firebase.auth().currentUser.uid){
                this.setState({
                    editable:true,
                    TODO:TODO
                })
            }else {
                this.setState({
                    editable:false,
                    TODO:TODO
                })
            }

        })
        .catch(e => {
            this.props.addToast("ohoh something went wrong :(");
        })
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    toggleCheck = (index) => {

        if(this._mounted){
        this.setState(state => {
            let TODO = [...state.TODO];
            TODO[index].state = !TODO[index].state

            return {
                TODO:TODO
            }
        })

        firebase.firestore().collection("projects").doc(this.props.projectID).get()
        .then(doc => {
            let TODO = doc.data().TODO?doc.data().TODO:[]
            let invitations = doc.data().invitations?doc.data().invitations:[];
        if(invitations.includes(firebase.auth().currentUser.email) || doc.data().author === firebase.auth().currentUser.uid){
            TODO[index].state = !TODO[index].state
            firebase.firestore().collection("projects").doc(this.props.projectID).update({TODO:TODO})
            .then(() => {

            })
            .catch(e => {
                this.props.addToast("ohoh something went wrong :(");
            })
        }
        })
        .catch(e => {
            this.props.addToast("ohoh something went wrong :(");
        })
    }
    }

    removeItem = (index) => {
        if(this._mounted){
            if(this.state.editable){
            this.setState(state => {
                let TODO = [...state.TODO];
                TODO.splice(index, 1);
                return {
                    TODO:TODO
                }
            })

            firebase.firestore().collection("projects").doc(this.props.projectID).get()
            .then(doc => {
                let TODO = doc.data().TODO?doc.data().TODO:[]
                let invitations = doc.data().invitations?doc.data().invitations:[];
            if(invitations.includes(firebase.auth().currentUser.email) || doc.data().author === firebase.auth().currentUser.uid){
                TODO.splice(index,1)
                firebase.firestore().collection("projects").doc(this.props.projectID).update({TODO:TODO})
                .then(() => {

                })
                .catch(e => {
                    this.props.addToast("ohoh something went wrong :(");
                })
            }
            })
            .catch(e => {
                this.props.addToast("ohoh something went wrong :(");
            })
        }
        }
    }

    switchPosition = async(type, index) => {
        if(this.state.editable){
           await this.setState(state => {
                let TODO = [...state.TODO];
                if(type === "up"){
                    if((index - 1) >= 0){
                        let help ={};
                        help = TODO[index - 1]
                        TODO[index -1] = TODO[index]
                        TODO[index] = help
                    }
                }else if(type === "down"){
                    if(index + 1 < TODO.length){
                        let help = {}
                        help = TODO[index + 1];
                        TODO[index + 1] = TODO[index];
                        TODO[index] = help
                    }
                }

                return {
                    TODO:TODO
                }
            
            })

            firebase.firestore().collection("projects").doc(this.props.projectID).get()
            .then(doc => {
                let TODO = this.state.TODO
                let invitations = doc.data().invitations?doc.data().invitations:[];
            if(invitations.includes(firebase.auth().currentUser.email) || doc.data().author === firebase.auth().currentUser.uid){
                firebase.firestore().collection("projects").doc(this.props.projectID).update({TODO:TODO})
                .then(() => {

                })
                .catch(e => {
                    this.props.addToast("ohoh something went wrong :(");
                })
            }
            })
            .catch(e => {
                this.props.addToast("ohoh something went wrong :(");
            })
        }
    }

    addElement = () => {
        if(this.state.editable){
            if(this.state.input !== ""){
            this.setState(state => {
                let base = [...state.TODO];
                base.push({
                    state:false,
                    text:this.state.input,
                    created:firebase.firestore.Timestamp.now()
                })
                return {
                    TODO:base,
                }
            })

            firebase.firestore().collection("projects").doc(this.props.projectID).get()
            .then(doc => {
                let TODO = doc.data().TODO?doc.data().TODO:[]
                let invitations = doc.data().invitations?doc.data().invitations:[];
            if(invitations.includes(firebase.auth().currentUser.email) || doc.data().author === firebase.auth().currentUser.uid){
                TODO.push({
                    state:false,
                    text:this.state.input,
                    created:firebase.firestore.Timestamp.now()
                })
                firebase.firestore().collection("projects").doc(this.props.projectID).update({TODO:TODO})
                .then(() => {

                })
                .catch(e => {
                    this.props.addToast("ohoh something went wrong :(");
                })
            }
            })
            .catch(e => {
                this.props.addToast("ohoh something went wrong :(");
            })
        }
    }
    }

    render(){
        return (
            <Drawer hasBackdrop={true} style={{zIndex:9999}} portalContainer={document.getElementById("portalContainer")} onClose={() => {this.props.handleClose()}} title={""} size={"50%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
              <div className={`${Classes.DIALOG_BODY}`}>
                    <h4 className="text-center">TO-DO</h4>
                    {this.state.editable?
                    <div className="input-group mb-3 mt-3 mx-auto">
                          <input type="text" className="form-control" value={this.state.input} onChange={(e) => {this.changeValue(e.target.value)}} placeholder="Enter Task" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="button" onClick={() => {this.addElement()}}><i className="material-icons align-middle" style={{fontSize:"15px"}}>add</i> Add</button> 
                         </div>
                        </div>
                    :null}
                  {this.state.TODO.map((e,i) => {
                      return (
                          <div key={i} className={`${e.state?"TODO-item-ready":"TODO-item"}  p-4 mt-2`}>
                              <i className="material-icons align-middle" onClick={() => {this.state.editable?this.toggleCheck(i):(() => {})()}}>{e.state?"check_box":"check_box_outline_blank"}</i>
                              <span className="ml-3">{e.text}</span>
                              {this.state.editable?
                              <div className="btn-group btns-change-order-todo">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",i)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",i)}}>keyboard_arrow_down</i></button>
                             </div>
                              :null}
                              {this.state.editable? <button className=" btn btn-close" onClick={() => {this.removeItem(i)}}><i className="material-icons align-middle">close</i></button>:null}
                          </div>
                      )
                  })}
              </div>
              </div>
            </Drawer>
        )
    }
}