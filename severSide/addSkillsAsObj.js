const firebase = require("../src/firebaseSetUp");



firebase.firestore().collection("projects").get()
.then((snap) => {
    snap.forEach(doc => {
        let arr = doc.data().skills;

        let skillsObj = {};
        for(let i =0; i<arr.length; i++){
            skillsObj[arr[i]] = true;
        }
        firebase.firestore().collection("projects").doc(doc.id).update({
            skillsExclusive:skillsObj
        })
        .then(() => {
            console.log("Succesfull");
        })
    })
})