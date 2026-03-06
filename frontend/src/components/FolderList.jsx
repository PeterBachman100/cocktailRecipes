import { X } from "lucide-react";
import { useFolders } from "../context/FolderContext";
import FolderForm from "./FolderForm";
import { NavLink } from "react-router-dom";

function FolderList({foldersVisible, handleFoldersVisible}) {

    const { folders } = useFolders();

    return (
        <div className={`FolderList_root ${foldersVisible ? 'visible' : ''}`}>
            <div className="FolderList_header">
                <h2 className="FolderList_title">Folders</h2>
                <button onClick={handleFoldersVisible} className="FolderList_close"><X size={24} /></button>
            </div>
            <FolderForm />
            <div className="FolderList_list">
                {folders.map((folder) => (
                    <NavLink 
                        className='FolderList_folder' 
                        key={folder._id}
                        to={`/my-recipes?folderId=${folder._id}`}
                        onClick={handleFoldersVisible}
                    >
                        {folder.name}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default FolderList;