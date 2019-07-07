import React from "react";
import "./myProjects.css";
import Navbar from "../../navbar";
import firebase from "../../../firebaseSetUp";
import logo from "../../../logo.svg";

export default class MyProjects extends React.Component {
    constructor(props){
        super(props);
        this.updateUser = this.updateUser.bind(this);

        this.state = {
            isLoading:false,
            user:null
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              this.updateUser(user.uid)
              // ...
            } else {
              // User is signed out.
              window.location.href = "/";
              // ...
            }
          });
    }

    async updateUser(id){
        firebase.firestore().collection("users").doc(id).get()
        .then(doc => {
            console.log(doc.data());
            this.setState({
                user:[doc.data()],
            })
            console.log(this.state.user);
        })
    }

    render(){
        return(
            <div>
                <Navbar logo={logo}
                leftElements={
                    [
                        {
                            type:"link",
                            text:"My Projects",
                            href:"",
                            state:"active",
                            icon:"work_outline",
                            onClick:() => {},
                            key:1
                        },
                        {
                            type:"link",
                            text:"Search Staff",
                            href:"",
                            state:"",
                            icon:"search",
                            onClick:() => {},
                            key:2
                        },
                        {
                            type:"link",
                            text:"Search Projects",
                            icon:"public",
                            href:"",
                            state:"",
                            onClick:() => { window.location.href = "/home"},
                            key:3
                        },
                        {
                            type:"dropdown",
                            text:"Payments",
                            href:"",
                            state:"",
                            icon:"payment",
                            dropdownItems:[
                                {
                                    href:"#",
                                    key:1,
                                    text:"test",
                                    state:"",
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
                            onClick:() => {},
                            key:6
                        },
                        {
                            type:"dropdown",
                            text:this.state.user === null?"Loading...":this.state.user[0].email,
                            href:"",
                            state:"",
                            onClick:() => {},
                            key:5,
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Settings",
                                    icon:"power_settings_new",
                                    onClick:() => {},
                                    state:"",
                                    key:1
                                },
                                {
                                    href:"",
                                    text:"logout",
                                    icon:"power_settings_new",
                                    onClick:()=> {firebase.auth().signOut()},
                                    key:2,
                                    state:"",
                                }
                            ]
                        }
                    ]
                }
                />
                <div className="row text-center">
                    <div className="col-sm-4 padding-3 border-right-custom-1">
                    <div className="input-group mb-3 mt-3 mx-auto">
                          <input type="text" className="form-control" placeholder="Search Projects" />
                            <div className="input-group-append">
                            <button className="btn btn-custom-1" type="button">Search</button> 
                         </div>
                        </div>

                        <select name="cars" className="custom-select-sm">
                          <option defaultValue>All</option>
                          <option value="volvo">Active Projects</option>
                          <option value="fiat">Colaboration Projects</option>
                          <option value="audi">Archived Projects</option>
                        </select>
                    </div>
                    <div className="col">
                        <h4 className="mt-3">My Projects</h4>
                        <div className="container-fluid">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}