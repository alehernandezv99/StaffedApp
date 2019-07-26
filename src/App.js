import React from 'react';
import './App.css';
import Navbar from './structure/navbar';
// import LandingPage from "./structure/body/landingPage";
 import Footer from "./structure/footer";
// import Home from "./structure/body/home";
//import MyProjects from "./structure/body/myProjects";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import {lazy,Suspense} from "react";
import firebase from "./firebaseSetUp";
import LoadingSpinner from "./structure/loading/loadingSpinner";
import $ from "jquery";


const LandingPage = lazy(() => import("./structure/body/landingPage"))
const Home = lazy(() => import("./structure/body/home"));
const MyProjects = lazy(() => import("./structure/body/myProjects"));
const Profile = lazy(() => import("./structure/body/profile"));
const SearchStaff = lazy(() => import("./structure/body/searchStaff"));

class App extends React.Component {
  constructor(props){
    super(props);
    this.handleStates = this.handleStates.bind(this);

    this.state = {
      currentPage:[true,false,false,false,false]
    }
  }

  handleStates(index, data){

    this.setState(state => {
      let currentPage = state.currentPage;
      for(let i = 0; i < currentPage.length; i++){
        currentPage[i] = false
      }
      if(!data){
      currentPage[index] = true;
      }else {
        currentPage[index] = {
          state:true,
          data:data
        }
      }
      return {
        currentPage:currentPage
      }
    })
  }

  componentDidMount(){
   
  }


  render(){
  /*return (
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
  );*/

  return (
    <div className="App">
      <Suspense fallback={<LoadingSpinner />}>
        {this.state.currentPage[0] === true?<LandingPage handleStates={this.handleStates}/>:null}
        {this.state.currentPage[1] === true?<Home handleStates={this.handleStates} />:null}
        {this.state.currentPage[2] === true?<MyProjects handleStates={this.handleStates} />:null}
        {(this.state.currentPage[3].data?this.state.currentPage[3].state:this.state.currentPage[3]) === true?<Profile handleStates={this.handleStates} userId={this.state.currentPage[3].data}/>:null}
        {this.state.currentPage[4] === true?<SearchStaff handleStates={this.handleStates}/>:null}
      </Suspense>
      <Footer />
    </div>
  )
  }
}

export default App;
