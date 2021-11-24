var express = require("express");

// use for file upload
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");
// end use for file upload
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;

var Recipe = require("../../models/recipe");

var User = require("../../models/user");

var router = express.Router();

var storage = multer.diskStorage({
    destination: "./views/images/",
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            // crypto take a randome byte, add date and extension name to orignal file   (cb(null) null for error)
            cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
        });
    }
});

// upload call multer with storage parameter
var upload = multer({ storage: storage });

// add middleware ensureAuthenticated into entire router in this file
router.use(ensureAuthenticated); // method ensureAuthenticated is defined in auth.js 

// add middleware function ensureAuthenticated between "/recipes" and "function => done
router.get("/", function (req, res) {   // "/", go to the root of the router, which is http://localhost:1337/recipes
    // get all the post
    Recipe.find({ userID: req.user._id }).exec(function (err, recipes) { // call back function returns all the recipes under that user
        if (err) { console.log(err); }
        // pass all posts under variable posts so we can use in view recipes.ejs
        res.render("recipe/recipes", { recipes: recipes });
    });
});

// view recipe/addrecipe page & get all recipes related to user => done
// handle when click Add new recipe 
router.get("/add", function (req, res) {
    res.render("recipe/addrecipe", {form: {
        title: "",
        category: [""],
        prepareTime: "",
        cookingTime: "",
        ingredient: "",
        cookingSteps: "",
        difficultLevel: ""
    }});
});

// handle when click "create"
router.post("/add", upload.array('images', 12), function (req, res, next) { // same name as addecipe.name = image
    var fileValidationError;
    const files = req.files;
    const title = req.body.title;
    const category = req.body.category == null ? [] : req.body.category;
    const prepareTime = req.body.prepareTime;
    const cookingTime = req.body.cookingTime;
    const ingredient = req.body.ingredient;
    const cookingSteps = req.body.cookingSteps;
    const difficultLevel = req.body.difficultLevel;    
    if (files.length < 1 || files.length > 12) {
            fileValidationError = {
            location: 'files',
            params: 'files',
            msg: 'Please choose at least one image and no more than 12 images',
            value: undefined
        }
    }
  
//fields value holder
var form = {
    files,
    title,
    category,
    prepareTime,
    cookingTime,
    ingredient,
    cookingSteps,
    difficultLevel
};

    req.checkBody('title', 'Please enter the title').notEmpty();
    req.checkBody('category', 'Please check the category').notEmpty();
    req.checkBody('prepareTime', 'Please enter prepare time in minutes').notEmpty().isInt();
    req.checkBody('cookingTime', 'Please enter cooking time in minutes').notEmpty().isInt();
    req.checkBody('ingredient', 'Please enter ingredients').notEmpty();
    req.checkBody('cookingSteps', 'Please enter cooking steps').notEmpty();
    req.checkBody('difficultLevel', 'Please choose difficult level').notEmpty();


 var errors = req.validationErrors();
 if(errors || fileValidationError){
     all_errors = []
     if (errors) {
         all_errors = all_errors.concat(errors);
     }
     if (fileValidationError) {
         all_errors = all_errors.concat([fileValidationError]);
     }
     //console.log(errors)
     console.log(form);
     res.render("recipe/addrecipe", {error: all_errors, form: form});
 } else{

//Here Success Part Code runs

    var newRecipe = new Recipe({
        title: title, 
        category: category, 
        prepareTime:  prepareTime,
        cookingTime: cookingTime,
        ingredient:  ingredient,
        cookingSteps: cookingSteps,
        difficultLevel:  difficultLevel,
        image: files,
        userID: req.user._id,  // id of the user signed in
    });

    newRecipe.save(function (err, recipe) {
        if (err) { console.log(err); }
        // if not err, go to http://localhost:1337/recipes
        res.redirect("/recipes");
    });
}
});


router.get("/update/:recipeId", function (req, res) {
    Recipe.findById(req.params.recipeId).exec(function (err, recipe) {
        if (err) { console.log(err); }
        res.render("recipe/editrecipe", { recipe: recipe });
    });
});


router.post("/update", upload.array('image', 12), async function (req, res) {
    var input = req.body.vote;

    if(input == "cancel") {
        res.redirect("/recipes");
    } else  if(input == "update"){
        const recipe = await Recipe.findById(req.body.recipeId);
        var fileValidationError;
        const newFiles = req.files;
        var currentFiles = recipe.image;
    
        recipe.title = req.body.title;
        recipe.category = req.body.category == null ? [] : req.body.category;
        recipe.prepareTime = req.body.prepareTime;
        recipe.cookingTime = req.body.cookingTime;
        recipe.ingredient = req.body.ingredient;
        recipe.cookingSteps = req.body.cookingSteps;
        recipe.difficultLevel = req.body.difficultLevel;
        recipe.userID = req.user._id;
    
        if (newFiles.length > 12) {
            fileValidationError = {
                location: 'files',
                params: 'files',
                msg: 'Please choose at least one image and no more than 12 images',
                value: undefined
            }
        }
    
        if (newFiles.length > 0 && newFiles.length < 13) {
            //handle upload file (use multer)
            recipe.image = newFiles; // upload path where file is located
        } else {
            recipe.image = currentFiles;
        }
    
        
        req.checkBody('title', 'Please enter the title').notEmpty();
        req.checkBody('category', 'Please check the category').notEmpty();
        req.checkBody('prepareTime', 'Please enter prepare time in minutes').notEmpty().isInt();
        req.checkBody('cookingTime', 'Please enter cooking time in minutes').notEmpty().isInt();
        req.checkBody('ingredient', 'Please enter ingredients').notEmpty();
        req.checkBody('cookingSteps', 'Please enter cooking steps').notEmpty();
        req.checkBody('difficultLevel', 'Please choose difficult level').notEmpty();
    
    
     var errors = req.validationErrors();
     if(errors || fileValidationError){
         all_errors = []
         if (errors) {
             all_errors = all_errors.concat(errors);
         }
         if (fileValidationError) {
             all_errors = all_errors.concat([fileValidationError]);
         }
         res.render("recipe/editrecipe", {error: all_errors, recipe: recipe});
     } else{
            let saveRecipe = await recipe.save();
           // console.log("saveRecipe", saveRecipe);
            res.redirect("/recipes/detail/" + req.body.recipeId);
     }
    }
});


router.get("/delete/:recipeId", function (req, res) {
    Recipe.findByIdAndDelete(req.params.recipeId).exec(function (err, recipe) {
        if (err) { console.log(err); }
        res.redirect("/recipes");
    });
});

// : means a route parameter it could be anything and it's often an ID
router.get("/detail/:recipeId", function (req, res) {
    // req. param() searches the URL path, body, and query string of the request (in that order) for the specified parameter. recipeId should be the same as :recipeId
    Recipe.findById(req.params.recipeId).exec(function (err, recipe) {
        if (err) { console.log(err); }
        // Find username of recipe's author
        User.findById(recipe.userID).exec(function (err, user) {
            if (err) { console.log(err); }
            name = user.username;
            // pass all posts under variable posts so we can use in view recipes.ejs
            res.render("recipe/detailrecipe", { recipe: recipe, username: name });
        });
    });
});

router.get("/like/:recipeId", function (req, res) {
    Recipe.findById(req.params.recipeId).exec(async function (err, recipe) {
        if (err) { console.log(err); }
        var currentUser = req.user;
        var currentRecipe = recipe;
        //check if liked recipe is exist in user.like
        var currentUserLike = currentUser.like;
        var isAlreadyLike = false;
        for (var i = 0; i < currentUserLike.length; i++) {
            if (JSON.stringify(currentUserLike[i]) ==  JSON.stringify(currentRecipe)) { //req.params.recipeId)
                isAlreadyLike = true;
                break;
            }
        }
        if (!isAlreadyLike) {
            // update user
            currentUser.username = currentUser.username;
            currentUser.email = currentUser.email;
            currentUser.password = currentUser.password;
            currentUser.firstname = currentUser.firstname;
            currentUser.lastname = currentUser.lastname;
            currentUser.createdAt = currentUser.createdAt;
            currentUser.like.push(currentRecipe); //currentRecipe._id

            // update recipe
            recipe.title = currentRecipe.title;
            recipe.category = currentRecipe.category;
            recipe.prepareTime = currentRecipe.prepareTime;
            recipe.cookingTime = currentRecipe.cookingTime;
            recipe.ingredient = currentRecipe.ingredient;
            recipe.cookingSteps = currentRecipe.cookingSteps;
            recipe.difficultLevel = currentRecipe.difficultLevel;
            recipe.userID = currentRecipe.userID;
            recipe.image = currentRecipe.image;
            recipe.like = Number(currentRecipe.like + 1);

            // save user and recipe in database
            let saveRecipe = await recipe.save();
            console.log("saveRecipe", saveRecipe);
            let saveUser = await currentUser.save();
            console.log("saveUser", saveUser);
        } else {
            console.log("Already like this recipe!!!");
        }
        res.redirect("../../recipes/detail/" + req.params.recipeId);
    });
});

module.exports = router;