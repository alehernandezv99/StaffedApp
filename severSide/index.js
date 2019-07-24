const express = require('express')
const app = express()
const algoliasearch = require('algoliasearch');
const client = algoliasearch('D6DXHGALTD', 'fad277b448e0555dfe348a06cc6cc875');
const index = client.initIndex('CVs');
var admin = require("firebase-admin");

var serviceAccount = require("../functions/freelanceapp-78578-firebase-adminsdk-rzifn-e2e9c82390.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freelanceapp-78578.firebaseio.com"
});


let records = []

admin.firestore().collection("CVs").get().then(async(projects) => {
  projects.forEach(doc => {
    let obj = doc.data()
    obj.objectID = doc.id;
    records.push(obj)
  })

  await index.saveObjects(records);
  console.log("Everything pushed to algolia");
})
 
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get("/test", (req, res) => {
    res.status(200).json({size:2});
})
 
app.listen(4000);
console.log("App listen at port 4000");