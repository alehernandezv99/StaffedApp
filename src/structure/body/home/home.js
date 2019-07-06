import React from "react";
import Navbar from "../../navbar";
import JobModule from "./jobModule";
import firebase from "../../../firebaseSetUp";

export default class Home extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            user:null,
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              this.setState({
                user:user.email
              })
              var displayName = user.displayName;
              var email = user.email;
              var emailVerified = user.emailVerified;
              var photoURL = user.photoURL;
              var isAnonymous = user.isAnonymous;
              var uid = user.uid;
              var providerData = user.providerData;
              // ...
            } else {
              // User is signed out.
              window.location.href = "/";
              // ...
            }
          });
    }

    render(){
        return(
            <div>
                <Navbar 
                leftElements={
                    [
                        {
                            type:"link",
                            text:"My Projects",
                            href:"",
                            key:1
                        },
                        {
                            type:"link",
                            text:"Search Staff",
                            href:"",
                            key:2
                        },
                        {
                            type:"link",
                            text:"Search Project",
                            href:"",
                            key:3
                        },
                        {
                            type:"dropdown",
                            text:"Payments",
                            href:"",
                            dropdownItems:[
                                {
                                    href:"#",
                                    key:1,
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
                            type:"dropdown",
                            text:this.state.user === null?"Loading...":this.state.user,
                            href:"",
                            key:5,
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Settings",
                                    key:1
                                },
                                {
                                    href:"",
                                    text:"logout",
                                    onClick:()=> {firebase.auth().signOut()},
                                    key:2
                                }
                            ]
                        }
                    ]
                }
                />
                

                <div className="container-fluid padding-2">
                    <div className="row text-center">
                        <div className="col ">
                        <div className="jumbotron">Recently Searches</div>
                            <div className="list-group">
                                <a href="" className="list-group-item list-group-item-action">First Item</a>
                                <a href="" className="list-group-item list-group-item-action">Second Item</a>
                                <a href="" className="list-group-item list-group-item-action">Third Item</a>
                            </div>
                        </div>
                        <div className="col-sm-6">
                        <div class="input-group mb-3 mt-3 mx-auto">
                          <input type="text" class="form-control" placeholder="Search" />
                            <div class="input-group-append">
                            <button class="btn btn-custom-1" type="submit">Search</button> 
                         </div>
                        </div>
                        <JobModule title={"Andoid developer for platform"} description={`
                        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsmu
                        lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                        `}  skills={
                            [
                                {
                                    text:"PHP"
                                },
                                {
                                    text:"JavaScript"
                                },
                                {
                                    text:"NodeJs"
                                }
                            ]
                        }
                        specs={
                            [
                                {
                                    text:"test",
                                    icon:"link"
                                }
                            ]
                        }/>
                        </div>
                        <div className="col">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src="https://www.w3schools.com/bootstrap4/img_avatar1.png" style={{width:"50%"}} className="rounded-circle" />
                                    <div className="mt-2 text-left"><i className="material-icons">style</i> 34 Cards</div>
                                    <div className="mt-2 text-left"><i className="material-icons">event_note</i> 6 Proposals</div>
                                    <div className="mt-2 text-left"><i className="material-icons">work</i> 3 Active Candidancies</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}