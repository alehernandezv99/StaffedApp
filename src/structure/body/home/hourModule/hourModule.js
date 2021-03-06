import React from "react";
import "./hourModule.css";

export default class HourModule extends React.Component{
    constructor(props){
        super(props);
    }

    calculateText = (hour) => {
        let date = new Date();
        let now = firebase.firestore.Timestamp.now().toDate()
        if(date.getFullYear() === now.getFullYear()){
            if(date.getMonth() === now.getMonth()){
                if(date.getDate() === now.getDate()){
                   if(((now.getHours() - date.getHours())) >= 1){
                    return `Posted ${(now.getHours() - date.getHours())} hours ago`
                   }
                }
            }
        }
    }

    render(){
    return (
        <div className="hour-posted">

        </div>
    )
    }
}