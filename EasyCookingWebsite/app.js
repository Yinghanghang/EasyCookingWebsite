'use strict';
var express = require("express");  // import express web application framework/module
var path = require("path");  // The path module provides utilities for working with file and directory paths.
var mongoose = require("mongoose"); // an Object Data Modeling (ODM) library for MongoDB and Node. js.
var bodyParser = require("body-parser"); // a piece of express middleware that reads a form's input and stores it as a javascript object accessible through req.body
var cookieParser = require("cookie-parser");
var passport = require("passport"); // authentication middleware 
var session = require("express-session");
var flash = require("connect-flash");
var params = require("./params/params");
var expressValidator = require('express-validator');

var setUpPassport = require("./setuppassport");
setUpPassport(); // excute the method

var app = express(); // start a new Express application, Where "express()" is like class and app is it's newly created object.
mongoose.connect(params.DATABASECONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }); // connect to database

app.set("port", process.env.PORT || 1337); // process.env.PORT means the PORT number that is manually set. 1337 is the default port.
app.set("views", path.join(__dirname, "views")); //The views setting tells Express what directory it should use as the source of view template files. In this case, set the views directory as the source using the path.join() method, which creates a cross-platform file path.
app.set("view engine", "ejs"); // setup what template engine(ejs) to use

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "alafjskfjfiehfnsvjdvjxdnvjn1!@!4fsifj",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); // initialize passport mudule
app.use(passport.session());
app.use(flash());
app.use(expressValidator());


app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));

app.use("/views", express.static(path.resolve(__dirname + '/views'))); 

app.listen(app.get("port"), function () {  //  listening on port 1337
    console.log("Server started on port " + app.get("port"));
})