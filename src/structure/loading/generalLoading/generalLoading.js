import React from "react";
import "./generalLoading.css";


export default class GeneralLoading extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
            <div className="container-fluid animate-bg" style={{backgroundColor:"lightgray", height:"63px"}}></div>
            <div className="row mt-4">
                <div className="col-lg-3">
                    <div className="jumbotron animate-bg"></div>
                </div>
                <div className="col-lg-6">
                   
                        <div className="jumbotron animate-bg"></div>
                   
                </div>
                <div className="col-lg-3">
                    <div className="jumbotron animate-bg"></div>
                </div>
            </div>
            </div>
        )
    }
}