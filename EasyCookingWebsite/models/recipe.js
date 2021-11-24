var mongoose = require("mongoose");

var recipeSchema = mongoose.Schema({
    title: { type: String, require: true },
    category: { type: mongoose.Schema.Types.Array, require: false },
    prepareTime: { type: String, require: false },
    cookingTime: { type: String, require: false },
    ingredient: { type: String, require: false },
    cookingSteps: { type: String, require: false },
    image: { type: Array, require: false, unique: false },
/*    username: { type: String, require: false },  //show username of display  */
    userID: { type: mongoose.Schema.Types.ObjectId, require: false, unique: false }, // ObjectId means reference to an id
    difficultLevel: { type: String, require: false },
    like: { type: Number, require: false, default: 0 },
    createAt: { type: Date, default: Date.now }
});


var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
