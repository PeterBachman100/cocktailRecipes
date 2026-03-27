import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import RecipeCard from './RecipeCard.jsx';
import useDebounce from '../../hooks/useDebounce';
import { MoonLoader } from 'react-spinners';
import { RotateCcw } from 'lucide-react';

function RecipeList({ filters, resetFilters, refreshTrigger, isPrivate }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWakingUp, setIsWakingUp] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    let wakeUpTimer;
    const fetchRecipes = async () => {
      setLoading(true);
      wakeUpTimer = setTimeout(() => setIsWakingUp(true), 3000);
      try {
        const endpoint = isPrivate ? '/api/private-recipes' : '/api/public-recipes';

        const params = {
          search: debouncedSearch,
          spirits: filters.spirits.join(','),
          flavors: filters.flavors.join(','),
          cocktailType: filters.cocktailType.join(','),
          spiritsMatch: filters.spiritsMatch,
          flavorsMatch: filters.flavorsMatch,
        };

        if (isPrivate && filters.folderId) {
          params.folderId = filters.folderId;
        }

        const response = await api.get(endpoint, { params });
        setRecipes(response.data); 
        clearTimeout(wakeUpTimer);
        setIsWakingUp(false);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        clearTimeout(wakeUpTimer);
        setIsWakingUp(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    return () => clearTimeout(wakeUpTimer);
  }, [
    debouncedSearch, 
    filters.spirits.join(','), 
    filters.spiritsMatch, 
    filters.flavors.join(','), 
    filters.flavorsMatch, 
    filters.cocktailType.join(','), 
    filters.folderId, 
    refreshTrigger, 
    isPrivate
  ]);

  const hasActiveFilters = 
    filters.search.trim() !== '' || 
    filters.spirits.length > 0 || 
    filters.flavors.length > 0 || 
    filters.cocktailType.length > 0;

  const emptyMessage = hasActiveFilters 
    ? "No recipes found matching those filters." 
    : "Your collection is empty. Start adding some recipes!";

  if (loading) return (
    <div className='RecipeList_loadingWrapper'>
        <div className='RecipeList_loading'>
          <MoonLoader color='var(--color-accent)' size={60} speedMultiplier={0.5}/>
          <p>Finding the perfect drink...</p>
          {isWakingUp && (
            <p className="waking-up_note">
              Waking up the server...<br /> Since this is a hobby project, the backend takes about 30 seconds to start back up. We’ll be right with you!
            </p>
          )}
        </div>
    </div>
  );

  if (recipes.length > 0) {
    return (
        <div className="RecipeList_root">
            {recipes.map(recipe => (
                <RecipeCard 
                    key={recipe._id} 
                    recipe={recipe} 
                    isPrivate={isPrivate} 
                />
            ))}
        </div>
    );
  } 

  return (
    <div className="RecipeList_empty">
      <div className='RecipeList_emptyMain'>
        <h2>{emptyMessage}</h2>
        {hasActiveFilters && (
            <button onClick={resetFilters} className='RecipeList_resetFilters'>
                <RotateCcw size={20} />
                Reset Filters
            </button>
        )}
      </div>
    </div>
  );

}

export default RecipeList;