import React from 'react';
import './navbar.css';
import logo from '../../logo.svg';

export default class Navbar extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <nav className="navbar navbar-expand-md box-shadow">

  <a className="navbar-brand" href="#">
      <img src={logo}  style={{width:'40px'}}/>
      </a>


  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
    <span className="navbar-toggler-icon"></span>
  </button>


  <div className="collapse navbar-collapse" id="collapsibleNavbar">
  <ul className="navbar-nav mr-auto">
        <li className="nav-item mr-sm-2">
            <a className="nav-link color-0A9FF2" href="#">About</a>
        </li>
        <li className="nav-item mr-sm-2">
            <a className="nav-link color-0A9FF2" href="#">Product Info</a>
        </li>
        <li className="nav-item mr-sm-2">
            <a className="nav-link color-0A9FF2" href="#">How To Use</a>
        </li>
        <li className="nav-item mr-sm-2">
            <a className="nav-link color-0A9FF2" href="#">Contact</a>
        </li>
    </ul>

    <ul className="navbar-nav">
      <li className="nav-item mr-sm-2">
        <a className="btn btn-0A9FF2" href="#">Login</a>
      </li>
      <li className="nav-item">
        <a className="btn btn-0A9FF2" href="#">Sign Up</a>
      </li> 
    </ul>
  </div> 
</nav>
        )
    }
}