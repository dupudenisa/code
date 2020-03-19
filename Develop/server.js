// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(express.urlencoded({ extended: true })); //MIDDLEWARE THAT RECEIVES OUR CLIENT REQUEST BEFORE IT GOES INTO OUR ROUTE & PARSES THE DATA THAT WE RETRIEVE SO WE HAVE ACCESS TO OUR REQ.BODY.
app.use(express.json());  //METHOD WHERE WE CAN APPLY OUR MIDDLEWARE. 
app.use(express.static("public")); // ALLOW US TO SPLIT OUR FRONT END FILES INTO DIFFERENT STATIC FILES.
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true })); //session: when the server is tracking who is logged in so we can render the pages a certain way. Tokens: server doesnt know or care whether youre logged in. if you have a token u send this token with every request. heres my identity and heres what i want so server sends it back to you. 
app.use(passport.initialize());
app.use(passport.session()); /

// Requiring our routes
require("./routes/html-routes.js")(app); //OUR SERVER IS BRINGING IN OUR ROUTES. WE ARE REQUIRING ROUTES FROM HTML.   
require("./routes/api-routes.js")(app);// 

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
