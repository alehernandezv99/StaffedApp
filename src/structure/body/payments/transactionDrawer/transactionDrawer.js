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
            size:0
        }
    }

    fetchTransactions = (page) => {
        this.setState({
            transactions:[],
            size:null
        })
        let body = {};

        let form_data = new URLSearchParams();
        body.uid = firebase.auth().currentUser.uid
        body.page = page
        Object.keys(body).forEach(key => {
            form_data.append(key, body[key])
        })
        fetch("https://staffed-app.herokuapp.com/getTransactions", {
            method:"POST",
            body:form_data,
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
             }
            })
        .then(response => {
            return response.json()
        }).then(result => {

            console.log(result)
            this.setState({
                transactions:result.transactions,
                size:result.size
            })
         })
         .catch(e => {
             this.setState({
                 transactions:[],
                 size:0
             })
         })
        }

    componentDidMount(){
       this.fetchTransactions(0)
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
                    {this.state.transactions.length === 0?null:<ul className="pagination text-center mt-2">
                             <li className="page-item ml-auto"><a className="page-link" href="#">Previous</a></li>
                             {
                                 (() => {
                                     let pages = [];
                                     for(let i = 0 ; i<  Math.ceil(this.state.size/8); i++){
                                         pages.push("element")
                                     }
                                     return pages
                                 })().map((data, i) => {
                                     return ( <li key={i} className="page-item"><a className="page-link" onClick={() => {this.fetchTransactions(i)}} href="#">{i}</a></li>)
                                 })                                                                  }
                             <li className="page-item mr-auto"><a className="page-link" href="#">Next</a></li>
                           </ul>}
                   </div>
                </div>
            </Drawer>
        )
    }
}