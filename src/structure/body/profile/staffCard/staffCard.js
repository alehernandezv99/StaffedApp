import React from "react";
import "./staffCard.css";
import TextCollapse from "../textCollapse";
import EditBtn from "../editBtn";

export default class StaffCard extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="card mx-3 mt-3 staff-card" style={{position:"relative"}}>
                <div className="card-header">
                <div style={{backgroundImage:`url(${this.props.photoURL?this.props.photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"60px",
                                    height:"60px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="rounded-circle" ></div>
                                <h5 className="text-center mt-2"><TextCollapse text={this.props.title} maxWidth={100}/></h5>
                </div>
                
                <div className="card-body">
                    <h6><TextCollapse text={this.props.description} maxWidth={100}/></h6>
                </div>
                <div className="card-footer">
                    <button className="btn btn-custom-1 mx-auto" onClick={this.props.onClick}><i className="material-icons align-middle">list</i> See More</button>
                </div>
                {this.props.editable?
                <EditBtn btns={[{
                    text:"edit",
                    callback:this.props.edit
                },{
                    text:"delete",
                    callback:this.props.delete
                }]} />
                 :null }
            </div>
        )
    }
}