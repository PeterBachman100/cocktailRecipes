import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Upload, MessageSquare, Info } from 'lucide-react';

const ENUMS = { 
    spirits: ['whiskey', 'bourbon', 'rye', 'scotch', 'rum', 'vodka', 'tequila / mezcal', 'cognac', 'brandy', 'gin', 'fortified wine', 'liqueur', 'other'], 
    cocktailType: ['classic', 'modern classic', 'tiki & tropical', 'coffee & dessert', 'shots & shooters', 'punches', 'other'], 
    flavors: ['bitter', 'sweet', 'savory', 'sour', 'spiced', 'fruity', 'smoky', 'herbal'], 
    units: ['oz', 'ml', 'g', 'tsp', 'tbsp', 'dash', 'drop', 'barspoon', 'part', 'count', 'top'] 
};

const RecipeEditor = () => {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [recipe, setRecipe] = useState({
        title: '',
        description: '',
        notes: '',
        cocktailType: 'classic',
        ingredients: [{ name: '', amount: '', unit: 'oz' }],
        steps: [{ instruction: '', tip: '' }],
        spirits: [],
        flavors: []
    });

    // Dynamic list handlers
    const addRow = (field, defaultValue) => {
        setRecipe({ ...recipe, [field]: [...recipe[field], defaultValue] });
    };

    const removeRow = (field, index) => {
        const updated = recipe[field].filter((_, i) => i !== index);
        setRecipe({ ...recipe, [field]: updated });
    };

    const handleArrayUpdate = (field, index, key, value) => {
        const updated = [...recipe[field]];
        updated[index][key] = value;
        setRecipe({ ...recipe, [field]: updated });
    };

    const toggleTag = (field, value) => {
        const current = recipe[field];
        const updated = current.includes(value) 
            ? current.filter(item => item !== value) 
            : [...current, value];
        setRecipe({ ...recipe, [field]: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Standard strings
        formData.append('title', recipe.title);
        formData.append('description', recipe.description);
        formData.append('notes', recipe.notes);
        formData.append('cocktailType', recipe.cocktailType);
        
        // Complex fields (must be stringified for parseJsonFields)
        formData.append('ingredients', JSON.stringify(recipe.ingredients));
        formData.append('steps', JSON.stringify(recipe.steps));
        formData.append('spirits', JSON.stringify(recipe.spirits));
        formData.append('flavors', JSON.stringify(recipe.flavors));
        
        if (imageFile) formData.append('image', imageFile);

        try {
            const res = await api.post('/api/public-recipes', formData);
            const newRecipeId = res.data._id;
            navigate(`/recipe/${newRecipeId}`, { replace: true });
        } catch (err) {
            console.error(err.response?.data?.error || "Save failed");
        }
    };

    return (
      <div className="RecipeEditor_root">
        <form className="RecipeEditor_form" onSubmit={handleSubmit}>

          {/* --- LEFT --- */}
          <div className='RecipeEditor_col'>

            <header className="RecipeEditor_section">
              <div>
                <h3>Title</h3>
                <input 
                    value={recipe.title} required
                    onChange={e => setRecipe({...recipe, title: e.target.value})}
                    className="RecipeEditor_input--title" placeholder="Cocktail name"
                />    
              </div>
              <div>
                <h3>Description</h3>
                <textarea 
                      className="RecipeEditor_textarea"
                      placeholder="Cocktail description" required
                      onChange={e => setRecipe({...recipe, description: e.target.value})}
                  />         
              </div>   
            </header>

            <section className='RecipeEditor_section'>
              <div>
                <h3>Spirits</h3>
                <div className="RecipeEditor_tagGroup">
                    {ENUMS.spirits.map(s => (
                        <button 
                            key={s} type="button"
                            className={`RecipeEditor_tag ${recipe.spirits.includes(s) ? 'RecipeEditor_tag--active' : ''}`}
                            onClick={() => toggleTag('spirits', s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
              </div>
              <div>
                <h3>Flavor Profile</h3>
                <div className="RecipeEditor_tagGroup">
                    {ENUMS.flavors.map(f => (
                        <button 
                            key={f} type="button"
                            className={`RecipeEditor_tag ${recipe.flavors.includes(f) ? 'RecipeEditor_tag--active' : ''}`}
                            onClick={() => toggleTag('flavors', f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
              </div>
              <div>
                <h3>Cocktail Type</h3>
                <div className='RecipeEditor_radioGroup'>
                  {ENUMS.cocktailType.map((type) => (
                    <label key={type} className='RecipeEditor_radioLabel'>
                      <input 
                        type='radio' name='cocktailType' value={type} checked={recipe.cocktailType === type} 
                        onChange={(e) => setRecipe({...recipe, cocktailType : e.target.value})}
                        className='RecipeEditor_radioInput'
                      />
                      <span className='RecipeEditor_radioCustom'></span>
                      <span className='RecipeEditor_typeText'>{type}</span>
                    </label>
                  ))}
                </div>

              </div>

            </section>
          </div>

          {/* --- RIGHT --- */}
          <div className='RecipeEditor_col'>

              <section className="RecipeEditor_section">
                  <div>
                    <h3>Ingredients</h3>
                    <div className='RecipeEditor_ingredients'>
                    {recipe.ingredients.map((ing, idx) => (
                        <div key={idx} className="RecipeEditor_ingredientRow">
                            <input 
                                type="number" step="0.25" placeholder="1"
                                onChange={e => handleArrayUpdate('ingredients', idx, 'amount', e.target.value)}
                                required 
                            />
                            <select onChange={e => handleArrayUpdate('ingredients', idx, 'unit', e.target.value)}>
                                {ENUMS.units.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                            <input 
                                placeholder="Ingredient name"
                                onChange={e => handleArrayUpdate('ingredients', idx, 'name', e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => removeRow('ingredients', idx)} className="RecipeEditor_iconBtn--delete">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <button type="button" className="RecipeEditor_addBtn" onClick={() => addRow('ingredients', {name:'', amount:'', unit:'oz'})}>
                        <Plus size={16} /> Add Ingredient
                    </button>
                    </div>
                  </div>
              </section>

              <section className="RecipeEditor_section">
                <div>
                  <h3>Instructions</h3>
                  <div className='RecipeEditor_instructions'>
                    {recipe.steps.map((step, idx) => (
                        <div key={idx} className="RecipeEditor_instructionRow">
                            <div className="RecipeEditor_instruction">
                                <textarea 
                                    placeholder="Instruction (e.g., Shake with ice and strain...)"
                                    onChange={e => handleArrayUpdate('steps', idx, 'instruction', e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => removeRow('steps', idx)} className="RecipeEditor_iconBtn--delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="RecipeEditor_tip">
                                <Info size={14} />
                                <input 
                                    placeholder="Optional tip (e.g. Shake for at least 30 seconds)"
                                    onChange={e => handleArrayUpdate('steps', idx, 'tip', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" className="RecipeEditor_addBtn" onClick={() => addRow('steps', {instruction:'', tip:''})}>
                        <Plus size={16} /> Add Step
                    </button>
                  </div>
                </div>
                <div>
                  <h3>Notes</h3>
                  <textarea 
                      className="RecipeEditor_textarea"
                      placeholder="Any additional notes or variations..."
                      onChange={e => setRecipe({...recipe, notes: e.target.value})}
                  />
                </div>
              </section>

              <section className="RecipeEditor_section">
                  <div>
                    <h3>Image</h3>
                    <label className="RecipeEditor_uploadArea">
                        <Upload size={16} />
                        <span>{imageFile ? imageFile.name : "Select Cocktail Photo"}</span>
                        <input type="file" hidden onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
                    </label>
                  </div>
              </section>

              <button type="submit" className="RecipeEditor_submitBtn">Save Recipe</button>

            </div>
          </form>
      </div>
    );
};

export default RecipeEditor;