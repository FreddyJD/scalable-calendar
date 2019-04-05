const express = require("express");
const exphbs = require("express-handlebars");
const firebase = require("firebase-admin");
const path = require("path");
const app = express();
const hbs = exphbs.create();

var serviceAccount = require("./config/serviceAccountKey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://calendar-1946d.firebaseio.com"
});

app.use(express.static(path.join(__dirname, "/public")));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.use(function (req, res, next) {
    hbs.handlebars.registerHelper('json', function (obj) {
        obj = [{
            title: 'Freddy J.',
            url: 'https://www.linkedin.com/in/freddyjd/',
            start: '2019-04-28'
        }];
        return new hbs.handlebars.SafeString(JSON.stringify(obj))
    });
    next();
});

app.get("/", function(req, res) {
  res.render("calendar", {
    layout: false,
  });
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}!`));
