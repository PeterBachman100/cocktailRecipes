import { useState, useCallback, useTransition } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';
import RecipeFilter from '../components/recipes/RecipeFilter';
import useRecipeFilters from '../hooks/useRecipeFilters';
import { SlidersHorizontal, ChevronUp } from 'lucide-react';


const RecipeBrowser = () => {
    const { id } = useParams();
    const { pathname } = useLocation();
    
    const isSplitView = id || pathname.includes('/new');
    const isFullWidth = !isSplitView;

    const [filterHidden, setFilterHidden] = useState(true);

    const { filters, updateField, toggleArrayItem, resetFilters } = useRecipeFilters({
        search: '',
        spirits: [],
        spiritsMatch: 'any',
        flavors: [],
        flavorsMatch: 'any',
        cocktailType: []
    });

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
                <RecipeList filters={filters} refreshTrigger={refreshTrigger} isRefreshing={isPending} />
            </aside>
            <main className='RecipeBrowser_main'>
                <Outlet context={{ triggerRefresh }} />
            </main>
        </div>
    );
}

export default RecipeBrowser;