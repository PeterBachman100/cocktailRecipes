import { X } from "lucide-react";
import { useFolders } from "../context/FolderContext";
import FolderForm from "./FolderForm";
import { useNavigate } from "react-router-dom";

function FolderList({foldersVisible, handleFolderList}) {

    const navigate = useNavigate();
    const { folders, setSelectedFolderId, selectedFolderId, loading } = useFolders();

    const handleSelect = (id) => {
        console.log('handle select');
        setSelectedFolderId(id);
        navigate("/my-recipes");
        handleFolderList(); 
    };

    let foldersContent = ''
    if (loading) {
        foldersContent = 'Loading folders';
    } else {
        foldersContent = (folders.map((folder) => (
            <div 
                className={`FolderList_folder ${selectedFolderId === 'folder._id' ? 'active' : ''}`} 
                key={folder._id}
                onClick={() => handleSelect(folder._id)}
            >
                {folder.name}
            </div>
        )));
    }
    return (
        <div className={`FolderList_root ${foldersVisible ? 'visible' : ''}`}>
            <div className="FolderList_header">
                <h2 className="FolderList_title">Folders</h2>
                <button onClick={handleFolderList} className="FolderList_close"><X size={24} /></button>
            </div>
            <FolderForm />
            <button onClick={() => setSelectedFolderId(null)}>All Private Recipes</button>
            <div className="FolderList_list">
                {foldersContent}
            </div>
        </div>
    );
}

export default FolderList;