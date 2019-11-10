import React from "react";
import "./jobModule.css";
import UserBox from "../../profile/userBox";
import firebase from "../../../../firebaseSetUp";

export default class JobModule extends React.Component {
    constructor(props){
        super(props);
        this.performTransaction = this.performTransaction.bind(this);
        this.state = {
            isSaved:false
        }
    }

    addToast = (message) => {
        this.props.addToast(message);
    }

    componentDidMount() {

        this.setState({
            isSaved:this.props.isSaved
        })
    }

    performTransactionRemove = (collection, prop,id, value, type, messageSucess, messageFailure,cb) => {
        cb();
        firebase.firestore().collection(collection).doc(id).get()
        .then(doc => {
            let data = doc.data()[prop];
          
            if(type === "string"){
                data = value;
            }
            if(type === "number"){
                data = value
            }
            let references = [];
            if(doc.data().references !== undefined){
                references = doc.data().references
            }
            for(let i =0 ; i < references.length; i++){
                if(references[i] === firebase.auth().currentUser.email){
                    references.splice(i,1)
                }
            }
            firebase.firestore().collection(collection).doc(this.props.id).update({
                references:references,
            })
            .then((result) => {
                this.addToast(messageSucess);
                cb()
                this.setState({
                    isSaved:false
                })
            })
            .catch(e => {
                this.addToast(messageFailure);
                cb();
            })
        })
    }

    performTransaction(collection, prop,id, value, type, messageSucess, messageFailure,cb){
        cb();
        firebase.firestore().collection(collection).doc(id).get()
        .then(doc => {
            let data = doc.data()[prop];
     
            if(type === "string"){
                data = value;
            }
            if(type === "number"){
                data = value
            }
            if(doc.data()[prop].includes(firebase.auth().currentUser.email) === false){
                data.push(firebase.auth().currentUser.email)
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
                this.setState({
                    isSaved:true
                })
            })
            .catch(e => {
                this.addToast(messageFailure);
                cb();
            })
        })

        
    }

     capitalize = (string)  =>
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

    render(){
        return(
            <div className="job-module text-center mt-3 shadow-sm" style={{position:"relative",paddingTop:"10px"}}>
                <div className="job-status">
                
                    <div>{this.capitalize(this.props.status)}</div>
                    
                </div>
                <div className="container mt-5">
                    <UserBox size={"50px"} id={this.props.author} addToast={this.props.addToast} handleStates={this.props.handleStates} openUser={this.props.openUser} />
                </div>
                    <h4 style={{fontWeight:700,color:"rgb(80,80,80)"}}><a onClick={this.props.onClick}>{this.props.title}</a></h4>
                <div className="job-module-block text-left mt-3 p-2">
                    <p style={{color:"rgb(100,100,100)",}}>{this.props.description}</p>
                </div>
                <div className="mt-2 row">
                <div className="col-sm-8 text-left" style={{display:"none"}}>
                {this.props.skills.map(element => {
                    return (<button type="button" key={element.key} className="btn btn-custom-2 btn-sm mr-1 mt-2">{element.text}</button>)
                })}
                </div>
                <div className="col text-right">
                    {this.state.isSaved === true? <button className="btn  mr-2 mt-2 btn-sm" title="Remove From Favorites" onClick={() => {this.performTransactionRemove("projects","references",this.props.id,firebase.auth().currentUser.email,"array", "Removed From Favorites","Ups Something is Worng :(", this.props.toggleLoading)}}><i className="material-icons align-middle" style={{color:"rgb(100,100,100)"}}>favorite</i></button>:
                    <button className="btn mr-2 mt-2 btn-sm" title="Mark As Favorite" onClick={() => {this.performTransaction("projects","references",this.props.id,firebase.auth().currentUser.email,"array", "Added To Favorites","Ups Something is Worng :(", this.props.toggleLoading)}}><i className="material-icons align-middle" style={{color:"rgb(100,100,100)"}}>favorite_border</i></button>
                    }
                </div>
                </div>
                <div className="mt-2 text-left specs">
                {this.props.specs.map(element => {
                    return (<label key={element.key} title={element.desc} className=" mr-2 mt-2 jobModule-label"><i className="material-icons align-middle jobModule-icon" > {element.icon}</i> <span className="ml-0 align-middle">{element.text}</span></label>)
                })}
                </div>
                <div className="hour-posted">{this.props.date}</div>
            </div>
        )
    }
}