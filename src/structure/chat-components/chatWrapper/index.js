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
      this.props.setInputId(`#wrapper-input-${this.id}`)

    }

    handleClick = () => {
        this.props.handleClick();

    }


    
    componentWillUnmount(){
        this._mounted = false;
    }

    render(){
        return(
            <div className="card chat-wrapper" style={{right:this.props.factor,}}>
                {(() => {
                    
      if(this.props.isOpen === true){
        $(`#wrapper-body-${this.id}`).slideDown("fast");
        $(`#wrapper-footer-${this.id}`).slideDown("fast");
      }else if(this.props.isOpen === false){
         
        $(`#wrapper-body-${this.id}`).slideUp("fast");
        $(`#wrapper-footer-${this.id}`).slideUp("fast");
      }
                })()}
                <div className={`card-header chat-wrapper-header text-center ${this.props.unread > 0 && !this.props.isOpen?"bg-switching":""}`}   style={{position:"relative"}}>
                {this.props.isOnline?
                    <div className="status-absolute"><span className="badge badge-pill badge-success">online</span></div>
                    :<div className="status-absolute"><span className="badge badge-pill badge-danger">offline</span></div>
                    }
                  <div className="media" onClick={this.props.handleClick}>
                   <img src={this.props.photoURL?this.props.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"}  alt="John Doe" className="mr-1 ml-2 mb-2 mt-2 rounded-circle align-middle" style={{width:"40px"}}/>
                     <div className="media-body" style={{position:"relative"}}>
                       <h6 style={{padding:0,marginTop:"2px"}}>{this.props.name?this.props.name.split("").splice(0,30).concat([".",".","."]).join(""):"Loading..."}</h6>
                       <p style={{margin:0,padding:0}}>{this.props.chatName.split("").splice(0,30).concat([".",".","."]).join("")}</p>
                      
                    </div>
            </div> 
                <button className="btn btn-close btn-sm"><i className="material-icons align-middle" onClick={this.props.handleClose}>close</i></button>
              {this.props.unread > 0 && !this.props.isOpen ?  <div className="unread-static"><span className="badge badge-pill badge-primary">{this.props.unread}</span></div>:null}

                </div>
                <div className="card-body chat-wrapper-body" id={`wrapper-body-${this.id}`} ref={ref => this.body =ref}> 
                    {this.props.children}
                </div>
                <div className="card-footer chat-wrapper-footer" id={`wrapper-footer-${this.id}`} >
                    <div className="form-group">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Type your message" id={`wrapper-input-${this.id}`} onFocus={this.props.focusInput} onChange={this.props.onChangeInput} value={this.props.input}/>
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