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

const algoliasearch = require('algoliasearch');
const client = algoliasearch('D6DXHGALTD', 'fad277b448e0555dfe348a06cc6cc875');
const indexAlgolia = client.initIndex('CVs');




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

    componentWillUnmount(){
        this._mounted = false;
    }

    componentDidMount(){
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

          firebase.firestore().collection("CVs").get()
          .then(snap => {
              let arr =[]

              snap.forEach(doc => {
                  arr.push(doc.data());
              })

              if(this._mounted){
              this.setState({
                  CVs:arr
              })
            }
          })
    }

    specificSearch = (string, page) => {
        indexAlgolia.search({query:string,
            hitsPerPage:this.state.pageSize.value,
            page:page !== undefined?page:0 }, (err, {hits,nbHits} = {}) => {

                if(this._mounted){
            this.setState( {
                CVs:hits,
                searchBar:true,
                size:nbHits
            })
        }
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
                <Navbar logo={logo}
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
                            type:"dropdown",
                            text:"Payments",
                            href:"",
                            icon:"payment",
                            onClick:() => {},
                            dropdownItems:[
                                {
                                    href:"#",
                                    key:1,
                                    onClick:() => {},
                                    text:"test"
                                }
                            ],
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
                <div className="container-fluid pt-4 pb-4">
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
                                     
                                        return <li key={i} className="page-item"><a className="page-link" onClick={() => {this.specificSearch(this.state.queryString,i)}} href="#">{i}</a></li>
                                     
                                 })                                                                  }
                             <li className="page-item mr-auto"><a className="page-link" href="#">Next</a></li>
                           </ul>}
                            </div>
                        </div>
                    </div>
                    
                </div>
                }
                <CreateProject isOpen={this.state.createProject.isOpen} handleClose={this.state.createProject.handleClose}/>
            </div>
        )
    }
}