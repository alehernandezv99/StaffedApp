import React from 'react';
import './App.css';
import Navbar from './structure/navbar';
import LandingPage from "./structure/body/landingPage";

class App extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
  return (
    <div className="App">
      <Navbar />
      <LandingPage />
    </div>
  );
  }
}

export default App;
