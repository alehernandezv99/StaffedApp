import React from "react";
import "./editBtn.css";

export default class EditBtn extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="dropdown right-corner-btn">
               <button type="button" className="dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
                 <div className="dropdown-menu dropdown-menu-right">
                     {this.props.btns.map((e,i) => {
                         return (<button key={i} className="dropdown-item" onClick={e.callback}>{e.text}</button>)
                     })}
               </div>
               </div>
        )
    }
}