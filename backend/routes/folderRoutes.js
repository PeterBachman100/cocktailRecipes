const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getFolders,
    createFolder,
    getFolderById,
    renameFolder,
    addRecipeToFolder,
    removeRecipeFromFolder,
    deleteFolder
} = require('../controllers/folderController');

router.use(protect);

router.route('/')
    .get(getFolders)
    .post(createFolder);

router.route('/:id')
    .get(getFolderById)
    .patch(renameFolder)
    .delete(deleteFolder);


router.patch('/:id/recipes', addRecipeToFolder);

router.patch('/:id/recipes/:recipeId', removeRecipeFromFolder);

module.exports = router;