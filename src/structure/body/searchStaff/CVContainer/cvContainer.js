import React from "react";
import "./cvContainer.css";
import TextCollapse from "../../profile/textCollapse";
import firebase from "../../../../firebaseSetUp";
import $ from "jquery";
import UserBox from "../../profile/userBox";

export default class CVContainer extends React.Component{
    constructor(props){
        super(props);
        this.id = `staff-container-${Math.ceil(Math.random()*100000)}`
        this.id2 = `inventory-container-${Math.ceil(Math.random()*100000)}`
        this.state = {
            user:null,
            open:false,
            staff:[]
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

        firebase.firestore().collection("invitations").where("from","==",this.props.id).where("status","==","accepted").get()
        .then(snap => {
          
            if(!snap.empty){
                let staff = [];

                snap.forEach(doc => {
                    staff.push({
                        user:doc.data().to,
                        id:doc.data().id
                    })
                })
                if(this._mounted){
                    this.setState({
                        staff:staff
                    })
                }
            }
        })
    }

    render(){
        return(<div className="mt-3 CV-container" >
          
            <div className="media border p-3">
                {this.state.user === null?<div className="spinner-border mx-3"></div>:<div style={{backgroundImage:`url(${this.state.user[0].photoURL?this.state.user[0].photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"50px",
                                    height:"50px",
                                    marginRight:"20px"
                        
                                }} className="rounded-circle" ></div>}
                <div className="media-body">
                <h4 onClick={this.props.openUser} style={{cursor:"pointer"}}>{this.state.user === null?<div className="spinner-border mx-3" style={{fontWeight:"light"}}></div>:this.props.name}</h4>
                <h5 onClick={this.props.openUser} style={{cursor:"pointer"}}>{this.props.description !== undefined?this.props.description.title:""}</h5>
                <TextCollapse text={this.props.description !== undefined?this.props.description.text:""} maxWidth={200} />

                {this.props.skills?
            
            <div className="form-group" style={{display:"none"}}>
                    {this.props.skills.map((skill, index) => {
                                  return <button type="button" key={index} className="btn btn-custom-2 btn-sm ml-2">{skill}</button>
                                })}
                    </div>
           :null }

       
            {this.props.type === "company"?this.state.staff.length > 0?<div className="text-center"><h4>Staff</h4></div>:null:null}
            {this.props.type === "company"?this.state.staff.length > 0? this.state.staff.map((e,i) => {
                if(i <= 1){
                 return(   <div className="media p-3" key={i}>
                        <UserBox margin={"m-2"} key={i} id={e.user} openUser={this.props.openUser} size={"50px"} addToast={this.addToast}/>
                    </div>
                 )
                }
                }):null:null}

        
                {this.props.type === "company"?this.state.staff.length > 2?
                 <div id={this.id} style={{display:"none"}}>
                { this.state.staff.map((e,i) => {
                        if(i > 1){
                            return(
                                <div className="media p-3" key={i}>
                                <UserBox margin={"m-2"} key={i} id={e.user} openUser={this.props.openUser} size={"50px"} addToast={this.addToast}/>
                            </div>
                            )
                        }
                    })
                }
                
              
                </div>
                :null:null}
                 
                 {this.props.type === "company"?this.props.staff.length > 2?<a href="" onClick={(e)=>{e.preventDefault(); 
                this.setState({
                    open:false
                });
                $(`#${this.id}`).slideToggle("fast");
                }}>{this.state.open === true?"View Less":"View All"}</a>:null:null}


           
              {this.props.type === "machines&vehicles"?this.props.inventory.length > 0?<div className="text-center mt-2"><h4>Inventory</h4></div>:null:null}
            {this.props.type === "machines&vehicles"?this.props.inventory.length > 0? this.props.inventory.map((e,i) => {
                if(i <= 1){
                 return(   <div className="media p-3" key={i}>
                        <div style={{backgroundImage:`url(${e.photoURL?e.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"50px",
                                    height:"50px",
                                    marginRight:"20px"
                                }} className="rounded-circle" ></div>
                          <div className="media-body">
                           <h4>{e.name}</h4>
                           <TextCollapse text={e.description} maxWidth={150} />

                           <div className="form-group">
                               <button type="button" onClick={() => {this.props.seeInventory(e)}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">list</i> See More</button>
                           </div>
                         </div>
                    </div>
                 )
                }
                }):null:null}


                {this.props.type === "machines&vehicles"?this.props.inventory.length > 2?
                 <div id={this.id2} style={{display:"none"}}>
                { this.props.invetory.map((e,i) => {
                        if(i > 1){
                            return(
                        <div className="media p-3" key={i}>
                       <div style={{backgroundImage:`url(${e.photoURL?e.photoURL:"https://firebasestorage.googleapis.com/v0/b/freelanceapp-78578.appspot.com/o/Global%2Fprofile%2Fimg_avatar1.png?alt=media&token=95b2b3b3-5e4e-4ea9-b775-fdf2da293c0f"})`,
                                    backgroundPosition:"center",
                                    backgroundSize:"cover",
                                    backgroundRepeat:"no-repeat",
                                    width:"50px",
                                    height:"50px",
                                    marginRight:"20px"
                       
                                }} className="rounded-circle" ></div>
                          <div className="media-body">
                           <h4>{e.name}</h4>
                           <TextCollapse text={e.description} maxWidth={150} />

                           <div className="form-group">
                               <button type="button" onClick={() => {this.props.seeInventory(e)}} className="btn btn-custom-1 btn-sm"><i className="material-icons align-middle">list</i> See More</button>
                           </div>
                         </div>
                    </div>
                            )
                        }
                    })
                }
                
              
                </div>
                :null:null}

               {this.props.type === "machines&vehicles"?this.props.inventory.length > 2?<a href="" onClick={(e)=>{e.preventDefault(); 
                this.setState({
                    open:false
                });
                $(`#${this.id2}`).slideToggle("fast");
                }}>{this.state.open === true?"View Less":"View All"}</a>:null:null}
           

                </div>

    
            </div>
            <div className="email-bottom-right">{this.props.email}</div>
            <div className="type-top-right">{this.props.type}</div>

            
        </div>)
    }
}