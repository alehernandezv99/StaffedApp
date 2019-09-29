import React from "react";
import "./dailyReport.css";
import firebase from "../../../../firebaseSetUp";
import checkCriteria from "../../../../utils/checkCriteria";
import LoadingSpinner from "../../../loading/loadingSpinner";
import TextCollapse from "../../profile/textCollapse";
import $ from "jquery";

import { Button, Position, Toast, Toaster, Classes, Slider, Drawer, Divider ,Alert, Intent} from "@blueprintjs/core";

export default class DailyReport extends React.Component {
    constructor(props){
        super(props);
        
        this.state ={
            inputState:false,
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

        this.fetchReports(false)
       
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

                if(this.state.report.trim().length > 0){

               

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
                   if(new Date().getMonth() !== lastDate.toDate().getMonth()){
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
             }else {
                this.toggleLoading();
                this.props.addToast("Cannot send an empty report");
             }

            }else {
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
            }
         })
       
    }

    toggleInputPanel = (state) => {
        if(state === true){
            $("#report-input").show();
            if(this._mounted){
                this.setState({
                    inputState:true
                })
            }
        }else {
            $("#report-input").hide()
            if(this._mounted){
                this.setState({
                    inputState:false
                })
            }
        }
    }

    render(){
        return(
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
            <div className={Classes.DRAWER_BODY}>
            <div className={`${Classes.DIALOG_BODY}`}>
                 <div className="form-group text-center">
                    { this.state.inputState === false?<button className="btn btn-custom-1 " onClick={(e) => {this.toggleInputPanel(true);}}><i className="material-icons align-middle">add</i>Add Report</button>:null}
                 </div>
                 <div className="form-group text-center" id="report-input" style={{display:"none"}}>
                     <label>Report</label>
                     <textarea  className="form-control" value={this.state.report} onChange={(e) => {
                         e.persist();

                         if(this._mounted){
                             this.setState({
                                 report:e.target.value
                             })
                         }
                     }}></textarea>
                     <button className="btn btn-custom-1 m-3" onClick={() => {this.submitReport();}}>Submit</button> 
                     <button className="btn btn-danger m-3" onClick={() => {this.toggleInputPanel(false)}}>Cancel</button>
                 </div>
                 <div className="container">
                     {this.state.pending === true?<div className="spinner-border"></div>:this.state.reports !== null?this.state.reports.length > 0?this.state.reports.map((e,i) => {
                         return <div className="card mt-2" key={i} style={{position:"relative"}}>
                             <div className="hour-posted">{e.created.toDate().getHours() + " : " + e.created.toDate().getMinutes() + " " + e.created.toDate().toDateString()}</div>
                             <div className="card-body mt-3">
                                 <TextCollapse  text={e.report} maxWidth={150} />
                                </div>
                             </div>
                     }):<div className="m-3">No reports</div>:<div className="spinner-border"></div>}
                     {this.state.loadMore === true? <div className="m-3 text-center"><a href="" onClick={(e) => {e.preventDefault(); this.fetchReports(true)}}>Load more</a> </div>:null}
                 </div>
            </div>
            </div>
            </Drawer>
        )
    }
}