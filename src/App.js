import React from 'react';
import './App.css';
import Navbar from './structure/navbar';
import LandingPage from "./structure/body/landingPage";
import Footer from "./structure/footer";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const About = () => {
  return (<h1 className="text-center">About</h1>)
}

class App extends React.Component {
  constructor(props){
    super(props);
  }


  render(){
  return (
    <div className="App">
      <Navbar />
        <Router>
         <Switch> 
          <Route path="/" exact render={() => { return <LandingPage />}} />
        </Switch>
      </Router>
      <Footer/>
    </div>
  );
  }
}

export default App;
