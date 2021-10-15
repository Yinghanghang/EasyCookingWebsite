var mongoose = require("mongoose");

var recipeSchema = mongoose.Schema({
    title: { type: String, require: true },
    category: { type: mongoose.Schema.Types.Array, require: false },
    prepareTime: { type: String, require: false },
    cookingTime: { type: String, require: false },
    cookingSteps: { type: String, require: false },
    image: { type: String, require: false, unique: false },
/*    username: { type: String, require: false },  //show username of display  */
    userID: { type: mongoose.Schema.Types.ObjectId, require: false, unique: false },
    difficultLevel: { type: String, require: false },
    createAt: { type: Date, default: Date.now }
});

var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;