import { NavLink, useLocation } from 'react-router-dom';
import BadgeList from './BadgeList';
import placeholderImage from '../../assets/placeholder.png';
import StarRating from '../utilities/StarRating';

function RecipeCard({ recipe, isPrivate }) {

  const location = useLocation();
  const basePath = isPrivate ? '/my-recipes' : '/recipes';
  const destination = `${basePath}/${recipe._id}${location.search}`;

  return (
    <NavLink to={destination} className={({ isActive }) => `RecipeCard ${isActive ? 'active' : ''}`}>
        <article className='RecipeCard_root'>
            <div className='RecipeCard_main'>
                <img className='RecipeCard_image' src={recipe.image ? recipe.image : placeholderImage} alt={recipe.title} />
                <section className='RecipeCard_info'>
                    <h2 className='RecipeCard_title'>{recipe.title}</h2>
                    <BadgeList items={recipe.spirits} type="spirit" />
                    <BadgeList items={recipe.flavors} type="flavor" />
                    <p className='RecipeCard_description'>{recipe.description}</p>
                    {recipe.rating && isPrivate ? 
                      (<div className='RecipeCard_rating'>
                        <StarRating value={recipe.rating} />
                      </div>) : 
                      ''
                    }
                </section>
            </div>
            
        </article>
    </NavLink>
  );
}

export default RecipeCard;

