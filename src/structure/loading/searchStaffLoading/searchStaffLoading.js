import React from "react";
import "./searchStaffLoading.css";

export default function SearchStaffLoading(props){
    return(<div className="container-fluid mt-4">
        <div className="row">
            <div className="col-sm-3">
                <div className="jumbotron animate-bg"></div>
                <div className="jumbotron animate-bg"></div>
            </div>
            <div className="col">
                <div className="jumbotron animate-bg"></div>
                <div className="jumbotron animate-bg"></div>
            </div>
        </div>
    </div>)
}