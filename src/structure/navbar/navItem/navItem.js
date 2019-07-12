import React from "react";
import "./navItem.css";

export default function NavItem(props){
    if(props.type === "link"){
    return(
        <li className="nav-item mr-3">
            <a className={"nav-link color-0A9FF2 " + props.state }href={props.href} data-toggle={props.dataToggle} onClick={(e) => {e.preventDefault(); props.onClick()}} data-target={props.dataTarget}><i className="material-icons align-middle mr-1">{props.icon}</i> {props.text}</a>
        </li>
    )
    }else if(props.type === "button"){
        return (
            <li className="nav-item mr-3">
              <a className={"btn btn-custom-1 " + props.state } href={props.href} data-toggle={props.dataToggle} onClick={(e) => {e.preventDefault(); props.onClick()}}  data-target={props.dataTarget}><i className="material-icons align-middle mr-1">{props.icon}</i> {props.text}</a>
           </li>
        )
    }else if(props.type === "dropdown"){
       return ( 
       <li className="nav-item dropdown mr-3">
            <a className={"nav-link color-0A9FF2 dropdown-toggle " + props.state} onClick={(e) => {e.preventDefault(); props.onClick()} } href={props.href} data-toggle={"dropdown"} ><i className="material-icons align-middle mr-1">{props.icon}</i> {props.text}</a>
            <div className="dropdown-menu dropdown-menu-right">
                {props.dropdownItems.map(element => {
                    return (<a className={"dropdown-item " + element.state} href={element.href} key={element.key} onClick={(e) => {e.preventDefault(); element.onClick()}}><i className="material-icons align-middle mr-1">{props.icon}</i> {element.text}</a>)
                })}
            </div>
        </li>
        )
    }else if(props.type === "dropdown badge"){
        return ( 
        <li className="nav-item dropdown mr-3">
             <a className={"nav-link color-0A9FF2 dropdown-toggle " + props.state} onClick={(e) => {e.preventDefault(); props.onClick()} } href={props.href} data-toggle={"dropdown"} ><span style={{position:"relative"}}><i className="material-icons align-middle mr-1">{props.icon}</i><span className="inbox">{props.count}</span> </span> {props.text}</a>
             <div className="dropdown-menu dropdown-menu-right">
                 {props.dropdownItems.map(element => {
                     return (<a className={"dropdown-item " + element.state} href={element.href} key={element.key} onClick={(e) => {e.preventDefault(); element.onClick()}}><i className="material-icons align-middle mr-1">{props.icon}</i> {element.text}</a>)
                 })}
             </div>
         </li>
         )
     }
}