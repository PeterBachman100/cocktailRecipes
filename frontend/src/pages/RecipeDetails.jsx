import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { ArrowLeft, CircleOff, Pencil, BookmarkPlus, BookmarkCheck, CloudAlert } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import BadgeList from '../components/recipes/BadgeList.jsx';
import Ingredient from '../components/recipes/Ingredient.jsx';
import placeholderImage from '../assets/placeholder.png';

function RecipeDetails() {
  const { isAdmin } = useAuth();
  const { isPersonal } = useOutletContext();
  const canEdit = isPersonal || isAdmin;

  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus]= useState('idle'); //idle, loading, success, failure

  const handleBack = () => {
    if (isPersonal) {
      navigate('/my-recipes');
    } else {
      navigate('/');
    }
  }
 
  const handleSaveToLibrary = async () => {
    setSaveStatus('loading');
    
    try {
        await api.post(`/api/private-recipes/copy/${id}`);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
        console.error("Save failed", err);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
    }
};

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const endpoint = isPersonal ? `/api/private-recipes/${id}` : `/api/public-recipes/${id}`
        setLoading(true);
        const response = await api.get(endpoint);
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
           onClick={handleBack}
         >
           <ArrowLeft size={20} />
           <span>Back to Library</span>
         </button>
       </header>
      <main className='RecipeDetails_main'>
        <div className='RecipeDetails_error'>
          <h2>Loading Recipe...</h2>
          <MoonLoader loading='true' color='var(--color-accent)' size='100px' speedMultiplier='0.5'/>
        </div>
      </main>
    </div>
  );

  if (!recipe) return (
    <div className='RecipeDetails_root'>
      <header className="RecipeDetails_nav">
         <button 
           className="RecipeDetails_backButton" 
           onClick={handleBack}
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
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
          <span>Back to Library</span>
        </button>
      </header>

      <main className="RecipeDetails_main">

        <div className="RecipeDetails_intro">
            <div className='RecipeDetails_header'>
              <h1 className="RecipeDetails_title">{recipe.title}</h1>
              <div>
                {canEdit && 
                  <button 
                    className='RecipeDetails_editButton' 
                    onClick={() => navigate('edit')}
                  >
                    <Pencil size={16} />
                  </button>
                }
                {!isPersonal && (
                  <button 
                    className={`RecipeDetails_saveButton RecipeDetails_saveButton--${saveStatus}`}
                    onClick={handleSaveToLibrary}
                    disabled={saveStatus !== 'idle'}
                  >
                    {saveStatus === 'idle' && <BookmarkPlus size={16} />}
                    {saveStatus === 'loading' && <MoonLoader size="16px" />}
                    {saveStatus === 'success' && <BookmarkCheck size={16} color={'var(--color-accent)'}/>}
                    {saveStatus === 'error' && <><CloudAlert size={16} color={'var(--color-error'} /><span> Error saving, please try again.</span></> }
                  </button>
                )}
                  
              </div>
            </div>
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
            {recipe.notes.lenth > 0 && (
              <div className='RecipeDetails_notes'>
                <p>{recipe.notes}</p>
              </div>
            )}
        </div>

        <img src={recipe.image ? recipe.image : placeholderImage} alt={recipe.title} className="RecipeDetails_image" />

      </main>
    </article>
  );
}

export default RecipeDetails;