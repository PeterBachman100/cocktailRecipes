import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams, useLocation, useOutletContext } from 'react-router-dom';
import { Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';
import CheckboxGroup from '../components/utilities/CheckboxGroup';

const ENUMS = { 
    spirits: ['whiskey', 'bourbon', 'rye', 'scotch', 'rum', 'vodka', 'tequila / mezcal', 'cognac', 'brandy', 'gin', 'fortified wine', 'liqueur', 'other'], 
    cocktailType: ['classic', 'modern classic', 'tiki & tropical', 'coffee & dessert', 'shots & shooters', 'punches', 'other'], 
    flavors: ['bitter', 'sweet', 'savory', 'sour', 'spiced', 'fruity', 'smoky', 'herbal'], 
    units: ['oz', 'ml', 'g', 'tsp', 'tbsp', 'dash', 'drop', 'barspoon', 'part', 'count', 'top', 'garnish', 'pinch'] 
};

const getInitialState = () => ({
  title: '',
  description: '',
  spirits: [],
  flavors: [],
  cocktailType: '',
  ingredients: [{ name: '', amount: '', unit: 'oz' }],
  steps: [{ instruction: '', tip: '' }],
  notes: '',
  image: '',
  cloudinaryId: ''
});

const NEW_INGREDIENT = { name: '', amount: '', unit: 'oz' };
const NEW_STEP = { instruction: '', tip: '' };

const getValidationErrors = (recipe, imageFile, isEditMode) => {
    const errs = {};
    const activeIngs = recipe.ingredients.filter(ing => ing.name.trim() !== '' || ing.amount !== '');
    const activeSteps = recipe.steps.filter(step => step.instruction.trim() !== '');

    if (!recipe.title?.trim()) errs.title = "Title is required.";
    if (!recipe.description?.trim()) errs.description = "Description is required.";
    if (!recipe.cocktailType) errs.cocktailType = "Please select a cocktail type.";
    if (!recipe.spirits || recipe.spirits.length === 0) errs.spirits = "Select at least one spirit.";
    if (!recipe.flavors || recipe.flavors.length === 0) errs.flavors = 'Select at least one flavor';
    if (activeIngs.length === 0) {
        errs.ingredients = "Add at least one ingredient";
    } else if (activeIngs.some(i => !i.name.trim() || !i.amount)) {
        errs.ingredients = 'All ingredients need both a name and a quantity';
    }
    if (activeSteps.length === 0) errs.instructions = 'Add at least one instruction step';
    
    const hasImage = imageFile || (isEditMode && recipe.image);
    if (!hasImage) {
        errs.image = "Image is required.";
    }
    
    return errs;
};

const RecipeEditor = () => {
    const navigate = useNavigate();
    const { triggerRefresh } = useOutletContext() || {};
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = location.pathname.includes('/edit');
    
    const [imageFile, setImageFile] = useState(null);
    const [recipe, setRecipe] = useState(getInitialState());
    const [errors, setErrors] = useState({});

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

        // Check if we should auto-add a new row
        const lastRow = updated[updated.length - 1];
        
        // Logic: If the user is typing in the last row and it's no longer empty, add one more
        const isIngredients = field === 'ingredients';
        
        // Check if the last row is "filled" (adjust criteria as needed)
        const lastRowFilled = isIngredients 
            ? (lastRow.name.trim() !== '' && lastRow.amount !== '')
            : (lastRow.instruction.trim() !== '');

        if (lastRowFilled) {
            updated.push(isIngredients ? { ...NEW_INGREDIENT } : { ...NEW_STEP });
        }

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

        const validationErrors = getValidationErrors(recipe, imageFile, isEditMode);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        const formData = new FormData();
        
        formData.append('title', recipe.title);
        formData.append('description', recipe.description);
        formData.append('notes', recipe.notes);
        formData.append('cocktailType', recipe.cocktailType);
        
        const finalIngs = recipe.ingredients.filter(ing => ing.name.trim() !== '');
        const finalSteps = recipe.steps.filter(step => step.instruction.trim() !== '');
        
        formData.append('ingredients', JSON.stringify(finalIngs));
        formData.append('steps', JSON.stringify(finalSteps));
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
            triggerRefresh();
            navigate(`/recipe/${recipeId}`, { replace: true });
        } catch (err) {
            console.error(err.response?.data?.error || "Save failed");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/public-recipes/${id}`);
            triggerRefresh();
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
                    
                    <div className={`RecipeEditor_title ${errors.title ? 'Error_wrapper' : ''}`}>
                        {errors.title && <span className='Error_message'>{errors.title}</span>}
                        <label className="RecipeEditor_inputLabel" htmlFor="title">Title</label>
                        <input 
                            value={recipe.title} id="title"
                            onChange={e => {
                                setRecipe({...recipe, title: e.target.value});
                            }}
                            className="RecipeEditor_title_input"
                        />
                    </div>
                    
                    <div className={`RecipeEditor_description ${errors.description ? 'Error_wrapper' : ''}`}>
                        {errors.description && <span className='Error_message'>{errors.description}</span>}
                        <label className="RecipeEditor_inputLabel" htmlFor="description">Description</label>
                        <textarea 
                            className="RecipeEditor_description_input"
                            id="description"
                            value={recipe.description}
                            onChange={e => {
                                setRecipe({...recipe, description: e.target.value});
                            }}
                        /> 
                    </div>
                        
                    
                    <div className="RecipeEditor_badges">
                        <div className={errors.spirits ? 'Error_wrapper Error_Group' : ''}>
                             {errors.spirits && <span className='Error_message'>{errors.spirits}</span>}
                            <span className="RecipeEditor_inputLabel">Spirits</span>
                            <CheckboxGroup name='spirits' options={ENUMS.spirits} selectedValues={recipe.spirits} 
                            onChange={(name, value) => {
                                toggleTag(name, value);
                            }}/>
                        </div>
                        <div className={errors.flavors ? 'Error_wrapper Error_Group' : ''}>
                            {errors.flavors && <span className='Error_message'>{errors.flavors}</span>}
                            <span className="RecipeEditor_inputLabel">Flavors</span>
                            <CheckboxGroup name="flavors" options={ENUMS.flavors} selectedValues={recipe.flavors} 
                            onChange={(name, value) => {
                                toggleTag(name, value);
                            }} 
                            />
                        </div>
                    </div>
                    
                    <div className={`RecipeEditor_selectGroup ${errors.cocktailType ? 'Error_wrapper' : ''}`}>
                        {errors.cocktailType && <span className='Error_message'>{errors.cocktailType}</span>}
                        <label htmlFor="cocktailType" className="RecipeEditor_inputLabel">Cocktail Type</label>
                        <select 
                            id="cocktailType"
                            name="cocktailType" 
                            value={recipe.cocktailType} 
                            onChange={(e) => {
                                setRecipe({...recipe, cocktailType: e.target.value});
                            }}
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
                    <div className={errors.ingredients ? 'Error_wrapper Error_Group' : ''}>
                        {errors.ingredients && <span className='Error_message'>{errors.ingredients}</span>}
                        <span className="RecipeEditor_inputLabel">Ingredients</span>
                        <div className="RecipeEditor_ingredients">
                            {recipe.ingredients.map((ingredient, idx) => (
                            <div key={idx} className="RecipeEditor_ingredientRow">
                                <input 
                                    type="number" placeholder="1"
                                    value={ingredient.amount}
                                    onChange={e => {
                                        handleArrayUpdate('ingredients', idx, 'amount', e.target.value);
                                    }}
                                />
                                <select value={ingredient.unit} onChange={e => handleArrayUpdate('ingredients', idx, 'unit', e.target.value)}>
                                    {ENUMS.units.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                                <input 
                                    placeholder="Ingredient"
                                    value={ingredient.name}
                                    onChange={e => handleArrayUpdate('ingredients', idx, 'name', e.target.value)}
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
                    <div className={errors.instructions ? 'Error_wrapper Error_Group' : ''}>
                        {errors.instructions && <span className='Error_message'>{errors.instructions}</span>}
                        <span className="RecipeEditor_inputLabel">Instructions</span>
                        <div className='RecipeEditor_instructions'>
                            {recipe.steps.map((step, idx) => (
                            <div key={idx} className="RecipeEditor_instructionRow">
                                <textarea 
                                    value={step.instruction}
                                    className="RecipeEditor_instruction"
                                    onChange={e => handleArrayUpdate('steps', idx, 'instruction', e.target.value)}
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

                <div className={`RecipeEditor_image ${errors.image ? 'Error_wrapper' : ''}`}>
                    {errors.image && <span className='Error_message'>{errors.image}</span>}
                    <span className='RecipeEditor_inputLabel'>Image</span>
                    <label className="RecipeEditor_uploadArea">
                        <span>{imageFile ? imageFile.name : (isEditMode ? "Update image" : "Select image")}</span>
                        <Upload size={12} />
                        <input type="file" hidden onChange={e => setImageFile(e.target.files[0])} accept="image/*" />
                    </label>
                    <img src={recipe.image || null} alt={recipe.title} className="RecipeDetails_image" />
                </div>
                
                {Object.keys(errors).length > 0 && (
                <div className="Error_summary">
                    <span>Please correct the following errors:</span>
                    <ul>
                        {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
                    </ul>
                </div>
            )}

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