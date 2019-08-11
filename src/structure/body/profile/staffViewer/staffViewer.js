import React from "react";
import "./staffViewer.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import CVcontent from "../CVcontent";

export default class StaffViewer extends React.Component {
    constructor(props){
        super(props);

    }

 

    

    render(){
        return(
            <Drawer hasBackdrop={true} style={{zIndex:999}} onClose={() => {this.props.handleClose()}} title={""} size={"75%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
              <div className={`${Classes.DIALOG_BODY}`}>
              <div className="container mt-2">
                        <div className="container-fluid" style={{position:"relative"}}>
                   
                                    <div style={{backgroundImage:`url(${this.props.data.photoURL?this.props.data.photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"150px",
                                    height:"150px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="rounded-circle" ></div>

                        </div>
                    </div>
                    <div className="form-group text-center mt-2">
                        <h5>{this.props.data.description[0].title}</h5>
                    </div>
                    <div className="form-group text-center">
                        <h6>{this.props.data.description[0].description}</h6>
                    </div>

                    <div id="accordion">
                        {this.props.data.order.map((element,index) => {
                            if(element === 1){
                                return (
                                    <div className="card mt-3" key={element}>
                                    <div className="card-header" style={{position:"relative"}}>
                                       <a className="card-link" data-toggle="collapse" href="#experience"> Experience</a>

                                   
                                        </div>
                                  <div className="collapse show" data-parent="#accordion" id="experience">
                                   {this.props.data.experience.length > 0?this.props.data.experience.map((element,i) => {
                                       return (
                                           <CVcontent editable={false} key={i}  title={element.title} text={element.text}/>
            
                                   )
                                       }):null}
                                </div>
            
                                </div> 
                                )
                            }

                            if(element === 2){
                                return (
                                    <div className="card mt-3" key={element}>
                        <div className="card-header" style={{position:"relative"}}>
                           <a className="card-link" data-toggle="collapse" href="#education"> Education</a>

                            </div>
                        
                            <div className="collapse show" id="education">
                            {this.props.data.education.length > 0?this.props.data.education.map((element,i) => {
                           return (
                               <CVcontent editable={false} key={i} title={element.title} text={element.text}/>

                       )
                           }):null}
                       
                        </div>
                    </div>
                                )
                            }

                            if(element === 3){
                              return(  <div className="card mt-3" key={element}>
                                  <div className="card-header" style={{position:"relative"}}>
                                    <a className="card-link" data-toggle="collapse" href="#portfolio"> Portfolio</a>

                                  </div>

                                <div className="collapse show" id="portfolio">
                                   {this.props.data.length > 0?this.props.data.portfolio.map((element,i) => {
                                    return (
                               <CVcontent editable={false} key={i} title={element.title} text={element.text}/>

                               )
                              }):null}
                              
                             </div>
                            </div>
                              )
                            }

                            if(element === 4){
                                return (
                                    <div className="card mt-3" key={element}>
                                     <div className="card-header" style={{position:"relative"}}>
                                       <a className="card-link" data-toggle="collapse" href="#skills"> Skills</a>

                                     </div>

                                      <div className="collapse show"  id="skills">
                                       {this.props.data.skills.length > 0?this.props.data.skills.map((element,i) => {
                                     return (
                               <CVcontent editable={false} key={i} title={element.title} text={element.text}/>

                       )
                           }):null}
                                   
                                   </div>
                               </div>
                                )
                            }

                            if(element === 5){
                                return (
                                    <div className="card mt-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>

                                
                                      </div>

                                    <div className="collapse show"  id="expertise">
                                       {this.props.data.expertise.length > 0?this.props.data.expertise.map((element,i) => {
                                      return (
                                      <CVcontent editable={false} key={i}  title={element.title} text={element.text}/>

                                       )
                                    }):null}
                                   
                                  </div>
                                 </div>
                                )
                            }

                            if(element === 6){
                                return (
                                    <div className="card mt-3 mb-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#contact-cv"> Contact</a>

                                        
                                     </div>

                                    <div className="collapse show" id="contact-cv" >
                                       {this.props.data.contact.length > 0?this.props.data.contact.map((element,i) => {
                                      return (
                                        <CVcontent editable={false} key={i} title={element.title} text={element.text}/>

                                        )
                                       }):null}
                                        
                                        </div>
                        
                                   </div>
                                )
                            }
                        })}
                    
                </div>
               
              </div>
            </div>
           </Drawer>
        )
    }
}