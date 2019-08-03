import React from "react";
import "./messageGroup.css";

export default class MessageGroup extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        
        return(
            <div>
                <div className="media " onClick={this.props.handleClick}>
                {!this.props.isOwn?<img src={this.props.photoURL?this.props.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"} alt="John Doe" className="mr-3 mt-3 rounded-circle" style={{width:"30px"}}/>:null}
                <div className={`media-body ${this.props.isOwn === true?"text-right":"text-left"}`}>
                    <h4 className="mt-2"><small>{this.props.author}</small></h4>
                </div>
                {this.props.isOwn?<img src={this.props.photoURL?this.props.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"} alt="John Doe" className="mr-3 mt-3 rounded-circle" style={{width:"30px"}}/>:null}
               </div>
               <div className={`mt-2 ${this.props.isOwn === true?"text-right":"text-left"}`}>
               {this.props.children}
               </div>
            </div>
        )
    }
}