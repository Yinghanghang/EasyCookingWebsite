const express = require("express");

const router = express.Router();

// TODO: add in error and info
// add currentUser object
router.use(function (req, res, next) {
    res.locals.currentUser = req.user;   // assign user from login into currentUser

    next();
});

//use router
router.use("/", require("./home"));

module.exports = router;