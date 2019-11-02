import React from "react";
import "./homeLoading.css";

export default function HomeLoading(){
    return(
        
        <div className="row">
            <div className="col-lg-3">
                <div className="jumbotron animate-bg"></div>
            </div>
            <div className="col-lg-6">
                <div className="jumbotron animate-bg"></div>
                <div className="jumbotron animate-bg"></div>
            </div>
            <div className="col-lg-3">
                <div className="jumbotron animate-bg"></div>
            </div>
        </div>
      
    )
}