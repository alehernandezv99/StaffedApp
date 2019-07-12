import React from "react";
import "./extendibleText.css";

export default class ExtensibleText extends React.Component { 
    constructor(props){
        super(props);

        this.state = {

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
      }else {
         
      }
      }



    render(){
        return(
            
                <div className="form-group">
                    {this.props.text > 130?
                    <div>
                    <p>{this.props.text.split("").splice(0,101).join("")}
                    <span ref={ref => this.dots = ref}>...</span><span ref={ref => this.more = ref}>{this.props.text.split("").splice(100,this.props.presentation.length - 101).join("")}</span></p>
                    
                   <button onClick={() => {
                        this.myFunction(this.dots, this.more, this.myBtn)
                       }} ref={ref =>this.myBtn = ref}>Read More</button>
                    
                   </div>
                   
                   :<div><p>{this.props.text}</p></div>
                    }

                </div>
          
        )
    }
}