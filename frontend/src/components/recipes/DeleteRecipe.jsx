import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Trash, X } from 'lucide-react';
import { useFolders } from '../../context/FolderContext';
import api from '../../api/axios';

const DeleteRecipe = ({ recipeId, folderId, triggerRefresh }) => {
    const { removeRecipeFromFolder, getFolderName } = useFolders();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { search } = useLocation();

    const deleteRecipe = async () => {
        if(folderId) {
            removeRecipeFromFolder(folderId, recipeId);
            triggerRefresh();
            navigate(`/my-recipes/${search}`, { replace: true });
        } else {
            try {
                await api.delete(`/api/private-recipes/${recipeId}`);
                triggerRefresh();
                navigate(`/my-recipes/${search}`, { replace: true });
            } catch(error) {
                console.error(error);
            }
        }
    }
    return (
        <div className="DeleteRecipe_root">
            <button className="DeleteRecipe_trigger" onClick={() => setIsOpen(!isOpen)}>
                <Trash size={16} />
            </button>

            {isOpen && (
                <div className="DeleteRecipe_dropdown">
                    <div className='DeleteRecipe_header'>
                        <h4>{folderId ? `Remove this recipe from ${getFolderName(folderId)}?` : 'Delete this recipe from your Saved Recipes?'}</h4>
                    </div>
                    <div className='DeleteRecipe_actions'>
                        <button className='DeleteRecipe_deleteButton' onClick={deleteRecipe}><span>Delete</span></button>
                        <button className='DeleteRecipe_cancelButton' onClick={() => setIsOpen(false)}><span>Cancel</span></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteRecipe;