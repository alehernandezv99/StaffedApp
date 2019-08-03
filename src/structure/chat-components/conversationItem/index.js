import React from "react";
import "./conversationItem.css";

export default class ConversationItem extends React.Component{
    render(){
        return(
            <div className="media border conversation-item p-1 mt-2" onClick={this.props.handleClick}>
                <img src={this.props.photoURL?this.props.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"}  alt="John Doe" className="mr-3 mt-2 rounded-circle align-middle" style={{width:"50px"}}/>
                <div className="media-body">
                    <h6 style={{margin:0,padding:0}}>{this.props.name?this.props.name.split("").splice(0,30).concat([".",".","."]).join(""):"Loading..."}</h6>
                    <h6 style={{margin:0,padding:0}}>{this.props.chatName.split("").splice(0,30).concat([".",".","."]).join("")} <small><i>{this.props.date}</i></small></h6>
                    <p style={{marginTop:"4px"}}>{this.props.lastMessage.split("").splice(0,30).concat([".",".","."]).join("")}</p>
                </div>
            </div>
        )
    }
}