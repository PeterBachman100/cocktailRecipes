import { useEffect, useState } from 'react';
import api from '../api/axios';

function RecipeDetails({ recipeId }) {
  const [recipe, setRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/api/public-recipes/${recipeId}`);
        setRecipe(response.data);
        setLoading(false);
        console.group(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipe();
  }, []);

  if (loading) return <p>Loading</p>;

  let renderedSpirits = recipe.spirits.map((spirit) => <span key={spirit} style={{ color: '#c23131', backgroundColor: '#f5f3f3ff', padding: '0.25rem 0.5rem', fontWeight: '900', textTransform: 'capitalize' }}>{ spirit }</span>);
  let renderedFlavors = recipe.flavors.map((flavor) => <span style={{backgroundColor: '#f5f3f3ff', color: '#3a3a3aff', padding: '0.125rem 0.25rem', textTransform: 'capitalize'}} key={flavor}>{flavor}</span>);
  let renderedCocktailType = <span style={{textTransform: 'capitalize', color: '#5b5b5bff'}}>{recipe.cocktailType}</span>;
  let renderedSeasons = recipe.seasons.map((season) => <span key={season} style={{color: '#5b5b5bff', textTransform: 'capitalize'}}>{season}</span>);
  
  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        
        <img style={{marginBottom: '0.5rem'}} src={recipe.image} />
        
        <div style={{paddingInline: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <div style={{display: 'flex'}}>
              <div style={{display: 'flex', gap: '0.25rem', borderRight: '1px solid #a09d9dff', paddingRight: '0.5rem'}}>{renderedSpirits}</div>
              <div style={{display: 'flex', gap: '0.25rem', paddingLeft: '1rem'}}>{renderedFlavors}</div>
            </div>
            <div style={{display: 'flex'}}>
              <div style={{borderRight: '1px solid #a09d9dff', paddingRight: '0.5rem'}}>{renderedCocktailType}</div>
              <div style={{display: 'flex', gap: '0.5rem', paddingLeft: '0.5rem'}}>{renderedSeasons}</div>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
            <h1 style={{textTransform: 'uppercase'}}>{recipe.title}</h1>
            <div>{recipe.description}</div>  
          </div>
        
          <div>
            <h2>Ingredients</h2>
            <ul style={{marginInlineStart: '0.5rem', listStyleType: 'disc'}}>
              {recipe.ingredients.map((ingredient) => (
                <li style={{marginInlineStart: '1rem'}} key={ingredient.name}>{ingredient.amount} {ingredient.unit} {ingredient.name}</li>
              ))}
            </ul>
          </div>
        
          <div>
            <h2>Instructions</h2>
            <ol style={{marginInlineStart: '0.5rem'}}>
              {recipe.steps.map((step, index) => (
                <li style={{marginInlineStart: '1rem'}} key={index}>{step.instruction} {step.tip}</li>
              ))}
            </ol>
          </div>
        
          <div>{recipe.notes}</div>

        </div>

      </div>
    </div>
  );
}

export default RecipeDetails;