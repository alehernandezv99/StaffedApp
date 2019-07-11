import React from "react";
import "./drawerJob.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import firebase from "../../../firebaseSetUp";
import DrawerJobLoading from "../../loading/drawerJobLoading";
import $ from "jquery";
import checkCriteria from "../../../utils/checkCriteria";
import ProposalModule from "./proposalModule";
import ContractModule from "./contractModule";
import AbsoluteLoading from "../../loading/absoluteLoading";

export default class DrawerJob extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            project:[],
            isOwner:false,
            id:"",
            isOpen:true,
            isLoading:false,
            proposal:{
                price:{value:"", criteria:{type:"number", min:10, max:50000}},
                receive:{value:"", criteria:{type:"number", min:10}},
                message:{value:"", criteria:{type:"text", minLength:5, maxLength:500}}
            },
            proposalFetched:null,
            contract:"",
            proposals:[],
            isSaved:false,
            hasChanged:false,
        }

        this.performTransaction = this.performTransaction.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
        this.checkChange = this.checkChange.bind(this)
    }

    toggleLoading(){
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }

    performTransaction(collection, prop, value, type, messageSucess, messageFailure,cb){
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
                cb()
            })
            .catch(e => {
                this.addToast(messageFailure);
                this.toggleLoading();
                cb();
            })
        })
    }


    addToast = (message) => {
        this.props.toastHandler(message)
    }

    changePage = (from, to) => {
        $(from).slideUp();
        $(to).slideDown();
    }

    

    updateProposal = () => {

       
        let objectProposal = this.state.proposalFetched;
        
        let check = 0;
        let messages = [];

        Object.keys(objectProposal).forEach(key => {
            if(key !== "user" && key !== "created"){
            if(!(checkCriteria(objectProposal[key]["value"], objectProposal[key]["criteria"], key).check)){
                check =1;
                messages.push((checkCriteria(objectProposal[key]["value"], objectProposal[key]["criteria"], key).message))
            }else {
                
            }
        }
        })

        if(check === 0){
            
            let data = {
                price:this.state.proposalFetched.price.value,
                presentation:this.state.proposalFetched.presentation.value,
                updated:firebase.firestore.Timestamp.now(),
            }
            firebase.firestore().collection("projects").doc(this.props.id).collection("proposals").where("user","==",firebase.auth().currentUser.uid).get()
            .then(snapshot => {
                if(!(snapshot.empty)){
                    let id = "";
                    snapshot.forEach(doc => {
                        id = doc.id;
                    })

                    firebase.firestore().collection("projects").doc(this.props.id).collection("proposals").doc(id).update(data)
                    .then(() => {
                        this.addToast("Proposal Updated");
                        this.props.handleClose();
                    })
                    .catch(e => {
                        this.addToast(e.message);

                    })
                }
            })
            }else {
                for(let i = 0; i < messages.length; i++){
                    this.addToast(messages[i]);
                }
            }
    }

    acceptProposal = (idProject, idProposal) => {
        this.toggleLoading();
        firebase.firestore().collection("projects").doc(idProject).collection("proposals").doc(idProposal).get()
        .then(doc => {
            if(doc.exists){
                firebase.firestore().collection("projects").doc(idProject).collection("proposals").doc(idProposal).update({status:"accepted"})
                .then(() => {
                    this.addToast("Proposal Accepted");
                    this.toggleLoading();
                })
                .catch(e => {
                    this.addToast(e.message);
                    this.toggleLoading()
                })
            }else {
                this.addToast("Proposal does not exist");
                this.toggleLoading();
            }
        })
        .catch(e => {
            this.addToast(e.message);
            this.toggleLoading();
        })
    }

    checkChange(element, reference){
      let check = 0 ;
        Object.keys(this.state.proposalFetchedListener).forEach(key => {
         if(this.state.proposalFetchedListener[key]["value"] !== reference[key]["value"]){

             check = 1
         }else {

         }
        })

        if(check === 1){
        element.style.boxShadow = "0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px #d5d23a";
        element.style.borderColor = "#d5d23a"
        this.setState({hasChanged:true})
        }else {
        element.style.boxShadow = "0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(82, 168, 236, 0.6)";
             element.style.borderColor = "rgba(82, 168, 236, 0.6)"
             this.setState({hasChanged:false})
        }

    }

    submitProposal(){
        let objectProposals = this.state.proposal;
        let check = 0;
        let messages = [];
        
        Object.keys(objectProposals).forEach(key => {
            if(key !== "quantity"){
            if(!(checkCriteria(objectProposals[key]["value"], objectProposals[key]["criteria"], key).check)){
                check =1;
            }else {
                messages.push((checkCriteria(objectProposals[key]["value"], objectProposals[key]["criteria"], key).message))
            }
        }
        })

        if(check === 0){

        let data = {
            price:this.state.proposal.price.value,
            presentation:this.state.proposal.message.value,
            user:firebase.auth().currentUser.uid,
            status:"pending",
            created:firebase.firestore.Timestamp.now(),
            id:firebase.firestore().collection("projects").doc().collection("proposals").id
        }

        firebase.firestore().collection("projects").doc(this.props.id).collection("proposals").where("user","==",firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            if(snapshot.empty){
                firebase.firestore().collection("projects").doc(this.props.id).collection("proposals").doc(data.id).set(data)
                .then(() => {
                    this.addToast("Proposal Submitted");
                    this.props.handleClose();
                })
                .catch(e => {
                    this.addToast(e.message);
                })
            }
        })
        .catch(e => {
            this.addToast(e.message)
        })
        
        }else {
            for(let i = 0; i < messages.length; i++){
                this.addToast(messages[i]);
            }
        }

        
    }

    fetchProjectProps = () =>{
            
        firebase.firestore().collection("projects").doc(this.props.id).get()
         .then(async snapshot => {
             let project = [];
                 project.push(snapshot.data());
                 let quantity = 0;
                 let idAuthorProject = project[0].author
                 let author = await firebase.firestore().collection("users").doc(project[0].author).get();
                 author = author.data().displayName?author.data().displayName:author.data().email;

                 project[0].author = author;
                 let references = snapshot.data().references;
                let result = await firebase.firestore().collection("projects").doc(this.props.id).collection("proposals").get()
 
                quantity =  result.size
                project[0].quantity = quantity;

                if(!(idAuthorProject === firebase.auth().currentUser.uid)){
                 firebase.firestore().collection("projects").doc(this.props.id).collection("proposals").where("user","==",firebase.auth().currentUser.uid).get()
                 .then(snapshot2 => {
                    
                 let documentF = null;
                 let isOwner = false;
                 let contract = "";
                 snapshot2.forEach(document => {
                    documentF = document;
                    if(document.data().status =="accepted"){
                        isOwner = true;
                        contract = document.data();
                    }
                 })
                 let proposalFetched = {};
                 
 
                 if(documentF !== null){
                     let proposals = documentF.data();
                 
                 
                 let obj = {value:"", criteria:{}}

                     if(proposals.user === firebase.auth().currentUser.uid){
                       
                         Object.keys(proposals).forEach(key => {
                       
                             if((Number.isNaN(Number(proposals[key]))) || proposals[key] === ""){
                                 obj.value = proposals[key];
                                 obj.criteria = {type:"text", minLength:4, maxLength:500}
                             }else {
                                 obj.value = proposals[key];
                                 obj.criteria = {type:"number", min:10, max:50000}
                             }
                             proposalFetched[key] = Object.assign({},obj);
                         })
                         proposalFetched["received"] = {value:Math.round((proposalFetched["price"]["value"] - proposalFetched["price"]["value"]*0.15)*100)/100, criteria:{type:"number", min:10}}
 
                         
                         
                      this.proposalFetchedListener = Object.assign({}, proposalFetched)
                      Object.keys(this.proposalFetchedListener).forEach(key => {
                          this.proposalFetchedListener[key] = Object.assign({}, this.proposalFetchedListener[key]);
                      })
                     }
 
                 }
                 
 
                 let isSaved = false;
                 if(references.includes(firebase.auth().currentUser.email)){
                     isSaved = true;
                 }
              
 
                 firebase.firestore().collection("users").doc(idAuthorProject).get()
                 .then( async doc => {
                     project[0].author = doc.data().displayName?doc.data().displayName:doc.data().email;
                      this.setState({project:project, proposalFetched:proposalFetched, isSaved:isSaved, proposalFetchedListener:this.proposalFetchedListener, isOwner:isOwner, contract:contract});
                
                 })
                 .catch(e => {
                    // this.addToast(e.message);
                 })
 
                 
 
                 })
                

                }else {
        
                    let isSaved = false;
                 if(references.includes(firebase.auth().currentUser.email)){
                     isSaved = true;
                 }

                 let proposals = [];

                 firebase.firestore().collection("projects").doc(project[0].id).collection("proposals").orderBy("created","desc").get()
                 .then(s => {
                     
                     let contract = "";
                     let index = 0
                    s.forEach(proposal => {
                        proposals.push(proposal.data());
                        if(proposals[index].status === "accepted"){
                            contract = proposals[index];
                        }
                        index++
                    })
                    this.setState({project:project, isSaved:isSaved, isOwner:true, proposals:proposals ,contract:contract})
                    
                 })

                 
                }
                 
         })
         .catch(e => {
            // this.addToast(e.message);
         })
 
     }

    componentDidMount(){
       this.fetchProjectProps();
    }

     setValue = async (obj, prop, value,index,cb, objA, propA, coeficent)=> {
         await this.setState(state => {
            let valueCollected = value.value;

            if(!(Number.isNaN(Number(valueCollected))) && valueCollected !== ""){
                valueCollected = Number(valueCollected)
            }
           
            let objBase = state[obj];
            let propBase = objBase[prop];
            propBase["value"] = valueCollected;
            objBase[prop] = propBase;

            if(coeficent){
            let objBaseA = state[objA];
            let propBaseA = objBaseA[propA];
            propBaseA["value"] = propBase["value"] + (propBase["value"]*coeficent);
            propBaseA["value"] = Math.round((Number(propBaseA["value"]) * 100))/100
            objBase[propA] = propBaseA;
            }

            if(!(checkCriteria(value.value, propBase["criteria"], prop).check)){
                value.parentNode.childNodes[index].style.display ="block";
                let message =checkCriteria(value.value, propBase["criteria"], prop).message;
                value.parentNode.childNodes[index].textContent = message;
            }else {
                value.parentNode.childNodes[index].style.display ="none";
            }

            return (
                {
                    [obj]:objBase,
                }
            )
        })
        cb()
    }

    render(){
        return(
            <div style={{position:"relative"}}>
                {this.state.isLoading === true?<AbsoluteLoading />:null} 
            <Drawer style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"75%"} isOpen={this.props.isOpen}>
                {this.state.project.length ===0?<DrawerJobLoading />:
                <div className={Classes.DRAWER_BODY}>
                <div id="dj-section-1">
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
                                    <div><h6 className="ml-5">{this.state.project[0].quantity}</h6></div>
                                </div>
                            </div>
                        </div>

                        </div>
                    </div>
                    </div>
                    <div className="col-sm-4">
                        
                        {this.state.isOwner === true?
                        this.state.contract === ""?
                        <button type="button" className="btn btn-custom-1 btn-block" onClick={() => {this.changePage("#dj-section-1","#dj-section-4")}}><i className="material-icons align-middle">view_agenda</i> View Proposals</button>:
                        <button type="button" className="btn btn-custom-1 btn-block" onClick={() => {this.changePage("#dj-section-1","#dj-section-4")}}><i className="material-icons align-middle">subject</i>Contract</button>
                        :
                            this.state.proposalFetched.price !== undefined?
                        <button type="button" className="btn btn-custom-1 btn-block" onClick={() => {this.changePage("#dj-section-1","#dj-section-3")}}><i className="material-icons align-middle">create</i> View Proposal</button>:
                        <button type="button" className="btn btn-custom-1 btn-block" onClick={() => {this.changePage("#dj-section-1","#dj-section-2")}}><i className="material-icons align-middle">add</i> Proposal</button>
                        }
                    
                        {
                        this.state.isSaved === true?null:
                        <div className="action-btns text-center">
                    <button onClick={() => {this.performTransaction("projects","references",firebase.auth().currentUser.email,"array","Project Saved","Upps Problem Saving The Project", this.props.handleClose)}} className="btn btn-custom-1 mr-2 mt-2 btn-sm"><i className="material-icons align-middle">save_alt</i> Save</button>
                        </div>
                        }
                        <div className="container-fluid mt-4">
                        <h4>Client</h4>
                        <h6 className="mt-3">{this.state.project[0].author}</h6>
                        </div>
                        <div className="container-fluid mt-4">
                        <h4>Country</h4>
                        <h6 className="mt-3">{this.state.project[0].country}</h6>
                        </div>
                    </div>
                </div>
                </div>
                <div id="dj-section-2" style={{display:"none"}}>
                  <div className={`${Classes.DIALOG_BODY}`}>
                      <button type="button" className="btn btn-custom-1 mb-3 btn-sm " onClick={() => {this.changePage("#dj-section-2","#dj-section-1")}}><i className="material-icons align-middle">chevron_left</i> Back</button>
                    <div className="card">
                        <div className="card-header">
                            <h3>Proposal</h3>
                        </div>
                    <div className="card-body">
                      <div className="form-group">
                          <div className="row mt-3">
                        <div className="col-sm-5">
                          <h4>Price</h4>
                        </div>
                        <div className="text-left">
                          <input type="number" value={this.state.proposal.price.value} className="form-control" onChange={(e) => {this.setValue("proposal","price",e.target,1, ()=> {},"proposal","receive",-0.15)}}/>
                          <div className="invalid-feedback">Valid.</div>
                           
                        </div>
                          </div>

                          <div className="row mt-3">
                        <div className="col-sm-5">
                          <h4>Pioneering Service Cost</h4>
                        </div>
                        <div className="text-left">
                          <h6>-15% (-{ Math.round((this.state.proposal.price.value * 0.15)*100)/100} $)</h6>
                        </div>
                          </div>

                          <div className="row mt-3">
                        <div className="col-sm-5">
                          <h4>You Receive</h4>
                        </div>
                        <div className="text-left">
                          <input type="number" className="form-control" value={this.state.proposal.receive.value} onChange={(e) => {this.setValue("proposal","receive",e.target,1, ()=> {},"proposal","price",-(1-(1/(1-0.15)))); this.checkChange(e.target)}}/>
                          <div className="invalid-feedback">Valid.</div>
                        </div>
                          </div>
                      </div>
                      <div className="form-group mt-5">
                      <h4>Cover Letter</h4>
                        <textarea className="form-control mt-3" onChange={(e) => {this.setValue("proposal","message",e.target,2,() => {})}} placeholder="The description about the project" rows="5" style={{resize:"none"}} required></textarea>
                           <div className="invalid-feedback">Valid.</div>
                          
                      </div>
                      </div>

                      <div className="card-footer text-center">
                          <button type="button" className="btn btn-custom-1" onClick={()=> {this.submitProposal()}}><i className="material-icons align-middle">send</i> Submit</button>
                      </div>
                  </div>
                  </div>
                </div>
                {this.state.proposalFetched !== null && this.state.contract == ""?
                this.state.proposalFetched.price === undefined?null:
                <div id="dj-section-3" style={{display:"none"}}>
                <div className={`${Classes.DIALOG_BODY}`}>
                      <button type="button" className="btn btn-custom-1 mb-3 btn-sm " onClick={() => {this.changePage("#dj-section-3","#dj-section-1")}}><i className="material-icons align-middle">chevron_left</i> Back</button>
                    <div className="card">
                        <div className="card-header">
                            <h3>Proposal</h3>
                        </div>
                    <div className="card-body">
                      <div className="form-group">
                          <div className="row mt-3">
                        <div className="col-sm-5">
                          <h4>Price</h4>
                        </div>
                        <div className="text-left">
                          <input type="number" value={this.state.proposalFetched.price.value} className="form-control" onChange={(e) => {e.persist(); this.setValue("proposalFetched","price",e.target,1, () => {this.checkChange(e.target, this.state.proposalFetched)},"proposalFetched","received",-0.15); }}/>
                          <div className="invalid-feedback">Valid.</div>
                           
                        </div>
                          </div>

                          <div className="row mt-3">
                        <div className="col-sm-5">
                          <h4>Pioneering Service Cost</h4>
                        </div>
                        <div className="text-left">
                          <h6>-15% (-{ Math.round((this.state.proposalFetched.price.value * 0.15)*100)/100} $)</h6>
                        </div>
                          </div>

                          <div className="row mt-3">
                        <div className="col-sm-5">
                          <h4>You Receive</h4>
                        </div>
                        <div className="text-left">
                          <input type="number" className="form-control" value={this.state.proposalFetched.received.value} onChange={(e) => {e.persist(); this.setValue("proposalFetched","received",e.target,1, ()=> { this.checkChange(e.target,this.state.proposalFetched)},"proposalFetched","price",-(1-(1/(1-0.15)))); }}/>
                          <div className="invalid-feedback">Valid.</div>
                        </div>
                          </div>
                      </div>
                      <div className="form-group mt-5">
                      <h4>Cover Letter</h4>
                        <textarea className="form-control mt-3" onChange={(e) => {e.persist(); this.setValue("proposalFetched","presentation",e.target,2,()=> { this.checkChange(e.target, this.state.proposalFetched)}); }} value={this.state.proposalFetched.presentation.value} placeholder="The description about the project" rows="5" style={{resize:"none"}} required></textarea>
                           <div className="invalid-feedback">Valid.</div>
                          
                      </div>
                      </div>

                      <div className="card-footer text-center">
                          {this.state.hasChanged === true?
                          <button type="button" className="btn btn-custom-1" onClick={()=> {this.updateProposal()}}><i className="material-icons align-middle">send</i> Confirm Edit</button>
                          :null
                          }
                      </div>
                  </div>
                  </div>

                </div>
                :null
                }
                {
                    this.state.isOwner === false?null:
                  
                    <div id="dj-section-4" style={{display:"none"}}>
                <div className={`${Classes.DIALOG_BODY}`}>
                      <button type="button" className="btn btn-custom-1 mb-3 btn-sm " onClick={() => {this.changePage("#dj-section-4","#dj-section-1")}}><i className="material-icons align-middle">chevron_left</i> Back</button>
                      {this.state.contract !== ""?
                     <ContractModule user={this.state.contract.user} price={this.state.contract.price} presentation={this.state.contract.presentation} />:
                    <div className="container-fluid">
                        {this.state.proposals.map((proposal,i) => {
                        return <ProposalModule acceptProposal={() => {this.acceptProposal(this.props.id, proposal.id)}}  key={i} user={proposal.user} price={proposal.price} presentation={proposal.presentation} />
                    })
                    }
                    </div>
                      }
                  </div>

                </div>
                }
                </div>
                }
            </Drawer>
            </div>
        )
    }
}