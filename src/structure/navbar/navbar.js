import React from 'react';
import './navbar.css';
import logo from '../../logo.svg';
import NavItem from "./navItem";

export default class Navbar extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <nav className="navbar navbar-expand-md shadow-sm bg-white sticky-top">

  <a className="navbar-brand" href="#">
      <img src={logo}  style={{width:'40px'}}/>
      </a>


  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
    <span className="navbar-toggler-icon"></span>
  </button>


  <div className="collapse navbar-collapse" id="collapsibleNavbar">
  <ul className="navbar-nav mr-auto">
        {this.props.leftElements.map(element => {
          return <NavItem type={element.type} href={element.href} key={element.key} text={element.text} dataToggle={element.dataToggle} dataTarget={element.dataTarget} />
        })}
    </ul>

    <ul className="navbar-nav">
      {this.props.rightElements.map(element => {
        return <NavItem type={element.type} href={element.href} key={element.key} text={element.text} dataToggle={element.dataToggle} dataTarget={element.dataTarget} />
      })}
    </ul>
  </div> 
</nav>
        )
    }
}