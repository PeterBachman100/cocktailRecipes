import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import RecipeCard from './RecipeCard.jsx';
import useDebounce from '../../hooks/useDebounce';
import { MoonLoader } from 'react-spinners';

function RecipeList({ filters, refreshTrigger, isPersonal }) {
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const endpoint = isPersonal ?
          '/api/private-recipes' :
          '/api/public-recipes';

        const params = new URLSearchParams();

        if (debouncedSearch) params.append('search', debouncedSearch);
        if (filters.spirits.length) params.append('spirits', filters.spirits.join(','));
        if (filters.flavors.length) params.append('flavors', filters.flavors.join(','));
        if (filters.cocktailType.length) params.append('cocktailType', filters.cocktailType.join(','));

        params.append('spiritsMatch', filters.spiritsMatch);
        params.append('flavorsMatch', filters.flavorsMatch);

        const response = await api.get(`${endpoint}?${params.toString()}`);
        setRecipes(response.data); 
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [debouncedSearch, filters.spirits, filters.spiritsMatch, filters.flavors, filters.flavorsMatch, filters.cocktailType, refreshTrigger, isPersonal]);

  if (loading) return (
    <div className='RecipeList_loadingWrapper'>
        <div className='RecipeList_loading'>
          <h2>Loading Recipes...</h2>
          <MoonLoader loading='true' color='var(--color-accent)' size='100px' speedMultiplier='0.5'/>
        </div>
    </div>
  );

  return (
    <div className={`RecipeList_root`}>
      {recipes.length > 0 ? (
        recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} isPersonal={isPersonal} />
        ))
      ) : (
        <p>No recipes found matching those filters.</p>
      )}
    </div>
  );
};

export default RecipeList;