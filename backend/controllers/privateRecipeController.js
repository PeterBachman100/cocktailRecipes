const mongoose = require('mongoose');
const { cloudinary } = require("../config/cloudinary");
const PrivateRecipe = require("../models/PrivateRecipe");
const PublicRecipe = require('../models/PublicRecipe');
const Folder = require('../models/Folder');
const { applyArrayFilter, parseJsonFields } = require("../utils/queryHelpers");


const getPrivateRecipes = async (req,res) => {
    try {
        const {spirits, spiritsMatch, flavors, flavorsMatch, seasons, seasonsMatch, cocktailType, search, folderId } = req.query;
        let query = { user: req.user.id };

        if (folderId) {
            const foundFolder = await Folder.findOne({ 
                _id: folderId, 
                ownerId: req.user.id 
            });

            if (!foundFolder) return res.json([]);

            query._id = { $in: foundFolder.recipeIds };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { spirits: { $regex: search, $options: 'i' } },
                { "ingredients.name": { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } }
            ];
        }

        if (cocktailType) query.cocktailType = { $in: cocktailType.split(',') };

        applyArrayFilter(query, 'spirits', spirits, spiritsMatch);
        applyArrayFilter(query, 'flavors', flavors, flavorsMatch);
        applyArrayFilter(query, 'seasons', seasons, seasonsMatch);

        const recipes = await PrivateRecipe.find(query).sort('-createdAt');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createPrivateRecipe = async (req, res) => {
    try {
        const recipeData = { ...req.body };
        const jsonFields = ['ingredients', 'steps', 'spirits', 'flavors', 'seasons', 'notes'];
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
        const { publicId } = req.params;

        // 1. Check if the user already has this public recipe saved
        const alreadySaved = await PrivateRecipe.findOne({ 
            user: req.user.id, 
            sourceId: publicId 
        });

        if (alreadySaved) {
            return res.status(400).json({ 
                message: 'Recipe already saved',
                recipeId: alreadySaved._id 
            });
        }

        // 2. Fetch the source
        const source = await PublicRecipe.findById(publicId);
        if (!source) return res.status(404).json({ message: 'Source not found' });

        // 3. Clone the image
        let clonedImage = source.image;
        let clonedId = source.cloudinaryId;

        if (source.image) {
            const uploadRes = await cloudinary.uploader.upload(source.image, {
                folder: 'private_recipes'
            });
            clonedImage = uploadRes.secure_url;
            clonedId = uploadRes.public_id;
        }

        // 4. Prepare the data
        const sourceObj = source.toObject();
        
        // Remove fields that should not be inherited from the public version
        delete sourceObj._id;
        delete sourceObj.createdAt;
        delete sourceObj.updatedAt;

        const copyData = {
            ...sourceObj,
            _id: new mongoose.Types.ObjectId(),
            user: req.user.id,
            sourceId: source._id, // Link to the original
            image: clonedImage,
            cloudinaryId: clonedId,
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
        const jsonFields = ['ingredients', 'steps', 'spirits', 'flavors', 'seasons', 'notes'];
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
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        const cloudId = recipe.cloudinaryId;
        await recipe.deleteOne();
        await Folder.updateMany(
            { ownerId: req.user.id },
            { $pull: { recipeIds: req.params.id } }
        );

        if (cloudId) await cloudinary.uploader.destroy(cloudId);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};

const checkSavedStatus = async (req, res) => {
    try {
        const saved = await PrivateRecipe.findOne({ 
            user: req.user.id, 
            sourceId: req.params.publicId 
        });
        
        res.json({ 
            isSaved: !!saved, 
            privateId: saved ? saved._id : null 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPrivateRecipes,
    createPrivateRecipe,
    copyPublicRecipe,
    getPrivateRecipeById,
    updatePrivateRecipeById,
    deletePrivateRecipe,
    checkSavedStatus
};