import React from "react";
import "./footer.css";

export default function Footer(){
    return(
        <footer className="bg-gradient-1" id="contact" style={{paddingTop:"30px"}}>
            <div className="text-center">
                <button type="button" className="btn btn-custom-instagram m-2 p-3" ><i className="fa fa-instagram align-middle"></i></button>
                <button type="button" className="btn btn-custom-twitter m-2  p-3" ><i className="fa fa-twitter align-middle "></i></button>
            </div>
           
  <div className="container-fluid text-center text-md-left mt-4">

  
    <div className="row">

     
      <div className="col-md-6 mt-md-0 mt-3 px-5">

    
        <h3 style={{color:"rgb(255,255,255)"}}>StaffedApp Support Center</h3>
      

      </div>


      <hr className="clearfix w-100 d-md-none pb-3"></hr>

    
      <div className="col-md-3 mb-md-0 mb-3">

   
        <h5 className="text-uppercase" style={{color:"rgb(255,255,255)"}}>LEGAL</h5>

        <ul className="list-unstyled links-white ">
          <li className="mt-2">
            <a href="#!" className="links-white ">Terms & Conditions</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white ">Privacy Policy</a>
          </li>
      
        </ul>

      </div>
   

    
      <div className="col-md-3 mb-md-0 mb-3">

     
        <h5 className="text-uppercase" style={{color:"rgb(255,255,255)"}}>RESOURCES</h5>

        <ul className="list-unstyled links-white">
          <li className="mt-2">
            <a href="#!" className="links-white mt-2">About</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white mt-2">Profuct Info</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white mt-2">How To Use</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white mt-2">Contact</a>
          </li>
        </ul>

      </div>
    

    </div>


  </div>
  
  <div className="footer-copyright text-center bg-special py-3"><span className="links-white">© 2019 Copyright:</span>
    <span href="https://mdbootstrap.com/education/bootstrap/" className="links-white"> StaffedApp | All Rights Reserved</span>
  </div>


        </footer>
    )
}