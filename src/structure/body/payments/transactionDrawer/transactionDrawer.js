import React from "react";
import "./transactionsDrawer.css";
import { Button, Position, Classes, Slider, Drawer, DateInput} from "@blueprintjs/core";
import firebase from "../../../../firebaseSetUp";
import TransactionRow from "../transactionRow";

export default class TransactionDrawer extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            transactions:[],
            size:0,
            loadMore:false,
            lastSeem:{},
            pending:false
        }
    }

    fetchTransactions = (page) => {
        this.setState({
            pending:true
        })
         let ref =firebase.firestore().collection("transactions").where("freelancer","==",firebase.auth().currentUser.uid).orderBy("created", "desc")

         if(page === true ){
             ref = ref.limit(10).startAfter(this.state.lastSeem)
         }else {
             ref = ref.limit(10)
         }
         ref.get()
        .then(snapshot => {
            let arr = [];

            snapshot.forEach(doc => {
                arr.push(doc.data());
            })
            if(!snapshot.empty){
                if(this._mounted){
                    this.setState(state => ({
                        transactions:this.state.transactions.concat(arr),
                        size:snapshot.size,
                        loadMore: snapshot.size < 10?false:true,
                        pending:false   ,
                        lastSeem:snapshot.docs[snapshot.docs.length - 1]
                    }))
                }
            }else {
                if(this._mounted){
                    this.setState({
                        transactions:[],
                        size:0,
                        loadMore:false,
                        pending:false
                    })
                }
            }
        })
        .catch(e => {
            if(this._mounted){
                this.setState({
                    transactions:[],
                    size:0,
                    pending:false,
                    loadMore:false
                })
            }
        })
        }

    componentDidMount(){
        this._mounted = true
       this.fetchTransactions(0)
    }

    componentWillUnmount() {
        this._mounted = false
    }

    render(){
        return(
            <Drawer portalContainer={document.getElementById("portalContainer")} hasBackdrop={true} style={{zIndex:999}} onClose={this.props.handleClose} title={""} size={"50%"} isOpen={this.props.isOpen}>
                 <div className={Classes.DRAWER_BODY}>
                   <div className={`${Classes.DIALOG_BODY}`}>
                       <table className="table table-striped text-center">
                         <thead>
                             <tr>
                                 <th>Date</th>
                                 <th>Description</th>
                                 <th>Ammount</th>
                             </tr>
                         </thead>
                         <tbody>
                       {this.state.transactions.length> 0?this.state.transactions.map((e,i) => {

                         let type = e.batch_header?"withdraw":"payment";
                         let freelancer = type === "payment"?e.freelancer:e.freelancer;
                         let client = type === "payment"?e.client:null;
                         let projectID = type === "payment"?e.projectID:null;
                         let price = type === "payment"?e.transactions[0].amount.total:0;              
                         let date;
                            
                         try {
                         date = e.created.toDate().toDateString();
                         
                         }catch(error){
                         
                             date = firebase.firestore.Timestamp.fromMillis((e.created.seconds !== undefined ?e.created.seconds:e.created._seconds)*1000).toDate().toDateString()
                         }
                      return (
                          <TransactionRow key={i} date={date} price={price} type={type} freelancer={freelancer} client={client} projectID={projectID} />
                        )
                       }):this.state.size !== null?<tr><td colSpan={3}>No Transactions</td></tr>:<div className="spinner-border"></div>}
                       </tbody>
                    </table>
                    {this.state.transactions.length === 0?null:this.state.loadMore?<div className="text-center mt-3">{this.state.pending === false?<a href="" onClick={(e) => {
                               e.preventDefault();
                             
                              this.fetchTransactions(true)
                               
                            }}>Load More</a>:<div className="spinner-border"></div>} </div>:null}
                   </div>
                </div>
            </Drawer>
        )
    }
}