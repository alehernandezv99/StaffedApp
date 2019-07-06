import React from "react";
import "./myProjects.css";
import Navbar from "../../navbar";
import firebase from "../../../firebaseSetUp";

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
                <Navbar 
                leftElements={
                    [
                        {
                            type:"link",
                            text:"My Projects",
                            href:"",
                            state:true,
                            onClick:() => {},
                            key:1
                        },
                        {
                            type:"link",
                            text:"Search Staff",
                            href:"",
                            onClick:() => {},
                            key:2
                        },
                        {
                            type:"link",
                            text:"Search Project",
                            href:"",
                            onClick:() => {},
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
                            text:this.state.user === null?"Loading...":this.state.user[0].email,
                            href:"",
                            key:5,
                            dropdownItems:this.state.user === null?[]:[
                                {
                                    href:"",
                                    text:"Settings",
                                    onClick:() => {},
                                    key:1
                                },
                                {
                                    href:"",
                                    text:"logout",
                                    onClick:()=> {firebase.auth().signOut()},
                                    onClick:() => {},
                                    key:2
                                }
                            ]
                        }
                    ]
                }
                />

                <Navbar
                className={"navbar-custom-1"}
                leftElements={
                    [
                        {
                            type:"link",
                            text:"Search Projects",
                            href:"",
                            state:true,
                            onClick:() => {},
                            key:1
                        },
                        {
                            type:"link",
                            text:"Edit Project",
                            href:"",
                            onClick:() => {},
                            key:2
                        },
                        {
                            type:"link",
                            text:"Archive Project",
                            href:"",
                            onClick:() => {},
                            key:3
                        },
                    ]
                }
                rightElements={
                    [
                        {
                            type:"button",
                            text:"Create Project",
                            href:"",
                            onClick:() => {alert("Creating Project")},
                            key:5,
                        }
                    ]
                }
                />
            </div>
        )
    }
}