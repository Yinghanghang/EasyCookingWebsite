var mongoose = require("mongoose");
//cretae post schema
var postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: false },
    createAt: { type: Date, default: Date.now },
    image: { type: String, required: false, unique: false },
    userID: { type: mongoose.Schema.Types.ObjectId, required: false, unique: false },
    public: { type: Boolean, default: false, required: false, unique: false }
});

// set Post object to be return
var Post = mongoose.model("Post", postSchema);
// return object Post
module.exports = Post;