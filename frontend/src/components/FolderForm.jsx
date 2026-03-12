import { useState } from "react";
import { Plus, Check, X } from "lucide-react";

const FolderForm = ({ initialName = "", onComplete, isInline = false }) => {
    // If isInline is true, we start in editing mode immediately
    const [isEditing, setIsEditing] = useState(isInline);
    const [name, setName] = useState(initialName);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        
        if (!trimmedName) return;

        try {
            // parent component (RecipeBrowser or FolderItem) handles the specific API call
            await onComplete(trimmedName);
            
            // Clean up if this is the "Create New" version
            if (!isInline) {
                setName("");
                setIsEditing(false);
            }
        } catch (err) {
            alert(err);
        }
    };

    const handleCancel = () => {
        if (isInline) {
            // Signal to parent to close the rename state without saving
            onComplete(null); 
        } else {
            setIsEditing(false);
            setName("");
        }
    };

    // "Create New" button view
    if (!isEditing && !isInline) {
        return (
            <button 
                className="FolderForm_addFolderButton" 
                onClick={() => setIsEditing(true)}
            >
                <Plus size={16} />
                <span>Create New Folder</span>
            </button>
        );
    }

    return (
        <form className="FolderForm_form" onSubmit={handleSubmit}>
            <input
                autoFocus
                className="FolderForm_input"
                value={name}
                maxLength={30}
                onChange={(e) => setName(e.target.value)}
                placeholder="Folder name..."
                // Ensures the cursor goes to the end of the text when renaming
                onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
            />
            <div className="FolderForm_actions">
                <button type="submit" className="FolderForm_submit">
                    <Check size={20} />
                </button>
                <button 
                    type="button" 
                    className="FolderForm_cancel" 
                    onClick={handleCancel}
                >
                    <X size={20} />
                </button>
            </div>
        </form>
    );
};

export default FolderForm;