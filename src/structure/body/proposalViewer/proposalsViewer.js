import React from "react";
import "./proposalsViewer.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import ProposaslsViewerLoading from "../../loading/proposalsViewerLoading";

export default class ProposalsViewer extends React.Component { 
    constructor(propos){
        super(props);

        this.state = {
            proposal:null,
            project:null,
            id:"",
        }
    }

    render(){
        return(
            <div>
                
                 <Drawer style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"75%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                 <div className={`${Classes.DIALOG_BODY}`}>
                     {this.state.id === ""?<ProposaslsViewerLoading />:
                     <div className="container-fluid">
                         <div className="card" style={{position:"relative"}}>

                        <div className="card">
                            <div className="card-body">
                                <div className="form-group">
                                    <h4>Client</h4>
                                    <h6>{this.state.project.author}</h6>
                                 </div>
                                 <div className="form-group">
                                     <h4>Budget</h4>
                                     <h6>{this.state.project.budget}</h6>
                                </div>
                                <div className="form-group">
                                    <h4>Description</h4>
                                    
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                         <div className="form-group">
                             <h4>Freelancer</h4>
                             <h6>{this.state.proposal.freelancer}</h6>
                         </div>
                         <div className="form-group">
                             <h4>Price</h4>
                             <h6>{this.state.proposal.price}</h6>
                        </div>
                        <div className="form-group">
                            <h4>Deadline</h4>
                            <h6>{this.state.proposal.deadline}</h6>
                        </div>
                        <div className="form-group mt-4">
                            <h4>Presentation</h4>
                            <h6>{this.state.proposal.presentation}</h6>
                        </div>
                        <div className="hour-posted">{this.state.proposal.created?this.state.proposal.created.toDate().toString():this.state.proposal.created.toDate().toString()}</div>
                        </div>

                        </div>
                     </div>

                     }
                     </div>
                     </div>
                 </Drawer>
                
            </div>
        )
    }
}