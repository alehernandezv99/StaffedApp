import React from "react";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import ImagePlaceholder from "../../../../res/Graphics/image_placeholder.png"


export default class MVviewer extends React.Component {
    constructor(props){
        super(props)
    }


    render(){
        return (
            <Drawer hasBackdrop={true}  portalContainer={document.getElementById("portalContainer")} onClose={() => {this.props.handleClose()}} title={""} size={window.innerWidth <= 700?"100%":"50%"} isOpen={this.props.isOpen}>
              <div className={Classes.DRAWER_BODY}>
                <div className={`${Classes.DIALOG_BODY}`}>
                <div style={{backgroundImage:`url(${this.props.photoURL?this.props.photoURL:ImagePlaceholder})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"contain",
                                    backgroundRepeat:"no-repeat",
                                    height:"150px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="" ></div>
                        <h4 className="mt-3 text-center">{this.props.name}</h4>
                        <p className="text-center mt-2">{this.props.description}</p>
                </div>
              </div>
            </Drawer>
        )
    }
}