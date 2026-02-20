import { useState } from 'react';
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
                <RecipeList viewMode={isFullWidth ? 'grid' : 'list'} filters={filters} />
            </aside>
            <main className='RecipeBrowser_main'>
                <Outlet />
            </main>
        </div>
    );
}

export default RecipeBrowser;