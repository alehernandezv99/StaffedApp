import React from "react";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider ,Alert, Intent} from "@blueprintjs/core";

export default class HelpDrawer extends React.Component { 
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
              <div className={Classes.DRAWER_BODY}>
                <div className={`${Classes.DIALOG_BODY}`}>
                <div className="container">
                            <h4 className="text-center">Help</h4>

                            <h5 style={{color:"#3a7bd5"}}>Project Status</h5>
                            <div className="mt-4"><span className="project-status mr-3">Hiring</span></div>
                            <div className="mt-2"> The owner of the project is looking for a freelancer to hire </div>
                            <div className="mt-4"><span className="project-status mr-3">In Development</span></div>
                            <div className="mt-2"> The owner of the project already hired a freelancer and the project is in development</div>
                            <div className="mt-4"><span className="project-status mr-3">Completed</span></div>
                            <div className="mt-2"> The project has been successfully completed</div>
                            <div className="mt-4"><span className="project-status mr-3">Cancelled</span></div>
                            <div className="mt-2"> The project has been closed for some reason</div>
                        </div>
                </div>
              </div>
            </Drawer> 
        )
    }
}