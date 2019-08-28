import React from "react";
import "./contractItem.css";
import UserBox from "../../profile/userBox";
import TextCollapse from "../../profile/textCollapse";

export default class ContractItem extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
        <div className="contract-item" onClick={this.props.onClick}>
            <div className="row text-center">
                <div className="col-xs-6 text-center">
                    <h5>Client</h5>
                    <UserBox  id={this.props.client} handleStates={this.props.handleStates} addToast={this.props.addToast} size={"60px"} />
                </div>
                <div className="col-xs-6 text-center">
                    <h5>Freelancer</h5>
                    <UserBox id={this.props.freelancer} handleStates={this.props.handleStates} addToast={this.props.addToast} size={"60px"} />
                </div>
                <div className="px-4 text-left" >
                    <h5 className="mt-2">Title</h5>
                    <div>{this.props.title}</div>

                    <h5 className="mt-2">Description</h5>
                    <div>{this.props.description}</div>

                    <h5 className="mt-2">Price</h5>
                    <div><TextCollapse text={`${this.props.price}$`} maxWidth={120} /></div>
                </div>

            </div>
        </div>
        )
    }
}