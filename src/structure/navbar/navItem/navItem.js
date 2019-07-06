import React from "react";
import "./navItem.css";

export default function NavItem(props){
    if(props.type === "link"){
    return(
        <li className="nav-item mr-3">
            <a className="nav-link color-0A9FF2" href={props.href} data-toggle={props.dataToggle} onClick={(e) => {e.preventDefault(); props.onClick()}} data-target={props.dataTarget}>{props.text}</a>
        </li>
    )
    }else if(props.type === "button"){
        return (
            <li className="nav-item mr-3">
              <a className="btn btn-custom-1" href={props.href} data-toggle={props.dataToggle} onClick={(e) => {e.preventDefault(); props.onClick()}}  data-target={props.dataTarget}>{props.text}</a>
           </li>
        )
    }else if(props.type === "dropdown"){
       return ( 
       <li className="nav-item dropdown mr-3">
            <a className="nav-link color-0A9FF2 dropdown-toggle" onClick={(e) => {e.preventDefault(); props.onClick()} } href={props.href} data-toggle={"dropdown"} >{props.text}</a>
            <div className="dropdown-menu dropdown-menu-right">
                {props.dropdownItems.map(element => {
                    return (<a className="dropdown-item" href={element.href} key={element.key} onClick={(e) => {e.preventDefault(); element.onClick()}}>{element.text}</a>)
                })}
            </div>
        </li>
        )
    }
}