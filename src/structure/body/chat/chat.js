import React from "react";
import "./chat.css";
import firebase from "../../../firebaseSetUp";
import $ from "jquery";

//Chat components
import ConversationContainer from "../../chat-components/conversationContainer";
import ConversationItem from "../../chat-components/conversationItem";
import MessengerModule from "./MessengerModule";


export default class Chat extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            conversations:[],
            openChats:[]
        }
    }

    openChat = (id) => {
        let factor = 0
        factor += 380;

        for(let i = 0 ; i< this.state.openChats.length; i++){
            factor += 340
        }

        if($(window).width() - factor >= 340){
        if(this.state.openChats.length < 3){
            if(!this.state.openChats.includes(id)){
                firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({openChats:firebase.firestore.FieldValue.arrayUnion({id:id,factor:factor})})
                .then(() => {

                })
                .catch(e => {
                    this.props.addToast("Something Goes Wrong :(");
                })
                    this.setState(state => {
                        let openChats = state.openChats;
                        openChats.push({
                            id:id,
                            factor:factor
                        });
                        return {
                            openChats:openChats
                        }
                    })
                
        }
        }else {
            this.setState(state => {
                let openChats = state.openChats;
                openChats[2] = id;

                return {
                    openChats:openChats
                }
            })
        }
    }else {
        this.props.addToast("Cannot Open More Chats");
    }
    }

    getParticipantsData  =(id, index) => {
   
       firebase.firestore().collection("chat").doc(id).get()
        .then((doc) => {
            
            let participants = doc.data().participants;

            for(let i = 0; i< participants.length; i++){
                    firebase.firestore().collection("users").doc(participants[i]).get()
                    .then(user => {
                       
                        if(this._mounted){
                            if(firebase.auth().currentUser.uid !== participants[i]){
                        this.setState(state => {
                            let base = state.conversations
                            let newArr = [...state.conversations]
                            let objTarget = newArr[index]
                            objTarget.name = firebase.auth().currentUser.uid === participants[i]?null:user.data().displayName?user.data().displayName:user.data().email
                            objTarget.photoURL = firebase.auth().currentUser.uid === participants[i]?null:user.data().photoURL;
                    
                            newArr[index] = objTarget
                            
                            return {
                                conversations:newArr
                            }
                        }) 
                    } 
                    } 
                    })
                    .catch(e => {
                        console.log(e.message);
                    })
                }
               
        })
    }

    componentWillUnmount(){
        this._mounted = false
    }

    componentDidMount() {
        this._mounted = true;
        firebase.firestore().collection("chat").where("participants","array-contains",firebase.auth().currentUser.uid).orderBy("updated","asc").onSnapshot(async snapshot => {
            let chats =[]
            let index= 0
           snapshot.forEach(chat => {
              this.getParticipantsData(chat.id, index);
         
                chats.push(chat.data())
                index++
            })
            
            this.setState({
                conversations:chats
            })
        })

        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
        .then(doc => {
            let openChats = doc.data().openChats;
            if(openChats !== undefined){
            
                if(openChats.length > 0){
            this.setState({
                openChats:openChats
            })
        }
        }
        })
    }

   handleClose =(i) => {
       
       this.setState(state => {
           let openChats = [...state.openChats]
           openChats.splice(i,1);

           return {
               openChats:openChats
           }
       })

       firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
       .then(user => {
           let openChats = user.data().openChats;
           openChats.splice(i,1)

           firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({openChats:openChats})
           .then(() => {

           })
           .catch(e => {

           })
       })
   }

    render(){
        return(
            <div>
                {(() => {
                    if(this.props.payload){
                        
                    if(this.props.payload){
                        let factor = 0
                        factor += 380;
                        let perfectIndex = null;
                        let currentWidth = $(window).width();
                      for(let i = 0 ; i< this.state.openChats.length; i++){
                       factor += 340;
                       if(factor + 340 > currentWidth){
                           perfectIndex = i
                       }
                    }
                       
                       if(perfectIndex === null){
                           if(this._mounted){
                           this.setState(state => {
                               let base = [...state.openChats];
                               base.push({
                                   id:this.props.payload,
                                   factor:factor
                               })
                               return {
                                   openChats:base
                               }
                           })
                        }
                       }else {
                           if(this._mounted){
                           this.setState(state => {
                               let base = [...state.openChats];
                               base.splice(perfectIndex,1);
                               return {
                                    openChats:base
                               }
                           })
                           }
                       }
                       this.props.resetPayload()
                }
            }
                })()}
                <ConversationContainer>
                    {this.state.conversations.map(e => {
                        return (
                            <ConversationItem name={e.name?e.name:null} photoURL={e.photoURL?e.photoURL:null} date={e.updated.toDate().toDateString()} chatName={e.projectName} lastMessage={e.lastMessage} handleClick={() => {this.openChat(e.id)}} />
                        )
                    })}
                    {this.state.conversations.length === 0?<div>No Conversations</div>:null}
                </ConversationContainer>
                <div className="basic-flex">
                    {this.state.openChats.map((e,i) => {
                        return (
                        <div style={{position:"relative"}}>
                        <MessengerModule factor={e.factor} id={e.id} key={i} handleClose={() => {this.handleClose(i)}}/>
                        </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

async function asyncForEach(array, callback){
    for(let index = 0; index < array.length; index++){
        await callback(array[index],index,array)
    }
}
