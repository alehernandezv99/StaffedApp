const firebase = require("../src/firebaseSetUp");
const KeywordsGeneration = require("../src/utils/keywordsGeneration");

firebase.firestore().collection("CVs").get()
.then(snap => {
    snap.forEach(doc => {
        firebase.firestore().collection("CVs").doc(doc.id).update({
            keywords:KeywordsGeneration.generateKeywords(doc.data().uemail).concat(KeywordsGeneration.generateKeywords(doc.data().description.length > 0?doc.data().description[0].title:"")).concat("")
        })
        .then(() => {
            console.log("Success");
        })
        .catch(e => {
            console.log(e.message);
        })
    })
})
.catch(e => {
    console.log(e.message);
})