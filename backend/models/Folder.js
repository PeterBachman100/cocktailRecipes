const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    recipeIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PrivateRecipe' 
    }]
}, { timestamps: true });

folderSchema.index({ name: 1, ownerId: 1}, { unique: true });

module.exports = mongoose.model('Folder', folderSchema);