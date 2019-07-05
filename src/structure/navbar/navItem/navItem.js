import React from "react";

export default function NavItem(props){
    if(props.type === "link"){
    return(
        <li className="nav-item mr-sm-2">
            <a className="nav-link color-0A9FF2" href={props.href} data-toggle={props.dataToggle} data-target={props.dataTarget}>{props.text}</a>
        </li>
    )
    }else if(props.type === "button"){
        return (
            <li className="nav-item mr-sm-2">
              <a className="btn btn-custom-1" href={props.href} data-toggle={props.dataToggle} data-target={props.dataTarget}>{props.text}</a>
           </li>
        )
    }
}