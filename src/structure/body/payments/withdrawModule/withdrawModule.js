import React from "react";
import "./withdrawModule.css";
import {Drawer, Classes} from "@blueprintjs/core";


export default class WithdrawModule extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                 <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
                     
                 </Drawer>
            </div>
        )
    }
}