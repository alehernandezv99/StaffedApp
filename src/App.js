import React from 'react';
import './App.css';
import Navbar from './structure/navbar';
import LandingPage from "./structure/body/landingPage";
import Footer from "./structure/footer";
import Home from "./structure/body/home";
import MyProjects from "./structure/body/myProjects";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import firebase from "./firebaseSetUp";


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
          <Route path="/myprojects" render={() => { return <MyProjects />}} />
        </Switch>
      </Router>
      <Footer/>
    </div>
  );
  }
}

export default App;
