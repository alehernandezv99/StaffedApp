const functions = require('firebase-functions');

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


exports.calculateSize = functions.https.onRequest(async(req,res) => {

    let data = req.params;
    let ref = admin.firestore().collection(data["collection"]);

    ref = ref.where(data["array"],"array-contains",data["value"])
    ref= ref.orderBy("created","desc");

    let result = await ref.get()

    let size = result.size;

   return res.send({
        size:size
    })
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
