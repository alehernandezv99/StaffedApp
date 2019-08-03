import React from "react";
import "./chatWrapper.css";
import $ from "jquery";

export default class ChatWrapper extends React.Component{
    constructor(props){
        super(props)

        this.id = String(Math.ceil(Math.random()*100000));
    }

    componentDidMount(){
      this._mounted = true

      this.props.setId(`#wrapper-body-${this.id}`)
    }

    handleClick = () => {
        $(`#wrapper-body-${this.id}`).slideToggle("fast");
        $(`#wrapper-footer-${this.id}`).slideToggle("fast");

    }
    componentWillMount(){
        this._mounted = true
    }
    componentWillUnmount(){
        this._mounted = false;
    }

    render(){
        return(
            <div className="card chat-wrapper" style={{right:this.props.factor}}>
                
                <div className="card-header chat-wrapper-header text-center" onClick={this.handleClick} style={{position:"relative"}}>
                  <div className="media" >
                   <img src={this.props.photoURL?this.props.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"}  alt="John Doe" className="mr-1 ml-2 mb-2 mt-2 rounded-circle align-middle" style={{width:"40px"}}/>
                     <div className="media-body">
                       <h6 style={{padding:0,marginTop:"2px"}}>{this.props.name?this.props.name.split("").splice(0,30).concat([".",".","."]).join(""):"Loading..."}</h6>
                       <p style={{margin:0,padding:0}}>{this.props.chatName.split("").splice(0,30).concat([".",".","."]).join("")}</p>
                    </div>
            </div> 
                <button className="btn btn-close btn-sm"><i className="material-icons align-middle" onClick={this.props.handleClose}>close</i></button>
                </div>
                <div className="card-body chat-wrapper-body" id={`wrapper-body-${this.id}`} ref={ref => this.body =ref}> 
                    {this.props.children}
                </div>
                <div className="card-footer chat-wrapper-footer" id={`wrapper-footer-${this.id}`} >
                    <div className="form-group">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Type your message" onFocus={this.props.focusInput} onChange={this.props.onChangeInput} value={this.props.input}/>
                        <div className="input-group-append">
                            <button className="btn btn-success" type="button"><i className="material-icons align-middle special-icon" onClick={this.props.onSend}>send</i></button> 
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}