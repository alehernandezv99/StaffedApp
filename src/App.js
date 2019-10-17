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
import HomeLoading from "./structure/loading/homeLoading";
import $ from "jquery";


const LandingPage = lazy(() => import("./structure/body/landingPage"))
const Home = lazy(() => import("./structure/body/home"));
const MyProjects = lazy(() => import("./structure/body/myProjects"));
const Profile = lazy(() => import("./structure/body/profile"));
const SearchStaff = lazy(() => import("./structure/body/searchStaff"));
const Payments = lazy(() => import("./structure/body/payments"));

class App extends React.Component {
  constructor(props){
    super(props);
    this.handleStates = this.handleStates.bind(this);

    this.state = {
      currentPage:[true,false,false,false,false,false],
      lastID:""
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
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
       
        this.uid = user.uid
        const firestoreDb = firebase.firestore();
        const oldRealTimeDb = firebase.database();
        const usersRef = firestoreDb.collection('users'); // Get a reference to the Users collection;
            const onlineRef = oldRealTimeDb.ref('.info/connected');
        oldRealTimeDb.ref(`/status/${this.uid}`).set("online")
        .then(() => {
          firestoreDb.collection("users").doc(this.uid).update({isOnline:true})
        });

        this.counter = 0
        onlineRef.on('value', snapshot => {
          this.counter++;
          console.log(`the state is `,snapshot.val())
  
          oldRealTimeDb
             .ref(`/status/${this.uid}`)
               .onDisconnect() // Set up the disconnect hook
                   .set('offline') // The value to be set for this key when the client disconnects
                .then(() => {
   // Set the Firestore User's online status to true
   

          });
        

});
        // ...
      } else {
        // User is signed out.
  
        if(this.uid){
          if(this.uid !== undefined){

           const firestoreDb = firebase.firestore();
           const oldRealTimeDb = firebase.database();

            const usersRef = firestoreDb.collection('users'); // Get a reference to the Users collection;
            const onlineRef = oldRealTimeDb.ref('.info/connected'); // Get a reference to the list of connections

            onlineRef.on('value', snapshot => {
            oldRealTimeDb
               .ref(`/status/${this.uid}`)
                 .onDisconnect() // Set up the disconnect hook
                     .set('offline') // The value to be set for this key when the client disconnects
                  .then(() => {
     // Set the Firestore User's online status to true
     
                   usersRef
                     .doc(this.uid)
                          .set({
                            isOnline: false,
                         }, { merge: true});  

     // Let's also create a key in our real-time database
     // The value is set to 'online'
                //   oldRealTimeDb.ref(`/status/${this.uid}`).set("online");
            });

});
}
         }

        // ...
      }
    });
  }

  passLastID= (id) => {
    this.setState({
      lastID:id
    })
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
      <Suspense fallback={<HomeLoading />}>
        {this.state.currentPage[0] === true?<LandingPage lastID={this.state.lastID} handleStates={this.handleStates}/>:null}
        {this.state.currentPage[1] === true?<Home passLastID={this.passLastID} handleStates={this.handleStates} />:null}
        {this.state.currentPage[2] === true?<MyProjects handleStates={this.handleStates} />:null}
        {(this.state.currentPage[3].data?this.state.currentPage[3].state:this.state.currentPage[3]) === true?<Profile handleStates={this.handleStates} userId={this.state.currentPage[3].data}/>:null}
        {this.state.currentPage[4] === true?<SearchStaff handleStates={this.handleStates}/>:null}
        {this.state.currentPage[5] === true?<Payments handleStates={this.handleStates} />:null}
      </Suspense>
      <Footer />
    </div>
  )
  }
}

export default App;
