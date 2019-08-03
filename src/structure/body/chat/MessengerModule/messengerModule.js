import React from "react";
import "./messengerModule.css";
import ChatWrapper from "../../../chat-components/chatWrapper";
import MessageModule from "./messageModule";
import firebase from "../../../../firebaseSetUp";
import $ from "jquery";

export default class MessengerModule extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            participants:{},
            groups:[],
            messages:[],
            message:""

            }
    }

    getGroups =() => {
        firebase.firestore().collection("chat").doc(this.props.id).onSnapshot(async doc => {
     
            let messages = doc.data().messages;
            let temporaryMessages = []
            let groups= [];
            let previousId ="";
            let temporaryGroup = {}
          
            for(let i = 0; i < messages.length; i++){
                
                if(messages[i].author !== previousId){
                    if(temporaryGroup.messages){
                        groups.push(temporaryGroup)
                        
                    }
                    temporaryGroup = {}
                    temporaryMessages = [];
                    if(messages[i].author === firebase.auth().currentUser.uid){
                        messages[i].isOwn = true;
                    }else{
                        messages[i].isOwn=  false;
                    }
                    temporaryMessages.push(messages[i])
                    temporaryGroup = {
                        author:messages[i].author,
                        messages:temporaryMessages,
                        isOwn:messages[i].author === firebase.auth().currentUser.uid?true:false
                    };
                    if(i === (messages.length - 1)){
                    groups.push(temporaryGroup);
                    }
                    previousId = messages[i].author
                }else {
                    if(messages[i].author === firebase.auth().currentUser.uid){
                        messages[i].isOwn = true;
                    }else{
                        messages[i].isOwn=  false;
                    }
                    
                    if(temporaryGroup.messages){
                        temporaryGroup.messages.push(messages[i])
                    }
                    if(i === (messages.length - 1)){
                        groups.push(temporaryGroup);
                        }
                }
            }
            if(this._mounted){
            await this.setState({
                chatName:doc.data().projectName,
                groups:groups
            })

            if(this.id){
                $(this.id).ready(() => {
                    $(this.id).scrollTop(999999999999);
                })
                
            }
        
            
        }
        })
    }

    setScrollTop = () => {
        $(this.id).scrollTop(999999999999);
    }

    getParticipantsData  = () => {
        firebase.firestore().collection("chat").doc(this.props.id).get()
        .then((doc) => {
            let participants = doc.data().participants;

            const start = async () => {
                await asyncForEach(participants,async (id) => {
                    await firebase.firestore().collection("users").doc(id).get()
                    .then(user => {
                        if(this._mounted){
                        this.setState(state => {
                            let base = state.participants
                            base[user.id] = user.data()
                            return {
                                participants:base
                            }
                        })  
                    } 
                    })
                    .catch(e => {
                        console.log(e.message);
                    })
                })
               
                this.getGroups();
            }

            start();
        })
    }

    componentDidMount(){
        this._mounted = true;
       this.getParticipantsData()
    }

    componentWillUnmount(){
        this._mounted = false
    }

    handleChangeInput = (e)=> {
        if(this._mounted){
        this.setState({
            message:e.target.value
        })
    }
    }

    handleSendMessage = ()=> {
        firebase.firestore().collection("chat").doc(this.props.id).update({messages:firebase.firestore.FieldValue.arrayUnion({
            message:this.state.message,
            sent:firebase.firestore.Timestamp.now(),
            author:firebase.auth().currentUser.uid
        })})
        .then(() => {
            console.log("Message successfully sent")
        })
        .catch(e => {

        })
    }

    setId = (id) => {
        this.id = id
    }


    render(){
        let user = {
        }
        Object.keys(this.state.participants).forEach(key => {
            if(firebase.auth().currentUser.uid !== key){
                user.photoURL = this.state.participants[key].photoURL?this.state.participants[key].photoURL:null;
                user.name = this.state.participants[key].displayName?this.state.participants[key].displayName:this.state.participants[key].email
            }
        })
        return(
            <ChatWrapper photoURL={user.photoURL} name={user.name} focusInput={this.setScrollTop} setId={this.setId}  onChangeInput={this.handleChangeInput} input={this.state.message} onSend={this.handleSendMessage} chatName={this.state.chatName?this.state.chatName:"Loading..."} handleClose={this.props.handleClose}>
                {this.state.groups.map((e,i) => {
                  return(  <MessageModule author={this.state.participants[e.author].displayName?this.state.participants[e.author].displayName:this.state.participants[e.author].email} photoURL={this.state.participants[e.author]?this.state.participants[e.author].photoURL?this.state.participants[e.author].photoURL:null:null} isOwn={e.isOwn} messages={e.messages} key={i} />)
                })}
                {this.state.groups.length === 0?<div>No messages</div>:null}
            </ChatWrapper>
        )
    }
}

async function asyncForEach(array, callback){
    for(let index = 0; index < array.length; index++){
        await callback(array[index],index,array)
    }
}


//const waitFor = (ms) => new Promise(r => setTimeout(r,ms))