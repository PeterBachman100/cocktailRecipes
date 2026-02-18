import { Outlet, useParams } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';
import RecipeFilter from '../components/recipes/RecipeFilter';
import useRecipeFilters from '../hooks/useRecipeFilters';


const RecipeBrowser = () => {
    const { id } = useParams();
    const isFullWidth = !id;

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
                <RecipeFilter 
                    filters={filters} 
                    updateField={updateField} 
                    toggleArrayItem={toggleArrayItem} 
                    resetFilters={resetFilters} 
                />
                <RecipeList viewMode={isFullWidth ? 'grid' : 'list'} filters={filters} />
            </aside>
            <main className='RecipeBrowser_main'>
                <Outlet />
            </main>
        </div>
    );
}

export default RecipeBrowser;