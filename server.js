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
const port = process.env.PORT || 5500;

//cross origin request
app.use(cors());

//connect to database


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

// register all route for local json database
require('./database')(app);

//register all page routes here 
require('./routes')(app, helpers);

//spin up server 
app.listen(port, ()=> {
  console.log("server started on PORT http://localhost:" + port);
});