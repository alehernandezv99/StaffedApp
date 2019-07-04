import React from 'react';
import './App.css';
import Navbar from './structure/navbar';
import LandingPage from "./structure/body/landingPage";
import Footer from "./structure/footer";

class App extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
  return (
    <div className="App">
      <Navbar />
      <LandingPage />
      <Footer />
    </div>
  );
  }
}

export default App;
