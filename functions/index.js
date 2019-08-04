const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
var admin = require("firebase-admin");

var serviceAccount = require("./freelanceapp-78578-firebase-adminsdk-rzifn-e2e9c82390.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://freelanceapp-78578.firebaseio.com"
});


exports.onUserStatusChanged = functions.database
.ref("/status/{userId}")  //Reference to the firebase realtime database key
.onUpdate((change,context) => {
    const usersRef = admin.firestore().collection("users")
    
    return change.after.ref.once("value")
    .then(statusSnapshot =>{return statusSnapshot.val()})
    .then(async status => {
        //Check if the value is offline
        if(status === "offline"){
            try {
           await usersRef
                 .doc(context.params.userId)
                     .update({isOnline:false})
                     
            }catch(e){
                return console.error(e)
            }

        }else {
            await usersRef
            .doc(context.params.userId)
                     .update({isOnline:true})
        }
        return console.log("All setted");

    })
    .catch(e => {
       return console.error(e)
    })
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
