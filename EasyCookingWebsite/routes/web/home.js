var express = require("express");
var passport = require("passport");
// add 
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;

var User = require("../../models/user");

var router = express.Router();


router.get("/", function (req, res) {
    Recipe.find().exec(function (err, recipes) {
        if (err) { console.log(err); }
        res.render("home/index", { recipes: recipes });
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

router.get("/result", function (req, res) {
    res.render("home/result")
});

router.get("/detail", function (req, res) {
    res.render("home/detail")
});

router.get("/profile", function (req, res) {
    User.findOne({ userID: req.user._id }, function (err, user) {
        if (err) { console.log(err); }
        res.render("user/profile", { user: user });
    });
});
 

module.exports = router;
