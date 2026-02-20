import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';
import CheckboxGroup from '../components/utilities/CheckboxGroup';

const ENUMS = { 
    spirits: ['whiskey', 'bourbon', 'rye', 'scotch', 'rum', 'vodka', 'tequila / mezcal', 'cognac', 'brandy', 'gin', 'fortified wine', 'liqueur', 'other'], 
    cocktailType: ['classic', 'modern classic', 'tiki & tropical', 'coffee & dessert', 'shots & shooters', 'punches', 'other'], 
    flavors: ['bitter', 'sweet', 'savory', 'sour', 'spiced', 'fruity', 'smoky', 'herbal'], 
    units: ['oz', 'ml', 'g', 'tsp', 'tbsp', 'dash', 'drop', 'barspoon', 'part', 'count', 'top', 'garnish'] 
};

const getInitialState = () => ({
  title: '',
  description: '',
  spirits: [],
  flavors: [],
  cocktailType: 'classic',
  ingredients: [{ name: '', amount: '', unit: 'oz' }],
  steps: [{ instruction: '', tip: '' }],
  notes: '',
  image: '',
  cloudinaryId: ''
});

const NEW_INGREDIENT = { name: '', amount: '', unit: 'oz' };
const NEW_STEP = { instruction: '', tip: '' };

const RecipeEditor = () => {
    const navigate = useNavigate();
    
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = location.pathname.includes('/edit');
    
    const [imageFile, setImageFile] = useState(null);
    const [recipe, setRecipe] = useState(getInitialState());

    useEffect(() => {
        if (isEditMode && id) {
            const fetchRecipe = async () => {
                try {
                    const response = await api.get(`/api/public-recipes/${id}`);
                    setRecipe(response.data);
                } catch (error) {
                    console.error("Error fetching recipe:", error);
                }
            }
            fetchRecipe();
        }
    }, [id, isEditMode]);

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
            let res;
            if (isEditMode) {
                res = await api.patch(`/api/public-recipes/${id}`, formData);
            } else {
                res = await api.post('/api/public-recipes', formData);
            }
            const recipeId = res.data._id;
            navigate(`/recipe/${recipeId}`, { replace: true });
        } catch (err) {
            console.error(err.response?.data?.error || "Save failed");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/public-recipes/${id}`);
            navigate('/', { replace: true });
        } catch(error) {
            console.error(error);
        }
    }

    return (
      <article className="RecipeEditor_root">
        <header className="RecipeEditor_nav">
         <button 
           className="RecipeEditor_backButton" 
           onClick={() => navigate('/')}
            >
            <ArrowLeft size={20} />
            <span>Back to Library</span>
            </button>
        </header>
        <form onSubmit={handleSubmit}>
            <main className="RecipeEditor_main">

                <div className="RecipeEditor_intro">
                    
                    <div>
                        <label className="RecipeEditor_inputLabel" htmlFor="title">Title</label>
                        <input 
                            value={recipe.title} required id="title"
                            onChange={e => setRecipe({...recipe, title: e.target.value})}
                            className="RecipeEditor_title"
                        />
                    </div>
                    
                    <div>
                        <label className="RecipeEditor_inputLabel" htmlFor="description">Description</label>
                        <textarea 
                            className="RecipeEditor_description"
                            required id="description"
                            value={recipe.description}
                            onChange={e => setRecipe({...recipe, description: e.target.value})}
                        /> 
                    </div>
                        
                    
                    <div className="RecipeEditor_badges">
                        <div>
                            <span className="RecipeEditor_inputLabel">Spirits</span>
                            <CheckboxGroup name='spirits' options={ENUMS.spirits} selectedValues={recipe.spirits} onChange={toggleTag} required={true} />
                        </div>
                        <div>
                            <span className="RecipeEditor_inputLabel">Flavors</span>
                            <CheckboxGroup name="flavors" options={ENUMS.flavors} selectedValues={recipe.flavors} onChange={toggleTag} required={true} />
                        </div>
                    </div>
                    
                    <div className='RecipeEditor_selectGroup'>
                        <label htmlFor="cocktailType" className="RecipeEditor_inputLabel">Cocktail Type</label>
                        <select 
                            id="cocktailType"
                            name="cocktailType" 
                            value={recipe.cocktailType} 
                            onChange={(e) => setRecipe({...recipe, cocktailType: e.target.value})}
                            className='RecipeEditor_select'
                        >
                            <option value="" disabled>Select a type...</option>
                            {ENUMS.cocktailType.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="RecipeEditor_content">
                    <div>
                        <span className="RecipeEditor_inputLabel">Ingredients</span>
                        <div className='RecipeEditor_ingredients'>
                            {recipe.ingredients.map((ingredient, idx) => (
                            <div key={idx} className="RecipeEditor_ingredientRow">
                                <input 
                                    type="number" placeholder="1"
                                    value={ingredient.amount}
                                    onChange={e => handleArrayUpdate('ingredients', idx, 'amount', e.target.value)}
                                    required 
                                />
                                <select value={ingredient.unit} onChange={e => handleArrayUpdate('ingredients', idx, 'unit', e.target.value)}>
                                    {ENUMS.units.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                                <input 
                                    placeholder="Ingredient"
                                    value={ingredient.name}
                                    onChange={e => handleArrayUpdate('ingredients', idx, 'name', e.target.value)}
                                    required
                                />
                                <button type="button" onClick={() => removeRow('ingredients', idx)} className="RecipeEditor_iconBtn--delete">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            ))}
                            <button type="button" className="RecipeEditor_addBtn" onClick={() => addRow('ingredients', {name:'', amount:'', unit:'oz'})}>
                                <Plus size={16} /> Add Ingredient
                            </button>
                        </div>
                    </div>
                    <div>
                        <span className="RecipeEditor_inputLabel">Instructions</span>
                        <div className='RecipeEditor_instructions'>
                            {recipe.steps.map((step, idx) => (
                            <div key={idx} className="RecipeEditor_instructionRow">
                                <textarea 
                                    value={step.instruction}
                                    className="RecipeEditor_instruction"
                                    onChange={e => handleArrayUpdate('steps', idx, 'instruction', e.target.value)}
                                    required
                                />
                                <textarea
                                    value={step.tip}
                                    className="RecipeEditor_tip"
                                    placeholder="Optional tip"
                                    onChange={e => handleArrayUpdate('steps', idx, 'tip', e.target.value)}
                                />
                                <button type="button" onClick={() => removeRow('steps', idx)} className="RecipeEditor_iconBtn--delete">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            ))}
                            <button type="button" className="RecipeEditor_addBtn" onClick={() => addRow('steps', {instruction:'', tip:''})}>
                                <Plus size={16} /> Add Step
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="RecipeEditor_inputLabel">Notes</label>
                        <textarea 
                            value={recipe.notes}
                            className="RecipeEditor_notes" id="notes"
                            placeholder="Any additional notes or variations..."
                            onChange={e => setRecipe({...recipe, notes: e.target.value})}
                        />
                    </div>
                </div>

                <div className='RecipeEditor_image'>
                    <span className='RecipeEditor_inputLabel'>Image</span>
                    <label className="RecipeEditor_uploadArea">
                        <span>{imageFile ? imageFile.name : (isEditMode ? "Update image" : "Select image")}</span>
                        <Upload size={12} />
                        <input type="file" hidden onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
                    </label>
                    <img src={recipe.image} alt={recipe.title} className="RecipeDetails_image" />
                </div>
                
                <button type='submit' className='RecipeEditor_submitBtn'>Save</button>

                <div className='RecipeEditor_delete'>
                    <button 
                        type='button' 
                        className='RecipeEditor_deleteButton'
                        onClick={handleDelete}
                    >
                        <Trash2 size={12} /><span>Delete recipe</span>
                    </button>
                </div>

            </main>
          </form>
      </article>
    );
};

export default RecipeEditor;