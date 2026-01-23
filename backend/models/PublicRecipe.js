const mongoose = require('mongoose');
const { recipe } = require('./recipeSchema');

const publicRecipeSchema = new mongoose.Schema(recipe, { timestamps: true });
publicRecipeSchema.index({ title: 1} , { unique: true });

module.exports = mongoose.model('PublicRecipe', publicRecipeSchema);