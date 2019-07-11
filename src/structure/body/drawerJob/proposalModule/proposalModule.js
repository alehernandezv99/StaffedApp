import React from "react";
import "./proposalModule.css";

export default class ProposalModule extends React.Component {
    constructor(props){
        super(props);
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
        "Jelos".split("").splice(129,)
      }

     

      componentWillReceiveProps(){
          let check  = 0;

          if(!(this.state.dots)){
              check =1 
          }
          if(!(this.state.more)){
              check  =1;
          }
          if(!(this.state.myBtn)){
              check = 1;
          }
        if(check ==0){
        this.myFunction(this.state.dots, this.state.more, this.state.myBtn)
        this.myFunction(this.state.dots, this.state.more, this.state.myBtn)
        }else {
            alert("Is Not Mounted")
        }
      }


    render(){
        return(
            <div className="container">
                <div className="card">
                <div className="card-body">
                <div className="form-group">

                    <h6>{this.props.user}</h6>
                </div>
                <div className="form-group">
                    <h6>{this.props.price}$</h6>
                </div>
                <div className="form-group">
                    {this.props.presentation.length > 130?
                    <div>
                    <p>{this.props.presentation.split("").splice(0,101).join("")}
                    <span ref={ref => this.setState({dots:ref})}>...</span><span ref={ref => this.setState({more:ref})}>{this.props.presentation.split("").splice(100,this.props.presentation.length - 101).join("")}</span></p>
                   <button onClick={() => {this.myFunction(this.state.dots, this.state.more, this.state.myBtn)}} ref={ref => this.setState({myBtn:ref})}>Read more</button>
                   
                   </div>
                   
                   :<div><p>{this.props.presentation}</p></div>
                    }
                    
                </div>
                </div>
                </div>
            </div>
        )
    }
}