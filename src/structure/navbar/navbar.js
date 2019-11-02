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
            <nav className={"navbar navbar-expand-md shadow-sm bg-white sticky-top " + this.props.className }>

  <a className="navbar-brand" href={this.props.logo.href} onClick={(e) => {e.preventDefault();}}>
      <img src={this.props.logo.img}  style={{width:'20px'}}/>
      </a>


  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
    <i className="material-icons align-middle" style={{fontSize:"30px"}}>menu</i>
  </button>


  <div className="collapse navbar-collapse" id="collapsibleNavbar">
  <ul className="navbar-nav mr-auto">
        {this.props.leftElements.map((element,i) => {
          return <NavItem type={element.type} count={element.count} state={element.state} icon={element.icon} onClick={element.onClick} href={element.href} key={element.key} text={element.text} dataToggle={element.dataToggle} dataTarget={element.dataTarget} dropdownItems={element.dropdownItems} />
        })}
    </ul>

    <ul className="navbar-nav">
      {this.props.rightElements.map((element, i) => {
        return <NavItem type={element.type} count={element.count} state={element.state} icon={element.icon} href={element.href} onClick={element.onClick} key={element.key} text={element.text} dataToggle={element.dataToggle} dataTarget={element.dataTarget} dropdownItems={element.dropdownItems}/>
      })}
    </ul>
  </div> 
</nav>
        )
    }
}