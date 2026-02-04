import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import RecipeCard from './RecipeCard.jsx';

function RecipeList() {
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/api/public-recipes');
        setRecipes(response.data); 
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Loading drinks...</div>;

  return (
    <div className="RecipeList_root">
      {recipes.map(recipe => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;