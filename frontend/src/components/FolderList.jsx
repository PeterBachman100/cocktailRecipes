import { X } from "lucide-react";
import { useFolders } from "../context/FolderContext";
import FolderForm from "./FolderForm";
import FolderItem from "./FolderItem";

function FolderList({ foldersVisible, handleFoldersVisible }) {
    // Destructure createFolder so we can pass it to the form
    const { folders, createFolder } = useFolders();

    return (
        <div className={`FolderList_root ${foldersVisible ? 'visible' : ''}`}>
            <div className="FolderList_header">
                <h2 className="FolderList_title">Folders</h2>
                <button onClick={handleFoldersVisible} className="FolderList_close">
                    <X size={24} />
                </button>
            </div>

            {/* Pass the creation logic into the form */}
            <FolderForm onComplete={createFolder} />

            <div className="FolderList_list">
                {folders.map((folder) => (
                    <FolderItem 
                        key={folder._id} 
                        folderId={folder._id} 
                        folderName={folder.name} 
                        handleFoldersVisible={handleFoldersVisible} 
                    />
                ))}
            </div>
        </div>
    );
}

export default FolderList;