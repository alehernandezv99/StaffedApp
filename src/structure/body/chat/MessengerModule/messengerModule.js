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
            message:"",
            unread:0,
            currentPage:0,
            canLoad:false
            }
    }

    loadMore = () => {
        console.log(this.state.currentPage)
        firebase.firestore().collection("chat").doc(this.props.id).collection("messages").orderBy("sent","desc").get().then(snapshot => {
            let pages = Math.ceil(snapshot.size/30)

        if((this.state.currentPage + 1 === pages)){
            this.setState({
                canLoad:false
            })
        }
        if(this.state.currentPage <= pages){
        let lastSeem = snapshot.docs[(30)*(this.state.currentPage) -(this.state.currentPage === 0?0:1)];

        console.log(`the index is ${(30)*(this.state.currentPage) -(this.state.currentPage === 0?0:1)}`,)

        firebase.firestore().collection("chat").doc(this.props.id).collection("messages").orderBy("sent","desc").startAfter(lastSeem).limit(30).get()
        .then(async snap => {
        
           await this.calculateGroups(snap,true)
            this.setScrollDown()
        })
        .catch(e => {
            console.log(e)
        })
    }
        })
        .catch(e => {
            console.log(e)
        })
    }

    getGroups =() => {
        firebase.firestore().collection("chat").doc(this.props.id).collection("messages").orderBy("sent","desc").get().then(snapshot => {
            if(snapshot.size > 30){
                this.setState({
                    canLoad:true
                })
            }
        firebase.firestore().collection("chat").doc(this.props.id).collection("messages").orderBy("sent","desc").limit(30).onSnapshot(async snap => {
     
            this.calculateGroups(snap)
        })
        
    })
    .catch(e => {
        console.log(e)
    })

    }


    calculateGroups =async (snap, additional) => {
        let messages = snap.docs
        messages.reverse()
            let temporaryMessages = []
            let groups= [];
            let previousId ="";
            let temporaryGroup = {}
            let unread = 0;
            for(let i = 0; i < messages.length; i++){
               let currentMessage = messages[i].data();
                if(currentMessage.status === undefined){
                    currentMessage.status = "unread";
                }
                if(currentMessage.status === "unread"){
                    if(currentMessage.author !== firebase.auth().currentUser.uid){
                    unread++
                    
                    }
                }
                if(currentMessage.author !== previousId){
                    if(temporaryGroup.messages){
                        groups.push(temporaryGroup)
                        
                    }
                    temporaryGroup = {}
                    temporaryMessages = [];
                    if(currentMessage.author === firebase.auth().currentUser.uid){
                        currentMessage.isOwn = true;
                    }else{
                        currentMessage.isOwn=  false;
                    }
                    temporaryMessages.push(currentMessage)
                    temporaryGroup = {
                        author:currentMessage.author,
                        messages:temporaryMessages,
                        isOwn:currentMessage.author === firebase.auth().currentUser.uid?true:false
                    };
                    if(i === (messages.length - 1)){
                    groups.push(temporaryGroup);
                    }
                    previousId = currentMessage.author
                }else {
                    if(currentMessage.author === firebase.auth().currentUser.uid){
                        currentMessage.isOwn = true;
                    }else{
                        currentMessage.isOwn=  false;
                    }
                    
                    if(temporaryGroup.messages){
                        temporaryGroup.messages.push(currentMessage)
                    }
                    if(i === (messages.length - 1)){
                        groups.push(temporaryGroup);
                        }
                }
            }
            if(this._mounted){
                if(!additional){
            await this.setState({
                groups:groups,
                unread:unread
            })
        }else {
            await this.setState(state => {
                let oldGroups = state.groups;
               let newGroups = groups.concat(oldGroups)
    
                return {
                    groups:newGroups
                }
            })
            this.setScrollDown()
        }

            if(this.id){
                $(this.id).ready(() => {
                    $(this.id).scrollTop(999999999999);
                })
                
            }
        
            
        }
    }

    setScrollDown = () => {
        $(this.id).scrollTop(0)
    }

    setScrollTop = () => {
        console.log("called");
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
                            console.log(user.data())
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

       if(this.props.isOpen){
        this.listenMessages()
    }
    }

    listenMessages = () => {
        
        if(this.props.isOpen){
            firebase.firestore().collection("chat").doc(this.props.id).collection("messages").orderBy("sent","desc").limit(30).get().then(snap => {
                
                let messages = snap.docs;
                messages.reverse()
                let batch = firebase.firestore().batch()
                for(let i =0; i < messages.length; i++){
                    let currentMessage = messages[i].data()
                    if(currentMessage.author !== firebase.auth().currentUser.uid){
                        currentMessage.status = "read"
                    }
                    batch.update(firebase.firestore().collection("chat").doc(this.props.id).collection("messages").doc(messages[i].id), currentMessage)
                }
                batch.commit()
                .then(() => {
                    this.previous = this.props.isOpen
                })
                .catch( e => {

                })
            
            })
        }
    
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
        if(this.state.message !== ""){
            let batch = firebase.firestore().batch()

            let messageID = firebase.firestore().collection("chat").doc(this.props.id).collection("messages").doc().id
            batch.set(firebase.firestore().collection("chat").doc(this.props.id).collection("messages").doc(messageID), {
                message:this.state.message,
                sent:firebase.firestore.Timestamp.now(),
                author:firebase.auth().currentUser.uid,
                status:"unread"
            })
        batch.update(firebase.firestore().collection("chat").doc(this.props.id), {lastMessage:this.state.message})
        batch.commit()
        .then(() => {

            this.setState({
                message:""
            })
        })
        .catch(e => {
            console.log(e)
        })
    }
    }

    setId = (id) => {
        this.id = id

        
    }

    setInputId =(id) =>{
        this.inputId = id;

        $(this.inputId).keypress((event) =>{
	
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                this.handleSendMessage()
            }
          
        });
    }

    handleClick = (i) => {

    }


    render(){
        let user = {
        }
        Object.keys(this.state.participants).forEach(key => {
            if(firebase.auth().currentUser.uid !== key){
                user.photoURL = this.state.participants[key].photoURL?this.state.participants[key].photoURL:null;
                user.name = this.state.participants[key].displayName?this.state.participants[key].displayName:this.state.participants[key].email;
                user.isOnline = this.state.participants[key].isOnline;
            }
        })
        return(
            <ChatWrapper unread={this.state.unread} handleClick={() => {
                if(!this.props.isOpen){
                    this.listenMessages()
                }
                this.props.handleClick()
            }} isOpen={this.props.isOpen} isOnline={user.isOnline} setInputId={this.setInputId} factor={this.props.factor} photoURL={user.photoURL} name={user.name} focusInput={this.setScrollTop} setId={this.setId}  onChangeInput={this.handleChangeInput} input={this.state.message} onSend={this.handleSendMessage} chatName={this.state.chatName?this.state.chatName:"Loading..."} handleClose={this.props.handleClose}>
                {this.state.canLoad?<a href="" className="text-center" onClick={async e => 
                {e.preventDefault(); 
                    await this.setState(state => {
                        return {
                            currentPage:(state.currentPage + 1)
                        }
                    })
                    this.loadMore()}}>See More</a>:null}
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