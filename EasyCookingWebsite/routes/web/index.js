var express = require("express");

var router = express.Router();

// TODO: add in error and info
// add currentUser object
router.use(function (req, res, next) {
    // create currentUser, error, info to use in _header.ejs
    res.locals.currentUser = req.user;   
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");

    next();
});

//use router
router.use("/", require("./home"));
router.use("/posts", require("./post")); // when go to posts, use post router file
router.use("/recipes", require("./recipe"));

module.exports = router;
