import React from "react";
import "./conversationItem.css";

export default class ConversationItem extends React.Component{
    render(){
        return(
            <div className="media border conversation-item p-1 mt-2" onClick={this.props.handleClick} style={{position:"relative"}}>
               
                <div style={{backgroundImage:`url(${this.props.photoURL?this.props.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"50px",
                                    height:"50px",
                                    marginRight:"20px"
                        
                                }} className="rounded-circle" ></div>
                <div className="media-body text-left" style={{position:"relative"}}>
                <h6 style={{margin:0,padding:0, fontWeight:600}}>{this.props.chatName.length <= 20?this.props.chatName:this.props.chatName.split("").splice(0,19).concat([".",".","."]).join("")} <small className="text-right"><i>{this.props.date}</i></small></h6>
                    <p style={{margin:0,padding:0}}>{this.props.name?this.props.name.length <= 20?this.props.name:this.props.name.split("").splice(0,19).concat([".",".","."]).join(""):"Loading..."}</p>
                    
                    <p style={{marginTop:"4px"}}>{this.props.lastMessage.split("").splice(0,30).concat([".",".","."]).join("")}</p>
                    {this.props.isOnline?
                    <div className="status-absolute bg-success"><span className="badge badge-pill badge-success"></span></div>
                    :<div className="status-absolute bg-danger"><span className="badge badge-pill badge-danger"></span></div>
                    }
                    
                </div>
                {this.props.unread >0?  <div className="unread-static" style={{left:"5px"}}><span className="badge badge-pill badge-primary">{this.props.unread}</span></div>:null}
            </div>
        )
    }
}