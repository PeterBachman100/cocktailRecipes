import { useState, useCallback, useTransition } from 'react';
import { Outlet, useParams, useSearchParams, useLocation } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';
import RecipeFilter from '../components/recipes/RecipeFilter';
import { SlidersHorizontal, ChevronUp } from 'lucide-react';
import { useFolders } from '../context/FolderContext';

const RecipeBrowser = () => {
    const { getFolderName } = useFolders();

    const { pathname } = useLocation();
    const isPrivate = pathname.includes('my-recipes');

    const [searchParams, setSearchParams] = useSearchParams();
    const folderId = searchParams.get('folderId') || '';
    const { id } = useParams();
    
    const filters = {
        folderId,
        search: searchParams.get('search') || '',
        spirits: searchParams.get('spirits')?.split(',').filter(Boolean) || [],
        flavors: searchParams.get('flavors')?.split(',').filter(Boolean) || [],
        cocktailType: searchParams.get('cocktailType')?.split(',').filter(Boolean) || [],
        spiritsMatch: searchParams.get('spiritsMatch') || 'any',
        flavorsMatch: searchParams.get('flavorsMatch') || 'any'
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

    let title = isPrivate ? 'Saved Recipes' : 'The Library';
    if (isPrivate && folderId) {
        title = `Folder: ${getFolderName(folderId)}`;
    }
   
    // 4. VIEW LOGIC
    const isSplitView = id || pathname.includes('/new') || pathname.includes('/edit');
    const isFullWidth = !isSplitView;
    const [filterHidden, setFilterHidden] = useState(true);

    // 5. REFRESH LOGIC
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isPending, startTransition] = useTransition();
    const triggerRefresh = useCallback(() => {
        startTransition(() => {
            setRefreshTrigger(prev => prev + 1);
        });
    }, []);

    return (
        <div className={`RecipeBrowser_root ${isFullWidth ? 'RecipeBrowser--full' : 'RecipeBrowser--split'}`}>
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
                
                <div className="RecipeBrowser_title">
                    <h1>{title}</h1>
                </div>

                <RecipeList 
                    filters={filters} 
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