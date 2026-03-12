import { NavLink } from "react-router-dom";

function FolderItem({ folderId, folderName, handleFoldersVisible }) {

    return (
        <div className="FolderItem_root">
            <NavLink 
                className='FolderItem_title' 
                to={`/my-recipes?folderId=${folderId}`}
                onClick={handleFoldersVisible}
            >
                {folderName}
            </NavLink>
        </div>
    );
}

export default FolderItem;