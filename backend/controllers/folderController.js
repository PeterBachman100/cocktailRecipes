const Folder = require('../models/Folder');

const getFolders = async (req, res) => {
    try {
        const folders = await Folder.find({ ownerId: req.user.id });
        res.json(folders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createFolder = async (req, res) => {
    try {
        const { name } = req.body;
        const folder = await Folder.create({
            name,
            ownerId: req.user.id,
            recipeIds: []
        });
        res.status(201).json(folder);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'A folder with this name already exists' });
        res.status(400).json({ message: 'Could not create folder', error: error.message });
    }
};

const getFolderById = async (req, res) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, ownerId: req.user.id })
            .populate('recipeIds');
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json(folder);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message});
    }
};

const renameFolder = async (req, res) => {
    try {
        const folder = await Folder.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.user.id },
            { name: req.body.name },
            { new: true, runValidators: true }
        );
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json(folder);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'A folder with this name already exists' });
        res.status(400).json({ message: 'Rename failed' });
    }
}
const addRecipeToFolder = async (req, res) => {
    try {
        const folder = await Folder.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.user.id },
            { $addToSet: { recipeIds: req.body.recipeId } },
            { new: true }
        );
        if(!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json(folder);
    } catch (error) {
        res.status(400).json({ message: 'Could not add recipe' });
    }
};

const removeRecipeFromFolder = async (req, res) => {
    try {
        const folder = await Folder.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.user.id },
            { $pull: { recipeIds: req.params.recipeId }},
            { new: true }
        );
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json(folder);
    } catch (error) {
        res.status(500).json({ message: 'Remove failed' });
    }
};

const deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findOneAndDelete({
            _id: req.params.id,
            ownerId: req.user.id
        });
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        res.json({ message: 'Folder deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};

module.exports = {
    getFolders,
    createFolder,
    getFolderById,
    renameFolder,
    addRecipeToFolder,
    removeRecipeFromFolder,
    deleteFolder
};

