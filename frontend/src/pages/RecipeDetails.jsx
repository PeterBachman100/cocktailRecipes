import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CircleOff } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import api from '../api/axios.js';
import BadgeList from '../components/recipes/BadgeList.jsx';
import Ingredient from '../components/recipes/Ingredient.jsx';

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

  if (loading) return (
    <div className='RecipeDetails_root'>
      <header className="RecipeDetails_nav">
         <button 
           className="RecipeDetails_backButton" 
           onClick={() => navigate('/')}
         >
           <ArrowLeft size={20} />
           <span>Back to Library</span>
         </button>
       </header>
      <main className='RecipeDetails_main'>
        <div className='RecipeDetails_error'>
          <h2>Loading Recipe...</h2>
          <MoonLoader loading='true' color='var(--color-accent)' size='100' speedMultiplier='0.5'/>
        </div>
      </main>
    </div>
  );

  if (!recipe) return (
    <div className='RecipeDetails_root'>
      <header className="RecipeDetails_nav">
         <button 
           className="RecipeDetails_backButton" 
           onClick={() => navigate('/')}
         >
           <ArrowLeft size={20} />
           <span>Back to Library</span>
         </button>
       </header>
      <main className='RecipeDetails_main'>
        <div className='RecipeDetails_error'>
          <h2>Recipe Not Found</h2>
          <CircleOff color='var(--color-error)' size={100} />
        </div>
      </main>
    </div>
  );
  

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
                <BadgeList items={recipe.spirits} type="spirit" compact="false" />
                <BadgeList items={recipe.flavors} type="flavor" compact="false" />
            </div>
        </div>

        <div className="RecipeDetails_content">
            <ul className='RecipeDetails_ingredients'>
                {recipe.ingredients?.map((ing, index) => (
                <li key={index}>
                    <Ingredient {...ing} />
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