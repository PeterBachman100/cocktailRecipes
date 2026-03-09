import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import RecipeCard from './RecipeCard.jsx';
import useDebounce from '../../hooks/useDebounce';
import { MoonLoader } from 'react-spinners';

function RecipeList({ filters, refreshTrigger, isPrivate }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce the search term to prevent API spamming while typing
  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const endpoint = isPrivate ? '/api/private-recipes' : '/api/public-recipes';

        // Axios handles object-to-query-string conversion automatically
        const params = {
          search: debouncedSearch,
          spirits: filters.spirits.join(','),
          flavors: filters.flavors.join(','),
          cocktailType: filters.cocktailType.join(','),
          spiritsMatch: filters.spiritsMatch,
          flavorsMatch: filters.flavorsMatch,
        };

        // Only add folderId if we are in the personal collection and it exists
        if (isPrivate && filters.folderId) {
          params.folderId = filters.folderId;
        }

        const response = await api.get(endpoint, { params });
        setRecipes(response.data); 
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
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

  if (loading) return (
    <div className='RecipeList_loadingWrapper'>
        <div className='RecipeList_loading'>
          <MoonLoader color='var(--color-accent)' size={60} speedMultiplier={0.5}/>
          <p>Finding the perfect drink...</p>
        </div>
    </div>
  );

  return (
    <div className="RecipeList_root">
      {recipes.length > 0 ? (
        recipes.map(recipe => (
          <RecipeCard 
            key={recipe._id} 
            recipe={recipe} 
            isPrivate={isPrivate} 
          />
        ))
      ) : (
        <div className="RecipeList_empty">
          <p>No recipes found matching those filters.</p>
        </div>
      )}
    </div>
  );
}

export default RecipeList;