import React from "react";
import "./dailyReport.css";
import firebase from "../../../../firebaseSetUp";
import checkCriteria from "../../../../utils/checkCriteria";
import LoadingSpinner from "../../../loading/loadingSpinner";
import $ from "jquery";

import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider ,Alert, Intent} from "@blueprintjs/core";

export default class DailyReport extends React.Component {
    constructor(props){
        super(props);
        
        this.state ={
            report:"",
            reports:null,
            loadMore:false,
            pending:false,
            lastSeem:{},
            isLoading:false
        }
    }

    fetchReports = (page) => {
      let ref =  firebase.firestore().collection("contracts").doc(this.props.id).collection("reports").orderBy("created","desc")
      if(page === true ){
          ref = ref.startAfter(this.state.lastSeem).limit(10)
      }else {
          ref =ref.limit(10)
      }

      ref.get()
      .then(snap => {

        if(!snap.empty){
          let reports = []
          snap.forEach(doc => {
              reports.push(doc.data())
          })

          if(page === true){
              if(this._mounted){
                  this.setState({
                      reports:this.state.reports.concat(reports),
                      pending:false,
                      loadMore:snap.size < 10?false:true,
                      lastSeem:snap.docs[snap.docs.length - 1]
                  })
              }
          }else {
              if(this._mounted){
                  this.setState({
                      reports:reports,
                      pending:false,
                      loadMore:snap.size < 10?false:true,
                      lastSeem:snap.docs[snap.docs.length - 1]
                  })
              }
          }
        }else {
            if(this._mounted){
            this.setState({
                reports:this.state.reports === null?[]:this.state.reports,
                pending:false,
                loadMore:false
            })
        }
        }

    
      })
    }

    componentWillUnmount(){
        this._mounted = false
    }

    componentDidMount(){
        this._mounted = true
       
    }

    toggleLoading =() => {
        if(this._mounted){
            this.setState(state => ({
                isLoading:!state.isLoading
            }))
        }
    }

    submitReport =() => {
        this.toggleLoading();
         firebase.firestore().collection("contracts").doc(this.props.id).collection("reports").orderBy("created","desc").limit(1).get()
         .then(snap => {
             if(!snap.empty){
                 let lastDate ="";
                snap.forEach(doc => {
                    lastDate = doc.data().created
                })

                if(this.state.report !== ""){

               

                if((new Date().getDate() !== lastDate.toDate().getDate())){
                    firebase.firestore().collection("contracts").doc(this.props.id).collection("reports").add({
                        created:firebase.firestore.Timestamp.now(),
                        report:this.state.report
                    })
                    .then(() => {
                        this.props.addToast("Report Submitted");
                        this.toggleLoading();
                        this.fetchReports(false);
                    })
                    .catch(e => {
                        this.props.addToast("Ohoh something went wrong!")
                        this.toggleLoading();
                    })
                }else {
                   if(new Date().getMonth() === lastDate.toDate().getMonth()){
                    firebase.firestore().collection("contracts").doc(this.props.id).collection("reports").add({
                        created:firebase.firestore.Timestamp.now(),
                        report:this.state.report
                    })
                    .then(() => {
                        this.props.addToast("Report Submitted");
                        this.toggleLoading();
                        this.fetchReports(false);
                    })
                    .catch(e => {
                        this.props.addToast("Ohoh something went wrong!")
                        this.toggleLoading();
                    })

                   } else {
                       if(new Date().getFullYear() !== lastDate.toDate().getFullYear()){
                        firebase.firestore().collection("contracts").doc(this.props.id).collection("reports").add({
                            created:firebase.firestore.Timestamp.now(),
                            report:this.state.report
                        })
                        .then(() => {
                            this.props.addToast("Report Submitted");
                            this.toggleLoading();
                            this.fetchReports(false);
                        })
                        .catch(e => {
                            this.props.addToast("Ohoh something went wrong!")
                            this.toggleLoading();
                        })
                       }else {
                        this.toggleLoading();
                        this.props.addToast("You can only submit one report per day")
                    }
                   }
                }
             }

            }else {
                this.toggleLoading();
                this.props.addToast("Cannot send an empty report");
            }
         })
       
    }

    render(){
        return(
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
            <div className={`${Classes.DIALOG_BODY}`}>
                 <div className="form-group">
                     <button className="btn btn-custom-1 "><i className="material-icons align-middle">add</i>Add Report</button>
                 </div>
                 <div className="form-group text-center">
                     <label>Report</label>
                     <textarea id="report-input" className="form-control" value={this.state.report} onChange={(e) => {
                         e.persist();

                         if(this._mounted){
                             this.setState({
                                 report:e.target.value
                             })
                         }
                     }}></textarea>
                     <button className="btn btn-custom-1" onClick={() => {this.submitReport();}}>Submit</button>
                 </div>
                 <div className="container">

                 </div>
            </div>
            </div>
            </Drawer>
        )
    }
}