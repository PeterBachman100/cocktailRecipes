import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const RecipeEditor = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    image: '',
    instructions: '',
    ingredients: [{ name: '', amount: '' }]
  });

  // Handle ingredient changes
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][field] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { name: '', amount: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/public-recipes', recipe);
      navigate('/'); 
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="RecipeEditor_root">
      <form className="RecipeEditor_form" onSubmit={handleSubmit}>
        <h1>New Cocktail Recipe</h1>
        
        <input placeholder="Title" onChange={e => setRecipe({...recipe, title: e.target.value})} />
        <input placeholder="Image URL" onChange={e => setRecipe({...recipe, image: e.target.value})} />
        
        <h3>Ingredients</h3>
        {recipe.ingredients.map((ing, idx) => (
          <div key={idx} className="RecipeEditor_ingRow">
            <input placeholder="Qty (e.g. 2oz)" onChange={e => handleIngredientChange(idx, 'amount', e.target.value)} />
            <input placeholder="Ingredient" onChange={e => handleIngredientChange(idx, 'name', e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={addIngredient}>+ Add Ingredient</button>

        <h3>Instructions</h3>
        <textarea onChange={e => setRecipe({...recipe, instructions: e.target.value})} />

        <button type="submit" className="RecipeEditor_submit">Publish to Library</button>
      </form>
    </div>
  );
};

export default RecipeEditor;