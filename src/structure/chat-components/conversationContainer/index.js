import React from "react";
import "./conversationsContainer.css";
import $ from "jquery";

const style ={
    position:"fixed",
    bottom:"0",
    right:"20px",
    maxWidth:"340px",
}

export default class ConversationsContainer extends React.Component{
    constructor(props){
        super(props);
    }

    handleCLick= () => {
        this.props.handleClick();
       // $("#conversation-body").slideToggle("fast");
      //  $("#conversation-footer").slideToggle("fast")
    }

    componentDidMount(){
       
    }

    render(){
        return(
            <div className="card conversation-container" style={style}>
                {(() => {
                     if(this.props.isOpen){
                        $("#conversation-body").slideDown("fast");
                    $("#conversation-footer").slideDown("fast")
                    }else {
                        $("#conversation-body").slideUp("fast");
                    $("#conversation-footer").slideUp("fast")
                    }
                })()}
                <div className={`card-header text-center conversation-header ${this.props.unread > 0 && !this.props.isOpen?"bg-switching":""}`} onClick={this.handleCLick}>Chats
                {this.props.unread >0?  <div className="unread-static"><span className="badge badge-pill badge-primary">{this.props.unread}</span></div>:null}
                </div>
                <div className="card-body conversation-body" id="conversation-body">{this.props.children}</div>
                <div className="card-footer conversation-footer" id="conversation-footer">
                    <div className="form-group">
                        <input type="text" placeholder="Search Chats" className="form-control" />
                    </div>
                </div>
            </div>
        )
    }
}
