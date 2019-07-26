const firebase = require("../src/firebaseSetUp");
const KeywordGeneration = require("../src/utils/keywordsGeneration");

firebase.firestore().collection("projects").get()
.then(snap => {
    snap.forEach(doc => {
        firebase.firestore().collection("projects").doc(doc.id).update({
            title:(doc.data().title.toLowerCase()),
            keywords:(KeywordGeneration.generateKeywords(doc.data().title.toLowerCase()))
        })
        .then(() => {
            console.log("Ready")
        })
        .catch(e => {
            console.log(e.message);
        })
    })
})
.catch(e => {
    console.log(e.message);
})