import React from "react";
import "./messageGroup.css";

export default class MessageGroup extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        
        return(
            <div>
                <div className={"media"} onClick={this.props.handleClick}>
                {!this.props.isOwn?<div style={{backgroundImage:`url(${this.props.photoURL?this.props.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"30px",
                                    height:"30px",
                                    marginRight:"20px",
                                }} className="rounded-circle" ></div>:null}
                
                <div className={`media-body ${this.props.isOwn === true?"text-right":"text-left"}`}>
              
                    <h4 className="mt-2"><small>{this.props.author}</small></h4>
                    
                </div>
                {this.props.isOwn?<div style={{backgroundImage:`url(${this.props.photoURL?this.props.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"30px",
                                    height:"30px",
                                    marginLeft:"20px",
                                }} className="rounded-circle" ></div>:null}
               </div>
               
               <div className={`mt-2 flex-message-group ${this.props.isOwn === true?"text-right flex-message-group-align-end":"text-left flex-message-group-align-start"}`}>
               {this.props.children}
               </div>
            </div>
        )
    }
}