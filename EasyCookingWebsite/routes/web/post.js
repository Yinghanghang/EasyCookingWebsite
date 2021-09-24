var express = require("express");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;

var Post = require("../../models/post");

var router = express.Router();
// add middleware ensureAuthenticated into router
router.use(ensureAuthenticated);

// add middleware function ensureAuthenticated between "/posts" and "function
router.get("/", function (req, res) {
    // get all the post
    Post.find({ userID: req.user._id }).exec(function (err, posts) {
        if (err) { console.log(err); }
        // pass all posts under variable posts so we can use in view posts.ejs
        res.render("post/posts", { posts: posts });
    });
});

// get all post related to user._id
router.get("/add", function (req, res) {
    res.render("post/addpost");
});

// add the new post
router.post("/add", function (req, res, next) {
    var newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        userID: req.user._id    //include userid of signed in user
    });

    newPost.save(function (err, post) {
        if (err) { console.log(err); }
        res.redirect("/posts");
    });
});

// /: means a route parameter it could be anything and it's often an ID
// localhost:1337/post/12345 --. fetch the  post with id 12345
router.get("/:postId", function (req, res) {
    Post.findById(req.params.postId).exec(function (err, post) {
        if (err) { console.log(err); }
        res.render("post/detailpost", { post: post });
    });
});

router.get("/edit/:postId", function (req, res) {
    Post.findById(req.params.postId).exec(function (err, post) {
        if (err) { console.log(err); }
        res.render("post/editpost", { post: post });
    });
});

/*router.post("/update", async function (req, res) {
    // get the post from async function
    const post = await Post.findById(req.body.postid);
    
    post.title = req.body.title;
    post.content = req.body.content;
    
    // post.save(); // not async function

    try {
        let savePost = await post.save();
        console.log("savepost", savePost);
        res.redirect("/posts/" + res.body.postid);

    } catch (err) {
        console.log("error happned: ");
        // send error to user
        res.status(500).send(err); 
    }
});*/

// check what is different from above code and this
router.post("/update", async function (req, res) {
    const post = await Post.findById(req.body.postid);

    post.title = req.body.title;
    post.content = req.body.content;

    // post.save()

    try {
        let savePost = await post.save();
        console.log("savepost", savePost);
        res.redirect("/posts/" + req.body.postid);

    } catch (err) {
        console.log("error happened");
        res.status(500).send(err);
    }

});

module.exports = router;