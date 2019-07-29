import React from "react";
import "./searchStaff.css";
import SearchStaffLoading from "../../loading/searchStaffLoading";
import firebase from "../../../firebaseSetUp";
import LoadingSpinner from "../../loading/loadingSpinner";
import Navbar from "../../navbar";
import { Button, Position, Toast, Toaster, Classes, Slider, Drawer} from "@blueprintjs/core";
import CreateProject from "../createProject";
import $ from "jquery";
import autocomplete from "../../../utils/autocomplete";
import logo from "../../../res/Graphics/main_logo.png";
import CVContainer from "./CVContainer";
import ProposalsViewer from "../proposalViewer";
import DrawerJob from "../drawerJob";





export default class SearchStaff extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user:null,
            toasts: [ /* IToastProps[] */ ],
            CVs:[],
            queryString:"",
            inbox:{
                count:0,
                elements:[]
            },
            size:null,
            drawerJob:{
                projectID:"",
                action:"",
                isOpen:false,
                handleClose:async() => {
                    if(this._mounted){
                       await this.setState(state => {
                            let base = state.drawerJob;
                            base.isOpen = false;
                            base.projectID = "";
                            return {
                                drawerJob:base
                            }
                        })
                    }
                },
                handleOpen:async(projectID,action) => {
                    if(this._mounted){
                      await  this.setState(state => {
                            let base = state.drawerJob;
                            base.isOpen = true;
                            base.action = action;
                            base.projectID = projectID
                            return {
                                drawerJob:base
                            }
                        })
                    }
                }
            },
            proposalsViewer:{
                isOpen:false,
                projectID:"",
                proposalID:"",
                handleOpen:async(projectID, proposalID) => {
                    if(this._mounted){
                     await  this.setState(state => {
                            let base = state.proposalsViewer;
                            base.isOpen = true;
                            base.projectID = projectID;
                            base.proposalID = proposalID;
                            
                            let base2 = state.drawerJob;
                            base2.isOpen = false;
                            base2.projectID = "";
                            return {
                                proposalsViewer:base,
                                drawerJob:base2
                            }
                        })
                    }
                },
                handleClose:async(projectID, proposalID) => {
                    if(this._mounted){
                       await this.setState(state => {
                            let base = state.proposalsViewer;
                            base.isOpen = false;
                            base.projectID = projectID;
                            base.proposalID = proposalID
                            return {
                                proposalsViewer:base
                            }
                        })
                    }
                }
            },
            createProject:{
                isOpen:false,
                handleClose:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.createProject;
                        base.isOpen = false;
                        return {createProject:base}
                    })
                }
                },
                handleOpen:() => {
                    if(this._mounted){
                    this.setState(state => {
                        let base = state.createProject;
                        base.isOpen = true;
                        return {createProject:base}
                    })
                }
                }
            },
            pageSize:{
                min:6,
                max:12,
                value:6
            }
        }
        this.toaster = {};
        this.refHandlers = {
            toaster:(ref) => {this.toaster = ref},
        }
    }

    addToast = (message) => {
        this.toaster.show({ message: message});
    }

    handleInboxEvent = (action) =>{
        if(this._mounted){
        if(action.type === "view contract"){
            this.setState(state =>{
                let base = state.drawerJob;
                base.action = action.type;
                base.projectID = action.id;
                base.isOpen = true;
                return {drawerJob:base}
            })
        }else if(action.type === "view proposal"){
            this.setState(state => {
                let base = state.proposalsViewer;
                base.isOpen = true;
                base.projectId = action.id;
                base.proposalId = action.id2;

                return ({proposalsViewer:base});
            })
        }
    }
    }

    updateUser = async(id) =>{
        firebase.firestore().collection("users").doc(id).get()
        .then(async doc => {
           firebase.firestore().collection("users").doc(id).collection("inbox").orderBy("sent","desc").onSnapshot(messages => {
               
            let count = 0
            let elements = [];
            messages.forEach(message => {
                if(elements.length < 5){
                elements.push(message.data());
                }
                if(message.data().state =="unread"){
                    count++
                }
            })
            if(this._mounted){
            this.setState({inbox:{
                count:count,
                elements:elements
            }})
        }
           })
           if(this._mounted){
             this.setState(state => {

                
                return {
                user:[doc.data()],
                
            }
            })
        }
           
        })
    }

    fetchCVs = (limit,page) => {
        this.specific = false;
        firebase.firestore().collection("CVs").get()
          .then(snap => {
              let size = snap.size;
              let lastSeem;
              let ref = firebase.firestore().collection("CVs");
              lastSeem = snap.docs[(limit*(page))-(page === 0?0:1)];

              if(page){
                  ref = ref.startAfter(lastSeem).limit(limit)
              }else {
                  ref = ref.limit(limit)
              }
              
              ref.get()
              .then((snap2) => {
                  let arr = [];

                  snap2.forEach(doc => {
                      arr.push(doc.data());
                  })
                if(this._mounted){
                    this.setState({
                        CVs:arr,
                        size:size
                    })
                  }
              })
          })
    }

    componentWillUnmount(){
        this._mounted = false;

        $("a").off("click");
    }

    componentDidMount(){

        $(document).ready(function(){
            // Add smooth scrolling to all links
            $("a").on('click', function(event) {
              // Make sure this.hash has a value before overriding default behavior
              if (this.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();
          
                // Store hash
                var hash = this.hash;
          
                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                $('html, body').animate({
                  scrollTop: $(hash).offset().top - 80
                }, 800, function(){
          
                  // Add hash (#) to URL when done scrolling (default click behavior)
                  window.location.hash = hash - 80;
                });
              } // End if
            
            });

    
          });

        this._mounted = true;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              this.updateUser(user.uid)

              // ...
            } else {
              // User is signed out.
              this.props.handleStates(0)
              // ...
            }
          });

          this.fetchCVs(this.state.pageSize.value,0);
    
    }

    markAsRead = async() =>{

        try {
        let refs = []
        let call = await firebase.firestore().collection("users").doc(this.state.user[0].uid).collection("inbox").get()
        call.forEach(ref => {
          refs.push(firebase.firestore().collection("users").doc(this.state.user[0].uid).collection("inbox").doc(ref.id))
        })

        let batch = firebase.firestore().batch();

        for(let i = 0; i< refs.length; i++){
            batch.update(refs[i], {state:"read"})
        }
        await batch.commit();

    }catch(e){
        this.addToast(e.message);
    }
    

    }


    specificSearch = (string, page) => {
        this.specific = true;
        let ref = firebase.firestore().collection("CVs").where("keywords","array-contains",string.toLowerCase()).get()
        .then(snap => {
            let size = snap.size;
            let lastSeem;
            lastSeem = snap.docs[(this.state.pageSize.value*(page))-(page === 0?0:1)]; 
            let ref2 = firebase.firestore().collection("CVs").where("keywords","array-contains",string.toLowerCase())
            if(page){
                ref2 = ref2.startAfter(lastSeem).limit(this.state.pageSize.value);
            }else {
                ref2 =ref2.limit(this.state.pageSize.value);
            }
            ref2.get()
            .then(snap2 => {
                let arr = []
                snap2.forEach(doc => {
                    arr.push(doc.data())
                })
                if(this._mounted){
                    this.setState({
                        CVs:arr,
                        size:size
                    })
                }
            })
        })
    }

    render(){
        return(
            <div>
                {this.state.isLoading === true? <LoadingSpinner />:null }
                <Toaster className={Classes.OVERLAY} position={Position.TOP} ref={this.refHandlers.toaster}>
                    {/* "Toasted!" will appear here after clicking button. */}
                    {this.state.toasts.map(toast => <Toast {...toast} />)}
                </Toaster>
                <Navbar logo={{
                    img:logo,
                    href:"#top"
                }}
                leftElements={
                    [
                        {
                            type:"link",
                            text:"My Projects",
                            href:"/myprojects",
                            icon:"work_outline",
                            onClick:() => {this.props.handleStates(2)},
                            key:1
                        },
                        {
                            type:"link",
                            text:"Search Staff",
                            href:"",
                            state:"active",
                            onClick:() => {},
                            icon:"search",
                            key:2
                        },
                        {
                            type:"link",
                            text:"Search Projects",
                            href:"",
                            state:"",
                            onClick:() => { this.props.handleStates(1)},
                            icon:"public",
                            key:3
                        },
                        
                        {
                            type:"link",
                            text:"Payments",
                            href:"",
                            state:"",
                            icon:"payment",
                            onClick:() => {this.props.handleStates(5)},
                            key:4
                        }
                    ]
                }

                rightElements={
                    [
                        {
                            type:"button",
                            text:"Create Project",
                            href:"",
                            icon:"add",
                            onClick:() => {this.state.createProject.handleOpen()},
                            key:6
                        },
                        {
                            type:"dropdown badge",
                            text:"Inbox",
                            icon:"inbox",
                            count:this.state.inbox.count,
                            href:"",
                            key:7,
                            onClick:()=> { 
                                if(this.state.user !== null){
                                this.markAsRead()
                                }
                            },
                            dropdownItems:this.state.inbox.elements.length > 0?this.state.inbox.elements.map((element,i) => {
                               return  {href:"",text:element.message,key:(i + Math.random()),onClick:()=>{this.handleInboxEvent(element.action)}}
                                 }):[{
                                href:"",
                                text:"No notifications",
                                key:2,
                                onClick:() => {}
                            }]
                        },
                        {
                            type:"dropdown",
                            text:this.state.user === null?"Loading...":this.state.user[0].displayName?this.state.user[0].displayName:this.state.user[0].email,
                            href:"",
                            key:5,
                            onClick:() => {},
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Profile",
                                    key:1,
                                    onClick:() => {this.props.handleStates(3, firebase.auth().currentUser.uid)},
                                },
                                {
                                    href:"",
                                    text:"Logout",
                                    onClick:()=> {firebase.auth().signOut()},
                                    key:2
                                }
                            ]
                        }
                    ]
                }/>
                {this.state.user === null?<SearchStaffLoading/>:
                
                <div className="container-fluid pt-4 pb-4" id="top">
                   <div id="portalContainer" className="text-left">
                   {this.state.drawerJob.projectID === ""?null:
                    <DrawerJob openProposal={(id,id2) => {this.state.proposalsViewer.handleOpen(id,id2)}} action={this.state.drawerJob.action} id={this.state.drawerJob.projectID} isOpen={this.state.drawerJob.isOpen} handleClose={this.state.drawerJob.handleClose}  toastHandler={(message) => {this.addToast(message)}}/>}
                    {this.state.proposalsViewer.projectID ===""?null:<ProposalsViewer openProject={(id) => {this.state.drawerJob.handleOpen(id); this.state.proposalsViewer.handleClose("","")}} handleClose={() => {this.state.proposalsViewer.handleClose("","")}} projectId={this.state.proposalsViewer.projectID} proposalId={this.state.proposalsViewer.proposalID} isOpen={this.state.proposalsViewer.isOpen} />}
                    <CreateProject isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/>
                  </div>
                    <div className="row">
                        <div className="col-sm-3">
                          <ul className="nav flex-column">
                          <li className="nav-item">
                           <a className="nav-link active" href="#">Search CVs</a>
                           </li>
                          </ul>
                        </div>
                        <div className="col">
                        
                            <div className="container">
                            <div className="form-group mx-5">
                            <div className="input-group mb-3 mt-3 mx-auto " >
                          <input type="text" className="form-control" onChange={(e) => {this.setState({queryString:e.target.value})}} placeholder="Search" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="button" onClick={() => {this.specificSearch(this.state.queryString)}}>Search</button> 
                         </div>
                        </div>
                        <Slider min={this.state.pageSize.min} max={this.state.pageSize.max} value={this.state.pageSize.value}  onChange={(e) => {this.setState(state => {
                                    let pageSize = state.pageSize;
                                    pageSize.value = e;
                                    return ({pageSize:pageSize});
                                });}}  />
                        </div>
                                {this.state.CVs.length > 0?this.state.CVs.map((element,i) => {
                            
                                    return <CVContainer email={element.uemail} openCV={()=> {this.props.handleStates(3,element.uid)}} key={i} description={element.description[0]} name={element.username} id={element.uid} />
                                }):<div className="">No Results</div>}

{this.state.size === null?null:<ul className="pagination text-center mt-2">
                             <li className="page-item ml-auto"><a className="page-link" href="#">Previous</a></li>
                             {
                                 (() => {
                                     let pages = [];
                                     for(let i = 0 ; i<  Math.ceil(this.state.size/this.state.pageSize.value); i++){
                                         pages.push("element")
                                     }
                                     return pages
                                 })().map((data, i) => {
                                     
                                        return <li key={i} className="page-item"><a className="page-link" onClick={() => {this.specific === true?this.specificSearch(this.state.queryString,i): this.fetchCVs(this.state.pageSize.value, i)}} href="#">{i}</a></li>
                                     
                                 })                                                                  }
                             <li className="page-item mr-auto"><a className="page-link" href="#">Next</a></li>
                           </ul>}
                            </div>
                        </div>
                    </div>
                    
                </div>
                }
            </div>
        )
    }
}