import React from "react";
import "./chat.css";
import firebase from "../../../firebaseSetUp";

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
        if(this.state.openChats.length < 3){
            if(!this.state.openChats.includes(id)){
            this.setState(state => {
                let openChats = state.openChats;
                openChats.push(id);
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
    }

   handleClose =(i) => {
       this.setState(state => {
           let openChats = [...state.openChats]
           openChats.splice(i,1);

           return {
               openChats:openChats
           }
       })
   }

    render(){
        return(
            <div>
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
                        <MessengerModule id={e} key={i} handleClose={() => {this.handleClose(i)}}/>
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
