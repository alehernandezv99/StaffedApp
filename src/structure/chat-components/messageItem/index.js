import React from "react";
import "./messageItem.css";
import $ from "jquery";

export default class MessageItem extends React.Component{
    constructor(props){
        super(props)

        this.state ={
            hover:false,
        }
        this.id = String(Math.ceil(Math.random()*100000));
       
    }

    componentDidMount(){
       
    }


    render(){
        return(
            <div className="container-fluid mt-2" >
                {(() => {
                    
                    this.state.hover?$(`#message-sent-${this.id}`).slideDown("fast"):$(`#message-sent-${this.id}`).slideUp("fast")
                })()}
               <h6 style={{maxWidth:"250px"}} className={this.props.isOwn?"message-isOwn":"message-normal"}> <span onMouseEnter={() => {this.setState({hover:true})}} onMouseLeave={() =>{this.setState({hover:false})}} >{this.props.message}</span></h6>
                <div className="message-sent" onMouseEnter={() => {this.setState({hover:true})}} onMouseLeave={() =>{this.setState({hover:false})}}  id={`message-sent-${this.id}`} style={{display:"none"}}><small>{this.props.sent}</small></div>
            </div>
        )
    }
}