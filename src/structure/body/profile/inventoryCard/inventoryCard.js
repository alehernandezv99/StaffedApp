import React from "react";
import "./inventoryCard.css";
import TextCollapse from "../textCollapse";
import EditBtn from "../editBtn";

export default class InventoryCard extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="card" style={{minWidth:300, maxWidth:300, position:"relative"}}>

                <EditBtn btns={
                    [
                        {
                            text:"Edit",
                            callback:() => {this.props.edit()}
                        },
                        {
                            text:"Delete",
                            callback:()=> {this.props.delete()}
                        }
                    ]
                } />
                <div className="card-header">
                <div style={{backgroundImage:`url(${this.props.photoURL})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"contain",
                                    backgroundRepeat:"no-repeat",
                                    height:"150px",
                                    minHeight:"150px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="" ></div>
                </div>

                <div className="card-body">
                    <TextCollapse text={this.props.name} maxWidth={50}/>
                    <br/>
                    <TextCollapse text={this.props.description} maxWidth={100} />
                </div>
            </div>
        )
    }
}