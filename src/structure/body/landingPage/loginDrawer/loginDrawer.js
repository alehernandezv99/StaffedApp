import React from "react";
import "./loginDrawer.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import LoadingSpinner from "../../../loading/loadingSpinner";

export default class LoginDrawer extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            email:"",
            password:"",
        };
    }

    componentDidMount(){
        this._mounted = true;
    }

    componentWillUnmount(){
        this._mounted = false;
    }

    changeState = (key, value) =>{
        if(this._mounted){
        this.setState({
            [key]:value
        })
    }
    }


    render(){
        return(
            <Drawer portalContainer={document.getElementById("portalContainer")}  onClose={this.props.handleClose} title={""} size={window.innerWidth <= 700?"100%":"50%"} isOpen={this.props.isOpen}>
                <div className={Classes.DRAWER_BODY}>
                <div className={`${Classes.DIALOG_BODY}`}>
                    {this.props.isLoading?<LoadingSpinner/>:null}
                <div className="card">

<div className="card-header">
    <h4 className="card-title text-center">Login</h4>
</div>

<div className="card-body">
<form>
  <div className="form-group">
    <label>Email address:</label>
    <input type="email" className="form-control" id="email" onChange={(e) => {this.changeState("email",e.target.value)} } />
  </div>
  <div className="form-group">
    <label>Password:</label>
    <input type="password" className="form-control" id="pwd" onChange={(e) => {this.changeState("password", e.target.value)}}/>
  </div>
  <div className="form-group form-check">
    <label className="form-check-label">
    <input className="form-check-input" type="checkbox"  onChange={(e) => {this.changeState("remember", e.target.checked)}}/> Remember me
  </label>
  </div>
  <button type="button" className="btn btn-custom-1 btn-block" onClick={()=> {this.props.handleAuth("login",this.state.email, this.state.password)}}>Sign In</button>
  <p className="text-center mt-3">You dont have an account? <a href="#" data-toggle="modal" onClick={this.props.openPanel}>Sign Up</a></p>
</form>
</div>
<div className="card-footer">
    <button type="button" className="btn btn-danger" onClick={this.props.handleClose}>Cancel</button>
</div>
</div>
                </div>  
                </div>
            </Drawer>
        )
    }
}