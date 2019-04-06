// Packages import
const express = require("express");
const exphbs = require("express-handlebars");
const firebase = require("firebase-admin");
const path = require("path");
const app = express();
const hbs = exphbs.create();
const bodyParser = require('body-parser')

// Connection to Firebase admin database 
var serviceAccount = require("./config/serviceAccountKey.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://calendar-1946d.firebaseio.com"
});

// Handlebar middleware
app.use(express.static(path.join(__dirname, "/public")));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
// Body-parser middleware | parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Index route (this will render the home view)
app.get('/', (req, res,) => { 
    res.render("home", {layout: false})
});

const tempdata = []; 

app.post('/api/add',(req,res) => {
    console.log(req.body)

    tempdata.push(req.body);
    res.end("yes");
});

app.get('/api/all', (req, res,) => { 
    res.json(tempdata)
});

// Calendar route 
app.get("/calendar", (req, res, next) => {

    // Express-Handlebars middleware.
    // This middleware will render calendar's data object. 
    hbs.handlebars.registerHelper('json', function (obj) {
        obj = [{
            title: 'Freddy J.',
            daysOfWeek: '1T7:00:00'
        }, 
        {
            title: 'Freddy J. - 1AM',
            daysOfWeek: '1T8:00:00',
        },
        {
            title: 'Freddy J. - 1AM',
            daysOfWeek: '1T8:00:00',
        }];
        return new hbs.handlebars.SafeString(JSON.stringify(obj))
    });
    next();
}, (req, res) => { 
    res.render("calendar", {
        layout: false,
      });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}!`));
