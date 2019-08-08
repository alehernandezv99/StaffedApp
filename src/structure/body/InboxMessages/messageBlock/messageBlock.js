import React from "react";
import "./messageBlock.css";

export default class MessageBlock extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="card mt-2" style={{position:"relative"}}>
                <div className="card-body message-block" style={{marginTop:"15px"}} onClick={() => {this.props.handleAction()}}>{this.props.message}</div>
                <div className="hour-posted"><small>{this.props.sent}</small></div>
            </div>
        )
    }
}