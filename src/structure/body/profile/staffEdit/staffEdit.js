import React from "react";
import "./staffEdit.css";

export default class StaffEdit extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            saved:false,
            progress:null,
            submitted:false,
            CV:{
                id:"",
                description:[],
                experience:[],
                education:[],
                portfolio:[],
                skills:[],
                expertise:[],
                contact:[],
                editable:true,
                order:[1,2,3,4,5,6],
                photoURL:null
            },
            inputs:{
                description:{
                    title:"",
                    description:""
                },
                experience:{
                    title:"",
                    description:""
                },
                education:{
                    title:"",
                    description:""
                },
                portfolio:{
                    title:"",
                    description:""
                },
                skills:{
                    title:"",
                    description:""
                },
                expertise:{
                    title:"",
                    description:""
                },
                contact:{
                    title:"",
                    description:""
                },

            }
        }
    }

    render(){
        return (
            <Drawer hasBackdrop={true} style={{zIndex:999}} portalContainer={document.getElementById("portalContainer")} onClose={() => {this.state.saved?(()=> {})():this.deleteReference(); this.props.handleClose()}} title={""} size={window.innerWidth <= 700?"100%":"75%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
              <div className={`${Classes.DIALOG_BODY}`}>
              <div className="container mt-2">
                        <div className="container-fluid" style={{position:"relative"}}>
                   
                                    <div style={{backgroundImage:`url(${this.state.CV.photoURL?this.state.CV.photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"150px",
                                    height:"150px",
                                    marginLeft:"50%",
                                    transform:"translate(-50%,0)"
                                }} className="rounded-circle" ></div>

                        
                     <div className="dropdown right-corner-btn">
                              <button type="button" className="dropdown-toggle remove-caret" data-toggle="dropdown"><i className="material-icons align-middle">more_horiz</i></button>
                                <div className="dropdown-menu dropdown-menu-right" style={{width:"300px"}}>
                                    <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="customFile" onChange={e => {e.persist(); this.upload(e)}}/>
                                    <label className="custom-file-label" >Choose file</label>
                                </div>
                              </div>
                             </div>

                             {this.state.progress?
                             <div className="progress mt-4">
                               <div className="progress-bar" style={{width:`${this.state.progress}%`}}></div>
                            </div>:null
                             }
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Profession</label>
                        <input type="text" value={this.state.inputs.description.title} className="form-control" onChange={(e) => {this.changeInputValue("description","title",e.target.value, e.target.parentNode.childNodes[2],e.target)}}/>
                        <div className="invalid-feedback" >test</div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" value={this.state.inputs.description.description} onChange={(e) => {this.changeInputValue("description","description",e.target.value, e.target.parentNode.childNodes[2],e.target)}}></textarea>
                        <div className="invalid-feedback">test</div>
                    </div>

                    <div id="accordion">
                        {this.state.CV.order.map((element,index) => {
                            if(element === 1){
                                return (
                                    <div className="card mt-3" key={element}>
                                    <div className="card-header" style={{position:"relative"}}>
                                       <a className="card-link" data-toggle="collapse" href="#experience"> Experience</a>

                                       {this.state.CV.editable === true?
                                       <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                       :null}
                                        </div>
                                  <div className="collapse show" data-parent="#accordion" id="experience">
                                   {this.state.CV.experience.length > 0?this.state.CV.experience.map((element,i) => {
                                       return (
                                           <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"experience",i,element.title,element.text)}} delete={() => {this.deleteContent("experience",i); }} title={element.title} text={element.text}/>
            
                                   )
                                       }):null}
                                   {this.state.CV.editable === true?
                                     <div> <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#experience-form")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>
                                     <div className="container" id="experience-form" style={{display:"none"}}>
                                         <div className="form-group" >
                                            <label>Title</label> 
                                            <input type="text" value={this.state.inputs.experience.title} onChange={(e) => {this.changeInputValue("experience","title",e.target.value)}} className="form-control" />
                                         </div>
                                         <div className="form-group">
                                            <label>Experience</label> 
                                            <textarea value={this.state.inputs.experience.description} onChange={(e) => {this.changeInputValue("experience","description",e.target.value)}} className="form-control" ></textarea>
                                         </div>
                                         <div className="form-group">
                                             <button type="button" onClick={() => {this.addElement("experience",{title:this.state.inputs.experience.title,text:this.state.inputs.experience.description})}} className="btn btn-custom-1"><i className="material-icons align-middle">add</i> Add</button>
                                         </div>
                                     </div>
                                     </div>
                                     : null}
                                </div>
            
                                </div> 
                                )
                            }

                            if(element === 2){
                                return (
                                    <div className="card mt-3" key={element}>
                        <div className="card-header" style={{position:"relative"}}>
                           <a className="card-link" data-toggle="collapse" href="#education"> Education</a>

                           {this.state.CV.editable === true?
                           <div className="btn-group btns-change-order">
                                          <button type="button" className="btn btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                        :null}
                            </div>
                        
                            <div className="collapse show" id="education">
                            {this.state.CV.education.length > 0?this.state.CV.education.map((element,i) => {
                           return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"education",i,element.title,element.text)}} delete={() => {this.deleteContent("education",i); }} title={element.title} text={element.text}/>

                       )
                           }):null}
                       {this.state.CV.editable === true?
                        <div> <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#education-form")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>
                        <div className="container" id="education-form" style={{display:"none"}}>
                            <div className="form-group" >
                               <label>Title</label> 
                               <input type="text" value={this.state.inputs.education.title} onChange={(e) => {this.changeInputValue("education","title",e.target.value)}} className="form-control" />
                            </div>
                            <div className="form-group">
                               <label>Education</label> 
                               <textarea value={this.state.inputs.education.description} onChange={(e) => {this.changeInputValue("education","description",e.target.value)}} className="form-control" ></textarea>
                            </div>
                            <div className="form-group">
                                <button type="button" onClick={() => {this.addElement("education",{title:this.state.inputs.education.title,text:this.state.inputs.education.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                            </div>
                        </div>
                        </div>
                         : null}
                        </div>
                    </div>
                                )
                            }

                            if(element === 3){
                              return(  <div className="card mt-3" key={element}>
                                  <div className="card-header" style={{position:"relative"}}>
                                    <a className="card-link" data-toggle="collapse" href="#portfolio"> Portfolio</a>

                                    {this.state.CV.editable === true?
                                    <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                    :null}
                                  </div>

                                <div className="collapse show" id="portfolio">
                                   {this.state.CV.portfolio.length > 0?this.state.CV.portfolio.map((element,i) => {
                                    return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"portfolio",i,element.title,element.text)}} delete={() => {this.deleteContent("portfolio",i); }} title={element.title} text={element.text}/>

                               )
                              }):null}
                               {this.state.CV.editable === true? 
                               <div> <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#portfolio-form")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>
                               <div className="container" id="portfolio-form" style={{display:"none"}}>
                                   <div className="form-group" >
                                      <label>Title</label> 
                                      <input type="text" value={this.state.inputs.portfolio.title} onChange={(e) => {this.changeInputValue("portfolio","title",e.target.value)}} className="form-control" />
                                   </div>
                                   <div className="form-group">
                                      <label>Portfolio</label> 
                                      <textarea value={this.state.inputs.portfolio.description} onChange={(e) => {this.changeInputValue("portfolio","description",e.target.value)}} className="form-control" ></textarea>
                                   </div>
                                   <div className="form-group">
                                       <button type="button" onClick={() => {this.addElement("portfolio",{title:this.state.inputs.portfolio.title,text:this.state.inputs.portfolio.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                   </div>
                               </div>
                               </div>
                               : null}
                             </div>
                            </div>
                              )
                            }

                            if(element === 4){
                                return (
                                    <div className="card mt-3" key={element}>
                                     <div className="card-header" style={{position:"relative"}}>
                                       <a className="card-link" data-toggle="collapse" href="#skills"> Skills</a>

                                       {this.state.CV.editable === true?
                                       <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                       :null}
                                     </div>

                                      <div className="collapse show"  id="skills">
                                       {this.state.CV.skills.length > 0?this.state.CV.skills.map((element,i) => {
                                     return (
                               <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"skills",i,element.title,element.text)}} delete={() => {this.deleteContent("skills",i); }} title={element.title} text={element.text}/>

                       )
                           }):null}
                                   {this.state.CV.editable === true? 
                                   <div> <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#skills-form")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>
                                   <div className="container" id="skills-form" style={{display:"none"}}>
                                       <div className="form-group" >
                                          <label>Title</label> 
                                          <input type="text" value={this.state.inputs.skills.title} onChange={(e) => {this.changeInputValue("skills","title",e.target.value)}} className="form-control" />
                                       </div>
                                       <div className="form-group">
                                          <label>Skills</label> 
                                          <textarea value={this.state.inputs.skills.description} onChange={(e) => {this.changeInputValue("skills","description",e.target.value)}} className="form-control" ></textarea>
                                       </div>
                                       <div className="form-group">
                                           <button type="button" onClick={() => {this.addElement("skills",{title:this.state.inputs.skills.title,text:this.state.inputs.skills.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                       </div>
                                   </div>
                                   </div>
                                   : null}
                                   </div>
                               </div>
                                )
                            }

                            if(element === 5){
                                return (
                                    <div className="card mt-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#expertise"> Expertise</a>

                                        {this.state.CV.editable === true?
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                        :null}
                                      </div>

                                    <div className="collapse show"  id="expertise">
                                       {this.state.CV.expertise.length > 0?this.state.CV.expertise.map((element,i) => {
                                      return (
                                      <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"expertise",i,element.title,element.text)}} delete={() => {this.deleteContent("expertise",i); }} title={element.title} text={element.text}/>

                                       )
                                    }):null}
                                   {this.state.CV.editable === true?
                                    <div> <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#expertise-form")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>
                                    <div className="container" id="expertise-form" style={{display:"none"}}>
                                        <div className="form-group" >
                                           <label>Title</label> 
                                           <input type="text" value={this.state.inputs.expertise.title} onChange={(e) => {this.changeInputValue("expertise","title",e.target.value)}} className="form-control" />
                                        </div>
                                        <div className="form-group">
                                           <label>Expertise</label> 
                                           <textarea value={this.state.inputs.expertise.description} onChange={(e) => {this.changeInputValue("expertise","description",e.target.value)}} className="form-control" ></textarea>
                                        </div>
                                        <div className="form-group">
                                            <button type="button" onClick={() => {this.addElement("expertise",{title:this.state.inputs.expertise.title,text:this.state.inputs.expertise.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                        </div>
                                    </div>
                                    </div>
                                     : null}
                                  </div>
                                 </div>
                                )
                            }

                            if(element === 6){
                                return (
                                    <div className="card mt-3 mb-3" key={element}>
                                      <div className="card-header" style={{position:"relative"}}>
                                        <a className="card-link" data-toggle="collapse" href="#contact-cv"> Contact</a>

                                        {this.state.CV.editable === true?
                                        <div className="btn-group btns-change-order">
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("down",index)}}>keyboard_arrow_up</i></button>
                                          <button type="button" className="btn  btn-sm"><i className="material-icons align-middle" onClick={e => {this.switchPosition("up",index)}}>keyboard_arrow_down</i></button>
                                      </div>
                                        :null}
                                     </div>

                                    <div className="collapse show" id="contact-cv" >
                                       {this.state.CV.contact.length > 0?this.state.CV.contact.map((element,i) => {
                                      return (
                                        <CVcontent editable={this.state.CV.editable} key={i} edit={() => {this.openEditPanel("update",this.state.CV.id,"contact",i,element.title,element.text)}} delete={() => {this.deleteContent("contact",i); }} title={element.title} text={element.text}/>

                                        )
                                       }):null}
                                        {this.state.CV.editable === true? 
                                        <div> <button type="button" className="btn btn-custom-3 btn-sm m-2" onClick={() => {this.toggleAddContent("#contact-form")}}><i className="material-icons align-middle">add</i> <span>Add</span></button>
                                        <div className="container" id="contact-form" style={{display:"none"}}>
                                            <div className="form-group" >
                                               <label>Title</label> 
                                               <input type="text" value={this.state.inputs.contact.title}  onChange={(e) => {this.changeInputValue("contact","title",e.target.value)}} className="form-control" />
                                            </div>
                                            <div className="form-group">
                                               <label>Contact</label> 
                                               <textarea value={this.state.inputs.contact.description} onChange={(e) => {this.changeInputValue("contact","description",e.target.value)}} className="form-control" ></textarea>
                                            </div>
                                            <div className="form-group">
                                                <button type="button" onClick={() => {this.addElement("contact",{title:this.state.inputs.contact.title,text:this.state.inputs.contact.description})}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">add</i> Add</button>
                                            </div>
                                        </div>
                                        </div>
                                        : null}
                                        </div>
                        
                                   </div>
                                )
                            }
                        })}
                    
                </div>
                 <div className="form-group">
                     <button type="button" className="btn btn-custom-1 " onClick={this.createStaff}><i className="material-icons align-middle">add</i> Create</button>
                 </div>
              </div>
            </div>
           </Drawer>
        )
    }
}