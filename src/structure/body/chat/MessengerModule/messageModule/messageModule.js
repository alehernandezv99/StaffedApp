import React from "react";
import "./messageModule.css";
import MessageGroup from "../../../../chat-components/messageGroup";
import MessageItem from "../../../../chat-components/messageItem";

export default class MessageModule extends React.Component{
    constructor(props){
        super(props)

    
    }
    

    render(){
        return (
            <MessageGroup isOwn={this.props.isOwn} photoURL={this.props.photoURL} author={this.props.author}>
                {this.props.messages.map((e,i) => {
                    return <MessageItem message={e.message} sent={e.sent.toDate().getDate() + "-" + e.sent.toDate().getMonth() + " " + e.sent.toDate().getHours() + ":" + e.sent.toDate().getMinutes()} isOwn={e.isOwn} key={i}/>
                })}
            </MessageGroup>
        )
    }
}