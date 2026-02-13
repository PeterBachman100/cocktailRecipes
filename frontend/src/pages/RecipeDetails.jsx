import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, } from 'lucide-react';
import api from '../api/axios.js';
import Fraction from 'fraction.js';
import BadgeList from '../components/recipes/BadgeList.jsx';

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/public-recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="RecipeDetails_loading">Loading recipe...</div>;
  if (!recipe) return <div className="RecipeDetails_error">Recipe not found.</div>;

  return (
    <article className="RecipeDetails_root">
      <header className="RecipeDetails_nav">
        <button 
          className="RecipeDetails_backButton" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
          <span>Back to Library</span>
        </button>
      </header>

      <main className="RecipeDetails_main">

        <div className="RecipeDetails_intro">
            <h1 className="RecipeDetails_title">{recipe.title}</h1>
            <p className='RecipeDetails_description'>{recipe.description}</p>
            <div className="RecipeDetails_badges">
                <BadgeList items={recipe.spirits} type="spirit" />
                <BadgeList items={recipe.flavors} type="flavor" />
            </div>
        </div>

        <div className="RecipeDetails_content">
            <ul className='RecipeDetails_ingredients'>
                {recipe.ingredients?.map((ing, index) => (
                <li key={index} className="RecipeDetails_ingredientItem">
                    <span className="RecipeDetails_ingredientAmount">{new Fraction(ing.amount).simplify(0.01).toFraction(true)}</span>
                    <span className="RecipeDetails_ingredientUnit">{ing.unit}</span>
                    <span className="RecipeDetails_ingredientName">{ing.name}</span>
                </li>
                ))}
            </ul>
            <ol className='RecipeDetails_steps'>
                {recipe.steps?.map((step, index) => (
                    <li key={index} className='RecipeDetails_step'>
                      <span>{step.instruction}</span>
                      {step.tip.length > 0 && <span className='RecipDetails_tip'>{` (${step.tip})`}</span>}
                    </li>
                ))}
            </ol>
            <div className='RecipeDetails_notes'>
                <p>{recipe.notes}</p>
            </div>
        </div>

        <img src={recipe.image} alt={recipe.title} className="RecipeDetails_image" />

      </main>
    </article>
  );
}

export default RecipeDetails;