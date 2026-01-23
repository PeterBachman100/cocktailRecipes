const PublicRecipe = require('../models/PublicRecipe');

const parseJsonFields = (data, fields) => {
    fields.forEach(field => {
        if (data[field] && typeof data[field] === 'string') {
            try {
                data[field] = JSON.parse(data[field]);
            } catch(error) {

            }
        }
    });
};

const createPublicRecipe = async (req, res) => {
    try {
        const recipeData = { ...req.body };
        const jsonFields = ['ingredients', 'steps', 'spirits', 'flavors', 'seasons'];
        parseJsonFields(recipeData, jsonFields);

        if (req.file) {
            recipeData.image = req.file.path;
        }

        const newRecipe = new PublicRecipe(recipeData);
        const savedRecipe = await newRecipe.save();

        res.status(201).json(savedRecipe);
    } catch(error) {
        res.status(400).json({ message: 'Error creating recipe', error: error.message });
    }
};

module.exports = { createPublicRecipe };