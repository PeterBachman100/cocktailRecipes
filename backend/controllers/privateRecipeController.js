const mongoose = require('mongoose');
const { cloudinary } = require("../config/cloudinary");
const PrivateRecipe = require("../models/PrivateRecipe");
const PublicRecipe = require('../models/PublicRecipe');
const { applyArrayFilter, parseJsonFields } = require("../utils/queryHelpers");


const getPrivateRecipes = async (req,res) => {
    try {
        const {spirits, spiritsMatch, flavors, flavorsMatch, seasons, seasonsMatch, cocktailType, search } = req.query;
        let query = { user: req.user.id };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { spirits: { $regex: search, $options: 'i' } },
                { "ingredients.name": { $regex: search, $options: 'i' } }
            ];
        }

        if (cocktailType) query.cocktailType = { $in: cocktailType.split(',') };

        applyArrayFilter('spirits', spirits, spiritsMatch);
        applyArrayFilter('flavors', flavors, flavorsMatch);
        applyArrayFilter('seasons', seasons, seasonsMatch);

        const recipes = await PrivateRecipe.find(query).sort('-createdAt');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createPrivateRecipe = async (req, res) => {
    try {
        const recipeData = { ...req.body };
        const jsonFields = ['ingredients', 'steps', 'spirits', 'flavors', 'seasons'];
        parseJsonFields(recipeData, jsonFields);

        recipeData.user = req.user.id; 

        if (req.file) {
            recipeData.image = req.file.path;
            recipeData.cloudinaryId = req.file.filename;
        }

        const newRecipe = await PrivateRecipe.create(recipeData);
        res.status(201).json(newRecipe);
    } catch (error) {
        if (req.file) await cloudinary.uploader.destroy(req.file.filename);
        res.status(400).json({ message: 'Creation failed', error: error.message });
    }
};

const copyPublicRecipe = async (req, res) => {
    try {
        const source = await PublicRecipe.findById(req.params.publicId);
        if (!source) return res.status(404).json({ message: 'Source not found' });

        let clonedImage = source.image;
        let clonedId = source.cloudinaryId;

        if (source.image) {
            const uploadRes = await cloudinary.uploader.upload(source.image, {
                folder: 'private_recipes'
            });
            clonedImage = uploadRes.secure_url;
            clonedId = uploadRes.public_id;
        }

        const copyData = {
            ...source.toObject(),
            _id: new mongoose.Types.ObjectId(),
            user: req.user.id,
            image: clonedImage,
            cloudinaryId: clonedId,
            rating: 0 
        };

        const copy = await PrivateRecipe.create(copyData);
        res.status(201).json(copy);
    } catch (error) {
        res.status(500).json({ message: 'Copy failed', error: error.message });
    }
};

const getPrivateRecipeById = async (req, res) => {
    try {
        const recipe = await PrivateRecipe.findOne({ _id: req.params.id, user: req.user.id });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};

const updatePrivateRecipeById = async (req, res) => {
    let newCloudinaryId = null;

    try {
        const recipe = await PrivateRecipe.findOne({ _id: req.params.id, user: req.user.id });
        
        if (!recipe) {
            if (req.file) await cloudinary.uploader.destroy(req.file.filename);
            return res.status(404).json({ message: 'Recipe not found or unauthorized' });
        }

        const updateData = { ...req.body };
        const jsonFields = ['ingredients', 'steps', 'spirits', 'flavors', 'seasons'];
        parseJsonFields(updateData, jsonFields);

        if (req.file) {
            updateData.image = req.file.path;
            updateData.cloudinaryId = req.file.filename;
            newCloudinaryId = req.file.filename;
        }

        const oldCloudinaryId = recipe.cloudinaryId;

        const updatedRecipe = await PrivateRecipe.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

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

const deletePrivateRecipe = async (req, res) => {
    try {
        const recipe = await PrivateRecipe.findOne({ _id: req.params.id, user: req.user.id });
        if (!recipe) return res.status(404).json({ message: 'Not found' });

        const cloudId = recipe.cloudinaryId;
        await recipe.deleteOne();

        if (cloudId) await cloudinary.uploader.destroy(cloudId);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};

module.exports = {
    getPrivateRecipes,
    createPrivateRecipe,
    copyPublicRecipe,
    getPrivateRecipeById,
    updatePrivateRecipeById,
    deletePrivateRecipe
};