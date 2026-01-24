const PublicRecipe = require('../models/PublicRecipe');
const { cloudinary } = require('../config/cloudinary');

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

// @desc Create public recipe
const createPublicRecipe = async (req, res) => {
    try {
        const recipeData = { ...req.body };
        const jsonFields = ['ingredients', 'steps', 'spirits', 'flavors', 'seasons'];
        parseJsonFields(recipeData, jsonFields);

        if (req.file) {
            recipeData.image = req.file.path;
            recipeData.cloudinaryId = req.file.filename;
        }

        const newRecipe = new PublicRecipe(recipeData);
        const savedRecipe = await newRecipe.save();

        res.status(201).json(savedRecipe);
    } catch(error) {
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename);
            console.log("Cleanup: Deleted orphaned image from Cloudinary due to DB error.");
        }
        
        res.status(400).json({ message: 'Error creating recipe', error: error.message });
    }
};

// @desc Get all public recipes (with filtering)
const getPublicRecipes = async (req, res) => {
    try {
        const { spirit, flavor, search } = req.query;
        let query = {};

        if(spirit) query.spirits = spirit;
        if(flavor) query.flavor = flavor;
        if(search) query.title = { $regex: search, $options: 'i' };

        const recipes = await PublicRecipe.find(query).select('title description spirits cocktailType flavors seasons image').sort('-createdAt');
        res.json(recipes);
    } catch(error) {
        res.status(500).json({ message: 'Server Error', error: error.message});
    }
};

// @desc Get single recipe by ID
const getPublicRecipeById = async (req, res) => {
    try {
        const recipe = await PublicRecipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json(recipe);
    } catch(error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Update a recipe (Admin only)
const updatePublicRecipe = async (req, res) => {
    try {
        let recipe = await PublicRecipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found'});

        const updateData = { ...req.body };

        const jsonFields = ['ingredients', 'steps', 'spirits', 'flavors', 'seasons'];
        parseJsonFields(updateData, jsonFields);

        if (req.file) {
            updateData.image = req.file.path;
        }

        recipe = await PublicRecipe.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.json(recipe);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
};

// @desc Delete a recipe (Admin only)
const deletePublicRecipe = async (req, res) => {
    try {
        const recipe = await PublicRecipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        await recipe.deleteOne();
        res.json({ message: 'Recipe removed succesfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error',  error: error.message });
    }
};

module.exports = {
    createPublicRecipe,
    getPublicRecipes,
    getPublicRecipeById,
    updatePublicRecipe,
    deletePublicRecipe
};