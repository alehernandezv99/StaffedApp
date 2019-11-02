import React from "react";
import "./contractDrawer.css";
import ContractItem from "./contractItem";
import firebase from "../../../firebaseSetUp";

import {Classes, Drawer,} from "@blueprintjs/core";

export default class ContractDrawer extends React.Component { 
    constructor(props){
        super(props)

        this.state = {
            contracts:[],
            loadMore:false,
            size:0,
            lastSeem:{}
        }
    }

    componentWillUnmount(){
        this._mounted = false
    }

    fetchContracts = (page) => {

        if(this._mounted){
            this.setState({
                contracts:[],
                size:null,
                pending:true
            })
        }
       let ref = firebase.firestore().collection("contracts").where("involved","array-contains",firebase.auth().currentUser.uid).orderBy("created","desc")

       if(page === true){
           ref = ref.limit(5).startAfter(this.state.lastSeem)
       }else {
           ref = ref.limit(5)
       }
      
       ref.get()
       .then(snap => {
        
           console.log("The snap is ", snap.empty)
        if(!snap.empty){
           let arr = [];

           snap.forEach(doc => {
               arr.push(doc.data())
           })

           if(this._mounted){
               this.setState(state => ({
                   contracts:state.contracts.concat(arr),
                   size:snap.size,
                   loadMore:snap.size < 5 ?false:true,
                   lastSeem:snap.docs[snap.docs.length - 1],
                   pending:false
               }))
           }
        }else {
            if(this._mounted){
                this.setState({
                    contracts:[],
                    size:0,
                    loadMore:0,
                    size:0
                })
            }
        }
       })
       .catch(e => {
           console.error(e)
           if(this._mounted){
               this.setState({
                   pending:false,
                   loadMore:false,
                   contracts:[]
               })
           }
       })
        
    }

    componentDidMount(){
        this._mounted = true
        this.fetchContracts(false)
    }


    render() {
        return (
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={window.innerWidth <= 700?"100%":"50%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                   <div className={`${Classes.DIALOG_BODY}`}>
                       {this.state.contracts.length > 0? this.state.contracts.map((e,i) => {
                           return (
                               <ContractItem openUser={this.props.openUser} key={i} client={e.client} freelancer={e.freelancer} title={e.title} description={e.description} price={e.price} handleStates={this.props.handleStates} onClick={() => {this.props.openContract("view contract", e.projectID)}} addToast={this.props.addToast} />
                           )
                       }):this.state.size !== null?<div className="m-2">No contracts</div>:<div className="spinner-border"></div>}
                   </div>
                   </div>
            </Drawer>
        )
    }
}