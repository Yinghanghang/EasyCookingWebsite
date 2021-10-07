var express = require("express");
var passport = require("passport");
// add 
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;

var User = require("../../models/user");

var router = express.Router();


router.get("/", function (req, res) {
    // console.log("hello I'm on the start page");
    res.render("home/index");
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
    res.render("home/register")
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

router.get("/result", function (req, res) {
    res.render("home/result")
});

router.get("/recipe", function (req, res) {
    res.render("home/recipe")
});

router.get("/profile", function (req, res) {
    res.render("user/profile")
});


module.exports = router;