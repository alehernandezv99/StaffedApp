import React from "react";
import "./inboxMessages.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import firebase from "../../../firebaseSetUp";
import MessageBlock from "./messageBlock";

export default class InboxMessages extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            page:0,
            messages:[],
            size:null,
            loadMore:false,
            lastSeem:null,
            pending:false
        }
    }

    fetchMessages= (page) => {
        this.setState({
            size:null,
            pending:true
        })
        let ref =firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection("inbox").orderBy("sent","desc")
        if(page === true){
            ref = ref.limit(10).startAfter(this.state.lastSeem)
        }else {
            this.setState({
                messages:[],
                size:null
            })
            ref = ref.limit(10)
        }

        ref.get()
        .then(messages => {
            let arr = []

            messages.forEach(message => {
                arr.push(message.data())
            })

            if(this._mounted){
                this.setState(state => ({
                    messages:state.messages.concat(arr),
                    size:messages.size,
                    loadMore:messages.size < 10? false:true,
                    lastSeem:messages.docs[messages.docs.length - 1],
                    pending:false
                }))
            }
            
        })
        .catch(e => {
            
            if(this._mounted){
                this.setState({
                    messages:[],
                    size:0,
                    loadMore:false,
                    pending:false
                })
            }
        })
    }


    componentDidMount() {
        this._mounted = true;
        this.fetchMessages(false)

    }


    render(){
        return (
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={window.innerWidth <= 700?"100%":"50%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                   <div className={`${Classes.DIALOG_BODY}`}>
                       {this.state.messages.length > 0 ? this.state.messages.map((e,i) => {
                            let date;
                            
                            try {
                            date = e.sent.toDate().toDateString();
                            
                            }catch(error){
                            
                                date = firebase.firestore.Timestamp.fromMillis((e.sent.seconds !== undefined ?e.sent.seconds:e.sent._seconds)*1000).toDate().toDateString()
                            }
                           return (
                               <MessageBlock key={i} message={e.message} sent={date} handleAction={() => {e.action !== null?this.props.handleAction(e.action):(() => {})()}} />
                           )
                       }):this.state.size !== null?<div className="text-center">No messages</div>:<div className="spinner-border"></div>}
                   </div>

                   {this.state.messages.length === 0?null:this.state.loadMore?<div className="text-center mt-3 mb-3">{this.state.pending === false?<a href="" onClick={async(e) => {
                               e.preventDefault();
                            this.fetchMessages(true)
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                 </div>
            </Drawer>
        )
    }
}