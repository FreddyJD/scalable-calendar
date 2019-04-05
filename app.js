// Imports
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Start database
var firebase = require("firebase-admin");
var serviceAccount = require("./config/serviceAccountKey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://calendar-1946d.firebaseio.com"
});



// Directory
app.get('/', function (req, res) {
  res.send('hello world')
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))