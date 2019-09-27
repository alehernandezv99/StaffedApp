import React from "react";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import ProposalsItem from "./proposalItem";
import firebase from "../../../firebaseSetUp";

export default class ProposalsList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            proposals:null,
            lastSeem:{},
            loadMore:true,
            pending:false
        }
    }

    fetchProposals = (page) => {
        if(this._mounted){
            this.setState({
                pending:true
            })
        }

       let ref = firebase.firestore().collection("proposals").where("user","==",firebase.auth().currentUser.uid).orderBy("updated","desc")

       if(page === true){
           ref= ref.startAfter(this.state.lastSeem).limit(6)
       }else {
        
           ref = ref.limit(6)
       }

       ref.get().then(snap => {
           if(!snap.empty){

            let proposals = []
               snap.forEach(doc => {
                   proposals.push(doc.data())
            })

            if(page === true){
                if(this._mounted){
                    this.setState(state => ({
                        proposals:state.proposals.concat(proposals),
                        lastSeem:snap.docs[snap.docs.length - 1],
                        pending:false,
                        loadMore:snap.size < 6?false:true,
                        size:snap.size
                    }))
                }
            }else {
                if(this._mounted){
                    this.setState(state => ({
                        proposals:proposals,
                        lastSeem:snap.docs[snap.docs.length - 1],
                        pending:false,
                        loadMore:snap.size < 6?false:true,
                        size:snap.size
                    }))
                }
            }
           }else {
               if(this.state.proposals === null){
            if(this._mounted){
                this.setState(state => ({
                    proposals:[],
                    pending:false,
                    loadMore:false
                }))
            }
        }else {
            if(this._mounted){
                this.setState(state => ({
                    pending:false,
                    loadMore:false
                }))
            }
        }
           }
       })
    }

    componentDidMount(){
        this._mounted =true;

        this.fetchProposals(false)
        
    }

    componentWillUnmount(){
        this._mounted =false
    }

    render(){
        return (
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                 <div className={`${Classes.DIALOG_BODY}`}>
                     {this.state.proposals === null?<div className="spinner-border mt-3"></div>:this.state.proposals.length > 0?this.state.proposals.map((e,i) => {

                         let date = e.created.toDate();
                         date = date.getHours() + " : " + date.getMinutes() + " " + date.toDateString() 
                         return(
                         <ProposalsItem price={e.price} key={i} date={date} projectID={e.projectID} proposalID={e.id} title={e.title} cover={e.presentation} openProposal={() => {this.props.openProposal(e.projectID,e.id)}} addToast={this.props.addToast} />
                         )
                     }):<div className="mt-3">No proposals</div>}

                    {this.state.proposals !== null? this.state.proposals.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={(e) => {e.preventDefault();
                               this.fetchProposals(true)
                               
                            }} >Load More</a>:<div className="spinner-border"></div>} </div>:null:null}
                 </div>
                 </div>
            </Drawer>
        )
    }
}