var firebase = require("firebase/app");

require("firebase/auth");
require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyD4dOYeRwkWXp7-qewqySqI3-rBMz8H3vI",
    authDomain: "freelanceapp-78578.firebaseapp.com",
    databaseURL: "https://freelanceapp-78578.firebaseio.com",
    projectId: "freelanceapp-78578",
    storageBucket: "",
    messagingSenderId: "793283518961",
    appId: "1:793283518961:web:4e4122c20b60d85a"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;