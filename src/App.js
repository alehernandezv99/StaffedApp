import React from 'react';
import './App.css';
import Navbar from './structure/navbar';
import LandingPage from "./structure/body/landingPage";
import Footer from "./structure/footer";
import Home from "./structure/body/home";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import firebase from "./firebaseSetUp";

class Welcome extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      user:null
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
      <h1 className="text-center">Welcome {this.state.user === null?<div className="spinner-border"></div>:this.state.user}</h1>
      <button type="button" className="btn btn-custom-1 btn-block" onClick={()=> {firebase.auth().signOut()}}>Logout</button>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
  }


  render(){
  return (
    <div className="App">
        <Router>
         <Switch> 
          <Route path="/" exact render={() => { return <LandingPage />}} />
          <Route path="/home" render={() => {return <Home />}}/>
        </Switch>
      </Router>
      <Footer/>
    </div>
  );
  }
}

export default App;
