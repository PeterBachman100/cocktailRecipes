import { useState } from 'react';
import { useFolders } from '../context/FolderContext';
import { FolderPlus, Check, Loader2 } from 'lucide-react';

const FolderPicker = ({ recipeId }) => {
    const { folders, addRecipeToFolder } = useFolders();
    const [isOpen, setIsOpen] = useState(false);
    const [loadingFolder, setLoadingFolder] = useState(null);

    const handleAdd = async (folderId) => {
        setLoadingFolder(folderId);
        try {
            await addRecipeToFolder(folderId, recipeId);
            setIsOpen(false);
        } catch (err) {
            alert(err);
        } finally {
            setLoadingFolder(null);
        }
    };

    return (
        <div className="FolderPicker_root">
            <button className="FolderPicker_trigger" onClick={() => setIsOpen(!isOpen)}>
                <FolderPlus size={18} />
                <span>Add to Folder</span>
            </button>

            {isOpen && (
                <div className="FolderPicker_dropdown">
                    <h4>Select Folder</h4>
                    {folders.map(folder => (
                        <button 
                            key={folder._id} 
                            onClick={() => handleAdd(folder._id)}
                            disabled={loadingFolder === folder._id}
                        >
                            {folder.name}
                            {loadingFolder === folder._id && <Loader2 className="animate-spin" size={14} />}
                        </button>
                    ))}
                    {folders.length === 0 && <p>No folders created yet.</p>}
                </div>
            )}
        </div>
    );
};

export default FolderPicker;