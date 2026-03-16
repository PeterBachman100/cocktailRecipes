import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CirclePlus, BookMarked, Folder, Martini } from 'lucide-react';

const AppNavbar = ({ handleFoldersVisible }) => {
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    // Check if we are currently viewing a specific folder
    const searchParams = new URLSearchParams(location.search);
    const isInsideFolder = location.pathname === '/my-recipes' && searchParams.has('folderId');

    // Helper for "My Recipes" link
    const getMyRecipesClass = ({ isActive }) => {
        // If it's technically active but we are inside a folder, de-activate it
        const actuallyActive = isActive && !isInsideFolder;
        return actuallyActive ? 'AppNavbar_link AppNavbar_link--active' : 'AppNavbar_link';
    };

    // Helper for "Folders" button (since it's not a NavLink, we style it manually)
    const folderBtnClass = isInsideFolder 
        ? 'AppNavbar_link AppNavbar_link--active' 
        : 'AppNavbar_link';

    return (
        <nav className='AppNavbar_root'>
            <NavLink to='/recipes' className={({ isActive }) => isActive ? 'AppNavbar_link AppNavbar_link--active' : 'AppNavbar_link'}>
                <Martini size={20} />
                <span>The Library</span>
            </NavLink>
            
            <NavLink to='/my-recipes' className={getMyRecipesClass} end>
                <BookMarked size={20} />
                <span>My Recipes</span>
            </NavLink>

            {user && (
                <button className={folderBtnClass} onClick={handleFoldersVisible}>
                    <Folder size={20} />
                    <span>Folders</span>
                </button>
            )}

            {user && (
                <NavLink to={isAdmin ? '/recipes/new' : '/my-recipes/new'} className={({ isActive }) => isActive ? 'AppNavbar_link AppNavbar_link--active' : 'AppNavbar_link'}>
                    <CirclePlus size={20} />
                    <span>Add Recipe</span>
                </NavLink>
            )}
        </nav>
    );
};

export default AppNavbar;