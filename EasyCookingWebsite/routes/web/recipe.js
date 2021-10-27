var express = require("express");
// use for file upload
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");
// end use for file upload
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;

var Recipe = require("../../models/recipe");

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

// add middleware ensureAuthenticated into router
router.use(ensureAuthenticated);

// add middleware function ensureAuthenticated between "/recipes" and "function => done
router.get("/", function (req, res) {   // "/", go to the route of the page, then we can have <webiste>/posts
    // get all the post
    Recipe.find({ userID: req.user._id }).exec(function (err, recipes) {
        if (err) { console.log(err); }
        // pass all posts under variable posts so we can use in view recipes.ejs
        res.render("recipe/recipes", { recipes: recipes });
    });
});

// view recipe/addrecipe page & get all recipes related to user => done
router.get("/add", function (req, res) {
    res.render("recipe/addrecipe");
});

// handle when click Add new recipe 
router.post("/add", upload.array('images', 12), function (req, res, next) { // same name as addecipe.name = image
    const files = req.files;
    if (!files) {
        const err = new Error("Please choose files");
        err.httpStatusCode = 400;
        return next(err);
    }
    var newRecipe = new Recipe({
        title: req.body.title,
        category: req.body.category,
        prepareTime: req.body.prepareTime,
        cookingTime: req.body.cookingTime,
        ingredient: req.body.ingredient,
        cookingSteps: req.body.cookingSteps,
        difficultLevel: req.body.difficultLevel,
        image: files,
        userID: req.user._id,
    });

    newRecipe.save(function (err, recipe) {
        if (err) { console.log(err); }
        // if not err, go to /recipes
        res.redirect("/recipes");
    });
});

router.get("/:recipeId", function (req, res) {
    Recipe.findById(req.params.recipeId).exec(function (err, recipe) {
        if (err) { console.log(err); }
        res.render("recipe/detailrecipe", { recipe: recipe });
    });
});

router.get("/update/:recipeId", function (req, res) {
    Recipe.findById(req.params.recipeId).exec(function (err, recipe) {
        if (err) { console.log(err); }
        res.render("recipe/editrecipe", { recipe: recipe });
    });
});

router.post("/update", upload.array('image', 12), async function (req, res) {
    const recipe = await Recipe.findById(req.body.recipeId);
    const files = req.files;

    recipe.title = req.body.title;
    recipe.category = req.body.category;
    recipe.prepareTime = req.body.prepareTime;
    recipe.cookingTime = req.body.cookingTime;
    recipe.ingredient = req.body.ingredient;
    recipe.cookingSteps = req.body.cookingSteps;
    recipe.difficultLevel = req.body.difficultLevel;
    recipe.userID = req.user._id;
    if (files != null) {
        //handle upload file (use multer)
        recipe.image = files; // upload path where file is located
    }


    try {
        let saveRecipe = await recipe.save();
        console.log("saveRecipe", saveRecipe);
        res.redirect("/recipes/" + req.body.recipeId);

    } catch (err) {
        console.log("error happened");
        res.status(500).send(err);
    }

});

module.exports = router;