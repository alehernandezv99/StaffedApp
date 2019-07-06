import React from "react";
import "./jobModule.css";

export default class JobModule extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="job-module text-center">
                    <h4>{this.props.title}</h4>
                <div className="job-module-block mt-3">
                    <p>{this.props.description}</p>
                </div>
                <div className="mt-2 row">
                <div className="col-sm-8 text-left">
                {this.props.skills.map(element => {
                    return (<button type="button" key={element.key} className="btn btn-custom-2 btn-sm mr-2 mt-2">{element.text}</button>)
                })}
                </div>
                <div className="col text-right">
                    <button className="btn btn-custom-1 mr-2 mt-2 btn-sm"><i className="material-icons align-middle">thumb_up_alt</i></button>
                    <button className="btn btn-custom-1 mr-2 mt-2 btn-sm"><i className="material-icons align-middle">thumb_down_alt</i></button>
                    <button className="btn btn-custom-1 mr-2 mt-2 btn-sm"><i className="material-icons align-middle">save_alt</i></button>
                </div>
                </div>
                <div className="mt-2 text-left">
                {this.props.specs.map(element => {
                    return (<button type="button" key={element.key} className="btn btn-custom-1 btn-sm mr-3 mt-2"><i className="material-icons align-middle" > {element.icon}</i> <span className="ml-2 align-middle">{element.text}</span></button>)
                })}
                </div>
            </div>
        )
    }
}