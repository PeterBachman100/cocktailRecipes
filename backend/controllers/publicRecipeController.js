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
        const { spirits, spiritsMatch, flavors, flavorsMatch, seasons, seasonsMatch, cocktailType, search } = req.query;
        let query = {};
        if(search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { "ingredients.name": { $regex: search, $options: 'i' } }
        ];
        if(cocktailType) query.cocktailType = { $in: cocktailType.split(',')};

        const applyArrayFilter = (field, value, matchType) => {
            if (!value) return;
            const vals = value.split(',');
            query[field] = (matchType === 'all') ? { $all: vals } : { $in: vals };
        };

        applyArrayFilter('spirits', spirits, spiritsMatch);
        applyArrayFilter('flavors', flavors, flavorsMatch);
        applyArrayFilter('seasons', seasons, seasonsMatch);

        const recipes = await PublicRecipe.find(query)
            .select('title description spirits cocktailType flavors seasons image')
            .sort('-createdAt');

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
    let oldCloudinaryId = null;
    let newCloudinaryId = null;

    try {
        let recipe = await PublicRecipe.findById(req.params.id);
        if (!recipe) {
            if (req.file) await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: 'Recipe not found'});
        }

        oldCloudinaryId = recipe.cloudinaryId;

        const updateData = { ...req.body };

        const jsonFields = ['ingredients', 'steps', 'spirits', 'flavors', 'seasons'];
        parseJsonFields(updateData, jsonFields);

        if (req.file) {
            updateData.image = req.file.path;
            updateData.cloudinaryId = req.file.filename;
            newCloudinaryId = req.file.filename;
        }

        const updatedRecipe = await PublicRecipe.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (req.file && oldCloudinaryId) {
            await cloudinary.uploader.destroy(oldCloudinaryId);
        }
        res.json(updatedRecipe);
    } catch (error) {
        if (newCloudinaryId) {
            await cloudinary.uploader.destroy(newCloudinaryId);
        }
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

        const cloudinaryId = recipe.cloudinaryId;
        await recipe.deleteOne();

        if (cloudinaryId) {
            try {
                await cloudinary.uploader.destroy(cloudinaryId);
            } catch (error) {
                console.error('Cloudinary image deletiong failed:', error.message);
            }
        }

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