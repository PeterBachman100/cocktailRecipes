const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');
const { createPublicRecipe } = require('../controllers/publicRecipeController');

router.post('/', protect, admin, upload.single('image'), createPublicRecipe);

module.exports = router;