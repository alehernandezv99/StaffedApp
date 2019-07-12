import React from "react";
import "./proposalModule.css";
import firebase from "../../../../firebaseSetUp";

export default class ProposalModule extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user:"",
        }
    }

     myFunction = (dots, moreText, btnText) =>{
        var dots = dots;
        var moreText = moreText;
        var btnText = btnText;
      
        if (dots.style.display === "none") {
          dots.style.display = "inline";
          btnText.innerHTML = "Read more"; 
          moreText.style.display = "none";
        } else {
          dots.style.display = "none";
          btnText.innerHTML = "Read less"; 
          moreText.style.display = "inline";
        }
        
      }

     

      componentDidMount(){

        
          firebase.firestore().collection("users").doc(this.props.user).get()
          .then(doc => {
              
            let check  = 0;

          if(this.dots === undefined){
              check =1 
          }
          if(this.more === undefined){
              check  =1;
          }
          if(this.myBtn === undefined){
              check = 1;
          }
        if(check ==0){
        this.myFunction(this.dots, this.more, this.myBtn)
        this.myFunction(this.dots, this.more, this.myBtn)
        this.setState({user:doc.data().displayName?doc.data().displayName:doc.data().email})
        }else {
           
        }
        
          })
          
      }


    render(){
        return(
            <div className="container mt-2">
                <div className="card" style={{position:"relative"}}>
                <div className="card-body">
                <div className="form-group">
                    {this.state.user === ""?<div className="spinner-border"></div>:
                    <h6>{this.state.user}</h6>
                    }
                </div>
                <div className="form-group">
                    <h6>{this.props.price}$</h6>
                </div>
                <div className="form-group">
                    <h6>{this.props.deadline}</h6>
                </div>
                <div className="form-group">
                    {this.props.presentation.length > 130?
                    <div>
                    <p>{this.props.presentation.split("").splice(0,101).join("")}
                    <span ref={ref => this.dots = ref}>...</span><span ref={ref => this.more = ref}>{this.props.presentation.split("").splice(100,this.props.presentation.length - 101).join("")}</span></p>
                    
                   <button onClick={() => {
                        this.myFunction(this.dots, this.more, this.myBtn)
                       }} ref={ref =>this.myBtn = ref}>Read More</button>
                    
                   </div>
                   
                   :<div><p>{this.props.presentation}</p></div>
                    }
                    <button type="buton" className="btn btn-custom-1 btn-sm mt-3" onClick={this.props.acceptProposal}>Accept</button>
                </div>
                </div>
                <div className="hour-posted">Posted On {this.props.date}</div>
                </div>
            </div>
        )
    }
}