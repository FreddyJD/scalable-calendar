// Packages import
const express = require("express");
const exphbs = require("express-handlebars");
const firebase = require("firebase-admin");
const path = require("path");
const cors = require("cors");
const app = express();
const hbs = exphbs.create();
const bodyParser = require("body-parser");

// Connection to Firebase admin database
var serviceAccount = require("./config/serviceAccountKey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://calendar-1946d.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("schools");

// Middleware | CORS
app.use(cors());

// Middleware | Handlebar
app.use(express.static(path.join(__dirname, "/public")));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Middleware | Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("home", { layout: false });
});

app.post("/api/add", (req, res) => {
  console.log(req.body.data);

  let school = req.body.school.toLowerCase();
  school = school.split(" ").join("-");

  ref.child(school).set({
    Professors: JSON.parse(req.body.data)
  });

  res.end("yes");
});

app.get("/api/school/:school", (req, res) => {
  const school = req.params.school;
  const arr = [];

  db.ref(`schools/${school}`).on("value", snapshot => {
    const data = snapshot.val();
    res.json(data.Professors);
  });
});

app.get("/api/all", (req, res) => {
  ref.once("value", function(snapshot) {
    res.json(snapshot);
  });
});

// Calendar route
app.get(
  "/calendar/:school",
  async (req, res, next) => {
    // Connect to the database
    await db.ref(`schools/${req.params.school}`).on("value", snapshot => {
        const data = snapshot.val();

        // Express-Handlebars middleware.
        // This middleware will render calendar's data object.
        hbs.handlebars.registerHelper("json", function(obj) {
            obj = data.Professors;
            return new hbs.handlebars.SafeString(JSON.stringify(obj));
          });
    });
    next();
  },
  (req, res) => {
    res.render("calendar", {
      layout: false
    });
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}!`));

