const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const exphbs = require('express-handlebars');
const helpers = require('./helpers');
const config = require('./config.json');

//setup app and port
const app = express();
const port = process.env.PORT || 4000;

//cross origin request
app.use(cors());

//connect to database
// const mongoose = require('mongoose');
// const opts = {
//   useNewUrlParser: true
// };
// console.log("which environment ?", app.get('env'));
// const url = ( app.get('env') === 'development') ? config.mongo.development.connectionString : config.mongo.production.connectionString;
// mongoose.set('useCreateIndex', true);
// mongoose.connect(url, opts, (err, db) => {
//     if (err) {
//         console.log("Couldn't connect to database", err);
//     } else {
//         console.log(`Connected To Database`);
//     }
// });

//Register all database schemas

//configure bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false
  })
);

app.use(express.static('public/'));

//configure handlebars as view engine
app.engine( 'hbs', exphbs( { 
    extname: 'hbs', 
    defaultLayout: 'main', 
    helpers: helpers,
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));
app.set( 'view engine', 'hbs' );

//register all page routes here 
var routes = require('./routes');
routes(app, helpers);

//spin up server 
app.listen(port, ()=> {
  console.log("server started on PORT http://localhost:" + port);
});