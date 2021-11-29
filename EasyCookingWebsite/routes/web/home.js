var express = require("express");
var passport = require("passport");

var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");

var User = require("../../models/user"); // the User object would get whatever is being exported from the module in user.js. 
var Recipe = require("../../models/recipe");

var router = express.Router();

router.get("/", function (req, res) {
    Recipe.find().sort({ like: -1}). exec(function (err, recipes) {
        if (err) { console.log(err); }
        res.render("home/index", { recipes: recipes }); // render the homepage, views fold is set to be the root directory
  });
});

router.get("/result", function (req, res) {
    Recipe.find().sort({ like: -1}).exec(function (err, recipe) {
        if (err) { console.log(err); }
        res.render("home/result", { recipes: recipe });
  });
});

router.post("/result", function (req, res) {
    var content = req.body.searchContent;
    var reg = new RegExp(content, 'i');
    Recipe.find({title : {$regex : reg}}).exec(function (err, recipe) {
        if (err) { console.log(err); }
        res.render("home/result", { recipes:recipe, category : content.category });
  });
});

router.get("/result/:category", function (req, res) {
    Recipe.find({category : req.params.category}).sort({ like: -1}).exec(function (err, recipe) {
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
    res.redirect("/"); // url
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

        if (username == "" || password == "" || repassword == "" || firstname == "" || lastname == "") {
            req.flash("error", "All fields are required!!!");
            return res.redirect("/signup");
        }

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

}, passport.authenticate("login", {  // use login authenticate strategy defined in setuppassport.js
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));


router.get("/profile", function (req, res) {
    User.findById(req.user._id, function (err, user) {
        if (err) { console.log(err); }
        var userLike = user.like;
        Recipe.find({'_id': { $in: userLike }}, function(err, recipes) {
            var recipeObj = [];
            for (var i = 0; i < recipes.length; i++) {
                var recipe = recipes[i];
                recipeObj.push(recipe);
                console.log(recipe);
            }
            res.render("user/profile", { user: user, recipe: recipeObj });
        });
    });
});

router.get("/like/:recipeId", function (req, res) {
    //req.flash("error", "Please login to like recipes.");  
    Recipe.findById(req.params.recipeId).exec(function (err, recipe) {
        if (err) { console.log(err); }
        User.findById(recipe.userID).exec(function (err, user) {
            if (err) { console.log(err); }   
            name = user.username;
            res.render("home/detail", { recipe: recipe, username: name ,  info: "Please login to like recipes." });
        });
    });

});


// Must be the last one in order for ":" to match
router.get("/home/:recipeId", function (req, res) {
    Recipe.findById(req.params.recipeId).exec(function (err, recipe) {
        if (err) { console.log(err); }
        //console.log(recipe);
        User.findById(recipe.userID).exec(function (err, user) {
            if (err) { console.log(err); }   
            name = user.username;
            res.render("home/detail", { recipe: recipe, username: name });
        });
    });
});

module.exports = router;
