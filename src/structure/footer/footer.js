import React from "react";
import "./footer.css";

export default function Footer(){
    return(
        <footer className="bg-gradient-1 padding-2">
            <div className="text-center">
                <button type="button" className="btn btn-custom-instagram m-2 p-3" ><i className="fa fa-instagram align-middle"></i></button>
                <button type="button" className="btn btn-custom-twitter m-2  p-3" ><i className="fa fa-twitter align-middle "></i></button>
            </div>
            <div className="row text-center">

            </div>
        </footer>
    )
}