import React from "react";
import "./conversationsContainer.css";
import $ from "jquery";

const style ={
    position:"fixed",
    bottom:"0",
    right:"20px",
    maxWidth:"400px",
}

export default class ConversationsContainer extends React.Component{
    constructor(props){
        super(props);
    }

    handleCLick= () => {
        $("#conversation-body").slideToggle("fast");
        $("#conversation-footer").slideToggle("fast")
    }

    render(){
        return(
            <div className="card" style={style}>
                <div className="card-header text-center conversation-header" onClick={this.handleCLick}>Chats</div>
                <div className="card-body" id="conversation-body">{this.props.children}</div>
                <div className="card-footer " id="conversation-footer">
                    <div className="form-group">
                        <input type="text" placeholder="Search Chats" className="form-control" />
                    </div>
                </div>
            </div>
        )
    }
}
