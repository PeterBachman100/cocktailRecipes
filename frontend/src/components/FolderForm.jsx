import { useState } from "react";
import { useFolders } from "../context/FolderContext";
import { Plus, Check, X } from "lucide-react";

const FolderForm = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const { createFolder } = useFolders();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await createFolder(name.trim());
            setName("");
            setIsEditing(false);
        } catch (err) {
            alert(err);
        }
    };

    if (!isEditing) {
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
            />
            <div className="FolderForm_actions">
                <button type="submit" className="FolderForm_submit">
                    <Check size={20} />
                </button>
                <button 
                    type="button" 
                    className="FolderForm_cancel" 
                    onClick={() => { setIsEditing(false); setName(""); }}
                >
                    <X size={20} />
                </button>
            </div>
        </form>
    );
};

export default FolderForm;