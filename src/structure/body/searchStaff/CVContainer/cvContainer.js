import React from "react";
import "./cvContainer.css";
import TextCollapse from "../../profile/textCollapse";
import firebase from "../../../../firebaseSetUp";
import $ from "jquery";

export default class CVContainer extends React.Component{
    constructor(props){
        super(props);
        this.id = `staff-container-${Math.ceil(Math.random()*100000)}`
        this.state = {
            user:null,
            open:false
        }
    }
    componentWillUnmount(){
        this._mounted = false;
    }
    componentDidMount(){
       
        this._mounted = true;
        firebase.firestore().collection("users").doc(this.props.id).get()
        .then((snapshot) => {
            if(this._mounted){
            this.setState({
                user:[snapshot.data()]
            })
        }
        })
    }

    render(){
        return(<div className="mt-3 CV-container" >
            <div className="media border p-3">
                {this.state.user === null?<div className="spinner-border mx-3"></div>:<img src={this.state.user[0].photoURL?this.state.user[0].photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"} alt="John Doe" className="mr-3 mt-3 rounded-circle" style={{width:"60px"}} />}
                <div className="media-body">
                <h4 onClick={this.props.openCV} style={{cursor:"pointer"}}>{this.state.user === null?<div className="spinner-border mx-3" style={{fontWeight:"light"}}></div>:this.props.name}{" - "}{this.props.description !== undefined?this.props.description.title:""}</h4>
                <TextCollapse text={this.props.description !== undefined?this.props.description.text:""} maxWidth={200} />

                {this.props.skills?
            
            <div className="form-group">
                    {this.props.skills.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 btn-sm">{skill}</button>
                                })}
                    </div>
           :null }
            
            {this.props.type === "company"?this.props.staff.length > 0? this.props.staff.map((e,i) => {
                if(i <= 1){
                 return(   <div className="media p-3" key={i}>
                        <img src={e.photoURL?e.photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"} className="mr-3 mt-3 rounded-circle" style={{width:"45px"}}/>
                          <div className="media-body">
                           <h4>{e.name?e.name[0].title:null} - {e.description?e.description[0].title:null}</h4>
                           <p>{e.description?e.description[0].description:null}</p>

                           <div className="form-group">
                               <button type="button" onClick={() => {this.props.seeStaff(e)}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">list</i> See More</button>
                           </div>
                         </div>
                    </div>
                 )
                }
                }):null:null}

                {this.props.type === "company"?this.props.staff.length > 2?
                 <div id={this.id} style={{display:"none"}}>
                { this.props.staff.map((e,i) => {
                        if(i > 1){
                            return(
                        <div className="media p-3" key={i}>
                        <img src={e.photoURL?e.photoURL:"https://www.w3schools.com/bootstrap4/img_avatar1.png"} className="mr-3 mt-3 rounded-circle" style={{width:"45px"}}/>
                          <div className="media-body">
                           <h4>{e.name?e.name[0].title:null} - {e.description?e.description[0].title:null}</h4>
                           <p>{e.description?e.description[0].description:null}</p>

                           <div className="form-group">
                               <button type="button" onClick={() => {this.props.seeStaff(e)}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">list</i> See More</button>
                           </div>
                         </div>
                    </div>
                            )
                        }
                    })
                }
                
                    }
                })}
                </div>
                :null:null}
                 
                 <a href="" onClick={(e)=>{e.preventDefault(); 
                this.setState({
                    open:false
                });
                $(`#${this.id}`).slideToggle("fast");
                }}>{this.state.open === true?"View Less":"View More"}</a>
                </div>
                
                
            </div>
            <div className="email-bottom-right">{this.props.email}</div>
            <div className="type-top-right">{this.props.type}</div>

            
        </div>)
    }
}