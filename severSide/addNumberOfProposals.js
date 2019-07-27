const firebase = require("../src/firebaseSetUp");


firebase.firestore().collection("projects").get()
.then(projects => {
    projects.forEach(doc => {
        let proposals = doc.data().applicants.length;
        firebase.firestore().collection("projects").doc(doc.id).update({
            proposals:proposals
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