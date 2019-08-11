import React from "react";
import "./addCardElement.css";

export default class AddCardElement extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
            <button className="btn btn-custom-4 m-3" onClick = {this.props.onClick}>
                <i className="material-icons align-middle">add</i> Add Staff
            </button>
            </div>
        )
    }
}