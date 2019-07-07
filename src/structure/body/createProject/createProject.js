import React from "react";
import "./createProject.css";

export default class CreateProject extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
    return(
        <div className="modal fade" id={this.props.id}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title text-center">Create Project</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                            <form className="cp-section-1">
                              <div className="form-group">
                                <label>Title</label>
                                <input type="text" placeholder="Precise title of the project" className="form-control"  />
                              </div>
                              <div className="form-group">
                                 <label for="comment">Description</label>
                                <textarea class="form-control" placeholder="The description about the project" rows="5" style={{resize:"none"}}></textarea>
                              </div>
                              <div className="form-group">
                                <label >Skills Required</label>
                                <input type="text" placeholder="javscript,php,etc" className="form-control"/>
                              </div>
                              <div className="from-group">
                                  <label>Type</label>
                                  <div>
                                  <select class="custom-select-sm">
                                    <option defaultValue>Fixed Price</option>
                                    <option value="volvo">Per Hour</option>
                                 </select>
                                 </div>
                              </div>
                              <button type="button" className="btn btn-custom-1 btn-block mt-3" >Next</button>
                            </form>

                            <form className="cp-section-2">
                              <div className="form-group">
                                  <label></label>
                              </div>
                            </form>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
    )
}
}
