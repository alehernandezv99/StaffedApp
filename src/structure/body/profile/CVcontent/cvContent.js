import React from "react";
import "./cvContent.css";

import TextCollapse from "../textCollapse";
import {Divider} from "@blueprintjs/core";

export default function CVcontent(props){
    return (
        <div className="card-body" >
                 <div className="card-title">{props.title}</div>
                <div className="container-fluid">
               <TextCollapse maxWidth={400} text={props.text} />

               {props.editable === true?<div className="dropdown right-corner-btn">
               <button type="button" className="dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
                 <div className="dropdown-menu dropdown-menu-right">
                   <button className="dropdown-item" onClick={props.edit}>Edit</button>
                   <button className="dropdown-item" onClick={props.delete}>Delete</button>
               </div>
               </div>:null}
              </div>
           <Divider/>
         </div>
    )
}