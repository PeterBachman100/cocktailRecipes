import { useState, useCallback, useTransition } from 'react';
import { Outlet, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';
import RecipeFilter from '../components/recipes/RecipeFilter';
import FolderForm from '../components/FolderForm';
import { SlidersHorizontal, ChevronUp, EllipsisVertical, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useFolders } from '../context/FolderContext';

const RecipeBrowser = () => {
    const { getFolderName, renameFolder, deleteFolder } = useFolders();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const folderId = searchParams.get('folderId') || '';
    const { id } = useParams();

    // UI States for Folder Management
    const [menuOpen, setMenuOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isPrivate = pathname.includes('my-recipes');
    const isFolderPage = isPrivate && folderId;

    const filters = {
        folderId,
        search: searchParams.get('search') || '',
        spirits: searchParams.get('spirits')?.split(',').filter(Boolean) || [],
        flavors: searchParams.get('flavors')?.split(',').filter(Boolean) || [],
        cocktailType: searchParams.get('cocktailType')?.split(',').filter(Boolean) || [],
        spiritsMatch: searchParams.get('spiritsMatch') || 'any',
        flavorsMatch: searchParams.get('flavorsMatch') || 'any'
    };

    // Actions
    const handleRename = async (newName) => {
        if (newName) await renameFolder(folderId, newName);
        setIsRenaming(false);
        setMenuOpen(false);
    };

    const handleDelete = async () => {
        await deleteFolder(folderId);
        setIsDeleting(false);
        setMenuOpen(false);
        navigate('/my-recipes'); // Redirect to main saved recipes after deletion
    };

    const Title = () => {
        if (isRenaming && isFolderPage) {
            return (
                <FolderForm 
                    initialName={getFolderName(folderId)} 
                    onComplete={handleRename} 
                    isInline 
                />
            );
        }

        const titleText = isFolderPage ? getFolderName(folderId) : (isPrivate ? 'Saved Recipes' : 'The Library');

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isFolderPage && (
                    <div style={{ position: 'relative' }}>
                        <button className='FolderMenu_trigger' onClick={() => setMenuOpen(!menuOpen)}>
                            <EllipsisVertical size={20} />
                        </button>
                        
                        {menuOpen && (
                            <div className="FolderMenu_popup">
                                <button onClick={() => setIsRenaming(true)}>
                                    <Pencil size={14} /> Rename
                                </button>
                                <button onClick={() => setIsDeleting(true)}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <h1>{titleText}</h1>
            </div>
        );
    };

    // Modal Overlay for Deletion
    const DeleteModal = () => {
        if (!isDeleting) return null;
        return (
            <div className="Modal_overlay">
                <div className="Modal_content">
                    <AlertCircle size={32} />
                    <h2>Delete Folder?</h2>
                    <p>This will permanently remove the folder but keep your recipes.</p>
                    <div className="Modal_actions">
                        <button onClick={handleDelete}>Delete</button>
                        <button onClick={() => setIsDeleting(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    const updateField = (name, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set(name, value);
        else newParams.delete(name);
        setSearchParams(newParams);
    };

    const toggleArrayItem = (field, item) => {
        const newParams = new URLSearchParams(searchParams);
        const currentItems = filters[field];
        const newItems = currentItems.includes(item)
            ? currentItems.filter(i => i !== item)
            : [...currentItems, item];
        
        if (newItems.length > 0) newParams.set(field, newItems.join(','));
        else newParams.delete(field);
        
        setSearchParams(newParams);
    };

    const resetFilters = () => {
        const newParams = new URLSearchParams();
        if (folderId) newParams.set('folderId', folderId);
        setSearchParams(newParams);
    };

    const isSplitView = id || pathname.includes('/new') || pathname.includes('/edit');
    const isFullWidth = !isSplitView;
    const [filterHidden, setFilterHidden] = useState(true);

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isPending, startTransition] = useTransition();
    const triggerRefresh = useCallback(() => {
        startTransition(() => {
            setRefreshTrigger(prev => prev + 1);
        });
    }, []);

    return (
        <div className={`RecipeBrowser_root ${isFullWidth ? 'RecipeBrowser--full' : 'RecipeBrowser--split'}`}>
            <DeleteModal />
            <aside className='RecipeBrowser_sidebar'>
                <div className='RecipeFilter_container'>
                    <div className={`RecipeFilter ${filterHidden ? 'hidden' : ''}`}>
                        <RecipeFilter 
                            filters={filters} 
                            updateField={updateField} 
                            toggleArrayItem={toggleArrayItem} 
                            resetFilters={resetFilters} 
                        />
                    </div>
                    <div className='RecipeFilter_bottom'>
                        <div className="RecipeFilter_title">
                            <Title />
                        </div>
                        <button 
                            className="RecipeFilter_visibilityToggle"
                            onClick={() => setFilterHidden(!filterHidden)}
                        >
                            {filterHidden ? 
                                <><SlidersHorizontal size={16} /><span>Filter Results</span></> :
                                <><ChevronUp size={16} />Hide Filters</>
                            }
                        </button>
                    </div>
                </div>
                <RecipeList 
                    filters={filters} 
                    resetFilters={resetFilters}
                    refreshTrigger={refreshTrigger} 
                    isRefreshing={isPending} 
                    isPrivate={isPrivate} 
                />
            </aside>

            <main className='RecipeBrowser_main'>
                <Outlet context={{ triggerRefresh, isPrivate, folderId }} />
            </main>
        </div>
    );
}

export default RecipeBrowser;