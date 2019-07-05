import React from "react";
import "./footer.css";

export default function Footer(){
    return(
        <footer className="bg-gradient-1 padding-2" id="contact">
            <div className="text-center">
                <button type="button" className="btn btn-custom-instagram m-2 p-3" ><i className="fa fa-instagram align-middle"></i></button>
                <button type="button" className="btn btn-custom-twitter m-2  p-3" ><i className="fa fa-twitter align-middle "></i></button>
            </div>
            <div className="row text-center">
                <div className="col ">
                    <ul className="list-group">
                        <a href="#" className="list-group-item list-group-item-action">First Item</a>
                        <a href="#" className="list-group-item list-group-item-action">Second Item</a>
                        <a href="#" className="list-group-item list-group-item-action">Third Item</a>
                    </ul>
                </div>
                <div className="col">
                <ul className="list-group">
                        <a href="#" className="list-group-item list-group-item-action">First Item</a>
                        <a href="#" className="list-group-item list-group-item-action">Second Item</a>
                        <a href="#" className="list-group-item list-group-item-action">Third Item</a>
                    </ul>
                </div>
            </div>
        </footer>
    )
}