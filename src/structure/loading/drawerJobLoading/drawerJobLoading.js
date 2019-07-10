import React from "react";
import "./drawerJobLoading.css";
import { Classes,} from "@blueprintjs/core";

export default function DrawerJobLoading(){
    return(
        <div className={Classes.DRAWER_BODY}>
            <div className={`row ${Classes.DIALOG_BODY}`}>
          
                <div className="col-sm-8">
                    <div className="jumbotron animate-bg"></div>
                    <div className="jumbotron animate-bg"></div>
                </div>
                <div className="col-sm-4">
                    <div className="jumbotron animate-bg"></div>
                </div>
                
            </div>
        </div>
    )
}