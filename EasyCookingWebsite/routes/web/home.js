var express = require("express");
var passport = require("passport");
// add 
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");

var User = require("../../models/user");
var Recipe = require("../../models/recipe");

var router = express.Router();

router.get("/", function (req, res) {
    // console.log("hello I'm on the start page");
    Recipe.find().exec(function (err, recipes) {
        if (err) { console.log(err); }
        res.render("home/index", { recipes: recipes });
  });
});

router.get("/result", function (req, res) {
    Recipe.find().exec(function (err, recipe) {
        if (err) { console.log(err); }
        res.render("home/result", { recipes: recipe });
  });
});

router.get("/result/:category", function (req, res) {
    Recipe.find({category : req.params.category}).exec(function (err, recipe) {
        if (err) { console.log(err); }
        //console.log(req.params.category);
        res.render("home/result", { recipes: recipe, category: req.params.category });
  });
});

router.get("/login", function (req, res) {
    res.render("home/login")
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",  // success => direct to the homepage
    failureRedirect: "/login",
    failureFlash: true

}));

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


router.get("/signup", function (req, res) {
    res.render("home/signup")
});

router.post("/signup", function (req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    User.findOne({ email: email }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            req.flash("error", "There is already an account with this email");
            return res.redirect("/signup");
        }
        if (password != repassword) {
            req.flash("error", "Password and Re-password are mismatch!");
            return res.redirect("/signup");
        }

        var newUser = new User({
            username: username,
            password: password,
            email: email,
            firstname: firstname,
            lastname: lastname
        });

        newUser.save(next);

    });

}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));


router.get("/profile", function (req, res) {
    User.findOne({ userID: req.user._id }, function (err, user) {
        if (err) { console.log(err); }
        res.render("user/profile", { user: user });
    });
});

// Must be the last one in order for ":" to match
router.get("/home/:recipeId", function (req, res) {
    Recipe.findById(req.params.recipeId).exec(function (err, recipe) {
        if (err) { console.log(err); }
        User.findById(recipe.userID).exec(function (err, user) {
            if (err) { console.log(err); }   
            name = user.username;
            res.render("home/detail", { recipe: recipe, username: name });
        });
    });
});

module.exports = router;
