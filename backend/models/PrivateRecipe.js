const mongoose = require('mongoose');
const { recipe } = require('./recipeSchema');

const privateRecipeSchema = new mongoose.Schema({
    ...recipe,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    rating: { type: Number, min: 0, max: 5, default: 0 }
  }, 
  { timestamps: true}
);

module.exports = mongoose.model('PrivateRecipe', privateRecipeSchema);