const axios = require("axios");

axios.get("https://api.sandbox.paypal.com/v1/payments/sale/4YR0900051687914A",{headers:{
    "Content-Type":"application/json",
    "Authorization":"Bearer  A21AAG5_NTDt1Y--BzwYgRCyUbkLELhAry_rsa-w8qsMiCkwdjivH4sdsu96FPpceMlWa8EH0iSCwenyNgKfJg0zVsfOJQ2sQ"
}})
.then(res => {
    console.log(res.data);
})
