import React from "react";
import firebase from "../../../../firebaseSetUp";

export default class ProposalItem extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            title:null,
            cover:null,
            active:null
        }
    }

    componentDidMount(){
        this._mounted = true;

        firebase.firestore().collection("projects").doc(this.props.projectID).get()
        .then(project => {
            let title = project.data().title
            firebase.firestore().collection("proposals").where("projectID","==",this.props.projectID).where("status","==","accepted").get()
            .then(snap => {
                if(!snap.empty){
                    snap.forEach(doc => {
                        if(doc.id === this.props.proposalID){
                            if(this._mounted){
                                this.setState({
                                    active:true,
                                })
                            }
                        }
                       
                    })
                }else {


                    if(this._mounted){
                        this.setState({
                            active:true,
                        })
                }
            }
            })
            .catch(e => {
                this.props.addToast("Ohoh something went wrong!");
            })
        })
        
    }

    componentWillUnmount(){
        this._mounted =false;
    }

    render(){
        return (
            <div className="card mt-3 proposal-item" style={{position:"relative"}} onClick={this.props.openProposal}>
                {this.state.active === true?<div className="job-status">
                    <div>Active</div>
                </div>:null}
                <div className="card-body mt-3" >
                   <h4 className="text-center">{this.props.title}</h4>
                   <p className="mt-3 text-center">{this.props.cover}</p>
                   <h5>{this.props.price + "$"}</h5>
                </div>

                <div className="hour-posted">{this.props.date}</div>
            </div>
        )
    }
}