const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const { 
    createPrivateRecipe,
    copyPublicRecipe,
    getPrivateRecipes,
    getPrivateRecipeById,
    updatePrivateRecipe,
    deletePrivateRecipe
} = require('../controllers/privateRecipeController');

router.use(protect);

router.route('/')
    .get(getPrivateRecipes)
    .post(upload.single('image'), createPrivateRecipe);

router.post('/copy/:publicId', copyPublicRecipe);

router.route('/:id')
    .get(getPrivateRecipeById)
    .patch(pload.single('image'), updatePrivateRecipe)
    .delete(deletePrivateRecipe);

module.exports = router;