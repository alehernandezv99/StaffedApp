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

     
      <div className="col-md-6 mt-md-0 mt-3">

    
        <h5 className="text-uppercase">Thanks For Coming</h5>
        <p>Contact Us If You Have Any Doubts.</p>

      </div>


      <hr className="clearfix w-100 d-md-none pb-3"></hr>

    
      <div className="col-md-3 mb-md-0 mb-3">

   
        <h5 className="text-uppercase">Links</h5>

        <ul className="list-unstyled links-white ">
          <li className="mt-2">
            <a href="#!" className="links-white ">Link 1</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white ">Link 2</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white ">Link 3</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white ">Link 4</a>
          </li>
        </ul>

      </div>
   

    
      <div className="col-md-3 mb-md-0 mb-3">

     
        <h5 className="text-uppercase">Links</h5>

        <ul className="list-unstyled links-white">
          <li className="mt-2">
            <a href="#!" className="links-white mt-2">Link 1</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white mt-2">Link 2</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white mt-2">Link 3</a>
          </li>
          <li className="mt-2">
            <a href="#!" className="links-white mt-2">Link 4</a>
          </li>
        </ul>

      </div>
    

    </div>


  </div>
  
  <div className="footer-copyright text-center bg-special py-3">© 2019 Copyright:
    <a href="https://mdbootstrap.com/education/bootstrap/" className="links-white"> Alejandro Hernandez | Esteban Hernandez</a>
  </div>


        </footer>
    )
}