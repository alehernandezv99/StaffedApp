import React from "react";
import "./drawerJob.css";
import {Classes, Drawer,Alert, Intent, Tooltip, Position} from "@blueprintjs/core";
import firebase from "../../../firebaseSetUp";
import DrawerJobLoading from "../../loading/drawerJobLoading";
import $ from "jquery";
import checkCriteria from "../../../utils/checkCriteria";
import ProposalModule from "./proposalModule";
import ContractModule from "./contractModule";
import AbsoluteLoading from "../../loading/absoluteLoading";
import UserBox from "../profile/userBox";
import LoadingSpinner from "../../loading/loadingSpinner";
import EditBtn from "../profile/editBtn";

import { DatePicker, TimePrecision } from "@blueprintjs/datetime";
import { isDate } from "util";






export default class DrawerJob extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            alert:{
                isOpen:false,
                confirm:() => {},
                text:"Sure you want to submit this proposal",
                intent:Intent.WARNING,
                icon:"info-sign",
                handleOpen:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base =state.alert;
                            alert.isOpen =true

                            return {
                                alert:base
                            }
                        })
                    }
                },
                handleClose:() => {
                    if(this._mounted){
                        this.setState(state => {
                            let base = state.alert;
                            base.isOpen = false;

                            return {
                                alert:base
                            }
                        })
                    }
                }
            },
            
            TODO:[],
            project:[],
            enableProposals:false,
            inputInvitation:"",
            isOwner:false,
            id:"",
            isOpen:true,
            isLoading:false,
            action:"",
            proposal:{
                price:{value:"", criteria:{type:"number", min:10, max:50000}},
                receive:{value:"", criteria:{type:"number", min:10}},
                message:{value:"", criteria:{type:"text", minLength:5, maxLength:10000}},
                deadline:{value:new Date(), criteria:{}}
            },
            proposalFetched:null,
            contract:"",
            proposals:[],
            isSaved:false,
            hasChanged:false,
            isLoading2:false
        }

        this.performTransaction = this.performTransaction.bind(this);
        this.toggleLoading = this.toggleLoading.bind(this);
        this.checkChange = this.checkChange.bind(this)
        this.sendMessage = this.sendMessage.bind(this);
    }

    toggleLoading(){
        if(this._mounted){
        this.setState(state => ({
            isLoading:!state.isLoading
        }))
    }
    }

    toggleLoading2 = () =>{
        this.setState(state => ({
            isLoading2:!state.isLoading2
        }))
    }

    removeFromFavorites = () => {
        this.toggleLoading2();

        firebase.firestore().collection("projects").doc(this.props.id).get()
        .then(doc => {
            let data = doc.data();
            let references = data.references;

            

            for(let i =0 ; i < references.length; i++){
                if(references[i] === firebase.auth().currentUser.email){
                    references.splice(i,1);
                }
            }

            firebase.firestore().collection("projects").doc(this.props.id).update({references:references})
            .then(() => {
                this.addToast("Project Removed From Favorites!");
                this.toggleLoading2();
            })
            .catch(e => {
                this.addToast("Ohoh something went wrong!");
                this.toggleLoading2();
            })
        })
        .catch(e => {
            this.addToast("Ohoh something went wrong!");
            this.toggleLoading2();
        })
    }

    performTransaction(collection, prop, value, type, messageSucess, messageFailure,cb){
        this.toggleLoading();
        this.toggleLoading2();
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
            let involved = [];
            if(doc.data().involved !== undefined){
                involved = doc.data().involved
            }
            if(involved.includes(firebase.auth().currentUser.email) === false){
                involved.push(firebase.auth().currentUser.email);
            }
            firebase.firestore().collection(collection).doc(this.props.id).update({
                [prop]:data,
                involved:involved
            })
            .then((result) => {
                this.addToast(messageSucess);
                this.toggleLoading2();
                this.toggleLoading()
               // cb()
            })
            .catch(e => {
                this.addToast(messageFailure);
                this.toggleLoading();
                this.toggleLoading2()
               // cb();
            })
        })
    }


    addToast = (message) => {
        this.props.toastHandler(message)
    }

    sendMessage(message, userId, action){
        let data = {
            message:message,
            action:action?action:null,
            sent:firebase.firestore.Timestamp.now(),
            state:"unread",
            id:firebase.firestore().collection("users").doc(userId).collection("inbox").doc().id
        }
        firebase.firestore().collection("users").doc(userId).collection("inbox").doc(data.id).set(data)
        .then(() => {
        })
        .catch(e => {
            this.addToast(e.message);
            alert("Cannot Send The message")
        })
    }

    changePage = (from, to) => {
        $(from).slideUp();
        $(to).slideDown();
    }

    

    updateProposal = () => {

       this.toggleLoading2()
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
                deadline:this.state.proposalFetched.deadline.value,
                updated:firebase.firestore.Timestamp.now(),
                state:"unread"
            }
         
            firebase.firestore().collection("proposals").where("projectID","==",this.props.id).where("user","==",firebase.auth().currentUser.uid).get()
            .then(snapshot => {
                if(!(snapshot.empty)){
                    let id = "";
                    snapshot.forEach(doc => {
                        id = doc.id;
                    })

                    firebase.firestore().collection("proposals").doc(id).update(data)
                    .then(async () => {
                        this.addToast("Proposal Updated");
                        this.toggleLoading2()
                        let authorId = await firebase.firestore().collection("users").where("uid","==",this.state.project[0].author).get()
                    authorId.forEach(user => {
                        this.sendMessage(`The user ${firebase.auth().currentUser.email} has updated a proposal in the project ${this.state.project[0].title}`,user.id,{type:"view proposal",id:this.proposalFetchedListener.id, id2:id})
                    })
                        this.props.handleClose();
                    })
                    .catch(e => {
                        this.addToast("Ohoh something went wrong!")
                        this.toggleLoading2()
                    })
                }
            })
            .catch(e => {
                this.toggleLoading2();
                this.addToast("Ohoh something went wrong!")
            })
            }else {
                for(let i = 0; i < messages.length; i++){
                    this.addToast(messages[i]);
                }
                this.toggleLoading2()
            }
        
    }

    acceptProposal = (idProject, idProposal) => {
        this.toggleLoading2()
        firebase.firestore().collection("proposals").where("projectID","==",idProject).where("status","==","accepted").get()
        .then(proposalAccepted => {

            if(proposalAccepted.empty){
              
      
        //this.toggleLoading();
        
        let batch = firebase.firestore().batch();
        
        firebase.firestore().collection("proposals").doc(idProposal).get() 
        .then(doc => {
            if(doc.exists){
                firebase.firestore().collection("projects").doc(idProject).get()
                .then(project => {
                if(project.data().status === "hiring"){
                 let contractID = firebase.firestore().collection("contracts").doc().id

                batch.update(firebase.firestore().collection("proposals").doc(idProposal), {status:"accepted"})
                batch.set(firebase.firestore().collection("contracts").doc(contractID), {
                    id:contractID,
                    projectID:idProject,
                    involved:[doc.data().user,firebase.auth().currentUser.uid ],
                    client:firebase.auth().currentUser.uid,
                    freelancer:doc.data().user,
                    price:doc.data().price,
                    deadline:doc.data().deadline,
                    created:firebase.firestore.Timestamp.now(),
                    presentation:doc.data().presentation,
                    description:project.data().description,
                    title:project.data().title,
                    status:"In Process",
                    isOpen:true,
                    openDispute:false
                })

                batch.update(firebase.firestore().collection("projects").doc(idProject), {status:"In Development"})
                
                batch.commit()
                .then(async () => {
                    this.addToast("Proposal Accepted");
                    let userId = await firebase.firestore().collection("proposals").doc(idProposal).get()
                    
                        this.sendMessage(`The owner of the project "${this.state.project[0].title}" accepted you the proposal `,userId.data().user,{type:"view contract" ,id:idProject})
                        this.sendMessage(`You in the project "${this.state.project[0].title}" accepted the proposal`,firebase.auth().currentUser.uid,{type:"view contract" ,id:idProject})
                    this.toggleLoading2()
                this.toggleLoading();
                    this.startInterview(idProject,idProposal);
                })
                .catch(e => {
                    this.addToast(e.message);
                    this.toggleLoading2()
                    this.toggleLoading()
                })
            }else {
                this.toggleLoading2()
                this.addToast("The project is in development")
            }
            })
            }else {
                this.addToast("Proposal does not exist");
                this.toggleLoading2()
                this.toggleLoading();
            }
            
        })
        .catch(e => {
            this.addToast(e.message);
            this.toggleLoading2()
            this.toggleLoading();
        })
    
}else {
    this.addToast("There is an accepted proposal already");
    this.toggleLoading2()
}
})
.catch(e => {
    this.addToast("Ohho something went wrong :(");
    this.toggleLoading2()
})
    }

    checkChange(element, reference, dateException){
      let check = 0 ;
  
        Object.keys(this.state.proposalFetchedListener).forEach(key => {
         if(this.state.proposalFetchedListener[key]["value"] !== reference[key]["value"]){
             if(!(Number.isNaN(Number(this.state.proposalFetchedListener[key]["value"]))) && (this.state.proposalFetchedListener[key]["value"] !== "")){
                check = 1
             }else {
                 if(this.state.proposalFetchedListener[key]["value"].toDate() === undefined || !isDate(this.state.proposalFetchedListener[key]["value"].toDate())){
                if(this.state.proposalFetchedListener[key]["value"].toLowerCase() !== reference[key]["value"].toLowerCase()){

                    check = 1
                }
                
            }else {
                
               let date1 = this.state.proposalFetchedListener[key]["value"].toDate() !== undefined?this.state.proposalFetchedListener[key]["value"].toDate():this.state.proposalFetchedListener[key] 
                let date2 = reference[key]["value"] === undefined?undefined:reference[key]["value"].toDate() !== undefined?reference[key]["value"].toDate():reference[key]["value"];
                let check2 = 0
                if(isDate(date1) && isDate(date2)){
                if(date1.getDate() !== date2.getDate()){
                    check2++;
                }
                if(date1.getMonth() === date2.getMonth()){
                    check2 ++
                }
                if(date1.getFullYear() === date2.getFullYear()){
                    check2++;
                }

                if(check2 === 3){
                    check = 1;
                }
            }else {
                check = 1;
            }
                
            }
             }
             

         }
        })

        if(check === 1){
            if(!dateException){
        element.style.boxShadow = "0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px #d5d23a";
        element.style.borderColor = "#d5d23a"
            }
            if(this._mounted){
        this.setState({hasChanged:true})
            }
        }else {
            if(!dateException){
        element.style.boxShadow = "0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(82, 168, 236, 0.6)";
             element.style.borderColor = "rgba(82, 168, 236, 0.6)"
            }
            if(this._mounted){
             this.setState({hasChanged:false})
            }
        }

    }

    componentDidUpdate(){
        (() => {
            if(this.state.action !== ""){
                if(this.state.action === "view contract"){
                    this.changePage("#dj-section-1","#dj-section-4")
                    if(this._mounted){
                    this.setState({action:""});
                    }
                }
            }
            return "";
        })()
    }

    startInterview = (projectID, proposalID) => {
        this.toggleLoading2()

        firebase.firestore().collection("projects").doc(projectID).get()
        .then(project => {
            let projectID = project.id;
            let projectName = project.data().title;
            let projectOwner = project.data().author;
            firebase.firestore().collection("proposals").doc(proposalID).get()
            .then(proposal => {
                firebase.firestore().collection("chat").where("participants","array-contains",proposal.data().user).where("projectID","==",projectID).get()
                .then(snap => {

                    if(snap.empty){
                let batch = firebase.firestore().batch();
                let anotherParticipant = proposal.data().user;
                let documentID = firebase.firestore().collection("chat").doc().id
                let messageID = firebase.firestore().collection("chat").doc(documentID).collection("messages").doc().id
                batch.set(firebase.firestore().collection("chat").doc(documentID),{
                    participants:[projectOwner,anotherParticipant],
                    projectID:projectID,
                    projectName:projectName,
                    projectOwner:projectOwner,
                    created:firebase.firestore.Timestamp.now(),
                    updated:firebase.firestore.Timestamp.now(),
                    id:documentID,
                    lastMessage:"The interview Started"
                })
                batch.set(firebase.firestore().collection("chat").doc(documentID).collection("messages").doc(messageID), {
                    author:projectOwner,
                    message:"The interview Started",
                    sent:firebase.firestore.Timestamp.now()
                })
                batch.update(firebase.firestore().collection("users").doc(anotherParticipant),{activeCandidancies:firebase.firestore.FieldValue.arrayUnion(projectID)})

                batch.commit()
                .then(() => {
                    this.addToast("You Started a Interview")
                    this.toggleLoading2()
                    this.props.handleClose();
                    snap.forEach(chat => {
                        this.props.providePayloadToChat(chat.data().id)
                    })
                })
                .catch(e => {
                    this.addToast("Something goes wrong :(, Try Again")
                    this.toggleLoading2()
                })
            }else {
                this.toggleLoading2();
                this.props.handleClose();
                snap.forEach(chat => {
                    this.props.providePayloadToChat(chat.data().id)
                })
            }

            })
            .catch(e => {
                this.addToast("Something goes wrong :(, Try Again")
                    this.toggleLoading2()
            })
            
                
            })
            .catch(e => {
                this.addToast("Something goes wrong :(, Try Again")
                    this.toggleLoading2()
            })
        })
        .catch(e => {
            this.addToast("Something goes wrong :(, Try Again");
            this.toggleLoading2()
        })
    }

    submitProposal(){
        this.toggleLoading2();
       
        let objectProposals = this.state.proposal;
        let check = 0;
        let messages = [];
        
        Object.keys(objectProposals).forEach(key => {
            if(key !== "quantity"){
            if(!(checkCriteria(objectProposals[key]["value"], objectProposals[key]["criteria"], key).check)){
                check =1;
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
            deadline:this.state.proposal.deadline.value,
            created:firebase.firestore.Timestamp.now(),
            updated:firebase.firestore.Timestamp.now(),
            id:firebase.firestore().collection("proposals").doc().id,
            projectID:this.state.project[0].id,
            title:this.state.project[0].title,
            state:"unread"
        }

        

        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
        .then((user) => {
        if(user.data().cards >= this.state.project[0].cards){
         let newCards = Number(user.data().cards - this.state.project[0].cards);
         //let previewPorposals = user.data().proposals !== undefined? user.data().proposals:[];
        // previewPorposals.push({projectId:this.props.id ,proposalId:data.id});
         let batch = firebase.firestore().batch();
         //batch.update(firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid), {proposals:previewPorposals})
         batch.update(firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid),{cards:newCards} )

         let inboxID = firebase.firestore().collection("users").doc(this.state.project[0].author).collection("inbox").doc().id
          batch.set(firebase.firestore().collection("users").doc(this.state.project[0].author).collection("inbox").doc(inboxID), {
              action:{
                  type:"view proposal",
                  id:this.state.project[0].id,
                  id2:data.id
              },
              id:inboxID,
              message:`The user ${firebase.auth().currentUser.email} made you a proposal in the project ${this.state.project[0].title}`,
              sent:firebase.firestore.Timestamp.now(),
              state:"unread"
          } )
        firebase.firestore().collection("proposals").where("projectID","==",this.props.id).where("user","==",firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            if(snapshot.empty){
               batch.set(firebase.firestore().collection("proposals").doc(data.id), data)

               firebase.firestore().collection("projects").doc(this.props.id).get()
               .then(async project => {
                   let applicants =[];
                   let involved = [];
                   if(project.data().applicants !== undefined){
                       applicants = project.data().applicants
                   }
                   if(project.data().involved !== undefined){
                       involved = project.data().involved;
                   }
                   if(applicants.includes(firebase.auth().currentUser.email) === false){
                       applicants.push(firebase.auth().currentUser.email);
                   }

                   if(involved.includes(firebase.auth().currentUser.email) === false){
                       involved.push(firebase.auth().currentUser.email)
                   }

                   batch.update(firebase.firestore().collection("projects").doc(this.props.id), {applicants:applicants,proposals:applicants.length, involved:involved, updated:firebase.firestore.Timestamp.now()})

                   batch.commit().then(async () => {
                    this.addToast("Proposal Submitted");
                    let authorId = await firebase.firestore().collection("users").where("email","==",this.state.project[0].author).get()
                    authorId.forEach(user => {
                        this.sendMessage(`The user ${firebase.auth().currentUser.email} has made you a proposal in the project ${this.state.project[0].title}`,user.id,{type:"view proposal",id:this.props.id, id2:data.id})
                    })
                    this.toggleLoading2()
                    this.props.handleClose();

                   })

               })
            }
        })
        .catch(e => {
            this.addToast(e.message)
            this.toggleLoading2()
        })
   

    }else {
        this.addToast("You don't have enough cards");
        this.props.handleClose();
    }
        })
        .catch(e => {
            this.addToast(e.message);
        })
        
        }else {
            for(let i = 0; i < messages.length; i++){
                this.addToast(messages[i]);
            }
            this.toggleLoading2()
        }

   
    }

    fetchProjectProps = () =>{
    
        firebase.firestore().collection("projects").doc(this.props.id).get()
         .then(async snapshot => {
      
             let project = [];
                 project.push(snapshot.data());
                 let quantity = 0;
                 let idAuthorProject = project[0].author
                 let TODO = snapshot.data().TODO?snapshot.data().TODO:[];
                // let userAuthor = await firebase.firestore().collection("users").doc(project[0].author).get();
                //  let data = userAuthor.data();
                 //let author = data.displayName?data.displayName:data.email;
                 //let img = data.photoURL;
   
                 //project[0].author = author;
                // project[0].authorImg = img;
                 let references = snapshot.data().references;
                let result = await firebase.firestore().collection("projects").where("projectID","==",this.props.id).get()
 
                quantity =  result.size
                project[0].quantity = quantity;

                if(!(idAuthorProject === firebase.auth().currentUser.uid)){
                 firebase.firestore().collection("proposals").where("user","==",firebase.auth().currentUser.uid).where("projectID","==",this.props.id).get()
                 .then(snapshot2 => {
             
                 let documentF = null;
                 let isOwner = false;
                 let contract = "";
                 snapshot2.forEach(async document => {
                    documentF = document;
                    if(document.data().status =="accepted"){
                       let fetchContract = await firebase.firestore().collection("contracts").where("projectID","==", this.props.id).get()

                       fetchContract.forEach(contractDoc => {
                           contract = contractDoc.data()
                           contract.title = project[0].title;
                           contract.idProposal = document.data().id;
                           contract.idProject = project[0].id
                       })
                        /*contract = {
                            client:project[0].contract.client,
                            freelancer:project[0].contract.freelancer,
                            description:project[0].contract.description,
                            price:project[0].contract.price,
                            deadline:project[0].contract.deadline,
                            start:project[0].contract.created,
                            idProposal:document.data().id,
                            idProject:project[0].id,
                            status:project[0].contract.status,
                            title:project[0].title
                        }*/

                        if(this._mounted){
                            this.setState({TODO:TODO, project:project, proposalFetched:proposalFetched, isSaved:isSaved, proposalFetchedListener:this.proposalFetchedListener, isOwner:isOwner, contract:contract, action:this.props.action});
                          }
                        
                    }
                 })
                 let proposalFetched = {};
                 
 
                 if(documentF !== null){
                     let proposals = documentF.data();
                 
                 
                     let obj = {value:"", criteria:{}}

                     if(proposals.user === firebase.auth().currentUser.uid){
                       
                         Object.keys(proposals).forEach(key => {
                       
                             if(((Number.isNaN(Number(proposals[key]))) || proposals[key] === "") && proposals[key].seconds === undefined){
                                 obj.value = proposals[key];
                                 obj.criteria = {type:"text", minLength:4, maxLength:500}
                             }else if(!((Number.isNaN(Number(proposals[key]))) && proposals[key] !== "")){
                                 obj.value = proposals[key];
                                 obj.criteria = {type:"number", min:10, max:50000}
                             }else {
                                
                               if(key !== "id"){
                                   
                                obj.value = proposals[key].toDate();
                                
                                obj.criteria = {}
                               }
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
              
 
              firebase.firestore().collection("proposals").where("status","==","accepted").where("projectID","==",this.props.id).get()
              .then(proposalAccepted => {
                  if(proposalAccepted.empty){
                    if(this._mounted){
                      this.setState({TODO:TODO, project:project,enableProposals:true, proposalFetched:proposalFetched, isSaved:isSaved, proposalFetchedListener:this.proposalFetchedListener, isOwner:isOwner, contract:contract, action:this.props.action});
                    }
                }else {
                    if(this._mounted){
                        this.setState({TODO:TODO, project:project, enableProposals:false, proposalFetched:proposalFetched, isSaved:isSaved, proposalFetchedListener:this.proposalFetchedListener, isOwner:isOwner, contract:contract, action:this.props.action});
                      }
                }
                })
                .catch(e => {
                    this.addToast("Ohoh something went wrong! :(");
                })
                
        
                 })
                 .catch(e => {
                     this.addToast("Ohoh something went wrong :(")
                 })
                

                }else {
        
                    let isSaved = false;
                 if(references.includes(firebase.auth().currentUser.email)){
                     isSaved = true;
                 }

                 let proposals = [];

                 firebase.firestore().collection("proposals").where("projectID","==",project[0].id).orderBy("created","desc").get()
                 .then( s => {
                     
                     let contract = "";
                     let index = 0

                     if(!s.empty){
                     s.forEach(async proposal => {
                        proposals.push(proposal.data());
                        if(proposals[index].status === "accepted"){
                            let fetchContract = await firebase.firestore().collection("contracts").where("projectID","==", this.props.id).get()

                       fetchContract.forEach(contractDoc => {
                           contract = contractDoc.data()
                           contract.title = project[0].title;
                           contract.idProposal = proposal.data().id;
                           contract.idProject = project[0].id
                       })

                      
                           /* contract = {
                                client:project[0].contract.client,
                                freelancer:project[0].contract.freelancer,
                                description:project[0].contract.description,
                                price:project[0].contract.price,
                                deadline:project[0].contract.deadline,
                                start:project[0].contract.created,
                                idProposal:proposal.data().id,
                                idProject:project[0].id,
                                status:project[0].contract.status,
                                title:project[0].title
                            }*/
                        }
                        index++
                        if(index === s.size){
                            if(this._mounted){
                                
                            this.setState({TODO:TODO, project:project, isSaved:isSaved, isOwner:true, proposals:proposals ,contract:contract, action:this.props.action})
                            }
                        }
                    })
                }else {
                    if(this._mounted){
                        console.log("The contract is ", contract)
                    this.setState({TODO:TODO, project:project, isSaved:isSaved, isOwner:true, proposals:proposals ,contract:contract, action:this.props.action})
                    }
                }
                 })

                 
                }
                 
         })
         .catch(e => {
            // this.addToast(e.message);
         })
 
     }

     componentWillUnmount() {
        this._mounted = false;

        if(this.projectListener !== undefined){
            //Clear the listener
            this.projectListener();
        }
     }

    componentDidMount(){
        this._mounted = true;

       

       this.projectListener =  firebase.firestore().collection("projects").doc(this.props.id).onSnapshot(snapshot => {
            this.fetchProjectProps();
        })
       
       
    }

     setValue = async (obj, prop, value,index,cb, objA, propA, coeficent)=> {
         await this.setState(state => {
            let valueCollected = value.value !== undefined?value.value:"";

            if(!(Number.isNaN(Number(valueCollected))) && valueCollected !== ""){
                valueCollected = Number(valueCollected)
            }
           
            let objBase = state[obj];
            let propBase = objBase[prop];
            if(!isDate(value)){
            propBase["value"] = valueCollected;
            }else {
                propBase["value"] = value; 
            }
            objBase[prop] = propBase;

            if(coeficent){
            let objBaseA = state[objA];
            let propBaseA = objBaseA[propA];
            propBaseA["value"] = propBase["value"] + (propBase["value"]*coeficent);
            propBaseA["value"] = Math.round((Number(propBaseA["value"]) * 100))/100
            objBase[propA] = propBaseA;
            }

            if(!(checkCriteria(value.value, propBase["criteria"], prop).check)){
                if(index){
                value.parentNode.childNodes[index].style.display ="block";
                let message =checkCriteria(value.value, propBase["criteria"], prop).message;
                value.parentNode.childNodes[index].textContent = message;
                }
            }else {
                if(index){
                value.parentNode.childNodes[index].style.display ="none";
                }
            }
            

            return (
                {
                    [obj]:objBase,
                }
            )
        })
        if(cb){
        cb()
        }
    }
    inviteEmail = () => {
        firebase.firestore().collection("projects").doc(this.props.id).get()
        .then(doc => {
            let invitations = doc.data().invitations?doc.data().invitations:[];
            let involved  = doc.data().involved?doc.data().involved:[];
            if(!invitations.includes(this.state.inputInvitation)){
            invitations.push(this.state.inputInvitation);

            if(!involved.includes(this.state.inputInvitation)){
                involved.push(this.state.inputInvitation);
            }

            firebase.firestore().collection("users").where("email","==",this.state.inputInvitation).get()
            .then(snap => {
                if(snap.empty){
                    this.addToast("The email is not registered in this platform");
                }else {
                    firebase.firestore().collection("projects").doc(this.props.id).update({invitations:invitations, involved:involved})
                    .then(() => {
                        this.addToast("User Invited")
                    })
                    .catch(e => {
                        this.addToast("ohoh something went wrong :(");
                    })
                }
            })
            .catch(e => {
                this.addToast("ohoh something went wrong")
            })
            
            }else {
                this.addToast("The Email is already Invited")
            }

            
        })
        .catch(e => {
            this.addToast("ohoh something went wrong :(")
        })
    }

    capitalize = (string)  =>
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render(){
        return(
            <div style={{position:"relative"}}>
                
                {this.state.isLoading === true?<AbsoluteLoading />:null} 
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"75%"} isOpen={this.props.isOpen}>
            {this.state.isLoading2?<LoadingSpinner />:null}
                {this.state.project.length ===0?<DrawerJobLoading />:
                <div className={Classes.DRAWER_BODY}>
                    <Alert icon={this.state.alert.icon} intent={this.state.alert.intent} isOpen={this.state.alert.isOpen} onConfirm={() => {this.state.alert.confirm(); this.state.alert.handleClose();}} onCancel={() =>{this.state.alert.handleClose()}} confirmButtonText="Yes" cancelButtonText="No">
                        <p>{this.state.alert.text}</p> 
                    </Alert>
                <div id="dj-section-1" >
                    
                <div className={`row ${Classes.DIALOG_BODY}`}>
                    
                    <div className="col-sm-8">
                        <div className="card">
                        <div className="text-center card-header" style={{position:"relative"}}>
                            <div className="job-status">
                            <div>{this.capitalize(this.state.project[0].status)}
                        
                            </div>
                            </div>
                        {this.state.isOwner? <EditBtn btns={
                        [
                            {
                                text:"Edit",
                                callback:() => {
                                    if(this._mounted){
                                        this.setState(state => {
                                            let base = state.alert;
                                            base.isOpen = true;
                                            base.confirm =() => { this.props.editProject(this.props.id)}
                                            base.text = "Sure you want to edit this project?"
                                            base.icon = "info-sign";
                                            base.intent = Intent.WARNING
                                            return {
                                                alert:base
                                            }
                                        })
                                    }
                                }
                            }
                        ]
                    }/>:null}
                            <h3 className="mt-4">{this.state.project[0].title}</h3>
                        </div>
                        <div className="card-body">
                  
                        <div className="container-fluid mt-2">
                        <h4>Description</h4>
                        <h6 className="mt-3">{this.state.project[0].description}</h6>
                        </div>
                     
                        <hr/>
                        <div className="container-fluid mt-4">
                            <h4>Specs</h4>
                            <div className="row mt-3">
                                <div className="col-sm-4" style={{borderRight:"1px solid lightgray"}}>
                                    <div><h5><i className="material-icons align-middle" >attach_money</i> Budget</h5></div>
                                    <div><h6 className="text-left px-3">{this.state.project[0].budget}</h6></div>
                                </div>
                                <div className="col-sm-4" style={{borderRight:"1px solid lightgray"}}>
                                <div><h5><i className="material-icons align-middle" >show_chart</i> Level</h5></div>
                                <div><h6 className="text-left px-3">{this.state.project[0].level}</h6></div>
                                </div>
                                <div className="col-sm-4">
                                    <div><h5><i className="material-icons align-middle">library_books</i> Proposals</h5></div>
                                    <div><h6 className="text-left px-3">{this.state.project[0].quantity}</h6></div>
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
                        this.state.contract === ""?
                            this.state.proposalFetched.price !== undefined?
                        <button type="button" className="btn btn-custom-1 btn-block" onClick={() => {this.changePage("#dj-section-1","#dj-section-3")}}><i className="material-icons align-middle">create</i> Edit Bid</button>:
                        this.state.enableProposals === true?<button type="button" className="btn btn-custom-1 btn-block" onClick={() => {this.changePage("#dj-section-1","#dj-section-2")}}><i className="material-icons align-middle">add</i> Bid</button>:null
                        :<button type="button" className="btn btn-custom-1 btn-block" onClick={() => {this.changePage("#dj-section-1","#dj-section-4")}}><i className="material-icons align-middle">subject</i>Contract</button>
                        }
                    
                        {
                        this.state.isSaved === true?<div className="action-btns text-center">
                        <button onClick={() => {this.removeFromFavorites()}} className="btn btn-custom-1 mr-2 mt-3 btn-sm"><i className="material-icons align-middle">favorite_border</i>Remove From Favorites</button>
                            </div>:
                        <div className="action-btns text-center">
                    <button onClick={() => {this.performTransaction("projects","references",firebase.auth().currentUser.email,"array","Project Saved","Upps Problem Saving The Project", this.props.handleClose)}} className="btn btn-custom-1 mr-2 mt-3 btn-sm"><i className="material-icons align-middle">favorite</i> Mark As Favorite</button>
                        </div>
                        }
                        <div className="container-fluid mt-4">
                        <h4>Created By</h4>
                            <UserBox id={this.state.project[0].author} openUser={() => {this.props.openUser(this.state.project[0].author)}} addToast={this.addToast} size={"60px"} handleStates={this.props.handleStates} />
                        </div>
                        <div className="container-fluid mt-4">
                        <h4><i className="material-icons align-middle">assistant_photo</i> <span>Country</span></h4>
                        <h6 className="mt-3 px-4">{this.state.project[0].country}</h6>
                        </div>
                        <div className="form-group mt-4">
                            <button type="button" className="btn btn-custom-1 btn-block mt-3" onClick={this.props.openTODO}><i className="material-icons align-middle">add</i> TO-DO</button>
                        </div>
                    </div>
                </div>
                 <h4 className="text-center mt-5 text-center">Progress</h4>
                {this.state.TODO !== undefined? <div className="progress mx-4 mt-3 "  style={{border:"1px solid gray"}}>
                   
                   <div className="progress-bar" style={{width:(() => {
                       if(this.state.TODO.length > 0){
                           let checked = 0;
                           for(let i = 0; i < this.state.TODO.length; i++){
                               if(this.state.TODO[i].state === true){
                                   checked ++;
                               }
                           }
                       
                           return String(`${Number(Math.round(checked/this.state.TODO.length*100))}%`)
                       }else {
                           return "0"
                       }
                   })()}}>{(() => {
                    if(this.state.TODO.length > 0){
                        let checked = 0;
                        for(let i = 0; i < this.state.TODO.length; i++){
                            if(this.state.TODO[i].state === true){
                                checked ++;
                            }
                        }
                        
                        return String(`${Number(Math.round(checked/this.state.TODO.length*100))}%`)
                    }else {
                        return "0%"
                    }
                })()}</div>
                </div>:null}
                {this.state.project[0].author === firebase.auth().currentUser.uid?
                <div>
                <h4 className="text-center mt-5 mb-2">Invitations</h4>

                <div className="input-group mb-3 mt-3 mx-auto" style={{width:"350px"}}>
                <input type="text" className="form-control" value={this.state.inputInvitation} onChange={(e) => {
                    this.setState({
                        inputInvitation:e.target.value
                    })
                }} placeholder="Enter Email" />
                  <div className="input-group-append ">
                  <button className="btn btn-custom-1" type="button" onClick={() => {this.inviteEmail()}}><i className="material-icons align-middle" style={{fontSize:"15px"}}>add</i> Invite</button> 
               </div>
              </div>
              {this.state.project[0].invitations?this.state.project[0].invitations.length > 0?
               <div className="invitations-job-drawer">
                {this.state.project[0].invitations.map((e,i) => {
                  return ( <UserBox openUser={this.props.openUser} key={i} addToast={this.addToast} size={"60px"} handleStates={this.props.handleStates} email={e} />)
                })}
                </div>
                :null:null }
              </div>
               :null}

                </div>
                <div id="dj-section-2" style={{display:"none"}}>
                  <div className={`${Classes.DIALOG_BODY}`}>
                      <button type="button" className="btn btn-custom-1 mb-3 btn-sm " onClick={() => {this.changePage("#dj-section-2","#dj-section-1")}}><i className="material-icons align-middle">chevron_left</i> Back</button>
                    <div className="card">
                        <div className="card-header">
                            <h3>Bid</h3>
                        </div>
                    <div className="card-body">
                      <div className="form-group">
                          <div className="row mt-4">
                        <div className="col-sm-5">
                          <h4>Price <span className="light-text">($US Dollars)</span></h4>
                        </div>
                        <div className="text-left">
                          <input type="number" value={this.state.proposal.price.value} className="form-control ml-2" onChange={(e) => {this.setValue("proposal","price",e.target,1, ()=> {},"proposal","receive",-0.15)}}/>
                          <div className="invalid-feedback">Valid.</div>
                           
                        </div>
                          </div>

                          <div className="row mt-4">
                        <div className="col-sm-5">
                          <h4>StaffedApp Service Cost</h4>
                        </div>
                        <div className="text-left">
                          <h6 className="ml-2">15% ({ Math.round((this.state.proposal.price.value * 0.15)*100)/100} $)</h6>
                        </div>
                          </div>

                          <div className="row mt-4">
                        <div className="col-sm-5">
                          <h4>You will Receive <span className="light-text">($US Dollars)</span></h4>
                        </div>
                        <div className="text-left">
                          <input type="number" className="form-control ml-2" value={this.state.proposal.receive.value} onChange={(e) => {this.setValue("proposal","receive",e.target,1, ()=> {},"proposal","price",-(1-(1/(1-0.15)))); }}/>
                          <div className="invalid-feedback">Valid.</div>
                        </div>
                          </div>

                          <div className="row mt-4">
                        <div className="col-sm-5">
                          <h4>Deadline</h4>
                        </div>
                        <div className="text-left">
                        <DatePicker
                        className="pr-2"
                              minDate={new Date()}
                              maxDate={new Date(2030,1,1)}
                        
                             onChange={(newDate) => this.setValue("proposal","deadline",newDate,)}
                             value={this.state.proposal.deadline.value}
                           />

                          <div className="invalid-feedback">Valid.</div>
                        </div>
                          </div>
                      </div>
                      
                      <div className="form-group mt-5">
                      <h4>Presentation</h4>
                        <textarea className="form-control mt-3" onChange={(e) => {this.setValue("proposal","message",e.target,2,() => {})}} placeholder="The description about the project" rows="5" style={{resize:"none"}} required></textarea>
                           <div className="invalid-feedback">Valid.</div>
                          
                      </div>
                      </div>

                      <div className="card-footer text-center">
                          <button type="button" className="btn btn-custom-1" onClick={()=> {
                              if(this._mounted){
                                  this.setState(state => {
                                      let base = state.alert;
                                      base.isOpen = true;
                                      base.confirm = () => {this.submitProposal()}
                                      base.text = "Sure you want to submit this proposal?"
                                      return {
                                          alert:base
                                      }
                                  })
                              }
                              
                            }
                              }><i className="material-icons align-middle">send</i> Submit</button>
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
                            <h3>Bid</h3>
                        </div>
                    <div className="card-body">
                      <div className="form-group">
                          <div className="row mt-4">
                        <div className="col-sm-5">
                          <h4>Price <span className="light-text">($US Dollars)</span></h4>
                        </div>
                        <div className="text-left">
                          <input type="number" value={this.state.proposalFetched.price.value} className="form-control ml-2" onChange={(e) => {e.persist(); this.setValue("proposalFetched","price",e.target,1, () => {this.checkChange(e.target, this.state.proposalFetched)},"proposalFetched","received",-0.15); }}/>
                          <div className="invalid-feedback">Valid.</div>
                           
                        </div>
                          </div>

                          <div className="row mt-4">
                        <div className="col-sm-5">
                          <h4>StaffedApp Service Cost</h4>
                        </div>
                        <div className="text-left">
                          <h6 className="ml-2">15% ({ Math.round((this.state.proposalFetched.price.value * 0.15)*100)/100} $)</h6>
                        </div>
                          </div>

                          <div className="row mt-4">
                        <div className="col-sm-5">
                          <h4>You Receive <span className="light-text">($US Dollars)</span></h4>
                        </div>
                        <div className="text-left">
                          <input type="number" className="form-control ml-2" value={this.state.proposalFetched.received.value} onChange={(e) => {e.persist(); this.setValue("proposalFetched","received",e.target,1, ()=> { this.checkChange(e.target,this.state.proposalFetched)},"proposalFetched","price",-(1-(1/(1-0.15)))); }}/>
                          <div className="invalid-feedback">Valid.</div>
                        </div>
                          </div>

                          <div className="row mt-4">
                        <div className="col-sm-5">
                          <h4>Deadline</h4>
                        </div>
                        <div className="text-left">
                        <DatePicker
                              minDate={this.state.proposalFetched.created.value}
                              maxDate={new Date(2030,1,1)}
                          
                             onChange={async(newDate) => { await this.setValue("proposalFetched","deadline",newDate,); this.checkChange(newDate, this.state.proposalFetched, true)}}
                             value={this.state.proposalFetched.deadline.value}
                           />
                    
                          <div className="invalid-feedback">Valid.</div>
                        </div>
                          </div>
                      </div>
                      <div className="form-group mt-5">
                      <h4>Presentation</h4>
                        <textarea className="form-control mt-3" onChange={(e) => {e.persist(); this.setValue("proposalFetched","presentation",e.target,2,()=> { this.checkChange(e.target, this.state.proposalFetched)}); }} value={this.state.proposalFetched.presentation.value} placeholder="The description about the project" rows="5" style={{resize:"none"}} required></textarea>
                           <div className="invalid-feedback">Valid.</div>
                          
                      </div>
                      </div>

                      <div className="card-footer text-center">
                          {this.state.hasChanged === true?
                          <button type="button" className="btn btn-custom-1" onClick={()=> {
                              if(this._mounted){
                                  this.setState(state => {
                                      let base = state.alert;
                                      base.isOpen = true;
                                      base.confirm = () => {this.updateProposal()}
                                      base.text ="Sure you want to update this proposal?"
                                      return {
                                          alert:base
                                      }
                                  })
                              }
                              
                            }}><i className="material-icons align-middle">send</i> Confirm Edit</button>
                          :null
                          }
                      </div>
                  </div>
                  </div>

                </div>
                :null
                }
                {
                    this.state.isOwner === false && this.state.contract === ""?null:
                  
                    <div id="dj-section-4" style={{display:"none"}}>
                <div className={`${Classes.DIALOG_BODY}`}>
                      <button type="button" className="btn btn-custom-1 mb-3 btn-sm " onClick={() => {this.changePage("#dj-section-4","#dj-section-1")}}><i className="material-icons align-middle">chevron_left</i> Back</button>
                      {this.state.contract !== ""?
                     <ContractModule openDispute={this.state.contract.openDispute} isOpen={this.state.contract.isOpen} openUser={this.props.openUser} id={this.state.contract.id} freelancer={this.state.contract.freelancer} title={this.state.contract.title} projectID={this.state.contract.idProject} status={this.state.contract.status} openProposal={() => {this.props.openProposal(this.state.contract.idProject, this.state.contract.idProposal)}} client={this.state.contract.client} price={this.state.contract.price} deadline={this.state.contract.deadline} description={this.state.contract.description} addToast={this.addToast} handleStates={this.props.handleStates} />:
                          null}
                    {this.state.isOwner === true && this.state.contract === ""?    
                   <div className="container-fluid">
                        {this.state.proposals.length > 0?this.state.proposals.map((proposal,i) => {

                       let date;
                            
                            try {
                       date = proposal.created.toDate().toDateString();

                         }catch(e){

                          date = firebase.firestore.Timestamp.fromMillis((proposal.created.seconds !== undefined ?proposal.created.seconds:proposal.created._seconds)*1000).toDate().toDateString()
                         }
                        return <ProposalModule handleStates={this.props.handleStates} addToast={this.addToast} startInterview={() => {this.startInterview(this.props.id,proposal.id)}} acceptProposal={() => {
                            if(this._mounted){
                                this.setState(state => {
                                    let base =state.alert;
                                    base.isOpen = true;
                                    base.confirm = () => {this.acceptProposal(this.props.id, proposal.id)}
                                    base.text ="Sure you want to accept this proposal?"
                                    return {
                                        alert:base
                                    }
                                })
                            }
                            
                        }}  key={i} date={date} deadline={proposal.deadline} user={proposal.user} price={proposal.price} presentation={proposal.presentation} />
                    })
                    :<div className="container-fluid text-center">
                        <h4>No Proposals</h4>
                        </div>
                    }
                    </div>
                    :null}
                      
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

function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}