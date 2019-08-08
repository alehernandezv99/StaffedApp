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
            messages:[]
        }
    }

    fetchMessages= (page) => {
        this.setState({
            messages:[],
            size:null
        })
        let body = {};

        let form_data = new URLSearchParams();
        body.uid = firebase.auth().currentUser.uid
        body.page = page
        Object.keys(body).forEach(key => {
            form_data.append(key, body[key])
        })
        fetch("https://staffed-app.herokuapp.com/getInboxMessages", {
            method:"POST",
            body:form_data,
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
             }
            })
        .then(response => {
            return response.json()
        }).then(result => {
           
            this.setState({
                messages:result.messages,
                size:result.size
            })
        })
        .catch(e => {
            this.setState({
                messages:[],
                size:0
            })
        })
    }


    componentDidMount() {
        this.fetchMessages(0)

    }


    render(){
        return (
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
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

                   {this.state.messages.length === 0?null:<ul className="pagination text-center mt-2">
                             <li className="page-item ml-auto"><a className="page-link" href="#">Previous</a></li>
                             {
                                 (() => {
                                     let pages = [];
                                     for(let i = 0 ; i<  Math.ceil(this.state.size/8); i++){
                                         pages.push("element")
                                     }
                                     return pages
                                 })().map((data, i) => {
                                     return ( <li key={i} className="page-item"><a className="page-link" onClick={() => {this.fetchMessages(i)}} href="#">{i}</a></li>)
                                 })                                                                  }
                             <li className="page-item mr-auto"><a className="page-link" href="#">Next</a></li>
                           </ul>}
                 </div>
            </Drawer>
        )
    }
}