const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    createPublicRecipe,
    getPublicRecipes,
    getPublicRecipeById,
    updatePublicRecipe,
    deletePublicRecipe
} = require('../controllers/publicRecipeController');

router.route('/')
    .get(getPublicRecipes)
    .post(protect, admin, upload.single('image'), createPublicRecipe);

router.route('/:id')
    .get(getPublicRecipeById)
    .patch(protect, admin, upload.single('image'), updatePublicRecipe)
    .delete(protect, admin, deletePublicRecipe);

module.exports = router;