import React from "react";
import "./navItem.css";

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
    }else if(props.type === "dropdown"){
       return ( 
       <li className="nav-item dropdown">
            <a className="nav-link color-0A9FF2 dropdown-toggle" href={props.href} data-toggle={"dropdown"} >{props.text}</a>
            <div className="dropdown-menu dropdown-menu-right">
                {props.dropdownItems.map(element => {
                    return (<a className="dropdown-item" href={element.href} key={element.key} onClick={element.onClick}>{element.text}</a>)
                })}
            </div>
        </li>
        )
    }
}