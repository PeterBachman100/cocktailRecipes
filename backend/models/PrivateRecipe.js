const mongoose = require('mongoose');
const { recipe } = require('./recipeSchema');

const privateRecipeSchema = new mongoose.Schema({
    ...recipe,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  }, 
  { timestamps: true}
);

module.exports = mongoose.model('PrivateRecipe', privateRecipeSchema);