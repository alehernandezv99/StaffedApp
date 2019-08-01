const axios = require("axios");
var paypal = require('paypal-rest-sdk');
const qs = require("querystring");


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVTUrNQsFoxsTJwhbxJYvSiKjEUtsp5VLZ-9sHilh77Tm-SSd__p6LqK5MVm6gGIpONgr0HCXih9BPc0',
    'client_secret': 'EKBWwE-DTtYldtlIfwOHSFzZkYEpB3VwWWnrX3rERSQaEw9fBHBtnbnHDhjpQgPiWv99nkZ9b2gEMCb3'
  });

  
