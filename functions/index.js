const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
var admin = require("firebase-admin");

var serviceAccount = require("./freelanceapp-78578-firebase-adminsdk-rzifn-e2e9c82390.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freelanceapp-78578.firebaseio.com"
});


exports.calculateSize = functions.https.onRequest(async(req, res) => {

    try {
        let data = req.query;
    
        console.log(data);
        let ref = admin.firestore().collection(data["collection"]);
    
        ref = ref.where(data["array"],"array-contains",data["value"])
        ref= ref.orderBy("created","desc");
    
        let result = await ref.get()
    
        let size = result.size;
    
       return res.status(200).send(size);
    }catch(e) {
        return console.log(e.message);
    }
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
