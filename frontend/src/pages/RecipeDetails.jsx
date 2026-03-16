import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, useOutletContext, useSearchParams } from 'react-router-dom';
import { X, CircleOff, Pencil, BookmarkPlus, BookmarkCheck, CloudAlert } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import BadgeList from '../components/recipes/BadgeList.jsx';
import Ingredient from '../components/recipes/Ingredient.jsx';
import placeholderImage from '../assets/placeholder.png';
import StarRating from '../components/utilities/StarRating.jsx';
import FolderPicker from '../components/FolderPicker.jsx';
import DeleteRecipe from '../components/recipes/DeleteRecipe.jsx';

function RecipeDetails() {
  const { isAdmin, user } = useAuth();
  const { isPrivate, triggerRefresh } = useOutletContext();
  const canEdit = isPrivate || isAdmin;

  const { id } = useParams();
  const [searchParams] = useSearchParams();
   const basePath = isPrivate ? '/my-recipes' : '/recipes';
    const { search } = useLocation();
  const folderId = searchParams.get('folderId');
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus]= useState('idle'); //idle, loading, success, failure
  const [savedPrivateId, setSavedPrivateId] = useState(null);
 
  const handleSaveToLibrary = async () => {
    setSaveStatus('loading');
    
    try {
        const response = await api.post(`/api/private-recipes/copy/${id}`);
        setSaveStatus('success');
        setSavedPrivateId(response.data._id);
    } catch (err) {
        console.error("Save failed", err);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleClose = () => {
    navigate(`${basePath}${search}`);
  }

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const endpoint = isPrivate ? `/api/private-recipes/${id}` : `/api/public-recipes/${id}`
        setLoading(true);
        setSaveStatus('idle');
        setSavedPrivateId(null);
        const response = await api.get(endpoint);
        setRecipe(response.data);

        if (!isPrivate && user) {
          const checkRes = await api.get(`/api/private-recipes/check-saved/${id}`);
          if (checkRes.data.isSaved) {
            setSavedPrivateId(checkRes.data.privateId);
          }
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return (
    <div className={`RecipeDetails_root`}>
      <header className="RecipeDetails_nav">
         <button 
           className="RecipeDetails_backButton" 
           onClick={handleClose}
         >
           <X size={20} />
           <span>Close</span>
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
    <div className={`RecipeDetails_root`}>
      <header className="RecipeDetails_nav">
         <button 
           className="RecipeDetails_backButton" 
           onClick={handleClose}
         >
           <X size={20} />
           <span>Close</span>
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
    <article className={`RecipeDetails_root`}>
      <header className="RecipeDetails_nav">
        <button 
          className="RecipeDetails_backButton" 
          onClick={handleClose}
        >
          <X size={20} />
          <span>Close</span>
        </button>
      </header>

      <main className="RecipeDetails_main">
        {recipe.rating && isPrivate ? (<div className='RecipeDetails_rating'><StarRating value={recipe.rating} size={20}/></div>) : ''}
        <div className="RecipeDetails_intro">
            <div className='RecipeDetails_header'>
              <h1 className="RecipeDetails_title">{recipe.title}</h1>
              <div className='RecipeDetails_actions'>
                {isPrivate && <FolderPicker recipeId={recipe._id} />}
                {canEdit && 
                  <button 
                    className='RecipeDetails_editButton' 
                    onClick={() => navigate('edit')}
                  >
                    <Pencil size={16} />
                  </button>
                }
                {isPrivate && <DeleteRecipe recipeId={id} folderId={folderId} triggerRefresh={triggerRefresh} />}
                {user && !isPrivate && (
                savedPrivateId ? (
                  <button 
                    className="RecipeDetails_saveButton RecipeDetails_saveButton--saved"
                    onClick={() => navigate(`/my-recipes/${savedPrivateId}`)}
                  >
                    <BookmarkCheck size={16} color={'var(--color-accent)'}/>
                    <span>Saved</span>
                  </button>
                ) : (
                  <button 
                    className={`RecipeDetails_saveButton RecipeDetails_saveButton--${saveStatus}`}
                    onClick={handleSaveToLibrary}
                    disabled={saveStatus !== 'idle'}
                  >
                    {saveStatus === 'idle' && (
                      <>
                        <BookmarkPlus size={16} /> 
                        <span>Save</span>
                      </>
                    )}

                    {saveStatus === 'loading' && (
                      <div className={`RecipeDetails_saveButton RecipeDetails_saveButton--${saveStatus}`}>
                        <MoonLoader size='16px' loading='true' speedMultiplier='0.5' color={'var(--color-primary)'} />
                        <span>Saving...</span>
                      </div>
                    )}

                    {saveStatus === 'success' && (
                      <>
                        <BookmarkCheck size={16} color={'var(--color-accent)'}/>
                        <span>Saved</span>
                      </>
                    )}

                    {saveStatus === 'error' && (
                      <>
                        <CloudAlert size={16} color={'var(--color-error)'} />
                        <span>Unable to save</span>
                      </>
                    )}
                  </button>
                )
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
            <div className='RecipeDetails_notes'>
              {recipe.notes && recipe.notes.length > 0 ? (
                recipe.notes.map((note, index) => (
                    <p key={index} className="RecipeDetails_note">
                        {note}
                    </p>
                ))
            ) : (
                ''
            )}
            </div>
        </div>

        <img src={recipe.image ? recipe.image : placeholderImage} alt={recipe.title} className="RecipeDetails_image" />

      </main>
    </article>
  );
}

export default RecipeDetails;