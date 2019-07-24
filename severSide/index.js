const express = require('express')
const app = express()
const algoliasearch = require('algoliasearch/lite');
const client = algoliasearch('D6DXHGALTD', 'fad277b448e0555dfe348a06cc6cc875');
const index = client.initIndex('your_index_name');
 
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get("/test", (req, res) => {
    res.status(200).json({size:2});
})
 
app.listen(4000);
console.log("App listen at port 4000");